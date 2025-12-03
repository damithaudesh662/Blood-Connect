// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.tsx to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme/theme';
import { useAuth } from '../navigation/RootNavigator';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

// type AuthNavProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;
type AuthNavProp = NativeStackNavigationProp<AuthStackParamList, 'Home'>;
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<AuthNavProp>();
  const { setPendingRole } = useAuth();

  const handlePress = (role: 'donor' | 'hospital') => {
    setPendingRole(role);
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blood Connect</Text>
      <Text style={styles.subtitle}>Location-Aware Blood Donation</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.donorButton]}
          onPress={() => handlePress('donor')}
        >
          <Text style={styles.buttonText}>I am a Donor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.hospitalButton]}
          onPress={() => handlePress('hospital')}
        >
          <Text style={styles.buttonText}>I am a Hospital</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: theme.spacing.md,
  },
  button: {
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
  },
  donorButton: {
    backgroundColor: theme.colors.primary,
  },
  hospitalButton: {
    backgroundColor: theme.colors.primaryLight,
  },
  buttonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
