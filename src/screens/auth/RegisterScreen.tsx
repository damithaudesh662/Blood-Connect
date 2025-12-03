// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { theme } from "../../theme/theme";
// import { useAuth } from "../../navigation/RootNavigator";
// import type { AuthStackParamList } from "../../navigation/AuthNavigator";
// import api from "../../services/app";

// type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

// export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
//   const { pendingRole } = useAuth();
//   const [name, setName] = useState("");
//   const [bloodGroup, setBloodGroup] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [location, setLocation] = useState("");
//   const [loading, setLoading] = useState(false);

//   const title =
//     pendingRole === "hospital" ? "Hospital Register" : "Donor Register";

//   const handleRegister = async () => {
//     if (!pendingRole) {
//       Alert.alert("Error", "Please choose Donor or Hospital first.");
//       return;
//     }

//     if (!name || !email || !password) {
//       Alert.alert("Validation", "Name, email and password are required.");
//       return;
//     }

//     if (pendingRole === "donor" && !bloodGroup) {
//       Alert.alert(
//         "Validation",
//         "Blood group is required for donor registration."
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log("Registering user:", {
//         name,
//         email,
//         password,
//         location,
//         role: pendingRole,
//         bloodGroup: pendingRole === "donor" ? bloodGroup : null,
//       });

//       // POST /api/auth/register
//       await api.post("/auth/register", {
//         name,
//         email,
//         password,
//         location,
//         role: pendingRole, // 'donor' or 'hospital'
//         bloodGroup: pendingRole === "donor" ? bloodGroup : null,
//       });

//       console.log("Registration successful");

//       Alert.alert(
//         "Success",
//         "Account created. Please login with your credentials.",
//         [
//           {
//             text: "OK",
//             onPress: () => navigation.goBack(),
//           },
//         ]
//       );
//     } catch (error: any) {
//       const message =
//         error?.response?.data?.error ?? "Could not register. Please try again.";
//       Alert.alert("Registration error", message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{title}</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Full name"
//         placeholderTextColor="#999"
//         value={name}
//         onChangeText={setName}
//       />

//       {pendingRole === "donor" && (
//         <TextInput
//           style={styles.input}
//           placeholder="Blood group (e.g., A+)"
//           placeholderTextColor="#999"
//           value={bloodGroup}
//           onChangeText={setBloodGroup}
//         />
//       )}

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         placeholderTextColor="#999"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         placeholderTextColor="#999"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Location"
//         placeholderTextColor="#999"
//         value={location}
//         onChangeText={setLocation}

//       />

//       <TouchableOpacity
//         style={[styles.registerButton, loading && { opacity: 0.7 }]}
//         onPress={handleRegister}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color={theme.colors.textOnPrimary} />
//         ) : (
//           <Text style={styles.registerButtonText}>Register</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//     padding: theme.spacing.lg,
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: theme.colors.primary,
//     marginBottom: theme.spacing.lg,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     borderRadius: theme.radius.md,
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//     marginBottom: theme.spacing.md,
//     backgroundColor: "#FFFFFF",
//   },
//   registerButton: {
//     backgroundColor: theme.colors.primaryLight,
//     paddingVertical: theme.spacing.md,
//     borderRadius: theme.radius.md,
//     alignItems: "center",
//     marginTop: theme.spacing.sm,
//   },
//   registerButtonText: {
//     color: theme.colors.textOnPrimary,
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../theme/theme";
import { useAuth } from "../../navigation/RootNavigator";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import api from "../../services/app";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { pendingRole } = useAuth();
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [locationText, setLocationText] = useState("");
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const title =
    pendingRole === "hospital" ? "Hospital Register" : "Donor Register";

  const handleUseCurrentLocation = async () => {
    try {
      setLocLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location permission",
          "Permission to access location was denied."
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;
      setCoords({ latitude, longitude });
      setLocationText(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
    } catch (error) {
      console.log("Error getting location", error);
      Alert.alert(
        "Location error",
        "Could not get current location. Please try again."
      );
    } finally {
      setLocLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!pendingRole) {
      Alert.alert("Error", "Please choose Donor or Hospital first.");
      return;
    }

    if (!name || !email || !password) {
      Alert.alert("Validation", "Name, email and password are required.");
      return;
    }

    if (pendingRole === "donor" && !bloodGroup) {
      Alert.alert(
        "Validation",
        "Blood group is required for donor registration."
      );
      return;
    }

    if (!coords) {
      Alert.alert(
        "Validation",
        "Please set your location using the GPS button."
      );
      return;
    }

    try {
      setLoading(true);

      const locationArray: [number, number] = [
        coords.latitude,
        coords.longitude,
      ];

      await api.post("/auth/register", {
        name,
        email,
        password,
        role: pendingRole,
        bloodGroup: pendingRole === "donor" ? bloodGroup : null,
        location: locationArray,
      });

      Alert.alert(
        "Success",
        "Account created. Please login with your credentials.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.error ?? "Could not register. Please try again.";
      Alert.alert("Registration error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      {pendingRole === "donor" && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Blood group</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={bloodGroup}
              onValueChange={(value) => setBloodGroup(value)}
              style={styles.picker}
            >
              <Picker.Item label="Select blood group" value="" color="#999" />
              {BLOOD_TYPES.map((type) => (
                <Picker.Item
                  key={type}
                  label={type}
                  value={type}
                  color={theme.colors.text}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.locationRow}>
        <TextInput
          style={[styles.input, styles.locationInput]}
          placeholder="Latitude, Longitude"
          placeholderTextColor="#999"
          value={locationText}
          editable={false}
        />
        <TouchableOpacity
          style={[styles.locButton, locLoading && { opacity: 0.7 }]}
          onPress={handleUseCurrentLocation}
          disabled={locLoading}
        >
          {locLoading ? (
            <ActivityIndicator color={theme.colors.textOnPrimary} />
          ) : (
            <Text style={styles.locButtonText}>Use GPS</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.registerButton, loading && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.textOnPrimary} />
        ) : (
          <Text style={styles.registerButtonText}>Register</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    backgroundColor: "#FFFFFF",
  },
  dropdownContainer: {
    marginBottom: theme.spacing.md,
  },
  dropdownLabel: {
    fontSize: 12,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: "#FFFFFF",
  },
  picker: {
    height: 44,
    width: "100%",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  locationInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: theme.spacing.sm,
  },
  locButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
  },
  locButtonText: {
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
    fontSize: 12,
  },
  registerButton: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  registerButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});
