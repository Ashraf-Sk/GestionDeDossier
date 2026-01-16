import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { STATUS_COLORS } from '../config/constants';
import { DocumentResponse } from '../services/demandeService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Clipboard from 'expo-clipboard';

type DemandeDetailRouteProp = RouteProp<RootStackParamList, 'DemandeDetail'>;

const DemandeDetailScreen = () => {
  const route = useRoute<DemandeDetailRouteProp>();
  const { demande } = route.params;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTEE':
        return 'check-circle';
      case 'REJETEE':
        return 'close-circle';
      case 'EN_COURS':
        return 'clock-outline';
      case 'AVIS_FAVORABLE':
        return 'thumb-up';
      case 'AVIS_DEFAVORABLE':
        return 'thumb-down';
      default:
        return 'information-outline';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'ACCEPTEE': 'Acceptée',
      'REJETEE': 'Rejetée',
      'EN_COURS': 'En cours de traitement',
      'AVIS_FAVORABLE': 'Avis favorable',
      'AVIS_DEFAVORABLE': 'Avis défavorable',
      'EN_ATTENTE': 'En attente',
      'INCOMPLETE': 'Incomplète',
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyIdToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(demande.idDemande);
      Alert.alert('Copié', `L'ID de la demande (${demande.idDemande}) a été copié dans le presse-papiers`);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de copier l\'ID');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <Icon 
            name={getStatusIcon(demande.status)} 
            size={40} 
            color={STATUS_COLORS[demande.status as keyof typeof STATUS_COLORS] || '#6B7280'} 
          />
          <Text style={styles.statusText}>{getStatusLabel(demande.status)}</Text>
        </View>

        {/* Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Informations de la Demande</Text>
          
          <View style={styles.infoRow}>
            <Icon name="file-document-outline" size={18} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>N° Demande</Text>
              <TouchableOpacity 
                style={styles.idContainer}
                onPress={copyIdToClipboard}
                activeOpacity={0.7}
              >
                <Text style={styles.infoValue}>{demande.idDemande}</Text>
                <Icon name="content-copy" size={18} color="#1565C0" style={styles.copyIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar" size={18} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date de dépôt</Text>
              <Text style={styles.infoValue}>{formatDate(demande.date)}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="clipboard-text-outline" size={18} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Type d'autorisation</Text>
              <Text style={styles.infoValue}>{demande.typeAutorisation}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="card-account-details" size={18} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>N° CIN</Text>
              <Text style={styles.infoValue}>{demande.cin}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="account" size={18} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Demandeur</Text>
              <Text style={styles.infoValue}>
                {demande.nomDemandeur} {demande.prenomDemandeur}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="map-marker" size={18} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Commune</Text>
              <Text style={styles.infoValue}>{demande.commune}</Text>
            </View>
          </View>
        </View>

        {/* Motif de rejet si applicable */}
        {demande.motifRejet && (
          <View style={styles.card}>
            <Text style={[styles.cardTitle, { color: '#DC2626' }]}>Motif de Rejet</Text>
            <Text style={styles.motifText}>{demande.motifRejet}</Text>
          </View>
        )}

        {/* Documents */}
        {demande.documents && demande.documents.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Documents joints</Text>
            {demande.documents.map((doc: DocumentResponse, index: number) => (
              <TouchableOpacity
                key={index}
                style={styles.documentItem}
                onPress={() => Alert.alert('Document', `Télécharger: ${doc.nomFichier}`)}
              >
                <Icon name="file-pdf-box" size={20} color="#DC2626" />
                <Text style={styles.documentName}>{doc.nomFichier}</Text>
                <Icon name="download" size={18} color="#1565C0" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Carte de localisation */}
        {demande.latitude && demande.longitude && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Localisation</Text>
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: demande.latitude,
                  longitude: demande.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                mapType="satellite"
              >
                <Marker
                  coordinate={{
                    latitude: demande.latitude,
                    longitude: demande.longitude,
                  }}
                  title="Localisation de la demande"
                  description={demande.commune}
                />
              </MapView>
              <Text style={styles.coordinatesText}>
                Coordonnées: {demande.latitude.toFixed(6)}, {demande.longitude.toFixed(6)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FC',
  },
  content: {
    flex: 1,
    paddingTop: 12,
    paddingBottom: 20,
  },
  statusCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EBF2FF',
    backgroundColor: '#FAFBFF',
  },
  statusText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#1565C0',
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 14,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7C8BA3',
    marginBottom: 4,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  infoValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
    flex: 1,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyIcon: {
    marginLeft: 4,
  },
  motifText: {
    fontSize: 13,
    color: '#5F2C2C',
    lineHeight: 21,
    padding: 14,
    backgroundColor: '#FEF5F4',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 13,
    backgroundColor: '#F8FAFB',
    borderRadius: 10,
    marginBottom: 9,
    borderWidth: 1.5,
    borderColor: '#EBF2FF',
  },
  documentName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
  },
  mapContainer: {
    marginTop: 10,
  },
  map: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#DDE9F8',
    overflow: 'hidden',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#5B7C99',
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default DemandeDetailScreen;
