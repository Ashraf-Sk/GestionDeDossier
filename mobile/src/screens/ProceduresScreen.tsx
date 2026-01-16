import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TYPES_DEMANDES, DOCUMENTS_REQUIS, PROCEDURE_PDFS } from '../config/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { demandeService } from '../services/demandeService';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';

const ProceduresScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const proceduresData = [
    {
      type: 'Permis de construire',
      icon: 'home-city-outline',
      color: '#4CAF50',
      description: 'Pour : toute nouvelle construction ou modification d\'un bâtiment.',
      utilite: 'Utilité : légaliser la construction selon le Plan d\'Aménagement Urbain (PAU).',
    },
    {
      type: 'Lotissement / Morcellement',
      icon: 'view-grid-outline',
      color: '#2196F3',
      description: 'Pour : diviser un terrain en plusieurs lots constructibles ou aménageables.',
      utilite: 'Utilité : créer des lots pour la vente ou la construction.',
    },
    {
      type: 'Certificat de conformité',
      icon: 'certificate-outline',
      color: '#FF9800',
      description: 'Pour : obtenir l\'attestation que la construction respecte les normes urbaines et les permis délivrés.',
      utilite: 'Utilité : obligatoire pour la vente ou la location d\'un bâtiment.',
    },
    {
      type: 'Note de renseignements urbanistiques (NRU)',
      icon: 'map-marker-outline',
      color: '#9C27B0',
      description: 'Pour : connaître les règles de construction applicables à un terrain.',
      utilite: 'Utilité : préparer un projet de construction ou achat de terrain.',
    },
    {
      type: 'Demande de démolition',
      icon: 'delete-outline',
      color: '#F44336',
      description: 'Pour : faire démolir une construction non conforme ou dangereuse.',
      utilite: 'Utilité : régularisation ou sécurité.',
    },
    {
      type: 'Demande de dérogation urbanistique',
      icon: 'file-alert-outline',
      color: '#FF5722',
      description: 'Pour : obtenir une autorisation exceptionnelle quand le projet ne respecte pas exactement le plan d\'urbanisme.',
      utilite: 'Utilité : projets spéciaux ou modifications nécessaires.',
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const downloadProcedurePdf = async (type: string) => {
    try {
      // Récupérer le fichier PDF depuis les assets
      const pdfAsset = PROCEDURE_PDFS[type as keyof typeof PROCEDURE_PDFS];
      
      if (!pdfAsset) {
        Alert.alert('Erreur', `Le PDF pour "${type}" n'est pas disponible.`);
        return;
      }

      console.log('[ProceduresScreen] Téléchargement du PDF pour:', type);

      // Vérifier si Sharing est disponible
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert('Erreur', 'Le partage de fichiers n\'est pas disponible sur cet appareil.');
        return;
      }

      // Utiliser Asset pour obtenir l'URI locale du fichier
      const asset = Asset.fromModule(pdfAsset);
      await asset.downloadAsync();

      if (asset.localUri) {
        // Partager/télécharger le fichier
        await Sharing.shareAsync(asset.localUri, {
          mimeType: 'application/pdf',
          dialogTitle: `Télécharger ${type}`,
        });
        
        console.log('[ProceduresScreen] PDF partagé avec succès');
      } else {
        throw new Error('Impossible de charger le fichier PDF');
      }
    } catch (error: any) {
      console.error('[ProceduresScreen] Erreur lors du téléchargement:', error);
      Alert.alert(
        'Erreur',
        `Impossible de télécharger le PDF: ${error.message || 'Erreur inconnue'}`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guide des Procédures</Text>
        <Text style={styles.headerSubtitle}>Toutes les informations nécessaires</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
            {proceduresData.map((procedure, index) => (
              <View key={index} style={styles.typeCard}>
                <TouchableOpacity
                  style={styles.typeHeader}
                  onPress={() => toggleExpand(index)}
                  activeOpacity={0.8}
                >
                  <View style={styles.typeIconContainer}>
                    <Icon name={procedure.icon} size={24} color="#1565C0" />
                  </View>
                  <View style={styles.typeHeaderContent}>
                    <Text style={styles.typeTitle}>{procedure.type}</Text>
                    <Text style={styles.typeSubtitle}>
                      {DOCUMENTS_REQUIS[procedure.type as keyof typeof DOCUMENTS_REQUIS]?.length || 0} documents • Détails
                    </Text>
                  </View>
                  <Icon 
                    name={expandedIndex === index ? 'chevron-up' : 'chevron-down'} 
                    size={24} 
                    color={'#9CA3AF'} 
                  />
                </TouchableOpacity>

                {expandedIndex === index && (
                  <View style={styles.typeDetails}>
                    <View style={styles.typeDescription}>
                      <Text style={styles.typeDescriptionText}>{procedure.description}</Text>
                    </View>

                    <View style={styles.documentsSection}>
                      <Text style={styles.documentsSectionTitle}>Documents requis :</Text>
                      {DOCUMENTS_REQUIS[procedure.type as keyof typeof DOCUMENTS_REQUIS]?.map((doc, docIndex) => (
                        <View key={docIndex} style={styles.documentRow}>
                          <View style={styles.documentBullet}>
                            <Text style={styles.documentBulletText}>{docIndex + 1}</Text>
                          </View>
                          <Text style={styles.documentText}>{doc}</Text>
                        </View>
                      ))}
                    </View>

                    <TouchableOpacity 
                      style={styles.pdfActionButton}
                      onPress={() => downloadProcedurePdf(procedure.type)}
                    >
                      <Icon name="file-pdf-box" size={20} color="#fff" />
                      <Text style={styles.pdfActionButtonText}>Télécharger la procédure</Text>
                      <Icon name="download" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E5F1FF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7C8BA3',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  
  // Types Card Styles
  typeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  typeHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  typeIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#D4E6FF',
  },
  typeHeaderContent: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  typeSubtitle: {
    fontSize: 12,
    color: '#7C8BA3',
    fontWeight: '600',
  },
  typeDetails: {
    borderTopWidth: 1.5,
    borderTopColor: '#EEF2F7',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FAFBFF',
  },
  typeDescription: {
    marginBottom: 16,
  },
  typeDescriptionText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 21,
    fontWeight: '500',
  },
  documentsSection: {
    marginBottom: 16,
  },
  documentsSectionTitle: {
    fontSize: 14,
    fontWeight: '800',

    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#1565C0',
  },
  documentRow: {
    flexDirection: 'row',
    marginBottom: 11,
    alignItems: 'flex-start',
  },
  documentBullet: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 1,
  },
  documentBulletText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
  documentText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 21,
    paddingTop: 2,
    fontWeight: '500',
  },
  pdfActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1565C0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  pdfActionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  
  // Procedures Tab Styles
  pdfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  pdfIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FEE5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#FFCCCC',
  },
  pdfContent: {
    flex: 1,
  },
  pdfTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  pdfDescription: {
    fontSize: 12,
    color: '#7C8BA3',
    fontWeight: '500',
  },
});

export default ProceduresScreen;
