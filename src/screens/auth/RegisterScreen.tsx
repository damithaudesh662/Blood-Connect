import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons"; 
import * as Notifications from "expo-notifications"; 
import { theme } from "../../theme/theme";
import { useAuth } from "../../navigation/RootNavigator";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import api from "../../services/app";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    
    shouldShowBanner: true, 
    shouldShowList: true, 
  }),
});

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

  // State to handle iOS Modal visibility
  const [showPicker, setShowPicker] = useState(false);

  const [phone, setPhone] = useState("");

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
    console.log("--- START REGISTER HANDLER ---");

    if (!pendingRole) {
      Alert.alert("Error", "Please choose Donor or Hospital first.");
      console.error("DEBUG: Failed validation - pendingRole is null.");
      return;
    }

    if (!name || !email || !password) {
      Alert.alert("Validation", "Name, email and password are required.");
      console.error("DEBUG: Failed validation - missing basic fields.");
      return;
    }

    if (pendingRole === "donor" && !bloodGroup) {
      Alert.alert(
        "Validation",
        "Blood group is required for donor registration."
      );
      console.error("DEBUG: Failed validation - Donor missing bloodGroup.");
      return;
    }

    if (!coords) {
      Alert.alert(
        "Validation",
        "Please set your location using the GPS button."
      );
      console.error("DEBUG: Failed validation - missing coordinates.");
      return;
    }

    try {
      setLoading(true);
      console.log(`DEBUG: Starting registration for role: ${pendingRole}`);

      // --- EXPO TOKEN LOGIC START ---
      let fcmToken = null;
      if (pendingRole === "donor") {
        try {
          console.log(
            "DEBUG: Donor role detected. Attempting to get Expo Token."
          );

          // 1. Check/Request Notification Permissions
          console.log("DEBUG: Awaiting getPermissionsAsync...");
          const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          console.log(`DEBUG: Existing permission status: ${existingStatus}`);

          if (existingStatus !== "granted") {
            console.log("DEBUG: Requesting new notification permission...");
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            console.log(`DEBUG: New permission status: ${finalStatus}`);
          }

          if (finalStatus === "granted") {
            // 2. Get the Expo Push Token
            console.log(
              "DEBUG: Permission granted. Awaiting getExpoPushTokenAsync..."
            );

            const PROJECT_ID = process.env.EXPO_PUBLIC_PROJECT_ID;

            console.log(`DEBUG: Retrieved PROJECT_ID from env: ${PROJECT_ID}`);

            if (!PROJECT_ID) {
              console.error("FATAL: EXPO_PUBLIC_PROJECT_ID is not defined.");
              // Add an alert here if you want to notify the developer
              throw new Error("Missing EXPO_PUBLIC_PROJECT_ID");
            }

            const tokenObject = await Notifications.getExpoPushTokenAsync({
              projectId: PROJECT_ID, 
            });

            fcmToken = tokenObject.data;
            console.log(
              `DEBUG: Successfully acquired Expo Push Token: ${fcmToken}`
            );
          } else {
            console.error(
              "DEBUG: Notification permission NOT granted. Token will be null."
            );
          }
        } catch (tokenError) {
          console.error(
            "DEBUG: FATAL ERROR during Expo Token retrieval:",
            tokenError
          );
          // Proceed with registration even if token fails, token will be null
        }
      }
      // --- EXPO TOKEN LOGIC END ---

      const locationArray: [number, number] = [
        coords.latitude,
        coords.longitude,
      ];

      const registrationPayload = {
        name,
        email,
        password,
        role: pendingRole,
        bloodGroup: pendingRole === "donor" ? bloodGroup : null,
        location: locationArray,
        fcmToken: fcmToken, // This is the Expo Token
      };

      console.log(
        `DEBUG: Sending API POST to /auth/register with payload (check backend log for fcmToken): ${JSON.stringify(
          registrationPayload
        )}`
      );

      // --- API CALL START ---
      await api.post("/auth/register", registrationPayload);
      console.log("DEBUG: API POST successful! Backend returned 201.");
      // --- API CALL END ---

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
      console.log("--- END REGISTER HANDLER (SUCCESS) ---");
    } catch (error: any) {
      console.error("DEBUG: FATAL ERROR caught in final catch block.");
      console.error("DEBUG: Full error object:", error);

      
      const message =
        error?.response?.data?.error ?? "Could not register. Please try again.";
      Alert.alert("Registration error", message);
      console.error(`DEBUG: Displayed user error: ${message}`);
    } finally {
      setLoading(false);
      console.log("DEBUG: setLoading(false) executed.");
    }
  };

  return (
    <View style={styles.container}>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
      

      <Text style={styles.title}>{title}</Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <View style={styles.phoneRow}>
        <View style={styles.phonePrefixBox}>
          <Text style={styles.phonePrefixText}>+94</Text>
        </View>
        <TextInput
          style={[styles.input, styles.phoneInput]}
          placeholder="Mobile number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {pendingRole === "donor" && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Blood group</Text>

          {/* Platform specific rendering */}
          {Platform.OS === "android" ? (
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
          ) : (
            // iOS Implementation: A button that opens a Modal
            <>
              <TouchableOpacity
                style={[styles.input, styles.iosPickerButton]}
                onPress={() => setShowPicker(true)}
              >
                <Text
                  style={
                    bloodGroup
                      ? styles.iosPickerText
                      : styles.iosPickerPlaceholder
                  }
                >
                  {bloodGroup || "Select blood group"}
                </Text>
              </TouchableOpacity>

              <Modal
                transparent={true}
                animationType="slide"
                visible={showPicker}
                onRequestClose={() => setShowPicker(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    {/* Toolbar with Done button */}
                    <View style={styles.modalToolbar}>
                      <TouchableOpacity
                        onPress={() => setShowPicker(false)}
                        style={styles.modalDoneButton}
                      >
                        <Text style={styles.modalDoneText}>Done</Text>
                      </TouchableOpacity>
                    </View>

                    {/* The Actual Picker Wheel */}
                    <Picker
                      selectedValue={bloodGroup}
                      onValueChange={(value) => setBloodGroup(value)}
                      style={{ height: 215, width: "100%" }} // Standard iOS Picker Height
                    >
                      <Picker.Item
                        label="Select blood group"
                        value=""
                        color="#999"
                      />
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
              </Modal>
            </>
          )}
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
  
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
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
    height: 44, 
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    backgroundColor: "#FFFFFF",
    color: theme.colors.text,
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
    height: 50, 
    width: "100%",
  },
  // New Styles for iOS Interaction
  iosPickerButton: {
    justifyContent: "center",
  },
  iosPickerText: {
    color: theme.colors.text,
  },
  iosPickerPlaceholder: {
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  phonePrefixBox: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    height: 44,
    justifyContent: "center",
    marginRight: theme.spacing.sm,
    backgroundColor: "#FFFFFF",
  },
  phonePrefixText: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  phoneInput: {
    flex: 1,
    marginBottom: 0,
  },
  modalToolbar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f8f8f8",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalDoneButton: {
    paddingHorizontal: 10,
  },
  modalDoneText: {
    color: theme.colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  // End new styles
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
    height: 44,
    justifyContent: "center",
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
