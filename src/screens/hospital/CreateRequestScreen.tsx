// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { theme } from '../../theme/theme';
// import type { AppStackParamList } from '../../navigation/AppNavigator';
// import api from '../../services/app';

// type Props = NativeStackScreenProps<AppStackParamList, 'CreateRequest'>;

// export const CreateRequestScreen: React.FC<Props> = ({ navigation }) => {
//   const [bloodType, setBloodType] = useState('');
//   const [persons, setPersons] = useState('');
//   const [notes, setNotes] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!bloodType || !persons) {
//       Alert.alert('Validation', 'Blood type and number of persons are required.');
//       return;
//     }

//     const personsNumber = Number(persons);
//     if (Number.isNaN(personsNumber) || personsNumber <= 0) {
//       Alert.alert(
//         'Validation',
//         'Number of persons must be a positive number.'
//       );
//       return;
//     }

//     try {
//       setLoading(true);
//       // POST /api/hospital/requests
//       await api.post('/hospital/requests', {
//         bloodType,
//         persons: personsNumber,
//         notes,
//       });

//       Alert.alert('Success', 'Request created.', [
//         {
//           text: 'OK',
//           onPress: () => navigation.goBack(),
//         },
//       ]);
//     } catch (error: any) {
//       const message =
//         error?.response?.data?.error ??
//         'Could not create request. Please try again.';
//       Alert.alert('Error', message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create blood request</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Blood type (e.g., O+)"
//         placeholderTextColor="#999"
//         value={bloodType}
//         onChangeText={setBloodType}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Number of persons needed (e.g., 4)"
//         placeholderTextColor="#999"
//         value={persons}
//         onChangeText={setPersons}
//         keyboardType="number-pad"
//       />

//       <TextInput
//         style={[styles.input, styles.notesInput]}
//         placeholder="Notes / urgency / ward (optional)"
//         placeholderTextColor="#999"
//         value={notes}
//         onChangeText={setNotes}
//         multiline
//       />

//       <TouchableOpacity
//         style={[styles.submitButton, loading && { opacity: 0.7 }]}
//         onPress={handleSubmit}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color={theme.colors.textOnPrimary} />
//         ) : (
//           <Text style={styles.submitText}>Create request</Text>
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
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: theme.colors.primary,
//     marginBottom: theme.spacing.lg,
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
//   notesInput: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   submitButton: {
//     backgroundColor: theme.colors.primary,
//     paddingVertical: theme.spacing.md,
//     borderRadius: theme.radius.md,
//     alignItems: 'center',
//     marginTop: theme.spacing.md,
//   },
//   submitText: {
//     color: theme.colors.textOnPrimary,
//     fontWeight: '600',
//     fontSize: 16,
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
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../theme/theme";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import api from "../../services/app";

type Props = NativeStackScreenProps<AppStackParamList, "CreateRequest">;

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const CreateRequestScreen: React.FC<Props> = ({ navigation }) => {
  const [bloodType, setBloodType] = useState("");
  const [persons, setPersons] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!bloodType || !persons) {
      Alert.alert(
        "Validation",
        "Blood type and number of persons are required."
      );
      return;
    }

    const personsNumber = Number(persons);
    if (Number.isNaN(personsNumber) || personsNumber <= 0) {
      Alert.alert("Validation", "Number of persons must be a positive number.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/hospital/requests", {
        bloodType,
        persons: personsNumber,
        notes,
      });

      Alert.alert("Success", "Request created.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.error ??
        "Could not create request. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create blood request</Text>

      <Text style={styles.label}>Blood type</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={bloodType}
          onValueChange={(value) => setBloodType(value)}
          style={styles.picker}
        >
          <Picker.Item label="Select blood type..." value="" />
          {BLOOD_TYPES.map((bt) => (
            <Picker.Item key={bt} label={bt} value={bt} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Number of persons needed (e.g., 4)"
        placeholderTextColor="#999"
        value={persons}
        onChangeText={setPersons}
        keyboardType="number-pad"
      />

      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Notes / urgency / ward (optional)"
        placeholderTextColor="#999"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity
        style={[styles.submitButton, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.textOnPrimary} />
        ) : (
          <Text style={styles.submitText}>Create request</Text>
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
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: "500",
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  picker: {
    height: 60,
    width: "100%",
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
  notesInput: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
    marginTop: theme.spacing.md,
  },
  submitText: {
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
    fontSize: 16,
  },
});
