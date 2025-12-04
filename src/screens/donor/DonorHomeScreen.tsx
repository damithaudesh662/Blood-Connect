

// // src/screens/donor/DonorHomeScreen.tsx
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { theme } from "../../theme/theme";
// import { DashboardCard } from "../../components/DashboardCard";
// import { useAuth } from "../../navigation/RootNavigator";
// import type { AppStackParamList } from "../../navigation/AppNavigator";
// import api from "../../services/app";
// import Ionicons from "@expo/vector-icons/Ionicons";

// type EmergencyRequest = {
//   id: string | number;
//   hospitalName: string;
//   bloodType: string;
//   distanceKm: number;
//   urgency: "High" | "Medium";
//   hospitalLat: number;
//   hospitalLng: number;
// };

// type NavProp = NativeStackNavigationProp<AppStackParamList, "DonorHome">;

// export const DonorHomeScreen: React.FC = () => {
//   const { signOut } = useAuth();
//   const navigation = useNavigation<NavProp>();

//   const [requests, setRequests] = useState<EmergencyRequest[]>([]);
//   const [loadingRequests, setLoadingRequests] = useState(false);

//   const loadNearbyRequests = async () => {
//     try {
//       setLoadingRequests(true);
//       const res = await api.get("/donor/requests/nearby");
//       setRequests(res.data.requests ?? []);
//     } catch (error) {
//       console.log("Failed to load nearby requests", error);
//     } finally {
//       setLoadingRequests(false);
//     }
//   };

//   useEffect(() => {
//     loadNearbyRequests();
//   }, []);

//   const renderRequestItem = ({ item }: { item: EmergencyRequest }) => {
//     return (
//       <View style={styles.requestCard}>
//         <View style={styles.requestHeader}>
//           <Text style={styles.requestHospital}>{item.hospitalName}</Text>
//           <View
//             style={[
//               styles.urgencyTag,
//               item.urgency === "High"
//                 ? styles.urgencyHigh
//                 : styles.urgencyMedium,
//             ]}
//           >
//             <Text style={styles.urgencyText}>{item.urgency}</Text>
//           </View>
//         </View>
//         <Text style={styles.requestText}>
//           Needed blood type:{" "}
//           <Text style={styles.requestHighlight}>{item.bloodType}</Text>
//         </Text>
//         <Text style={styles.requestText}>
//           Distance:{" "}
//           <Text style={styles.requestHighlight}>
//             {item.distanceKm.toFixed(1)} km
//           </Text>
//         </Text>

//         <View style={styles.cardButtonsRow}>
//           <TouchableOpacity
//             style={styles.smallButton}
//             onPress={() =>
//               navigation.navigate("RequestDetail", {
//                 id: String(item.id),
//                 hospitalName: item.hospitalName,
//                 location: "Hospital location",
//                 bloodType: item.bloodType,
//                 distanceKm: item.distanceKm,
//                 urgency: item.urgency,
//                 latitude: item.hospitalLat,
//                 longitude: item.hospitalLng,
//               })
//             }
//           >
//             <Text style={styles.smallButtonText}>View details</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.smallButtonSecondary}
//             onPress={() =>
//               navigation.navigate("MapViewScreen", {
//                 hospitalName: item.hospitalName,
//                 latitude: item.hospitalLat,
//                 longitude: item.hospitalLng,
//               })
//             }
//           >
//             <Text style={styles.smallButtonSecondaryText}>View on map</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerRow}>
//         <View>
//           <Text style={styles.appTitle}>Blood Connect</Text>
//           <Text style={styles.appSubtitle}>Donor Dashboard</Text>
//         </View>

