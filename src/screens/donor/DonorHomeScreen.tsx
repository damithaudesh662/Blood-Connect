// // // import React from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   FlatList,
// // //   TouchableOpacity,
// // // } from "react-native";
// // // import { theme } from "../../theme/theme";
// // // import { DashboardCard } from "../../components/DashboardCard";
// // // import { useAuth } from "../../navigation/RootNavigator";
// // // import { useNavigation } from "@react-navigation/native";
// // // import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// // // import type { AppStackParamList } from "../../navigation/AppNavigator";

// // // type EmergencyRequest = {
// // //   id: string;
// // //   hospitalName: string;
// // //   location: string;
// // //   bloodType: string;
// // //   distanceKm: number;
// // //   urgency: "High" | "Medium";
// // // };

// // // const MOCK_REQUESTS: EmergencyRequest[] = [
// // //   {
// // //     id: "1",
// // //     hospitalName: "Badulla General Hospital",
// // //     location: "Badulla",
// // //     bloodType: "A+",
// // //     distanceKm: 2.3,
// // //     urgency: "High",
// // //   },
// // //   {
// // //     id: "2",
// // //     hospitalName: "Kandy Teaching Hospital",
// // //     location: "Kandy",
// // //     bloodType: "O-",
// // //     distanceKm: 18.7,
// // //     urgency: "Medium",
// // //   },
// // // ];

// // // export const DonorHomeScreen: React.FC = () => {
// // //   const { signOut } = useAuth();
// // //   const navigation =
// // //     useNavigation<NativeStackNavigationProp<AppStackParamList>>();

// // //   const renderRequestItem = ({ item }: { item: EmergencyRequest }) => {
// // //     return (
// // //       <View style={styles.requestCard}>
// // //         <View style={styles.requestHeader}>
// // //           <Text style={styles.requestHospital}>{item.hospitalName}</Text>
// // //           <View
// // //             style={[
// // //               styles.urgencyTag,
// // //               item.urgency === "High"
// // //                 ? styles.urgencyHigh
// // //                 : styles.urgencyMedium,
// // //             ]}
// // //           >
// // //             <Text style={styles.urgencyText}>{item.urgency}</Text>
// // //           </View>
// // //         </View>
// // //         <Text style={styles.requestText}>
// // //           Needed blood type:{" "}
// // //           <Text style={styles.requestHighlight}>{item.bloodType}</Text>
// // //         </Text>
// // //         <Text style={styles.requestText}>
// // //           Location: <Text style={styles.requestHighlight}>{item.location}</Text>
// // //         </Text>
// // //         <Text style={styles.requestText}>
// // //           Distance:{" "}
// // //           <Text style={styles.requestHighlight}>
// // //             {item.distanceKm.toFixed(1)} km
// // //           </Text>
// // //         </Text>

// // //         <TouchableOpacity
// // //           style={styles.respondButton}
// // //           onPress={() =>
// // //             navigation.navigate("RequestDetail", {
// // //               id: item.id,
// // //               hospitalName: item.hospitalName,
// // //               location: item.location,
// // //               bloodType: item.bloodType,
// // //               distanceKm: item.distanceKm,
// // //               urgency: item.urgency,
// // //             })
// // //           }
// // //         >
// // //           <Text style={styles.respondButtonText}>View details</Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     );
// // //   };

// // //   return (
// // //     <View style={styles.container}>
// // //       <View style={styles.headerRow}>
// // //         <View>
// // //           <Text style={styles.appTitle}>Blood Connect</Text>
// // //           <Text style={styles.appSubtitle}>Donor Dashboard</Text>
// // //         </View>

// // //         <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
// // //           <Text style={styles.logoutText}>Logout</Text>
// // //         </TouchableOpacity>
// // //       </View>

// // //       <View style={styles.statsRow}>
// // //         <DashboardCard
// // //           title="Next eligible"
// // //           value="12 Jan 2026"
// // //           subtitle="Based on last donation"
// // //           style={styles.statCard}
// // //         />
// // //         <DashboardCard
// // //           title="Last donation"
// // //           value="20 Sep 2025"
// // //           subtitle="Badulla Hospital"
// // //           style={styles.statCard}
// // //         />
// // //         <DashboardCard
// // //           title="Total donations"
// // //           value="5"
// // //           subtitle="Thank you!"
// // //           style={styles.statCard}
// // //         />
// // //       </View>

// // //       <Text style={styles.sectionTitle}>Emergency requests near you</Text>

