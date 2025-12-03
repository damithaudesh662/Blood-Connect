import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '../../theme/theme';
import type { AppStackParamList } from '../../navigation/AppNavigator';

type Props = NativeStackScreenProps<AppStackParamList, 'CreateRequest'>;

export const CreateRequestScreen: React.FC<Props> = ({ navigation }) => {
  const [bloodType, setBloodType] = useState('');
  const [units, setUnits] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!bloodType || !units) {
      Alert.alert('Validation', 'Blood type and units are required.');
      return;
    }

    // Later: send to backend and update list via API
    Alert.alert('Success', 'Request created (mock).', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create blood request</Text>

      <TextInput
        style={styles.input}
        placeholder="Blood type (e.g., O+)"
        placeholderTextColor="#999"
        value={bloodType}
        onChangeText={setBloodType}
      />

      <TextInput
        style={styles.input}
        placeholder="Units needed (e.g., 4)"
        placeholderTextColor="#999"
        value={units}
        onChangeText={setUnits}
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

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Create request</Text>
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
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    backgroundColor: '#FFFFFF',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  submitText: {
    color: theme.colors.textOnPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
});
