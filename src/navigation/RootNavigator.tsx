

import React, {
  useMemo,
  useState,
  createContext,
  useContext,
  useEffect,
} from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { theme } from '../theme/theme';
import { saveAuth, getAuth, clearAuth } from '../services/authStorage';

import api, { setAuthToken } from '../services/app';

type UserRole = 'donor' | 'hospital' | null;

type AuthContextType = {
  isSignedIn: boolean;
  role: UserRole;
  signIn: (token: string, role: Exclude<UserRole, null>) => Promise<void>;
  signOut: () => Promise<void>;
  setPendingRole: (role: Exclude<UserRole, null>) => void;
  pendingRole: UserRole;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

export const RootNavigator: React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [pendingRole, setPendingRoleState] = useState<UserRole>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const { token, role: storedRole } = await getAuth();
        if (token && storedRole) {
          setAuthToken(token);
          setRole(storedRole);
          setIsSignedIn(true);
        }
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrapAsync();
  }, []);

  const setPendingRole = (r: Exclude<UserRole, null>) => {
    setPendingRoleState(r);
  };

  const signIn = async (token: string, r: 'donor' | 'hospital') => {
    await saveAuth(token, r);
    setAuthToken(token);
    setRole(r);
    setIsSignedIn(true);
    setPendingRoleState(null);
  };

  const signOut = async () => {
    await clearAuth();
    setAuthToken(null);
    setIsSignedIn(false);
    setRole(null);
  };

  const value = useMemo(
    () => ({
      isSignedIn,
      role,
      signIn,
      signOut,
      pendingRole,
      setPendingRole,
    }),
    [isSignedIn, role, pendingRole]
  );

  if (isBootstrapping) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {isSignedIn ? <AppNavigator /> : <AuthNavigator />}
    </AuthContext.Provider>
  );
};
