import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { demandeService } from '../services/demandeService';
import { CONTACT_INFO } from '../config/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    sujet: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.sujet || !formData.message) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      // ⚠️ BACKEND ne supporte que 'message', pas 'sujet'
      // On concatène sujet et message pour ne rien perdre
      //const messageComplet = `[${formData.sujet}] ${formData.message}`;
      const sujet = `${formData.sujet}`;
      const message = `${formData.message}`;
      
      await demandeService.contact({
        sujet: sujet,
        message: message,
      });

      Alert.alert(
        'Succès',
        'Votre message a été envoyé avec succès. Nous vous contacterons bientôt.',
        [
          {
            text: 'OK',
            onPress: () => setFormData({ sujet: '', message: '' }),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.response?.data?.message || 'Une erreur est survenue lors de l\'envoi du message'
      );
    } finally {
      setLoading(false);
    }
  };

  const openPhone = () => {
    Linking.openURL(`tel:${CONTACT_INFO.phone}`);
  };

  const openEmail = () => {
    Linking.openURL(`mailto:${CONTACT_INFO.email}`);
  };

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${CONTACT_INFO.latitude},${CONTACT_INFO.longitude}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contactez-Nous</Text>
        <Text style={styles.headerSubtitle}>
          Nous sommes là pour vous aider
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Informations de contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nos Coordonnées</Text>

          <TouchableOpacity style={styles.contactCard} onPress={openPhone}>
            <View style={styles.contactIcon}>
              <Icon name="phone" size={24} color="#4CAF50" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Téléphone</Text>
              <Text style={styles.contactValue}>{CONTACT_INFO.phone}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={openEmail}>
            <View style={styles.contactIcon}>
              <Icon name="email" size={24} color="#2196F3" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{CONTACT_INFO.email}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={openMaps}>
            <View style={styles.contactIcon}>
              <Icon name="map-marker" size={24} color="#F44336" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Adresse</Text>
              <Text style={styles.contactValue}>{CONTACT_INFO.address}</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Carte */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notre Localisation</Text>
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: CONTACT_INFO.latitude,
                longitude: CONTACT_INFO.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: CONTACT_INFO.latitude,
                  longitude: CONTACT_INFO.longitude,
                }}
                title="Notre Bureau"
                description={CONTACT_INFO.address}
              />
            </MapView>
          </View>
        </View>

        {/* Formulaire de contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Envoyez-nous un Message</Text>

          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sujet</Text>
              <View style={styles.inputContainer}>
                <Icon name="format-title" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Objet de votre message"
                  value={formData.sujet}
                  onChangeText={(text) => setFormData({ ...formData, sujet: text })}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Message</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Votre remarque, proposition ou réclamation..."
                  value={formData.message}
                  onChangeText={(text) => setFormData({ ...formData, message: text })}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.sendButton, loading && styles.sendButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon name="send" size={20} color="#fff" />
                  <Text style={styles.sendButtonText}>Envoyer</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Horaires */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Icon name="clock-outline" size={24} color="#2196F3" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Horaires d'ouverture</Text>
              <Text style={styles.infoText}>
                Lundi - Vendredi: 8h00 - 16h00{'\n'}
                Samedi: Fermé{'\n'}
                Dimanche: Fermé
              </Text>
            </View>
          </View>
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
    paddingTop: 16,
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
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
    letterSpacing: 0.2,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactContent: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '500',
  },
  contactValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  mapContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: 220,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    height: 48,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#DDE9F8',
    borderRadius: 10,
    backgroundColor: '#F8FAFB',
    paddingHorizontal: 14,
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  sendButton: {
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
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF5FF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: '#1565C0',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  infoText: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 21,
    fontWeight: '500',
  },
});

export default ContactScreen;
