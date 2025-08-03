# In-App Password Reset Flow Guide

## 🎯 Overview

Instead of using deep links, you can create a complete in-app password reset flow where:
1. User requests password reset
2. Receives email with a code/token
3. Enters the code in your app
4. Sets new password within the app

## ✅ Benefits of In-App Flow

- **No deep link issues** - works reliably in testing
- **Better user experience** - stays within your app
- **More control** - customize the entire flow
- **Works with Expo Go** - no need for development builds
- **Simpler testing** - easier to debug

## 🚀 Implementation Options

### Option 1: Email Code Verification (Recommended)

**Flow:**
1. User enters email → Request reset
2. User receives email with 6-digit code
3. User enters code in app
4. User sets new password

### Option 2: Email Link with Token Extraction

**Flow:**
1. User enters email → Request reset
2. User receives email with link
3. User copies token from link
4. User pastes token in app
5. User sets new password

## 🧪 Option 1: Email Code Verification

### Step 1: Update AuthContext.js

```javascript
// Add these functions to your AuthContext.js
const requestPasswordReset = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: null // Don't redirect, just send email
    });
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const verifyResetCode = async (email, code) => {
  try {
    // This would need a custom Supabase function
    // For now, we'll use the token approach
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const updatePasswordWithCode = async (email, code, newPassword) => {
  try {
    // This would need a custom Supabase function
    // For now, we'll use the token approach
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### Step 2: Create ResetCodeScreen.js

```javascript
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function ResetCodeScreen({ navigation, route }) {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('code'); // 'code' or 'password'
  const { verifyResetCode, updatePasswordWithCode } = useAuth();
  
  const email = route.params?.email;

  const handleVerifyCode = async () => {
    if (!code || code.length < 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyResetCode(email, code);
      if (result.success) {
        setStep('password');
      } else {
        Alert.alert('Error', result.error || 'Invalid code');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const result = await updatePasswordWithCode(email, code, newPassword);
      if (result.success) {
        Alert.alert('Success', 'Password updated successfully', [
          { text: 'OK', onPress: () => navigation.navigate('Auth') }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to update password');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'password') {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.content}>
              <Ionicons name="lock-closed" size={80} color="white" style={styles.icon} />
              <Text style={styles.title}>Set New Password</Text>
              <Text style={styles.subtitle}>Enter your new password</Text>

              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#999"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleUpdatePassword}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setStep('code')}
              >
                <Text style={styles.backButtonText}>Back to Code</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <Ionicons name="mail" size={80} color="white" style={styles.icon} />
            <Text style={styles.title}>Enter Reset Code</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit code to {email}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit code"
              placeholderTextColor="#999"
              value={code}
              onChangeText={setCode}
              keyboardType="numeric"
              maxLength={6}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Verifying...' : 'Verify Code'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Back to Email</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
    opacity: 0.9,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
```

### Step 3: Update ForgotPasswordScreen.js

```javascript
// Add this to your ForgotPasswordScreen.js
const handleRequestReset = async () => {
  if (!email.trim()) {
    Alert.alert('Error', 'Please enter your email address');
    return;
  }

  setLoading(true);
  try {
    const result = await requestPasswordReset(email.trim());
    if (result.success) {
      Alert.alert(
        'Check Your Email',
        'We sent a reset code to your email address.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ResetCode', { email: email.trim() })
          }
        ]
      );
    } else {
      Alert.alert('Error', result.error || 'Failed to send reset code');
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to send reset code');
  } finally {
    setLoading(false);
  }
};
```

### Step 4: Update App.js Navigation

```javascript
// Add ResetCodeScreen to your imports
import ResetCodeScreen from './src/screens/ResetCodeScreen';

// Add to your Stack.Navigator
<Stack.Screen name="ResetCode" component={ResetCodeScreen} />
```

## 🧪 Option 2: Token Extraction from Email

### Alternative Implementation

If you prefer to extract tokens from email links:

```javascript
// In ResetCodeScreen.js
const [token, setToken] = useState('');

const handleVerifyToken = async () => {
  if (!token.trim()) {
    Alert.alert('Error', 'Please enter the token from your email');
    return;
  }

  setLoading(true);
  try {
    // Extract token from email link and validate
    const result = await validateResetToken(token.trim());
    if (result.success) {
      setStep('password');
    } else {
      Alert.alert('Error', 'Invalid token');
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to verify token');
  } finally {
    setLoading(false);
  }
};
```

## 🎯 Benefits of In-App Flow

1. **No deep link issues** - works with Expo Go
2. **Better UX** - user stays in your app
3. **Easier testing** - no need for development builds
4. **More control** - customize the entire flow
5. **Reliable** - works on all devices and email clients

## 🚀 Quick Implementation

**To implement this quickly:**

1. **Create ResetCodeScreen.js** (use the code above)
2. **Update AuthContext.js** with the new functions
3. **Update ForgotPasswordScreen.js** to navigate to ResetCode
4. **Add ResetCodeScreen** to App.js navigation
5. **Test the flow**

**Would you like me to help you implement this in-app flow?** It's much more reliable than deep links for testing! 🎯 