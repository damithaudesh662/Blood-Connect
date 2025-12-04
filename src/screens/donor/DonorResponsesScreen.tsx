// // src/screens/donor/DonorResponsesScreen.tsx
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   TouchableOpacity,
// } from "react-native";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { theme } from "../../theme/theme";
// import type { AppStackParamList } from "../../navigation/AppNavigator";
// import api from "../../services/app";

// type Props = NativeStackScreenProps<AppStackParamList, "DonorResponses">;

// type DonorResponseItem = {
//   id: string | number;
//   hospitalName: string;
//   bloodType: string;
//   status: "Open" | "Partially Filled" | "Closed";
//   createdAt: string;
//   respondedAt: string;
//   hospitalLat: number;
//   hospitalLng: number;
// };

// export const DonorResponsesScreen: React.FC<Props> = ({ navigation }) => {
//   const [responses, setResponses] = useState<DonorResponseItem[]>([]);
//   const [loading, setLoading] = useState(false);

//   const loadResponses = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/donor/responses");
//       setResponses(res.data.responses ?? []);
//     } catch (e) {
//       console.log("Failed to load responses", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadResponses();
//   }, []);

//   const renderItem = ({ item }: { item: DonorResponseItem }) => (
//     <View style={styles.card}>
//       <View style={styles.headerRow}>
//         <Text style={styles.hospitalName}>{item.hospitalName}</Text>
//         <Text style={styles.statusText}>{item.status}</Text>
//       </View>
//       <Text style={styles.text}>
//         Blood type:{" "}
//         <Text style={styles.highlight}>{item.bloodType}</Text>
//       </Text>
//       <Text style={styles.text}>Requested at: {item.createdAt}</Text>
//       <Text style={styles.text}>You responded: {item.respondedAt}</Text>

//       <TouchableOpacity
//         style={styles.mapButton}
//         onPress={() =>
//           navigation.navigate("MapViewScreen", {
//             hospitalName: item.hospitalName,
//             latitude: item.hospitalLat,
//             longitude: item.hospitalLng,
//           })
//         }
//       >
//         <Text style={styles.mapButtonText}>View on map</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>My responded requests</Text>

//       {loading ? (
//         <ActivityIndicator
//           size="large"
//           color={theme.colors.primary}
//           style={{ marginTop: theme.spacing.lg }}
//         />
//       ) : (
//         <FlatList
//           data={responses}
//           keyExtractor={(item) => String(item.id)}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>
//               You have not responded to any requests yet.
//             </Text>
//           }
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//     padding: theme.spacing.lg,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: theme.colors.primary,
//     marginBottom: theme.spacing.lg,
//   },
//   listContent: {
//     paddingBottom: theme.spacing.lg,
//     gap: theme.spacing.md,
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: theme.radius.lg,
//     padding: theme.spacing.md,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//   },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: theme.spacing.xs,
//   },
//   hospitalName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: theme.colors.primary,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: theme.colors.text,
//   },
//   text: {
//     fontSize: 14,
//     color: theme.colors.text,
//     marginBottom: theme.spacing.xs,
//   },
//   highlight: {
//     fontWeight: "600",
//     color: theme.colors.primary,
//   },
//   mapButton: {
//     marginTop: theme.spacing.sm,
//     alignSelf: "flex-start",
//     backgroundColor: theme.colors.primary,
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.xs,
//     borderRadius: theme.radius.md,
//   },
//   mapButtonText: {
//     color: theme.colors.textOnPrimary,
//     fontWeight: "600",
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: theme.spacing.lg,
//     color: theme.colors.text,
//   },
// });


// src/screens/donor/DonorResponsesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { theme } from "../../theme/theme";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import api from "../../services/app";

type Props = NativeStackScreenProps<AppStackParamList, "DonorResponses">;

type DonorResponseItem = {
  responseId: number;
  requestId: number;
  hospitalName: string;
  bloodType: string;
  requestStatus: "Open" | "Partially Filled" | "Closed";
  responseStatus: "Responded" | "Donated" | "Cancelled";
  createdAt: string;
  respondedAt: string;
  lastUpdatedAt: string | null;
  hospitalLat: number;
  hospitalLng: number;
};

export const DonorResponsesScreen: React.FC<Props> = ({ navigation }) => {
  const [responses, setResponses] = useState<DonorResponseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadResponses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/donor/responses");
      const all: DonorResponseItem[] = res.data.responses ?? [];
      // show only active (not yet finalized) responses
      setResponses(all.filter((r) => r.responseStatus === "Responded"));
    } catch (e) {
      console.log("Failed to load responses", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResponses();
  }, []);

  const handleDonated = async (responseId: number) => {
    try {
      setActionLoadingId(responseId);
      await api.post(`/donor/responses/${responseId}/donated`);

      // Remove card from list
      setResponses((prev) =>
        prev.filter((item) => item.responseId !== responseId)
      );

      Alert.alert("Thank you!", "Donation marked successfully.");
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ??
        "Could not update donation status. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (responseId: number) => {
    Alert.alert(
      "Cancel response",
      "Are you sure you want to cancel this response?",
      [
        { text: "No" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              setActionLoadingId(responseId);
              await api.delete(`/donor/responses/${responseId}`);

              setResponses((prev) =>
                prev.filter((item) => item.responseId !== responseId)
              );
            } catch (e: any) {
              const msg =
                e?.response?.data?.error ??
                "Could not cancel response. Please try again.";
              Alert.alert("Error", msg);
            } finally {
              setActionLoadingId(null);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: DonorResponseItem }) => {
    const isBusy = actionLoadingId === item.responseId;

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.hospitalName}>{item.hospitalName}</Text>
          <Text style={styles.statusText}>{item.requestStatus}</Text>
        </View>
        <Text style={styles.text}>
          Blood type:{" "}
          <Text style={styles.highlight}>{item.bloodType}</Text>
        </Text>
        <Text style={styles.text}>Requested at: {item.createdAt}</Text>
        <Text style={styles.text}>You responded: {item.respondedAt}</Text>
        {item.lastUpdatedAt && (
          <Text style={styles.text}>
            Last updated: {item.lastUpdatedAt}
          </Text>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.donatedButton, isBusy && { opacity: 0.7 }]}
            onPress={() => handleDonated(item.responseId)}
            disabled={isBusy}
          >
            <Text style={styles.donatedButtonText}>Donated</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteButton, isBusy && { opacity: 0.7 }]}
            onPress={() => handleDelete(item.responseId)}
            disabled={isBusy}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() =>
              navigation.navigate("MapViewScreen", {
                hospitalName: item.hospitalName,
                latitude: item.hospitalLat,
                longitude: item.hospitalLng,
              })
            }
            disabled={isBusy}
          >
            <Text style={styles.mapButtonText}>View on map</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
          keyExtractor={(item) => String(item.responseId)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              You have no pending responded requests.
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
  buttonRow: {
    flexDirection: "row",
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
    flexWrap: "wrap",
  },
  donatedButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  donatedButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: "#FF5252",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  mapButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  mapButtonText: {
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: theme.spacing.lg,
    color: theme.colors.text,
  },
});
