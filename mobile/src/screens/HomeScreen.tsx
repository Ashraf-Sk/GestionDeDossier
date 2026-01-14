import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';
import { TYPES_DEMANDES, DOCUMENTS_REQUIS } from '../config/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { logout, userInfo } = useAuth();

  const menuItems = [
    {
      id: 1,
      title: 'Nouvelle Demande',
      description: 'Créer une demande d\'autorisation',
      icon: 'file-plus',
      color: '#4CAF50',
      onPress: () => navigation.navigate('CreateDemande', {}),
    },
    {
      id: 2,
      title: 'Suivi de Demande',
      description: 'Vérifier l\'état de votre dossier',
      icon: 'magnify',
      color: '#2196F3',
      onPress: () => navigation.navigate('MainTabs', { screen: 'Track' } as any),
    },
    {
      id: 3,
      title: 'Procédures & Documents',
      description: 'Consultez les documents requis',
      icon: 'book-open-variant',
      color: '#FF9800',
      onPress: () => navigation.navigate('Procedures'),
    },
    {
      id: 4,
      title: 'Contactez-Nous',
      description: 'Support et assistance',
      icon: 'phone',
      color: '#9C27B0',
      onPress: () => navigation.navigate('MainTabs', { screen: 'Contact' } as any),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Bienvenue</Text>
            <Text style={styles.headerSubtitle}>
              {userInfo?.email?.split('@')[0]?.charAt(0).toUpperCase()}{userInfo?.email?.split('@')[0]?.slice(1) || 'Utilisateur'}
            </Text>
          </View>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Icon name="logout" size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Actions Principales</Text>
          <Text style={styles.sectionDescription}>Accédez rapidement aux fonctionnalités</Text>
          
          <View style={styles.actionsGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.actionCard}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconContainer}>
                  <Icon name={item.icon} size={24} color="#1565C0" />
                </View>
                <Text style={styles.actionTitle}>{item.title}</Text>
                <Text style={styles.actionDescription}>{item.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Procédures Disponibles */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Procédures Disponibles</Text>
          <Text style={styles.sectionDescription}>6 types de demandes</Text>
          
          <View style={styles.proceduresList}>
            {TYPES_DEMANDES.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={styles.procedureItem}
                onPress={() => navigation.navigate('Procedures')}
                activeOpacity={0.7}
              >
                <View style={styles.procedureItemLeft}>
                  <View style={styles.procedureNumber}>
                    <Text style={styles.procedureNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.procedureContent}>
                    <Text style={styles.procedureTitle}>{type}</Text>
                    <Text style={styles.procedureDocCount}>
                      {DOCUMENTS_REQUIS[type as keyof typeof DOCUMENTS_REQUIS]?.length || 0} documents
                    </Text>
                  </View>
                </View>
                <Icon name="chevron-right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* CTA Card */}
        <TouchableOpacity
          style={styles.ctaCard}
          onPress={() => navigation.navigate('CreateDemande', {})}
          activeOpacity={0.8}
        >
          <View style={styles.ctaContent}>
            <Icon name="file-plus" size={28} color="#fff" />
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>Nouvelle Demande</Text>
              <Text style={styles.ctaText}>Créez votre demande en quelques étapes</Text>
            </View>
          </View>
          <Icon name="arrow-right" size={24} color="#fff" />
        </TouchableOpacity>

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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    textTransform: 'capitalize',
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFCCCC',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#7C8BA3',
    marginBottom: 16,
    fontWeight: '500',
  },
  // Actions Grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF5FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#D4E6FF',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 5,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#7C8BA3',
    textAlign: 'center',
    lineHeight: 17,
    fontWeight: '500',
  },
  // Procedures List
  proceduresList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5F1FF',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  procedureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F7',
  },
  procedureItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  procedureNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  procedureNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
  },
  procedureContent: {
    flex: 1,
  },
  procedureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  procedureDocCount: {
    fontSize: 12,
    color: '#7C8BA3',
    fontWeight: '600',
  },
  // CTA Card
  ctaCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    backgroundColor: '#1565C0',
    borderRadius: 14,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#1565C0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  ctaContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 3,
    letterSpacing: 0.2,
  },
  ctaText: {
    fontSize: 13,
    color: '#E0E7FF',
    lineHeight: 18,
    fontWeight: '500',
  },
});

export default HomeScreen;