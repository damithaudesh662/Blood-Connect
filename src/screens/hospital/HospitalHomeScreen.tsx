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
// inside HospitalHomeScreen.tsx, in the component:
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AppStackParamList } from "../../navigation/AppNavigator";

type HospitalRequest = {
  id: string;
  bloodType: string;
  units: number;
  status: "Open" | "Partially Filled" | "Fulfilled";
  createdAt: string;
};

const MOCK_HOSPITAL_REQUESTS: HospitalRequest[] = [
  {
    id: "r1",
    bloodType: "O+",
    units: 5,
    status: "Open",
    createdAt: "Today, 3:20 PM",
  },
  {
    id: "r2",
    bloodType: "B-",
    units: 2,
    status: "Partially Filled",
    createdAt: "Today, 11:05 AM",
  },
];

type NavProp = NativeStackNavigationProp<AppStackParamList, "HospitalHome">;

export const HospitalHomeScreen: React.FC = () => {
  const { signOut } = useAuth();
  const navigation = useNavigation<NavProp>();

  const renderRequest = ({ item }: { item: HospitalRequest }) => {
    const statusStyle =
      item.status === "Open"
        ? styles.statusOpen
        : item.status === "Partially Filled"
        ? styles.statusPartial
        : styles.statusFulfilled;

    return (
      <View style={styles.reqCard}>
        <View style={styles.reqHeader}>
          <Text style={styles.reqTitle}>Blood type {item.bloodType}</Text>
          <View style={[styles.statusTag, statusStyle]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.reqText}>
          Units requested: <Text style={styles.reqHighlight}>{item.units}</Text>
        </Text>
        <Text style={styles.reqText}>Created: {item.createdAt}</Text>

        <TouchableOpacity style={styles.manageButton} onPress={() => {}}>
          <Text style={styles.manageButtonText}>Manage request</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.appTitle}>Blood Connect</Text>
          <Text style={styles.appSubtitle}>Hospital Dashboard</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.statsRow}>
        <DashboardCard
          title="Active requests"
          value="3"
          subtitle="Currently open"
          style={styles.statCard}
        />
        <DashboardCard
          title="Fulfilled today"
          value="2"
          subtitle="Thank you, donors"
          style={styles.statCard}
        />
        <DashboardCard
          title="Pending donors"
          value="7"
          subtitle="Awaiting confirmation"
          style={styles.statCard}
        />
      </View>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Current blood requests</Text>
        <TouchableOpacity style={styles.newReqButton} onPress={() => {}}>
          <Text style={styles.newReqButtonText}>+ New request</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Current blood requests</Text>
        <TouchableOpacity
          style={styles.newReqButton}
          onPress={() => navigation.navigate("CreateRequest")}
        >
          <Text style={styles.newReqButtonText}>+ New request</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={MOCK_HOSPITAL_REQUESTS}
        keyExtractor={(item) => item.id}
        renderItem={renderRequest}
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
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  newReqButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  newReqButtonText: {
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  reqCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  reqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  reqTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  statusTag: {
    borderRadius: 999,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusOpen: {
    backgroundColor: theme.colors.primary,
  },
  statusPartial: {
    backgroundColor: theme.colors.primaryLight,
  },
  statusFulfilled: {
    backgroundColor: "#4CAF50",
  },
  statusText: {
    color: theme.colors.textOnPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
  reqText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  reqHighlight: {
    fontWeight: "600",
    color: theme.colors.primary,
  },
  manageButton: {
    marginTop: theme.spacing.sm,
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  manageButtonText: {
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
  },
});
