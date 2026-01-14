import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/AppNavigator';

type LocationPickerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface LocationPickerRoute {
  params?: {
    latitude?: number;
    longitude?: number;
  };
}

const LocationPickerScreen = () => {
  const navigation = useNavigation<LocationPickerScreenNavigationProp>();
  const route = useRoute() as LocationPickerRoute;
  
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: route.params?.latitude || 33.5731,
    longitude: route.params?.longitude || -7.5898,
  });
  
  const [mapReady, setMapReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMapPress = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Impossible d\'obtenir la localisation');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'obtenir la localisation');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    navigation.navigate('CreateDemande', {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Icon name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sélectionner une localisation</Text>
        <View style={{ width: 24 }} />
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onPress={handleMapPress}
        onMapReady={() => setMapReady(true)}
      >
        {mapReady && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title="Localisation sélectionnée"
            description={`${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`}
            pinColor="#2196F3"
          />
        )}
      </MapView>

      <View style={styles.bottomPanel}>
        <View style={styles.coordinates}>
          <View style={styles.coordinateItem}>
            <Text style={styles.coordinateLabel}>Latitude</Text>
            <Text style={styles.coordinateValue}>{selectedLocation.latitude.toFixed(6)}</Text>
          </View>
          <View style={styles.coordinateSeparator} />
          <View style={styles.coordinateItem}>
            <Text style={styles.coordinateLabel}>Longitude</Text>
            <Text style={styles.coordinateValue}>{selectedLocation.longitude.toFixed(6)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <Icon name="crosshairs-gps" size={18} color="#fff" />
              <Text style={styles.currentLocationButtonText}>Ma localisation actuelle</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <View style={styles.buttonContent}>
            <Icon name="check-circle" size={20} color="#fff" />
            <Text style={styles.confirmButtonText}>Confirmer</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E5F1FF',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.2,
  },
  map: {
    flex: 1,
  },
  bottomPanel: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#E5F1FF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  coordinates: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 13,
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
  },
  coordinateItem: {
    flex: 1,
    alignItems: 'center',
  },
  coordinateSeparator: {
    width: 1.5,
    height: 42,
    backgroundColor: '#E5F1FF',
  },
  coordinateLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  coordinateValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1565C0',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
    borderRadius: 10,
    paddingVertical: 13,
    marginBottom: 11,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  currentLocationButtonText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 10,
    paddingVertical: 13,
    marginBottom: 9,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmButtonText: {
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
    borderRadius: 10,
    paddingVertical: 13,
    backgroundColor: '#F8FAFB',
  },
  cancelButtonText: {
    color: '#7C8BA3',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LocationPickerScreen;
