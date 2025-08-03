import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import * as Linking from 'expo-linking';

export default function ConfirmScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { confirmEmail } = useAuth();

  useEffect(() => {
    handleEmailConfirmation();
  }, []);

  const handleEmailConfirmation = async () => {
    try {
      // Get the URL parameters from the deep link
      const url = route.params?.url || '';
      const token = route.params?.token || '';
      const email = route.params?.email || '';
      
      if (token && email) {
        // Handle the confirmation with our custom confirmEmail function
        const result = await confirmEmail(token, email);
        
        if (result.success) {
          // Successfully confirmed email
          setTimeout(() => {
            navigation.replace('MainApp');
          }, 2000);
        } else {
          setError(result.error || 'Failed to confirm email');
        }
      } else if (url) {
        // Handle URL-based confirmation (fallback)
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const tokenFromUrl = urlParams.get('token');
        const emailFromUrl = urlParams.get('email');
        
        if (tokenFromUrl && emailFromUrl) {
          const result = await confirmEmail(tokenFromUrl, emailFromUrl);
          
          if (result.success) {
            setTimeout(() => {
              navigation.replace('MainApp');
            }, 2000);
          } else {
            setError(result.error || 'Failed to confirm email');
          }
        } else {
          setError('Invalid confirmation link');
        }
      } else {
        // If no URL or parameters, just show success message (for manual confirmation)
        setTimeout(() => {
          navigation.replace('MainApp');
        }, 2000);
      }
    } catch (error) {
      console.error('Email confirmation error:', error);
      setError('Failed to confirm email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    handleEmailConfirmation();
  };

  const handleBackToSignIn = () => {
    navigation.replace('Auth');
  };

  if (error) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <View style={styles.content}>
          <Ionicons name="alert-circle" size={80} color="#ff6b6b" />
          <Text style={styles.title}>Confirmation Failed</Text>
          <Text style={styles.subtitle}>
            {error}
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleRetry}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToSignIn}>
            <Text style={styles.backButtonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="checkmark-circle" size={80} color="#51cf66" />
        <Text style={styles.title}>Email Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your account has been successfully verified. Welcome to Wise Sobriety!
        </Text>
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        <Text style={styles.loadingText}>Setting up your account...</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  button: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
}); 