// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { theme } from '../../theme/theme';
// import type { AppStackParamList } from '../../navigation/AppNavigator';

// type Props = NativeStackScreenProps<AppStackParamList, 'RequestDetail'>;

// export const RequestDetailScreen: React.FC<Props> = ({ route, navigation }) => {
//   const { hospitalName, location, bloodType, distanceKm, urgency } = route.params;

//   const handleRespond = () => {
//     // Later: call backend to mark donor as responding
//     Alert.alert(
//       'Thank you!',
//       'Your interest to donate has been sent to the hospital (mock).',
//       [
//         {
//           text: 'OK',
//           onPress: () => navigation.goBack(),
//         },
//       ]
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Emergency blood request</Text>

//       <View style={styles.block}>
//         <Text style={styles.label}>Hospital</Text>
//         <Text style={styles.value}>{hospitalName}</Text>

//         <Text style={styles.label}>Location</Text>
//         <Text style={styles.value}>{location}</Text>

//         <Text style={styles.label}>Blood type needed</Text>
//         <Text style={styles.valueHighlight}>{bloodType}</Text>

//         <Text style={styles.label}>Approx. distance</Text>
//         <Text style={styles.value}>{distanceKm.toFixed(1)} km away</Text>

//         <Text style={styles.label}>Urgency</Text>
//         <Text
//           style={[
//             styles.urgencyValue,
//             urgency === 'High'
//               ? styles.urgencyHigh
//               : styles.urgencyMedium,
//           ]}
//         >
//           {urgency}
//         </Text>
//       </View>

//       <TouchableOpacity style={styles.respondButton} onPress={handleRespond}>
//         <Text style={styles.respondButtonText}>I will respond to this request</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.secondaryButton}
//         onPress={() => navigation.goBack()}
//       >
//         <Text style={styles.secondaryButtonText}>Back to list</Text>
//       </TouchableOpacity>
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
//     fontWeight: 'bold',
//     color: theme.colors.primary,
//     marginBottom: theme.spacing.lg,
//   },
//   block: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: theme.radius.lg,
//     padding: theme.spacing.md,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     marginBottom: theme.spacing.lg,
//   },
//   label: {
//     fontSize: 12,
//     color: '#777777',
//     marginTop: theme.spacing.xs,
//     textTransform: 'uppercase',
//   },
//   value: {
//     fontSize: 16,
//     color: theme.colors.text,
//   },
//   valueHighlight: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: theme.colors.primary,
//   },
//   urgencyValue: {
//     marginTop: theme.spacing.xs,
//     paddingVertical: theme.spacing.xs,
//     paddingHorizontal: theme.spacing.sm,
//     alignSelf: 'flex-start',
//     borderRadius: 999,
//     color: theme.colors.textOnPrimary,
//     fontWeight: '600',
//   },
//   urgencyHigh: {
//     backgroundColor: theme.colors.primary,
//   },
//   urgencyMedium: {
//     backgroundColor: theme.colors.primaryLight,
//   },
//   respondButton: {
//     backgroundColor: theme.colors.primary,
//     paddingVertical: theme.spacing.md,
//     borderRadius: theme.radius.md,
//     alignItems: 'center',
//     marginBottom: theme.spacing.sm,
//   },
//   respondButtonText: {
//     color: theme.colors.textOnPrimary,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   secondaryButton: {
//     borderWidth: 1,
//     borderColor: theme.colors.primaryLight,
//     paddingVertical: theme.spacing.md,
//     borderRadius: theme.radius.md,
//     alignItems: 'center',
//   },
//   secondaryButtonText: {
//     color: theme.colors.primaryLight,
//     fontWeight: '600',
//   },
// });


// 


// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { theme } from '../../theme/theme';
// import type { AppStackParamList } from '../../navigation/AppNavigator';
// import api from '../../services/app';

// type Props = NativeStackScreenProps<AppStackParamList, 'RequestDetail'>;

// export const RequestDetailScreen: React.FC<Props> = ({ route, navigation }) => {
//   const { id, hospitalName, location, bloodType, distanceKm, urgency } =
//     route.params;

//   const [loading, setLoading] = useState(false);

//   const handleRespond = async () => {
//     try {
//       setLoading(true);
//       // POST /api/donor/requests/:id/respond
//       await api.post(`/donor/requests/${id}/respond`);

//       Alert.alert(
//         'Thank you!',
//         'Your interest to donate has been sent to the hospital.',
//         [
//           {
//             text: 'OK',
//             onPress: () => navigation.goBack(),
//           },
//         ]
//       );
//     } catch (error: any) {
//       const message =
//         error?.response?.data?.error ??
//         'Could not send your response. Please try again.';
//       Alert.alert('Error', message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Emergency blood request</Text>

//       <View style={styles.block}>
//         <Text style={styles.label}>Hospital</Text>
//         <Text style={styles.value}>{hospitalName}</Text>

//         <Text style={styles.label}>Location</Text>
//         <Text style={styles.value}>{location}</Text>

//         <Text style={styles.label}>Blood type needed</Text>
//         <Text style={styles.valueHighlight}>{bloodType}</Text>

