import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import TrackDemandeScreen from '../screens/TrackDemandeScreen';
import DemandeDetailScreen from '../screens/DemandeDetailScreen';
import CreateDemandeScreen from '../screens/CreateDemandeScreen';
import ProceduresScreen from '../screens/ProceduresScreen';
import ContactScreen from '../screens/ContactScreen';
import LocationPickerScreen from '../screens/LocationPickerScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  DemandeDetail: { demande: any };
  CreateDemande: { latitude?: number; longitude?: number };
  Procedures: undefined;
  LocationPicker: { latitude?: number; longitude?: number };
};

export type MainTabParamList = {
  Home: undefined;
  Track: undefined;
  Contact: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Navigation par onglets pour les utilisateurs authentifiés
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Track') {
            iconName = focused ? 'file-search' : 'file-search-outline';
          } else if (route.name === 'Contact') {
            iconName = focused ? 'phone' : 'phone-outline';
          } else {
            iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen 
        name="Track" 
        component={TrackDemandeScreen}
        options={{ tabBarLabel: 'Suivi' }}
      />
      <Tab.Screen 
        name="Contact" 
        component={ContactScreen}
        options={{ tabBarLabel: 'Contact' }}
      />
    </Tab.Navigator>
  );
};

// Navigation principale
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Ou un écran de chargement
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ title: 'Connexion', headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ title: 'Inscription' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="DemandeDetail" 
              component={DemandeDetailScreen}
              options={{ title: 'Détails de la demande' }}
            />
            <Stack.Screen 
              name="CreateDemande" 
              component={CreateDemandeScreen}
              options={{ title: 'Nouvelle demande' }}
            />
            <Stack.Screen 
              name="Procedures" 
              component={ProceduresScreen}
              options={{ title: 'Procédures administratives' }}
            />
            <Stack.Screen 
              name="LocationPicker" 
              component={LocationPickerScreen}
              options={{ title: 'Localisation', headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
