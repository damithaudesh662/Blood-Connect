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
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  InputAccessoryView,
  Button,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../theme/theme";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import api from "../../services/app";

type Props = NativeStackScreenProps<AppStackParamList, "CreateRequest">;

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const INPUT_ACCESSORY_ID = "DoneButtonAccessory"; // ID for the iOS keyboard toolbar

export const CreateRequestScreen: React.FC<Props> = ({ navigation }) => {
  const [bloodType, setBloodType] = useState("");
  const [persons, setPersons] = useState("");
  const [coverage, setCoverage] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  
  // State to toggle the iOS Picker wheel visibility
  const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = async () => {
    Keyboard.dismiss(); // Ensure keyboard is closed on submit

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

    let coverageNumber: number | undefined;
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
        coverage: coverageNumber ?? null,
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

  // Helper to close keyboard when tapping background
  const dismissKeyboard = () => {
    Keyboard.dismiss();
    // On iOS, we also want to hide the picker if the user taps away
    if (Platform.OS === 'ios') {
       setShowPicker(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* 1. InputAccessoryView (iOS Only): 
         Adds a toolbar with a 'Done' button above the number pad.
      */}
      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID={INPUT_ACCESSORY_ID}>
          <View style={styles.accessory}>
            <Button onPress={() => Keyboard.dismiss()} title="Done" />
          </View>
        </InputAccessoryView>
      )}

      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create blood request</Text>

          {/* --- BLOOD TYPE SELECTOR --- */}
          <Text style={styles.label}>Blood type</Text>
          
          {Platform.OS === "ios" ? (
            // iOS: Custom Toggable View
            <View>
              <TouchableOpacity
                style={styles.iosPickerSelector}
                onPress={() => {
                  Keyboard.dismiss();
                  setShowPicker(!showPicker);
                }}
              >
                <Text style={bloodType ? styles.pickerText : styles.placeholderText}>
                  {bloodType || "Select blood type..."}
                </Text>
              </TouchableOpacity>

              {showPicker && (
                <View style={styles.iosPickerContainer}>
                  <Picker
                    selectedValue={bloodType}
                    onValueChange={(value) => setBloodType(value)}
                    style={{ width: "100%" }}
                  >
                     <Picker.Item label="Select..." value="" />
                    {BLOOD_TYPES.map((bt) => (
                      <Picker.Item key={bt} label={bt} value={bt} />
                    ))}
                  </Picker>
                </View>
              )}
            </View>
          ) : (
            // Android: Standard Dropdown
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
          )}

          {/* --- NUMBER INPUTS --- */}
          <TextInput
            style={styles.input}
            placeholder="Number of persons needed (e.g., 4)"
            placeholderTextColor="#999"
            value={persons}
            onChangeText={setPersons}
            keyboardType="number-pad"
            // Connects to the iOS 'Done' button toolbar
            inputAccessoryViewID={INPUT_ACCESSORY_ID} 
          />

          <TextInput
            style={styles.input}
            placeholder="Coverage radius in km (optional)"
            placeholderTextColor="#999"
            value={coverage}
            onChangeText={setCoverage}
            keyboardType="number-pad"
            inputAccessoryViewID={INPUT_ACCESSORY_ID}
          />

          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Notes / urgency / ward (optional)"
            placeholderTextColor="#999"
            value={notes}
            onChangeText={setNotes}
            multiline
            // Multiline inputs usually have a Return key that creates a new line, 
            // so we usually add a "Done" button here too if we want easy dismissal.
            inputAccessoryViewID={INPUT_ACCESSORY_ID}
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
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    paddingBottom: 50, // Extra padding at bottom for scrolling
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
  // Android Picker Styles
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    width: "100%",
    height: 50,
  },
  // iOS Custom Picker Styles
  iosPickerSelector: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    height: 50,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: theme.spacing.md,
  },
  iosPickerContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
  },
  pickerText: {
    color: "#000",
    fontSize: 16,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  // Input Styles
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    backgroundColor: "#FFFFFF",
    height: 50,
    color: "#000",
  },
  notesInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: theme.spacing.sm,
  },
  // Submit Button
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  submitText: {
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
    fontSize: 16,
  },
  // iOS Keyboard Accessory Bar
  accessory: {
    width: "100%",
    height: 44,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#dedede",
  },
});