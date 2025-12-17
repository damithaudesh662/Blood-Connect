
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { theme } from "../../theme/theme";
import type { AppStackParamList } from "../../navigation/AppNavigator";

type Props = NativeStackScreenProps<AppStackParamList, "MapViewScreen">;

export const MapViewScreen: React.FC<Props> = ({ route }) => {
  const { hospitalName, latitude, longitude, donorLat, donorLng } = route.params;
  const hasDonor = typeof donorLat === "number" && typeof donorLng === "number";
  

  const region = hasDonor
    ? {
        latitude: (latitude + donorLat!) / 2,
        longitude: (longitude + donorLng!) / 2,
        latitudeDelta: Math.abs(latitude - donorLat!) + 0.05,
        longitudeDelta: Math.abs(longitude - donorLng!) + 0.05,
      }
    : {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{hospitalName}</Text>
      <MapView style={styles.map} initialRegion={region}>
        {hasDonor && (
          <Marker
            coordinate={{ latitude: donorLat!, longitude: donorLng! }}
            title="You"
            description="Donor location"
            pinColor="blue"
          />
        )}

        <Marker
          coordinate={{ latitude, longitude }}
          title={hospitalName}
          description="Hospital location"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.primary,
    padding: theme.spacing.md,
  },
  map: {
    flex: 1,
  },
});