// // //       <FlatList
// // //         data={MOCK_REQUESTS}
// // //         keyExtractor={(item) => item.id}
// // //         renderItem={renderRequestItem}
// // //         contentContainerStyle={styles.listContent}
// // //         showsVerticalScrollIndicator={false}
// // //       />
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: theme.colors.background,
// // //     paddingHorizontal: theme.spacing.lg,
// // //     paddingTop: theme.spacing.lg,
// // //   },
// // //   headerRow: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: theme.spacing.lg,
// // //   },
// // //   appTitle: {
// // //     fontSize: 22,
// // //     fontWeight: "bold",
// // //     color: theme.colors.primary,
// // //   },
// // //   appSubtitle: {
// // //     fontSize: 14,
// // //     color: theme.colors.text,
// // //   },
// // //   logoutButton: {
// // //     paddingVertical: theme.spacing.xs,
// // //     paddingHorizontal: theme.spacing.sm,
// // //     borderRadius: theme.radius.md,
// // //     borderWidth: 1,
// // //     borderColor: theme.colors.primaryLight,
// // //   },
// // //   logoutText: {
// // //     color: theme.colors.primaryLight,
// // //     fontWeight: "600",
// // //   },
// // //   statsRow: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     gap: theme.spacing.sm,
// // //     marginBottom: theme.spacing.lg,
// // //   },
// // //   statCard: {
// // //     flex: 1,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 16,
// // //     fontWeight: "600",
// // //     color: theme.colors.text,
// // //     marginBottom: theme.spacing.md,
// // //   },
// // //   listContent: {
// // //     paddingBottom: theme.spacing.lg,
// // //     gap: theme.spacing.md,
// // //   },
// // //   requestCard: {
// // //     backgroundColor: "#FFFFFF",
// // //     borderRadius: theme.radius.lg,
// // //     padding: theme.spacing.md,
// // //     borderWidth: 1,
// // //     borderColor: theme.colors.border,
// // //   },
// // //   requestHeader: {
// // //     flexDirection: "row",
// // //     justifyContent: "space-between",
// // //     alignItems: "center",
// // //     marginBottom: theme.spacing.sm,
// // //   },
// // //   requestHospital: {
// // //     fontSize: 16,
// // //     fontWeight: "600",
// // //     color: theme.colors.primary,
// // //   },
// // //   urgencyTag: {
// // //     borderRadius: 999,
// // //     paddingHorizontal: theme.spacing.sm,
// // //     paddingVertical: theme.spacing.xs,
// // //   },
// // //   urgencyHigh: {
// // //     backgroundColor: theme.colors.primary,
// // //   },
// // //   urgencyMedium: {
// // //     backgroundColor: theme.colors.primaryLight,
// // //   },
// // //   urgencyText: {
// // //     color: theme.colors.textOnPrimary,
// // //     fontSize: 12,
// // //     fontWeight: "600",
// // //   },
// // //   requestText: {
// // //     fontSize: 14,
// // //     color: theme.colors.text,
// // //     marginBottom: theme.spacing.xs,
// // //   },
// // //   requestHighlight: {
// // //     fontWeight: "600",
// // //     color: theme.colors.primary,
// // //   },
// // //   respondButton: {
// // //     marginTop: theme.spacing.sm,
// // //     alignSelf: "flex-start",
// // //     backgroundColor: theme.colors.primary,
// // //     paddingHorizontal: theme.spacing.md,
// // //     paddingVertical: theme.spacing.xs,
// // //     borderRadius: theme.radius.md,
// // //   },
// // //   respondButtonText: {
// // //     color: theme.colors.textOnPrimary,
// // //     fontWeight: "600",
// // //   },
// // // });


// // import React, { useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   FlatList,
// //   TouchableOpacity,
// //   ActivityIndicator,
// // } from 'react-native';
// // import { useNavigation } from '@react-navigation/native';
// // import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { theme } from '../../theme/theme';
// // import { DashboardCard } from '../../components/DashboardCard';
// // import { useAuth } from '../../navigation/RootNavigator';
// // import type { AppStackParamList } from '../../navigation/AppNavigator';
// // import api from '../../services/app';

// // type EmergencyRequest = {
// //   id: string | number;
// //   hospitalName: string;
// //   location: string;
// //   bloodType: string;
// //   distanceKm: number;
// //   urgency: 'High' | 'Medium';
// // };

// // type NavProp = NativeStackNavigationProp<AppStackParamList, 'DonorHome'>;

// // export const DonorHomeScreen: React.FC = () => {
// //   const { signOut } = useAuth();
// //   const navigation = useNavigation<NavProp>();

// //   const [requests, setRequests] = useState<EmergencyRequest[]>([]);
// //   const [loading, setLoading] = useState(false);

