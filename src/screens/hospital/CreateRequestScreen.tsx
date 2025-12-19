import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { theme } from "../../theme/theme";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import api from "../../services/app";

type Props = NativeStackScreenProps<AppStackParamList, "CreateRequest">;

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const CreateRequestScreen: React.FC<Props> = ({ navigation }) => {
  const [bloodType, setBloodType] = useState<string | null>(null);
  const [persons, setPersons] = useState("");
  const [coverage, setCoverage] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBloodModal, setShowBloodModal] = useState(false);

  const handleSubmit = async () => {
    Keyboard.dismiss();

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

    let coverageNumber: number | null = null;
    if (coverage.trim().length > 0) {
      const parsed = Number(coverage);
      if (Number.isNaN(parsed) || parsed <= 0) {
        Alert.alert(
          "Validation",
          "Coverage radius must be a positive number if provided."
        );
        return;
      }
      coverageNumber = parsed;
    }

    try {
      setLoading(true);
      await api.post("/hospital/requests", {
        bloodType,
        persons: personsNumber,
        notes,
        coverage: coverageNumber,
      });

      Alert.alert("Success", "Request created.", [
        { text: "OK", onPress: () => navigation.goBack() },
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create blood request</Text>

          {/* Blood type dropdown */}
          <Text style={styles.label}>Blood type</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowBloodModal(true)}
          >
            <Text style={bloodType ? styles.dropdownText : styles.placeholder}>
              {bloodType ?? "Select blood type"}
            </Text>
          </TouchableOpacity>

          {/* Modal */}
          <Modal visible={showBloodModal} transparent animationType="fade">
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setShowBloodModal(false)}
            >
              <View style={styles.modalContent}>
                {BLOOD_TYPES.map((bt) => (
                  <Pressable
                    key={bt}
                    style={styles.modalItem}
                    onPress={() => {
                      setBloodType(bt);
                      setShowBloodModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{bt}</Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>

          <TextInput
            style={styles.input}
            placeholder="Number of persons needed (e.g., 4)"
            placeholderTextColor="#999"
            value={persons}
            onChangeText={setPersons}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          <TextInput
            style={styles.input}
            placeholder="Coverage radius in km (optional)"
            placeholderTextColor="#999"
            value={coverage}
            onChangeText={setCoverage}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Notes / urgency / ward (optional)"
            placeholderTextColor="#999"
            value={notes}
            onChangeText={setNotes}
            multiline
            blurOnSubmit
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  dropdown: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    backgroundColor: "#fff",
    marginBottom: theme.spacing.md,
  },
  dropdownText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  placeholder: {
    color: "#999",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalItemText: {
    fontSize: 16,
    color: theme.colors.text,
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


//
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
// import { Picker } from "@react-native-picker/picker";
// import { theme } from "../../theme/theme";
// import type { AppStackParamList } from "../../navigation/AppNavigator";
// import api from "../../services/app";
//
// type Props = NativeStackScreenProps<AppStackParamList, "CreateRequest">;
//
// const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
//
// export const CreateRequestScreen: React.FC<Props> = ({ navigation }) => {
//   const [bloodType, setBloodType] = useState("");
//   const [persons, setPersons] = useState("");
//   const [coverage, setCoverage] = useState(""); // radius in km, optional
//   const [notes, setNotes] = useState("");
//   const [loading, setLoading] = useState(false);
//
//   const handleSubmit = async () => {
//     if (!bloodType || !persons) {
//       Alert.alert(
//         "Validation",
//         "Blood type and number of persons are required."
//       );
//       return;
//     }
//
//     const personsNumber = Number(persons);
//     if (Number.isNaN(personsNumber) || personsNumber <= 0) {
//       Alert.alert("Validation", "Number of persons must be a positive number.");
//       return;
//     }
//
//     let coverageNumber: number | undefined;
//     if (coverage.trim().length > 0) {
//       const parsed = Number(coverage);
//       if (Number.isNaN(parsed) || parsed <= 0) {
//         Alert.alert(
//           "Validation",
//           "Coverage radius must be a positive number if provided."
//         );
//         return;
//       }
//       coverageNumber = parsed;
//     }
//
//     try {
//       setLoading(true);
//       await api.post("/hospital/requests", {
//         bloodType,
//         persons: personsNumber,
//         notes,
//         // send null/undefined when not set so backend treats as “no coverage limit”
//         coverage: coverageNumber ?? null,
//       });
//
//       Alert.alert("Success", "Request created.", [
//         {
//           text: "OK",
//           onPress: () => navigation.goBack(),
//         },
//       ]);
//     } catch (error: any) {
//       const message =
//         error?.response?.data?.error ??
//         "Could not create request. Please try again.";
//       Alert.alert("Error", message);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create blood request</Text>
//
//       <Text style={styles.label}>Blood type</Text>
//       <View style={styles.pickerWrapper}>
//         <Picker
//           selectedValue={bloodType}
//           onValueChange={(value) => setBloodType(value)}
//           style={styles.picker}
//         >
//           <Picker.Item label="Select blood type..." value="" />
//           {BLOOD_TYPES.map((bt) => (
//             <Picker.Item key={bt} label={bt} value={bt} />
//           ))}
//         </Picker>
//       </View>
//
//       <TextInput
//         style={styles.input}
//         placeholder="Number of persons needed (e.g., 4)"
//         placeholderTextColor="#999"
//         value={persons}
//         onChangeText={setPersons}
//         keyboardType="number-pad"
//       />
//
//       <TextInput
//         style={styles.input}
//         placeholder="Coverage radius in km (optional, e.g., 10)"
//         placeholderTextColor="#999"
//         value={coverage}
//         onChangeText={setCoverage}
//         keyboardType="number-pad"
//       />
//
//       <TextInput
//         style={[styles.input, styles.notesInput]}
//         placeholder="Notes / urgency / ward (optional)"
//         placeholderTextColor="#999"
//         value={notes}
//         onChangeText={setNotes}
//         multiline
//       />
//
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
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//     padding: theme.spacing.lg,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: theme.colors.primary,
//     marginBottom: theme.spacing.lg,
//   },
//   label: {
//     fontSize: 14,
//     color: theme.colors.text,
//     marginBottom: theme.spacing.xs,
//     fontWeight: "500",
//   },
//   pickerWrapper: {
//     borderWidth: 2,
//     borderColor: theme.colors.border,
//     borderRadius: theme.radius.md,
//     marginBottom: theme.spacing.md,
//     backgroundColor: "#FFFFFF",
//     overflow: "hidden",
//   },
//   picker: {
//     height: 60,
//     width: "100%",
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
//   notesInput: {
//     height: 100,
//     textAlignVertical: "top",
//   },
//   submitButton: {
//     backgroundColor: theme.colors.primary,
//     paddingVertical: theme.spacing.md,
//     borderRadius: theme.radius.md,
//     alignItems: "center",
//     marginTop: theme.spacing.md,
//   },
//   submitText: {
//     color: theme.colors.textOnPrimary,
//     fontWeight: "600",
//     fontSize: 16,
//   },
// });
//
