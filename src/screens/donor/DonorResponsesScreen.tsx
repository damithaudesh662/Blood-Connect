// src/screens/donor/DonorResponsesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { theme } from "../../theme/theme";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import api from "../../services/app";

type Props = NativeStackScreenProps<AppStackParamList, "DonorResponses">;

type DonorResponseItem = {
  id: string | number;
  hospitalName: string;
  bloodType: string;
  status: "Open" | "Partially Filled" | "Closed";
  createdAt: string;
  respondedAt: string;
  hospitalLat: number;
  hospitalLng: number;
};

export const DonorResponsesScreen: React.FC<Props> = ({ navigation }) => {
  const [responses, setResponses] = useState<DonorResponseItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadResponses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/donor/responses");
      setResponses(res.data.responses ?? []);
    } catch (e) {
      console.log("Failed to load responses", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResponses();
  }, []);

  const renderItem = ({ item }: { item: DonorResponseItem }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.hospitalName}>{item.hospitalName}</Text>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <Text style={styles.text}>
        Blood type:{" "}
        <Text style={styles.highlight}>{item.bloodType}</Text>
      </Text>
      <Text style={styles.text}>Requested at: {item.createdAt}</Text>
      <Text style={styles.text}>You responded: {item.respondedAt}</Text>

      <TouchableOpacity
        style={styles.mapButton}
        onPress={() =>
          navigation.navigate("MapViewScreen", {
            hospitalName: item.hospitalName,
            latitude: item.hospitalLat,
            longitude: item.hospitalLng,
          })
        }
      >
        <Text style={styles.mapButtonText}>View on map</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My responded requests</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: theme.spacing.lg }}
        />
      ) : (
        <FlatList
          data={responses}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              You have not responded to any requests yet.
            </Text>
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
    padding: theme.spacing.lg,
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
  },
  text: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  highlight: {
    fontWeight: "600",
    color: theme.colors.primary,
  },
  mapButton: {
    marginTop: theme.spacing.sm,
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  mapButtonText: {
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    marginTop: theme.spacing.lg,
    color: theme.colors.text,
  },
});