// //   const loadNearbyRequests = async () => {
// //     try {
// //       setLoading(true);
// //       // GET /api/donor/requests/nearby
// //       const res = await api.get('/donor/requests/nearby');
// //       setRequests(res.data.requests ?? []);
// //     } catch (error) {
// //       console.log('Failed to load nearby requests', error);
// //       // You can show an Alert here if you want
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     loadNearbyRequests();
// //   }, []);

// //   const renderRequestItem = ({ item }: { item: EmergencyRequest }) => {
// //     return (
// //       <View style={styles.requestCard}>
// //         <View style={styles.requestHeader}>
// //           <Text style={styles.requestHospital}>{item.hospitalName}</Text>
// //           <View
// //             style={[
// //               styles.urgencyTag,
// //               item.urgency === 'High'
// //                 ? styles.urgencyHigh
// //                 : styles.urgencyMedium,
// //             ]}
// //           >
// //             <Text style={styles.urgencyText}>{item.urgency}</Text>
// //           </View>
// //         </View>
// //         <Text style={styles.requestText}>
// //           Needed blood type:{' '}
// //           <Text style={styles.requestHighlight}>{item.bloodType}</Text>
// //         </Text>
// //         <Text style={styles.requestText}>
// //           Location:{' '}
// //           <Text style={styles.requestHighlight}>{item.location}</Text>
// //         </Text>
// //         <Text style={styles.requestText}>
// //           Distance:{' '}
// //           <Text style={styles.requestHighlight}>
// //             {item.distanceKm.toFixed(1)} km
// //           </Text>
// //         </Text>

// //         <TouchableOpacity
// //           style={styles.respondButton}
// //           onPress={() =>
// //             navigation.navigate('RequestDetail', {
// //               id: String(item.id),
// //               hospitalName: item.hospitalName,
// //               location: item.location,
// //               bloodType: item.bloodType,
// //               distanceKm: item.distanceKm,
// //               urgency: item.urgency,
// //             })
// //           }
// //         >
// //           <Text style={styles.respondButtonText}>View details</Text>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   };

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.headerRow}>
// //         <View>
// //           <Text style={styles.appTitle}>Blood Connect</Text>
// //           <Text style={styles.appSubtitle}>Donor Dashboard</Text>
// //         </View>

// //         <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
// //           <Text style={styles.logoutText}>Logout</Text>
// //         </TouchableOpacity>
// //       </View>

// //       <View style={styles.statsRow}>
// //         <DashboardCard
// //           title="Next eligible"
// //           value="12 Jan 2026"
// //           subtitle="Based on last donation"
// //           style={styles.statCard}
// //         />
// //         <DashboardCard
// //           title="Last donation"
// //           value="20 Sep 2025"
// //           subtitle="Badulla Hospital"
// //           style={styles.statCard}
// //         />
// //         <DashboardCard
// //           title="Total donations"
// //           value="5"
// //           subtitle="Thank you!"
// //           style={styles.statCard}
// //         />
// //       </View>

// //       <Text style={styles.sectionTitle}>Emergency requests near you</Text>

