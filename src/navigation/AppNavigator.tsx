import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DonorHomeScreen } from "../screens/donor/DonorHomeScreen";
import { HospitalHomeScreen } from "../screens/hospital/HospitalHomeScreen";
import { useAuth } from "./RootNavigator";


import { CreateRequestScreen } from "../screens/hospital/CreateRequestScreen";
import { RequestDetailScreen } from "../screens/donor/RequestDetailScreen";
import { DonorResponsesScreen } from "../screens/donor/DonorResponsesScreen";
import { MapViewScreen } from "../screens/common/MapViewScreen";
import { DonorProfileScreen } from "../screens/donor/DonorProfileScreen";
import { HospitalPastRequestsScreen } from "../screens/hospital/HospitalPastRequestsScreen";
import { HospitalEditRequestScreen } from "../screens/hospital/HospitalEditRequestScreen";

export type AppStackParamList = {
  DonorHome: undefined;
  HospitalHome: undefined;
  CreateRequest: undefined;
  HospitalPastRequests: undefined;
  RequestDetail: {
    id: string;
    hospitalName: string;
    location: string;
    bloodType: string;
    distanceKm: number;
    urgency: "High" | "Medium";
    latitude: number;
    longitude: number;
  };
  DonorResponses: undefined;
  MapViewScreen: {
    hospitalName: string;
    latitude: number;
    longitude: number;
    donorLat?: number;
    donorLng?: number;
  };
  DonorProfile: undefined;
  HospitalEditRequest: {
    id: string | number;
    bloodType: string;
    units: number;
  };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  const { role } = useAuth();
  const initialRouteName = role === "hospital" ? "HospitalHome" : "DonorHome";

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen
        name="DonorHome"
        component={DonorHomeScreen}
        options={{ title: "Blood Connect – Donor" }}
      />
      <Stack.Screen
        name="HospitalHome"
        component={HospitalHomeScreen}
        options={{ title: "Blood Connect – Hospital" }}
      />
      <Stack.Screen
        name="CreateRequest"
        component={CreateRequestScreen}
        options={{ title: "New blood request" }}
      />
      <Stack.Screen
        name="RequestDetail"
        component={RequestDetailScreen}
        options={{ title: "Request details" }}
      />
      <Stack.Screen name="DonorResponses" component={DonorResponsesScreen} />
      <Stack.Screen name="MapViewScreen" component={MapViewScreen} />
      <Stack.Screen name="DonorProfile" component={DonorProfileScreen} />
      <Stack.Screen
        name="HospitalPastRequests"
        component={HospitalPastRequestsScreen}
      />
      <Stack.Screen
        name="HospitalEditRequest"
        component={HospitalEditRequestScreen}
      />
    </Stack.Navigator>
  );
};
