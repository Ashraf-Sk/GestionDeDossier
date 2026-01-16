import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { demandeService } from '../services/demandeService';
import { TYPES_DEMANDES, DOCUMENTS_REQUIS } from '../config/constants';
import * as DocumentPicker from 'expo-document-picker';
import * as Clipboard from 'expo-clipboard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type CreateDemandeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CreateDemandeScreenRouteProp = {
  params?: {
    latitude?: number;
    longitude?: number;
  };
};

interface DocumentFile {
  [key: string]: any[];
}

const CreateDemandeScreen = () => {
  const navigation = useNavigation<CreateDemandeScreenNavigationProp>();
  const route = useRoute() as CreateDemandeScreenRouteProp;
  
  const [typeAutorisation, setTypeAutorisation] = useState('');
  const [cinDemandeur, setCinDemandeur] = useState('');
  const [latitude, setLatitude] = useState<number>(route.params?.latitude || 0);
  const [longitude, setLongitude] = useState<number>(route.params?.longitude || 0);
  const [documentFiles, setDocumentFiles] = useState<DocumentFile>({});
  const [loading, setLoading] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  // Écouter les changements de params (quand on revient de LocationPicker)
  useEffect(() => {
    if (route.params?.latitude !== undefined && route.params?.longitude !== undefined) {
      setLatitude(route.params.latitude);
      setLongitude(route.params.longitude);
    }
  }, [route.params]);

  const pickDocumentForType = async (documentName: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: false,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        setDocumentFiles({
          ...documentFiles,
          [documentName]: result.assets,
        });
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner le fichier');
    }
  };

  const removeDocumentFile = (documentName: string) => {
    const updated = { ...documentFiles };
    delete updated[documentName];
    setDocumentFiles(updated);
  };

  const handleSubmit = async () => {
    if (!typeAutorisation || !cinDemandeur) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!latitude || !longitude) {
      Alert.alert('Erreur', 'Veuillez entrer une localisation valide');
      return;
    }

    // Valider que la latitude et longitude sont des nombres valides
    if (isNaN(latitude) || isNaN(longitude)) {
      Alert.alert('Erreur', 'La localisation doit être des nombres valides');
      return;
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      Alert.alert('Erreur', 'Latitude doit être entre -90 et 90, Longitude entre -180 et 180');
      return;
    }

    // Convertir documentFiles en tableau pour envoyer au service
    const allFiles: any[] = [];
    Object.values(documentFiles).forEach(fileArray => {
      allFiles.push(...fileArray);
    });

    setLoading(true);
    try {
      const response = await demandeService.createDemande(
        typeAutorisation,
        cinDemandeur,
        latitude,
        longitude,
        allFiles
      );

      const copyIdToClipboard = async () => {
        try {
          await Clipboard.setStringAsync(response.idDemande);
          Alert.alert('Copié', `L'ID de la demande (${response.idDemande}) a été copié dans le presse-papiers`);
        } catch (error) {
          Alert.alert('Erreur', 'Impossible de copier l\'ID');
        }
      };

      Alert.alert(
        'Succès',
        `Votre demande a été créée avec succès.\n\nN° de demande: ${response.idDemande}\n\nVous pouvez copier cet ID pour le sauvegarder ou le partager.`,
        [
          { 
            text: 'Copier l\'ID', 
            onPress: copyIdToClipboard,
            style: 'default' 
          },
          { 
            text: 'OK', 
            onPress: () => navigation.goBack(),
            style: 'cancel' 
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.response?.data?.message || 'Une erreur est survenue lors de la création de la demande'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={10}
      >
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
          <Text style={styles.cardTitle}>Nouvelle Demande d'Autorisation</Text>

          {/* Type d'autorisation */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type d'autorisation *</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowTypePicker(!showTypePicker)}
            >
              <Text style={[styles.pickerButtonText, !typeAutorisation && styles.placeholder]}>
                {typeAutorisation || 'Sélectionner un type'}
              </Text>
              <Icon name="chevron-down" size={24} color="#666" />
            </TouchableOpacity>

            {showTypePicker && (
              <View style={styles.pickerList}>
                {TYPES_DEMANDES.map((type, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.pickerItem}
                    onPress={() => {
                      setTypeAutorisation(type);
                      setShowTypePicker(false);
                    }}
                  >
                    <Text style={styles.pickerItemText}>{type}</Text>
                    {typeAutorisation === type && (
                      <Icon name="check" size={20} color="#2196F3" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Documents requis */}
            {typeAutorisation && DOCUMENTS_REQUIS[typeAutorisation as keyof typeof DOCUMENTS_REQUIS] && (
              <View style={styles.documentsRequiredSection}>
                <View style={styles.documentsHeader}>
                  <Icon name="file-document-outline" size={20} color="#2196F3" />
                  <Text style={styles.documentsTitle}>Documents requis</Text>
                </View>

                {DOCUMENTS_REQUIS[typeAutorisation as keyof typeof DOCUMENTS_REQUIS].map((docName, index) => {
                  const hasFile = documentFiles[docName]?.length > 0;
                  const file = documentFiles[docName]?.[0];

                  return (
                    <View key={index} style={styles.documentSection}>
                      <View style={styles.documentHeader}>
                        <View style={styles.documentNumber}>
                          <Text style={styles.documentNumberText}>{index + 1}</Text>
                        </View>
                        <View style={styles.documentInfo}>
                          <Text style={styles.documentName}>{docName}</Text>
                          <Text style={styles.documentSubtext}>
                            {hasFile ? `✓ ${file?.name || 'Fichier sélectionné'}` : 'Pas de fichier'}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={[styles.documentPickButton, hasFile && styles.documentPickButtonActive]}
                        onPress={() => pickDocumentForType(docName)}
                      >
                        <Icon
                          name={hasFile ? 'file-check' : 'file-upload-outline'}
                          size={18}
                          color={hasFile ? '#4CAF50' : '#2196F3'}
                        />
                        <Text
                          style={[styles.documentPickButtonText, hasFile && styles.documentPickButtonTextActive]}
                        >
                          {hasFile ? 'Modifier' : 'Sélectionner'}
                        </Text>
                      </TouchableOpacity>

                      {hasFile && (
                        <TouchableOpacity
                          style={styles.documentRemoveButton}
                          onPress={() => removeDocumentFile(docName)}
                        >
                          <Icon name="trash-can-outline" size={16} color="#F44336" />
                          <Text style={styles.documentRemoveButtonText}>Supprimer</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}

                <View style={styles.documentsInfo}>
                  <Icon name="information-outline" size={16} color="#FF9800" />
                  <Text style={styles.documentsInfoText}>
                    Veuillez télécharger les documents nécessaires pour valider votre demande
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* N° CIN */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>N° CIN *</Text>
            <View style={styles.inputContainer}>
              <Icon name="card-account-details-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: AB123456"
                value={cinDemandeur}
                onChangeText={setCinDemandeur}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Localisation */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localisation *</Text>
            {latitude && longitude ? (
              <View style={styles.locationSelectedContainer}>
                <View style={styles.locationSelectedContent}>
                  <View style={styles.locationSelectedIcon}>
                    <Icon name="map-check" size={24} color="#4CAF50" />
                  </View>
                  <View style={styles.locationSelectedText}>
                    <Text style={styles.locationSelectedLabel}>Localisation confirmée</Text>
                    <Text style={styles.locationSelectedCoordinates}>
                      {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.editLocationButton}
                  onPress={() => navigation.navigate('LocationPicker', { latitude, longitude })}
                >
                  <Icon name="pencil" size={18} color="#2196F3" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.mapButton}
                onPress={() => navigation.navigate('LocationPicker', { latitude, longitude })}
              >
                <Icon name="map-marker" size={20} color="#fff" />
                <Text style={styles.mapButtonLabel}>Cliquer pour sélectionner sur la carte</Text>
                <Icon name="chevron-right" size={24} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="send" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Soumettre la demande</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: '#1565C0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DDE9F8',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFB',
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
    color: '#7C8BA3',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#DDE9F8',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#F8FAFB',
  },
  pickerButtonText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  pickerList: {
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  pickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },
  pickerItemText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1565C0',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#EEF5FF',
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  locationButtonText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#1565C0',
    fontWeight: '700',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#DDE9F8',
    borderRadius: 10,
    padding: 14,
    backgroundColor: '#F8FAFB',
  },
  uploadButtonText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#1565C0',
    fontWeight: '700',
  },
  filesList: {
    marginTop: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFB',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
  },
  fileName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  documentsRequis: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#EEF5FF',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#1565C0',
  },
  documentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  documentsTitle: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '800',
    color: '#1565C0',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  documentItem: {
    flexDirection: 'row',
    marginLeft: 8,
    marginBottom: 6,
  },
  documentBullet: {
    fontSize: 14,
    color: '#7C8BA3',
    marginRight: 8,
    fontWeight: 'bold',
  },
  documentText: {
    flex: 1,
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  // Flexible document sections
  documentsRequiredSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
  },
  documentSection: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F8FAFB',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  documentNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1565C0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  documentNumberText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  documentSubtext: {
    fontSize: 12,
    color: '#7C8BA3',
    fontWeight: '500',
  },
  documentPickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1565C0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EEF5FF',
    marginTop: 8,
  },
  documentPickButtonActive: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  documentPickButtonText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '700',
    color: '#1565C0',
  },
  documentPickButtonTextActive: {
    color: '#059669',
  },
  documentRemoveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#FFE5E5',
    borderWidth: 1.5,
    borderColor: '#FFCCCC',
  },
  documentRemoveButtonText: {
    marginLeft: 6,
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '700',
  },
  documentsInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEF9E7',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  documentsInfoText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
    fontWeight: '500',
  },
  // Map button styles
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1565C0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  mapButtonLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 10,
    letterSpacing: 0.2,
  },
  mapButtonCoordinates: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: 2,
    fontWeight: '600',
  },
  locationSelectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: '#DCFCE7',
    marginTop: 12,
  },
  locationSelectedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationSelectedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationSelectedText: {
    flex: 1,
  },
  locationSelectedLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 2,
  },
  locationSelectedCoordinates: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  editLocationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1.5,
    borderColor: '#D4E6FF',
  },
});

export default CreateDemandeScreen;