// //       {loading ? (
// //         <ActivityIndicator
// //           size="large"
// //           color={theme.colors.primary}
// //           style={{ marginTop: theme.spacing.lg }}
// //         />
// //       ) : (
// //         <FlatList
// //           data={requests}
// //           keyExtractor={(item) => String(item.id)}
// //           renderItem={renderRequestItem}
// //           contentContainerStyle={styles.listContent}
// //           showsVerticalScrollIndicator={false}
// //           ListEmptyComponent={
// //             <Text style={styles.emptyText}>No emergency requests found.</Text>
// //           }
// //         />
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: theme.colors.background,
// //     paddingHorizontal: theme.spacing.lg,
// //     paddingTop: theme.spacing.lg,
// //   },
// //   headerRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: theme.spacing.lg,
// //   },
// //   appTitle: {
// //     fontSize: 22,
// //     fontWeight: 'bold',
// //     color: theme.colors.primary,
// //   },
// //   appSubtitle: {
// //     fontSize: 14,
// //     color: theme.colors.text,
// //   },
// //   logoutButton: {
// //     paddingVertical: theme.spacing.xs,
// //     paddingHorizontal: theme.spacing.sm,
// //     borderRadius: theme.radius.md,
// //     borderWidth: 1,
// //     borderColor: theme.colors.primaryLight,
// //   },
// //   logoutText: {
// //     color: theme.colors.primaryLight,
// //     fontWeight: '600',
// //   },
// //   statsRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     gap: theme.spacing.sm,
// //     marginBottom: theme.spacing.lg,
// //   },
// //   statCard: {
// //     flex: 1,
// //   },
// //   sectionTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: theme.colors.text,
// //     marginBottom: theme.spacing.md,
// //   },
// //   listContent: {
// //     paddingBottom: theme.spacing.lg,
// //     gap: theme.spacing.md,
// //   },
// //   requestCard: {
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: theme.radius.lg,
// //     padding: theme.spacing.md,
// //     borderWidth: 1,
// //     borderColor: theme.colors.border,
// //   },
// //   requestHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: theme.spacing.sm,
// //   },
// //   requestHospital: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: theme.colors.primary,
// //   },
// //   urgencyTag: {
// //     borderRadius: 999,
// //     paddingHorizontal: theme.spacing.sm,
// //     paddingVertical: theme.spacing.xs,
// //   },
// //   urgencyHigh: {
// //     backgroundColor: theme.colors.primary,
// //   },
// //   urgencyMedium: {
// //     backgroundColor: theme.colors.primaryLight,
// //   },
// //   urgencyText: {
// //     color: theme.colors.textOnPrimary,
// //     fontSize: 12,
// //     fontWeight: '600',
// //   },
// //   requestText: {
// //     fontSize: 14,
// //     color: theme.colors.text,
// //     marginBottom: theme.spacing.xs,
// //   },
// //   requestHighlight: {
// //     fontWeight: '600',
// //     color: theme.colors.primary,
// //   },
// //   respondButton: {
// //     marginTop: theme.spacing.sm,
// //     alignSelf: 'flex-start',
// //     backgroundColor: theme.colors.primary,
// //     paddingHorizontal: theme.spacing.md,
// //     paddingVertical: theme.spacing.xs,
// //     borderRadius: theme.radius.md,
// //   },
// //   respondButtonText: {
// //     color: theme.colors.textOnPrimary,
// //     fontWeight: '600',
// //   },
// //   emptyText: {
// //     textAlign: 'center',
// //     marginTop: theme.spacing.lg,
// //     color: theme.colors.text,
// //   },
// // });




// src/screens/donor/DonorHomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { theme } from "../../theme/theme";
import { DashboardCard } from "../../components/DashboardCard";
import { useAuth } from "../../navigation/RootNavigator";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import api from "../../services/app";

type EmergencyRequest = {
  id: string | number;
  hospitalName: string;
  bloodType: string;
  distanceKm: number;
  urgency: "High" | "Medium";
  hospitalLat: number;
  hospitalLng: number;
};

type NavProp = NativeStackNavigationProp<AppStackParamList, "DonorHome">;

export const DonorHomeScreen: React.FC = () => {
  const { signOut } = useAuth();
  const navigation = useNavigation<NavProp>();

  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const loadNearbyRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await api.get("/donor/requests/nearby");
      setRequests(res.data.requests ?? []);
    } catch (error) {
      console.log("Failed to load nearby requests", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    loadNearbyRequests();
  }, []);

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
          Distance:{" "}
          <Text style={styles.requestHighlight}>
            {item.distanceKm.toFixed(1)} km
          </Text>
        </Text>

        <View style={styles.cardButtonsRow}>
          <TouchableOpacity
            style={styles.smallButton}
            onPress={() =>
              navigation.navigate("RequestDetail", {
                id: String(item.id),
                hospitalName: item.hospitalName,
                location: "Hospital location",
                bloodType: item.bloodType,
                distanceKm: item.distanceKm,
                urgency: item.urgency,
                latitude: item.hospitalLat,
                longitude: item.hospitalLng,
              })
            }
          >
            <Text style={styles.smallButtonText}>View details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.smallButtonSecondary}
            onPress={() =>
              navigation.navigate("MapViewScreen", {
                hospitalName: item.hospitalName,
                latitude: item.hospitalLat,
                longitude: item.hospitalLng,
              })
            }
          >
            <Text style={styles.smallButtonSecondaryText}>View on map</Text>
          </TouchableOpacity>
        </View>
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

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Emergency requests near you</Text>
        <TouchableOpacity
          style={styles.responsesButton}
          onPress={() => navigation.navigate("DonorResponses")}
        >
          <Text style={styles.responsesButtonText}>My responded requests</Text>
        </TouchableOpacity>
      </View>

      {loadingRequests ? (
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: theme.spacing.lg }}
        />
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderRequestItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No emergency requests nearby.</Text>
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
  responsesButton: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  responsesButtonText: {
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
    fontSize: 12,
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
  cardButtonsRow: {
    flexDirection: "row",
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  smallButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  smallButtonText: {
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
    fontSize: 12,
  },
  smallButtonSecondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  smallButtonSecondaryText: {
    color: theme.colors.primaryLight,
    fontWeight: "600",
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: theme.spacing.md,
    color: theme.colors.text,
  },
});
