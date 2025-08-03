import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import * as Linking from 'expo-linking';

// Import screens
import IntroScreen from './src/screens/IntroScreen';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import CheckInScreen from './src/screens/CheckInScreen';
import WinsScreen from './src/screens/WinsScreen';
import MeditationScreen from './src/screens/MeditationScreen';
import ResourcesScreen from './src/screens/ResourcesScreen';
import ConfirmScreen from './src/screens/ConfirmScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import ResetCodeScreen from './src/screens/ResetCodeScreen';
import MySummariesScreen from './src/screens/MySummariesScreen';
import AudioImportScreen from './src/screens/AudioImportScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Deep linking config
const linking = {
  prefixes: [
    'https://wisesobriety.org',
    'wisesobriety://'
  ],
  config: {
    screens: {
      Intro: 'intro',
      Auth: 'auth',
      ConfirmScreen: 'confirm',
      ForgotPassword: 'forgot-password',
      ResetPassword: 'reset-password',
      MainApp: {
        screens: {
          Home: 'home',
          CheckIn: 'checkin',
          Wins: 'wins',
          Meditation: 'meditation',
          Resources: 'resources',
        },
      },
    },
  },
};

// Bottom Tab Navigator
function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CheckIn') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Wins') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Meditation') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Resources') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'MySummaries') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 80 + insets.bottom,
          paddingBottom: 10 + insets.bottom,
          paddingTop: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CheckIn" component={CheckInScreen} />
      <Tab.Screen name="Wins" component={WinsScreen} />
      <Tab.Screen name="Meditation" component={MeditationScreen} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      <Tab.Screen name="MySummaries" component={MySummariesScreen} options={{ title: 'Summaries' }} />
    </Tab.Navigator>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  console.log('AppContent: user:', user?.id, 'loading:', loading);

  if (loading) {
    console.log('AppContent: Still loading, showing nothing');
    return null; // You could add a loading screen here
  }

  // Check if user is authenticated
  const initialRoute = user ? "MainApp" : "Intro";
  console.log('AppContent: Choosing initial route:', initialRoute);

  return (
    <NavigationContainer linking={linking}>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="ConfirmScreen" component={ConfirmScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
              <Stack.Screen name="ResetCode" component={ResetCodeScreen} />
        <Stack.Screen name="AudioImport" component={AudioImportScreen} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
} 