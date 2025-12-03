// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { theme } from '../../theme/theme';
// import { useAuth } from '../../navigation/RootNavigator';
// import type { AuthStackParamList } from '../../navigation/AuthNavigator';

// type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

// export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
//   const { pendingRole } = useAuth();
//   const [name, setName] = useState('');
//   const [bloodGroup, setBloodGroup] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const title =
//     pendingRole === 'hospital' ? 'Hospital Register' : 'Donor Register';

//   const handleRegister = () => {
//     if (!pendingRole) {
//       Alert.alert('Error', 'Please choose Donor or Hospital first.');
//       return;
//     }

//     if (!name || !email || !password) {
//       Alert.alert('Validation', 'Name, email and password are required.');
//       return;
//     }

//     // Later: call backend registration API
//     Alert.alert('Success', 'Account created (mock). Please login.');
//     navigation.goBack();
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

//       {pendingRole === 'donor' && (
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

//       <TouchableOpacity
//         style={styles.registerButton}
//         onPress={handleRegister}
//       >
//         <Text style={styles.registerButtonText}>Register</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//     padding: theme.spacing.lg,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: theme.colors.primary,
//     marginBottom: theme.spacing.lg,
//     textAlign: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     borderRadius: theme.radius.md,
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.sm,
//     marginBottom: theme.spacing.md,
//     backgroundColor: '#FFFFFF',
//   },
//   registerButton: {
//     backgroundColor: theme.colors.primaryLight,
//     paddingVertical: theme.spacing.md,
//     borderRadius: theme.radius.md,
//     alignItems: 'center',
//     marginTop: theme.spacing.sm,
//   },
//   registerButtonText: {
//     color: theme.colors.textOnPrimary,
//     fontSize: 16,
//     fontWeight: '600',
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
import { theme } from "../../theme/theme";
import { useAuth } from "../../navigation/RootNavigator";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import api from "../../services/app";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { pendingRole } = useAuth();
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const title =
    pendingRole === "hospital" ? "Hospital Register" : "Donor Register";

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

    try {
      setLoading(true);
      console.log("Registering user:", {
        name,
        email,
        password,
        role: pendingRole,
        bloodGroup: pendingRole === "donor" ? bloodGroup : null,
      });

      // POST /api/auth/register
      await api.post("/auth/register", {
        name,
        email,
        password,
        role: pendingRole, // 'donor' or 'hospital'
        bloodGroup: pendingRole === "donor" ? bloodGroup : null,
      });

      console.log("Registration successful");

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
        <TextInput
          style={styles.input}
          placeholder="Blood group (e.g., A+)"
          placeholderTextColor="#999"
          value={bloodGroup}
          onChangeText={setBloodGroup}
        />
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
