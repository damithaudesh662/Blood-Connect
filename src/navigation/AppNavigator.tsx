import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DonorHomeScreen } from '../screens/donor/DonorHomeScreen';
import { HospitalHomeScreen } from '../screens/hospital/HospitalHomeScreen';
import { useAuth } from './RootNavigator';

// ...existing imports...
import { CreateRequestScreen } from '../screens/hospital/CreateRequestScreen';
import { RequestDetailScreen } from '../screens/donor/RequestDetailScreen';

export type AppStackParamList = {
  DonorHome: undefined;
  HospitalHome: undefined;
  CreateRequest: undefined;
  RequestDetail: {
    id: string;
    hospitalName: string;
    location: string;
    bloodType: string;
    distanceKm: number;
    urgency: 'High' | 'Medium';
  };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  const { role } = useAuth();
  const initialRouteName =
    role === 'hospital' ? 'HospitalHome' : 'DonorHome';

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="DonorHome"
        component={DonorHomeScreen}
        options={{ title: 'Blood Connect – Donor' }}
      />
      <Stack.Screen
        name="HospitalHome"
        component={HospitalHomeScreen}
        options={{ title: 'Blood Connect – Hospital' }}
      />
      <Stack.Screen
        name="CreateRequest"
        component={CreateRequestScreen}
        options={{ title: 'New blood request' }}
      />
      <Stack.Screen
        name="RequestDetail"
        component={RequestDetailScreen}
        options={{ title: 'Request details' }}
      />
    </Stack.Navigator>
  );
};
