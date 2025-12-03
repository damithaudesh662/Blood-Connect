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
import { useAuth } from '../../navigation/RootNavigator';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';
import api from '../../services/app'


type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { pendingRole, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const title =
    pendingRole === 'hospital' ? 'Hospital Login' : 'Donor Login';

  const handleLogin = async () => {
    if (!pendingRole) {
      Alert.alert('Error', 'Please choose Donor or Hospital first.');
      navigation.goBack();
      return;
    }

    if (!email || !password) {
      Alert.alert('Validation', 'Email and password are required.');
      return;
    }

    try {
      // Call backend: POST /api/auth/login
      const response = await api.post('/auth/login', {
        email,
        password,
        role: pendingRole,
      });

      const { token, role } = response.data;

      // Use real token + role from backend
      await signIn(token, role);
    } catch (error: any) {
      const message =
        error?.response?.data?.error ??
        'Login failed. Please check your credentials and try again.';
      Alert.alert('Login error', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkContainer}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.linkText}>
          Don&apos;t have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
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
  loginButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  loginButtonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
  },
  linkText: {
    color: theme.colors.primaryLight,
  },
});