//         <Text style={styles.label}>Approx. distance</Text>
//         <Text style={styles.value}>{distanceKm.toFixed(1)} km away</Text>

//         <Text style={styles.label}>Urgency</Text>
//         <Text
//           style={[
//             styles.urgencyValue,
//             urgency === 'High'
//               ? styles.urgencyHigh
//               : styles.urgencyMedium,
//           ]}
//         >
//           {urgency}
//         </Text>
//       </View>

//       <TouchableOpacity
//         style={[styles.respondButton, loading && { opacity: 0.7 }]}
//         onPress={handleRespond}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color={theme.colors.textOnPrimary} />
//         ) : (
//           <Text style={styles.respondButtonText}>
//             I will respond to this request
//           </Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.secondaryButton}
//         onPress={() => navigation.goBack()}
//         disabled={loading}
//       >
//         <Text style={styles.secondaryButtonText}>Back to list</Text>
//       </TouchableOpacity>
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
//     fontWeight: 'bold',
//     color: theme.colors.primary,
//     marginBottom: theme.spacing.lg,
//   },
//   block: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: theme.radius.lg,
//     padding: theme.spacing.md,
//     borderWidth: 1,
//     borderColor: theme.colors.border,
//     marginBottom: theme.spacing.lg,
//   },
//   label: {
//     fontSize: 12,
//     color: '#777777',
//     marginTop: theme.spacing.xs,
//     textTransform: 'uppercase',
//   },
//   value: {
//     fontSize: 16,
//     color: theme.colors.text,
//   },
//   valueHighlight: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: theme.colors.primary,
//   },
//   urgencyValue: {
//     marginTop: theme.spacing.xs,
//     paddingVertical: theme.spacing.xs,
//     paddingHorizontal: theme.spacing.sm,
//     alignSelf: 'flex-start',
//     borderRadius: 999,
//     color: theme.colors.textOnPrimary,
//     fontWeight: '600',
//   },
//   urgencyHigh: {
//     backgroundColor: theme.colors.primary,
//   },
//   urgencyMedium: {
//     backgroundColor: theme.colors.primaryLight,
//   },
//   respondButton: {
//     backgroundColor: theme.colors.primary,
//     paddingVertical: theme.spacing.md,
//     borderRadius: theme.radius.md,
//     alignItems: 'center',
//     marginBottom: theme.spacing.sm,
//   },
//   respondButtonText: {
//     color: theme.colors.textOnPrimary,
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   secondaryButton: {
//     borderWidth: 1,
//     borderColor: theme.colors.primaryLight,
//     paddingVertical: theme.spacing.md,
//     borderRadius: theme.radius.md,
//     alignItems: 'center',
//   },
//   secondaryButtonText: {
//     color: theme.colors.primaryLight,
//     fontWeight: '600',
//   },
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '../../theme/theme';
import type { AppStackParamList } from '../../navigation/AppNavigator';
import api from '../../services/app';

type Props = NativeStackScreenProps<AppStackParamList, 'RequestDetail'>;

export const RequestDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id, hospitalName, location, bloodType, distanceKm, urgency } =
    route.params;

  const [loading, setLoading] = useState(false);

  const handleRespond = async () => {
    try {
      setLoading(true);
      await api.post(`/donor/requests/${id}/respond`);

      Alert.alert(
        'Thank you!',
        'Your interest to donate has been sent to the hospital.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.error ??
        'Could not send your response. The request may already be full or closed.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency blood request</Text>

      <View style={styles.block}>
        <Text style={styles.label}>Hospital</Text>
        <Text style={styles.value}>{hospitalName}</Text>

        <Text style={styles.label}>Location</Text>
        <Text style={styles.value}>{location}</Text>

        <Text style={styles.label}>Blood type needed</Text>
        <Text style={styles.valueHighlight}>{bloodType}</Text>

        <Text style={styles.label}>Approx. distance</Text>
        <Text style={styles.value}>{distanceKm.toFixed(1)} km away</Text>

        <Text style={styles.label}>Urgency</Text>
        <Text
          style={[
            styles.urgencyValue,
            urgency === 'High'
              ? styles.urgencyHigh
              : styles.urgencyMedium,
          ]}
        >
          {urgency}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.respondButton, loading && { opacity: 0.7 }]}
        onPress={handleRespond}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.textOnPrimary} />
        ) : (
          <Text style={styles.respondButtonText}>
            I will respond to this request
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.secondaryButtonText}>Back to list</Text>
      </TouchableOpacity>
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
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  block: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 12,
    color: '#777777',
    marginTop: theme.spacing.xs,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    color: theme.colors.text,
  },
  valueHighlight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  urgencyValue: {
    marginTop: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    alignSelf: 'flex-start',
    borderRadius: 999,
    color: theme.colors.textOnPrimary,
    fontWeight: '600',
  },
  urgencyHigh: {
    backgroundColor: theme.colors.primary,
  },
  urgencyMedium: {
    backgroundColor: theme.colors.primaryLight,
  },
  respondButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  respondButtonText: {
    color: theme.colors.textOnPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: theme.colors.primaryLight,
    fontWeight: '600',
  },
});
