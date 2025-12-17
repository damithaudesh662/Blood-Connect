import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { theme } from "../../theme/theme";
import { DashboardCard } from "../../components/DashboardCard";
import { useAuth } from "../../navigation/RootNavigator";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import api from "../../services/app";

type HospitalRequest = {
  id: string | number;
  bloodType: string;
  persons: number;
  status: "Open" | "Partially Filled" | "Closed";
  createdAt: string;
  notes?: string | null;
  hospitalName: string; // We use this for the header
  respondedCount: number;
  donatedCount: number;
};

type NavProp = NativeStackNavigationProp<AppStackParamList, "HospitalHome">;

const ITEMS_PER_PAGE = 5;

export const HospitalHomeScreen: React.FC = () => {
  const { signOut } = useAuth();
  const navigation = useNavigation<NavProp>();

  const [allRequests, setAllRequests] = useState<HospitalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hospital/requests");
      setAllRequests(res.data.requests ?? []);
      setCurrentPage(1); 
    } catch (error) {
      console.log("Failed to load hospital requests", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  // Extract Hospital Name from the first request (if available)
  // Fallback to "Hospital Dashboard" if no data is loaded yet
  const hospitalName = allRequests.length > 0 
    ? allRequests[0].hospitalName 
    : "Hospital Dashboard";

  const activeRequests = allRequests.filter(
    (r) => r.status === "Open" || r.status === "Partially Filled"
  );
  const closedRequests = allRequests.filter((r) => r.status === "Closed");

  // Pagination Logic
  const totalPages = Math.ceil(activeRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = activeRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

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

        {/* Removed Hospital Name from here as requested */}

        <Text style={styles.reqText}>
          Units requested:{" "}
          <Text style={styles.reqHighlight}>{item.persons}</Text>
        </Text>
        
        <View style={styles.statsContainer}>
          <Text style={styles.reqText}>
            Responded (Pending):{" "}
            <Text style={styles.reqHighlight}>{item.respondedCount}</Text>
          </Text>
          <Text style={styles.reqText}>
            Successfully Donated:{" "}
            <Text style={[styles.reqHighlight, { color: "#4CAF50" }]}>
              {item.donatedCount}
            </Text>
          </Text>
        </View>

        <Text style={styles.reqText}>Created: {item.createdAt}</Text>
        
        {item.notes ? (
          <Text style={styles.reqText}>Notes: {item.notes}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.manageButton}
          onPress={() =>
            navigation.navigate("HospitalEditRequest", {
              id: item.id,
              bloodType: item.bloodType,
              units: item.persons,
            })
          }
        >
          <Text style={styles.manageButtonText}>Manage request</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPaginationFooter = () => {
    if (activeRequests.length === 0) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.pageButton, currentPage === 1 && styles.disabledButton]} 
          onPress={goToPrevPage}
          disabled={currentPage === 1}
        >
          <Text style={[styles.pageButtonText, currentPage === 1 && styles.disabledText]}>
            {"< Previous"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.pageInfoText}>
          Page {currentPage} of {totalPages}
        </Text>

        <TouchableOpacity 
          style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]} 
          onPress={goToNextPage}
          disabled={currentPage === totalPages}
        >
          <Text style={[styles.pageButtonText, currentPage === totalPages && styles.disabledText]}>
            {"Next >"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.appTitle}>Blood Connect</Text>
          {/* Hospital Name Displayed Here at the Top */}
          <Text style={styles.appSubtitle}>{hospitalName}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <DashboardCard
          title="Active requests"
          value={String(activeRequests.length)}
          subtitle="Currently open"
          style={styles.statCard}
        />
        <DashboardCard
          title="Closed"
          value={String(closedRequests.length)}
          subtitle="All time"
          style={styles.statCard}
        />
      </View>

      <View style={styles.sectionHeaderRow}>
        <TouchableOpacity
          style={styles.pastReqButton}
          onPress={() => navigation.navigate("HospitalPastRequests")}
        >
          <Text style={styles.pastReqButtonText}>View past requests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.newReqButton}
          onPress={() => navigation.navigate("CreateRequest")}
        >
          <Text style={styles.newReqButtonText}>+ New request</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Current blood requests</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: theme.spacing.lg }}
        />
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderRequest}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderPaginationFooter}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No current requests.</Text>
          }
        />
      )}
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
    fontSize: 16, // Increased size slightly for better visibility
    color: theme.colors.text,
    marginTop: 2,
    fontWeight: "500",
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
    marginBottom: theme.spacing.xs,
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
    alignSelf: "flex-start",
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  newReqButtonText: {
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
  },
  pastReqButton: {
    alignSelf: "flex-start",
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  pastReqButtonText: {
    color: theme.colors.primary,
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
  statsContainer: {
    marginVertical: theme.spacing.xs,
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
  emptyText: {
    textAlign: "center",
    marginTop: theme.spacing.lg,
    color: theme.colors.text,
  },
  // --- Pagination Styles ---
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  pageButton: {
    padding: theme.spacing.sm,
  },
  pageButtonText: {
    color: theme.colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#ccc",
  },
  pageInfoText: {
    color: theme.colors.text,
    fontSize: 14,
  },
});