//         <View style={styles.headerActions}>
//           <TouchableOpacity
//             style={styles.profileIconWrapper}
//             onPress={() => navigation.navigate("DonorProfile")}
//           >
//             <Ionicons
//               name="person-circle-outline"
//               size={28}
//               color={theme.colors.primary}
//             />
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.statsRow}>
//         <DashboardCard
//           title="Next eligible"
//           value="12 Jan 2026"
//           subtitle="Based on last donation"
//           style={styles.statCard}
//         />
//         <DashboardCard
//           title="Last donation"
//           value="20 Sep 2025"
//           subtitle="Badulla Hospital"
//           style={styles.statCard}
//         />
//         <DashboardCard
//           title="Total donations"
//           value="5"
//           subtitle="Thank you!"
//           style={styles.statCard}
//         />
//       </View>

//       <View style={styles.sectionHeaderRow}>
//         <Text style={styles.sectionTitle}>Emergency requests near you</Text>
//         <TouchableOpacity
//           style={styles.responsesButton}
//           onPress={() => navigation.navigate("DonorResponses")}
//         >
//           <Text style={styles.responsesButtonText}>My responded requests</Text>
//         </TouchableOpacity>
//       </View>

//       {loadingRequests ? (
//         <ActivityIndicator
//           size="large"
//           color={theme.colors.primary}
//           style={{ marginTop: theme.spacing.lg }}
//         />
//       ) : (
//         <FlatList
//           data={requests}
//           keyExtractor={(item) => String(item.id)}
//           renderItem={renderRequestItem}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           ListEmptyComponent={
//             <Text style={styles.emptyText}>No emergency requests nearby.</Text>
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
//     paddingHorizontal: theme.spacing.lg,
//     paddingTop: theme.spacing.lg,
//   },
//   headerRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: theme.spacing.lg,
//   },
//   headerActions: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: theme.spacing.sm,
//   },
//   profileIconWrapper: {
//     borderRadius: 999,
//   },
//   appTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: theme.colors.primary,
//   },
//   appSubtitle: {
//     fontSize: 14,
//     color: theme.colors.text,
//   },
//   logoutButton: {
//     paddingVertical: theme.spacing.xs,
//     paddingHorizontal: theme.spacing.sm,
//     borderRadius: theme.radius.md,
//     borderWidth: 1,
//     borderColor: theme.colors.primaryLight,
//   },
//   logoutText: {
//     color: theme.colors.primaryLight,
//     fontWeight: "600",
//   },
//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     gap: theme.spacing.sm,
//     marginBottom: theme.spacing.lg,
//   },
//   statCard: {
//     flex: 1,
//   },
//   sectionHeaderRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: theme.spacing.md,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: theme.colors.text,
//   },
//   responsesButton: {
//     backgroundColor: theme.colors.primaryLight,
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.xs,
//     borderRadius: theme.radius.md,
//   },
//   responsesButtonText: {
//     color: theme.colors.textOnPrimary,
//     fontWeight: "600",
//     fontSize: 12,
//   },
//   listContent: {
//     paddingBottom: theme.spacing.lg,
//     gap: theme.spacing.md,
//   },
//   requestCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: theme.radius.lg,
//     padding: theme.spacing.md,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//   },
//   requestHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: theme.spacing.sm,
//   },
//   requestHospital: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: theme.colors.primary,
//   },
//   urgencyTag: {
//     borderRadius: 999,
//     paddingHorizontal: theme.spacing.sm,
//     paddingVertical: theme.spacing.xs,
//   },
//   urgencyHigh: {
//     backgroundColor: theme.colors.primary,
//   },
//   urgencyMedium: {
//     backgroundColor: theme.colors.primaryLight,
//   },
//   urgencyText: {
//     color: theme.colors.textOnPrimary,
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   requestText: {
//     fontSize: 14,
//     color: theme.colors.text,
//     marginBottom: theme.spacing.xs,
//   },
//   requestHighlight: {
//     fontWeight: "600",
//     color: theme.colors.primary,
//   },
//   cardButtonsRow: {
//     flexDirection: "row",
//     marginTop: theme.spacing.sm,
//     gap: theme.spacing.sm,
//   },
//   smallButton: {
//     backgroundColor: theme.colors.primary,
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.xs,
//     borderRadius: theme.radius.md,
//   },
//   smallButtonText: {
//     color: theme.colors.textOnPrimary,
//     fontWeight: "600",
//     fontSize: 12,
//   },
//   smallButtonSecondary: {
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: theme.colors.primaryLight,
//     paddingHorizontal: theme.spacing.md,
//     paddingVertical: theme.spacing.xs,
//     borderRadius: theme.radius.md,
//   },
//   smallButtonSecondaryText: {
//     color: theme.colors.primaryLight,
//     fontWeight: "600",
//     fontSize: 12,
//   },
//   emptyText: {
//     textAlign: "center",
//     marginTop: theme.spacing.md,
//     color: theme.colors.text,
//   },
// });


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
import Ionicons from "@expo/vector-icons/Ionicons";

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

type DonorProfile = {
  id: number;
  name: string;
  email: string;
  bloodGroup: string | null;
  role: string;
  donationCount: number;
};

type DonorResponseItem = {
  responseStatus: "Responded" | "Donated" | "Cancelled";
  respondedAt: string; // "DD Mon YYYY HH24:MI"
};

export const DonorHomeScreen: React.FC = () => {
  const { signOut } = useAuth();
  const navigation = useNavigation<NavProp>();

  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [lastDonationDate, setLastDonationDate] = useState<Date | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

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

  // const parseRespondedAt = (s: string): Date | null => {
  //   // s like "04 Dec 2025 10:15"
  //   const parsed = Date.parse(s.replace(" ", " "));
  //   if (!Number.isNaN(parsed)) return new Date(parsed);
  //   return null;
  // };
  const parseRespondedAt = (s: string): Date | null => {
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const loadProfileAndLastDonation = async () => {
    try {
      setLoadingProfile(true);

      const [profileRes, responsesRes] = await Promise.all([
        api.get("/donor/profile"),
        api.get("/donor/responses"),
      ]);

      const profileData: DonorProfile = profileRes.data.profile;
      setProfile(profileData);

      const responses: DonorResponseItem[] =
        responsesRes.data.responses ?? [];

      const donatedDates: Date[] = responses
        .filter((r) => r.responseStatus === "Donated")
        .map((r) => parseRespondedAt(r.respondedAt))
        .filter((d): d is Date => d !== null);

      if (donatedDates.length > 0) {
        const latest = donatedDates.reduce((max, d) =>
          d > max ? d : max
        );
        setLastDonationDate(latest);
      } else {
        setLastDonationDate(null);
      }
    } catch (e) {
      console.log("Failed to load donor profile or donations", e);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadNearbyRequests();
    loadProfileAndLastDonation();
  }, []);

  const computeEligibility = () => {
    if (!lastDonationDate) {
      return {
        nextEligibleLabel: "Eligible now",
        lastDonationLabel: "No previous donations",
      };
    }

    const intervalMonths = 4; // example safety interval
    const next = new Date(lastDonationDate);
    next.setMonth(next.getMonth() + intervalMonths);

    const today = new Date();
    const eligibleNow = today >= next;

    const nextStr = next.toDateString();
    const lastStr = lastDonationDate.toDateString();

    return {
      nextEligibleLabel: eligibleNow ? "Eligible now" : nextStr,
      lastDonationLabel: lastStr,
    };
  };

  const eligibility = computeEligibility();

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

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.profileIconWrapper}
            onPress={() => navigation.navigate("DonorProfile")}
          >
            <Ionicons
              name="person-circle-outline"
              size={28}
              color={theme.colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsRow}>
        <DashboardCard
          title="Next eligible"
          value={
            loadingProfile ? "..." : eligibility.nextEligibleLabel
          }
          subtitle="Based on last donation"
          style={styles.statCard}
        />
        <DashboardCard
          title="Last donation"
          value={
            loadingProfile ? "..." : eligibility.lastDonationLabel
          }
          subtitle=""
          style={styles.statCard}
        />
        <DashboardCard
          title="Total donations"
          value={
            loadingProfile || !profile
              ? "..."
              : String(profile.donationCount)
          }
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
          <Text style={styles.responsesButtonText}>My responded</Text>
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  profileIconWrapper: {
    borderRadius: 999,
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
