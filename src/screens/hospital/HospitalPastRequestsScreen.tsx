
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { theme } from "../../theme/theme";
import api from "../../services/app";

type HospitalRequest = {
  id: string | number;
  bloodType: string;
  persons: number;
  status: "Open" | "Partially Filled" | "Closed";
  createdAt: string;
  notes?: string | null;
};

export const HospitalPastRequestsScreen: React.FC = () => {
  const [requests, setRequests] = useState<HospitalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const loadPastRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hospital/requests");
      const all: HospitalRequest[] = res.data.requests ?? [];
      setRequests(all.filter((r) => r.status === "Closed"));
    } catch (error) {
      console.log("Failed to load past hospital requests", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPastRequests();
    }, [])
  );

  const handleDelete = (id: string | number) => {
    Alert.alert(
      "Delete request",
      "Are you sure you want to permanently delete this closed request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(id);
              await api.delete(`/hospital/requests/${id}`);
              setRequests((prev) => prev.filter((r) => r.id !== id));
            } catch (error: any) {
              const msg =
                error?.response?.data?.error ??
                "Could not delete request. Please try again.";
              Alert.alert("Error", msg);
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: HospitalRequest }) => (
    <View style={styles.reqCard}>
      <View style={styles.reqHeader}>
        <Text style={styles.reqTitle}>Blood type {item.bloodType}</Text>
        <View style={[styles.statusTag, styles.statusFulfilled]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.reqText}>
        Units requested: <Text style={styles.reqHighlight}>{item.persons}</Text>
      </Text>
      <Text style={styles.reqText}>Created: {item.createdAt}</Text>
      {item.notes ? (
        <Text style={styles.reqText}>Notes: {item.notes}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
        disabled={deletingId === item.id}
      >
        <Text style={styles.deleteButtonText}>
          {deletingId === item.id ? "Deleting..." : "Delete request"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Past blood requests</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: theme.spacing.lg }}
        />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No past requests yet.</Text>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
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
  deleteButton: {
    marginTop: theme.spacing.sm,
    alignSelf: "flex-start",
    backgroundColor: "#FF5252",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    marginTop: theme.spacing.lg,
    color: theme.colors.text,
  },
});
