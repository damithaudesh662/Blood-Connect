import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { theme } from "../../theme/theme";
import { DashboardCard } from "../../components/DashboardCard";
import { useAuth } from "../../navigation/RootNavigator";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";

type EmergencyRequest = {
  id: string;
  hospitalName: string;
  location: string;
  bloodType: string;
  distanceKm: number;
  urgency: "High" | "Medium";
};

const MOCK_REQUESTS: EmergencyRequest[] = [
  {
    id: "1",
    hospitalName: "Badulla General Hospital",
    location: "Badulla",
    bloodType: "A+",
    distanceKm: 2.3,
    urgency: "High",
  },
  {
    id: "2",
    hospitalName: "Kandy Teaching Hospital",
    location: "Kandy",
    bloodType: "O-",
    distanceKm: 18.7,
    urgency: "Medium",
  },
];

export const DonorHomeScreen: React.FC = () => {
  const { signOut } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const renderRequestItem = ({ item }: { item: EmergencyRequest }) => {
    return (
      <View style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <Text style={styles.requestHospital}>{item.hospitalName}</Text>
          <View
            style={[
              styles.urgencyTag,
              item.urgency === "High"
                ? styles.urgencyHigh
                : styles.urgencyMedium,
            ]}
          >
            <Text style={styles.urgencyText}>{item.urgency}</Text>
          </View>
        </View>
        <Text style={styles.requestText}>
          Needed blood type:{" "}
          <Text style={styles.requestHighlight}>{item.bloodType}</Text>
        </Text>
        <Text style={styles.requestText}>
          Location: <Text style={styles.requestHighlight}>{item.location}</Text>
        </Text>
        <Text style={styles.requestText}>
          Distance:{" "}
          <Text style={styles.requestHighlight}>
            {item.distanceKm.toFixed(1)} km
          </Text>
        </Text>

        <TouchableOpacity
          style={styles.respondButton}
          onPress={() =>
            navigation.navigate("RequestDetail", {
              id: item.id,
              hospitalName: item.hospitalName,
              location: item.location,
              bloodType: item.bloodType,
              distanceKm: item.distanceKm,
              urgency: item.urgency,
            })
          }
        >
          <Text style={styles.respondButtonText}>View details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.appTitle}>Blood Connect</Text>
          <Text style={styles.appSubtitle}>Donor Dashboard</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <DashboardCard
          title="Next eligible"
          value="12 Jan 2026"
          subtitle="Based on last donation"
          style={styles.statCard}
        />
        <DashboardCard
          title="Last donation"
          value="20 Sep 2025"
          subtitle="Badulla Hospital"
          style={styles.statCard}
        />
        <DashboardCard
          title="Total donations"
          value="5"
          subtitle="Thank you!"
          style={styles.statCard}
        />
      </View>

      <Text style={styles.sectionTitle}>Emergency requests near you</Text>

      <FlatList
        data={MOCK_REQUESTS}
        keyExtractor={(item) => item.id}
        renderItem={renderRequestItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  appSubtitle: {
    fontSize: 14,
    color: theme.colors.text,
  },
  logoutButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },
  logoutText: {
    color: theme.colors.primaryLight,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  requestHospital: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  urgencyTag: {
    borderRadius: 999,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  urgencyHigh: {
    backgroundColor: theme.colors.primary,
  },
  urgencyMedium: {
    backgroundColor: theme.colors.primaryLight,
  },
  urgencyText: {
    color: theme.colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
  requestText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  requestHighlight: {
    fontWeight: "600",
    color: theme.colors.primary,
  },
  respondButton: {
    marginTop: theme.spacing.sm,
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  respondButtonText: {
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
  },
});
