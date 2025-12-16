// src/screens/hospital/HospitalEditRequestScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../../theme/theme';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import api from '../../services/app';

type Props = NativeStackScreenProps<AppStackParamList, 'HospitalEditRequest'>;

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const HospitalEditRequestScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id, bloodType: initialBloodType, units: initialUnits } = route.params;

  const [bloodType, setBloodType] = useState(initialBloodType);
  const [units, setUnits] = useState(String(initialUnits));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!bloodType || !units) {
      Alert.alert('Validation', 'Blood type and units are required.');
      return;
    }

    const unitsNumber = Number(units);
    if (Number.isNaN(unitsNumber) || unitsNumber <= 0) {
      Alert.alert('Validation', 'Units must be a positive number.');
      return;
    }

    try {
      setLoading(true);
      await api.put(`/hospital/requests/${id}`, {
        bloodType,
        units: unitsNumber,
      });

      Alert.alert('Success', 'Request updated.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.error ??
        'Could not update request. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit blood request</Text>

      <Text style={styles.label}>Blood type</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={bloodType}
          onValueChange={(value) => setBloodType(value)}
          style={styles.picker}
        >
          {BLOOD_TYPES.map((bt) => (
            <Picker.Item key={bt} label={bt} value={bt} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Units requested</Text>
      <TextInput
        style={styles.input}
        value={units}
        onChangeText={setUnits}
        keyboardType="number-pad"
        placeholder="Enter units"
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={[styles.saveButton, loading && { opacity: 0.7 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.textOnPrimary} />
        ) : (
          <Text style={styles.saveText}>Save changes</Text>
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
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  picker: {
    height: 60,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  saveText: {
    color: theme.colors.textOnPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
});
