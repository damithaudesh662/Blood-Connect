


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import { theme } from "../../theme/theme";
import type { AppStackParamList } from "../../navigation/AppNavigator";
import api from "../../services/app";

type Props = NativeStackScreenProps<AppStackParamList, "DonorProfile">;

type DonorProfile = {
  id: number;
  name: string;
  email: string;
  bloodGroup: string | null;
  role: string;
  donationCount: number;
  latitude: number | null;
  longitude: number | null;
};

export const DonorProfileScreen: React.FC<Props> = () => {
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const [editingEmail, setEditingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  const [editingLocation, setEditingLocation] = useState(false);
  const [locationText, setLocationText] = useState("");
  const [coordsDraft, setCoordsDraft] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [savingLocation, setSavingLocation] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/donor/profile");
      const data: DonorProfile = res.data.profile;
      setProfile(data);
      setEmailDraft(data.email);
      if (data.latitude != null && data.longitude != null) {
        setLocationText(
          `${data.latitude.toFixed(5)}, ${data.longitude.toFixed(5)}`
        );
        setCoordsDraft({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ??
        "Could not load profile. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveEmail = async () => {
    if (!profile) return;
    if (!emailDraft) {
      Alert.alert("Validation", "Email cannot be empty.");
      return;
    }
    try {
      setSavingEmail(true);
      const res = await api.patch("/donor/profile", {
        email: emailDraft,
      });
      setProfile(res.data.profile);
      setEditingEmail(false);
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ??
        "Could not update email. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setSavingEmail(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    try {
      setLocLoading(true);
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location permission",
          "Permission to access location was denied."
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;
      setCoordsDraft({ latitude, longitude });
      setLocationText(
        `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
      );
      setEditingLocation(true);
    } catch (e) {
      console.log("Error getting location", e);
      Alert.alert(
        "Location error",
        "Could not get current location. Please try again."
      );
    } finally {
      setLocLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!profile || !coordsDraft) {
      Alert.alert(
        "Validation",
        "No location to save. Use GPS to set your location first."
      );
      return;
    }
    try {
      setSavingLocation(true);
      const res = await api.patch("/donor/profile", {
        location: [coordsDraft.latitude, coordsDraft.longitude],
      });
      const updated: DonorProfile = res.data.profile;
      setProfile(updated);
      setEditingLocation(false);
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ??
        "Could not update location. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setSavingLocation(false);
    }
  };

  if (loading || !profile) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My profile</Text>

      <View style={styles.block}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{profile.name}</Text>

        <Text style={styles.label}>Email</Text>
        {editingEmail ? (
          <View style={styles.editRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={emailDraft}
              onChangeText={setEmailDraft}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[
                styles.saveButton,
                savingEmail && { opacity: 0.7 },
              ]}
              onPress={handleSaveEmail}
              disabled={savingEmail}
            >
              <Text style={styles.saveButtonText}>
                {savingEmail ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.editRow}>
            <Text style={styles.value}>{profile.email}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditingEmail(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.label}>Blood group</Text>
        <Text style={styles.value}>
          {profile.bloodGroup ?? "Not specified"}
        </Text>

        <Text style={styles.label}>Total donations</Text>
        <Text style={styles.valueHighlight}>{profile.donationCount}</Text>

        <Text style={styles.label}>Saved location</Text>
        <View style={styles.locationRow}>
          <TextInput
            style={[styles.input, styles.locationInput]}
            value={locationText}
            editable={false}
            placeholder="No location set"
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[styles.locButton, locLoading && { opacity: 0.7 }]}
            onPress={handleUseCurrentLocation}
            disabled={locLoading}
          >
            <Text style={styles.locButtonText}>
              {locLoading ? "..." : "Use GPS"}
            </Text>
          </TouchableOpacity>
        </View>

        {editingLocation && (
          <TouchableOpacity
            style={[
              styles.saveButtonFull,
              savingLocation && { opacity: 0.7 },
            ]}
            onPress={handleSaveLocation}
            disabled={savingLocation}
          >
            <Text style={styles.saveButtonText}>
              {savingLocation ? "Saving..." : "Save location"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
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
  block: {
    backgroundColor: "#FFFFFF",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    fontSize: 12,
    color: "#777777",
    marginTop: theme.spacing.xs,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    color: theme.colors.text,
  },
  valueHighlight: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: "#FFFFFF",
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  editButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
  },
  editButtonText: {
    color: theme.colors.primaryLight,
    fontWeight: "600",
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  saveButtonFull: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    alignItems: "center",
  },
  saveButtonText: {
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
    fontSize: 14,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.xs,
  },
  locationInput: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  locButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.md,
  },
  locButtonText: {
    color: theme.colors.textOnPrimary,
    fontWeight: "600",
    fontSize: 12,
  },
});
