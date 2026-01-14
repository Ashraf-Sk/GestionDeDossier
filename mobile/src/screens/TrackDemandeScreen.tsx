import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { demandeService, DemandeResponse } from '../services/demandeService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type TrackDemandeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TrackDemandeScreen = () => {
  const navigation = useNavigation<TrackDemandeScreenNavigationProp>();
  const [idDemande, setIdDemande] = useState('');
  const [cinDemandeur, setCinDemandeur] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrackDemande = async () => {
    if (!idDemande || !cinDemandeur) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const demande = await demandeService.trackDemande(idDemande, cinDemandeur);
      navigation.navigate('DemandeDetail', { demande });
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.response?.data || 'Demande introuvable ou accès refusé'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Suivi de Demande</Text>
        <Text style={styles.headerSubtitle}>
          Consultez l'état de votre demande
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formCard}>
          <View style={styles.infoBox}>
            <Icon name="information-outline" size={24} color="#2196F3" />
            <Text style={styles.infoText}>
              Saisissez votre numéro de CIN et le numéro de demande pour consulter les détails
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>N° de la Demande</Text>
            <View style={styles.inputContainer}>
              <Icon name="file-document-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ex: DEM-2024-001"
                value={idDemande}
                onChangeText={setIdDemande}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>N° CIN</Text>
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

          <TouchableOpacity
            style={[styles.searchButton, loading && styles.searchButtonDisabled]}
            onPress={handleTrackDemande}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="magnify" size={24} color="#fff" />
                <Text style={styles.searchButtonText}>Rechercher</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Besoin d'aide ?</Text>
          <Text style={styles.helpText}>
            • Le numéro de demande vous est envoyé par email après le dépôt{'\n'}
            • Vérifiez que votre N° CIN correspond à celui utilisé lors du dépôt{'\n'}
            • En cas de problème, contactez-nous via l'onglet Contact
          </Text>
        </View>
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
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7C8BA3',
    marginTop: 4,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EEF5FF',
    padding: 13,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#1565C0',
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#0C4A6E',
    lineHeight: 21,
    fontWeight: '500',
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
  searchButton: {
    backgroundColor: '#1565C0',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  helpCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  helpText: {
    fontSize: 13,
    color: '#7C8BA3',
    lineHeight: 22,
    fontWeight: '500',
  },
});

export default TrackDemandeScreen;
