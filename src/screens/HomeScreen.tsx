

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';
import { useAuth } from '../navigation/RootNavigator';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type AuthNavProp = NativeStackNavigationProp<AuthStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<AuthNavProp>();
  const { setPendingRole } = useAuth();

  const handlePress = (role: 'donor' | 'hospital') => {
    setPendingRole(role);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Section: Hero Image & Text */}
        <View style={styles.topSection}>
          <View style={styles.imageContainer}>
            <Image
              // Use require to load the local image asset based on your project structure
              source={require('../../assets/blood_donor_logo.png')} //
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Blood Connect</Text>
            <Text style={styles.subtitle}>
              Bridging the gap between donors and those in need. 
            </Text>
          </View>
        </View>

        {/* Bottom Section: Action Buttons */}
        <View style={styles.buttonContainer}>
          <Text style={styles.actionLabel}>Continue as</Text>

          <TouchableOpacity
            style={[styles.button, styles.donorButton, styles.shadow]}
            activeOpacity={0.8}
            onPress={() => handlePress('donor')}
          >
            <Ionicons
              name="heart"
              size={24}
              color={theme.colors.textOnPrimary}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Donor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.hospitalButton, styles.shadow]}
            activeOpacity={0.8}
            onPress={() => handlePress('hospital')}
          >
            <Ionicons
              name="medkit"
              size={24}
              color={theme.colors.textOnPrimary}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Hospital / Blood Bank</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'space-between', // Pushes top section up and buttons down
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  imageContainer: {
    height: 220,
    width: '100%',
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: '90%',
    height: '100%',
  },
  textContainer: {
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    fontSize: 36,
    fontWeight: '800', // Extra bold for modern feel
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24, // Better readability
    opacity: 0.8, // Slightly softer than pure black text
  },
  buttonContainer: {
    borderRadius: 12,
    width: '100%',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    opacity: 0.6,
    marginLeft: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  button: {
    flexDirection: 'row', // Align icon and text horizontally
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.lg, //Rounds corners more significantly
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  // Modern soft shadow styling
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  donorButton: {
    backgroundColor: theme.colors.primary,
  },
  hospitalButton: {
    backgroundColor: theme.colors.primaryLight,
  },
  buttonIcon: {
    marginRight: theme.spacing.md,
  },
  buttonText: {
    color: theme.colors.textOnPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});