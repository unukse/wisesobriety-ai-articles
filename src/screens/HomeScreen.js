import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { simpleStorage } from '../../SIMPLE_CHECKIN_STORAGE';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckInReminder, setShowCheckInReminder] = useState(false);
  const [showCheckInPopup, setShowCheckInPopup] = useState(false);

  useEffect(() => {
    loadCheckIns();
  }, []);

  useEffect(() => {
    // Show immediate check-in popup after loading
    if (!loading) {
      // Add a small delay to ensure the screen is fully loaded
      const timer = setTimeout(() => {
        setShowCheckInPopup(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    // Check if user has checked in today after loading check-ins
    if (!loading && checkIns.length > 0) {
      checkIfCheckedInToday();
    }
  }, [loading, checkIns]);

  const loadCheckIns = async () => {
    try {
      setLoading(true);
      const allCheckIns = await simpleStorage.getAllCheckIns();
      const userCheckIns = allCheckIns.filter(checkIn => checkIn.user_id === user?.id);
      setCheckIns(userCheckIns);
    } catch (error) {
      console.error('Error loading check-ins:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfCheckedInToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const hasCheckedInToday = checkIns.some(checkIn => {
      const checkInDate = new Date(checkIn.created_at);
      checkInDate.setHours(0, 0, 0, 0);
      return checkInDate.getTime() === today.getTime();
    });

    // Show reminder if user hasn't checked in today
    if (!hasCheckedInToday) {
      setShowCheckInReminder(true);
    }
  };

  const handleCheckInNow = () => {
    setShowCheckInReminder(false);
    navigation.navigate('CheckIn');
  };

  const handleRemindLater = () => {
    setShowCheckInReminder(false);
  };

  const handleCheckInPopupNow = () => {
    setShowCheckInPopup(false);
    navigation.navigate('CheckIn');
  };

  const handleCheckInPopupLater = () => {
    setShowCheckInPopup(false);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ]
    );
  };

  const getDaysSober = () => {
    if (checkIns.length === 0) return 0;
    
    // Count check-ins where user reported no alcohol consumption
    const soberCheckIns = checkIns.filter(checkIn => {
      const alcoholConsumption = checkIn.alcohol_consumption?.toLowerCase() || '';
      // Consider it sober if they reported "none", "no", "0", "zero", or left it empty
      return alcoholConsumption.includes('none') || 
             alcoholConsumption.includes('no') || 
             alcoholConsumption === '' || 
             alcoholConsumption.includes('0') ||
             alcoholConsumption.includes('zero');
    });
    
    return soberCheckIns.length;
  };

  const getMotivationAverage = () => {
    if (checkIns.length === 0) return 0;
    const total = checkIns.reduce((sum, checkIn) => sum + (checkIn.motivation_rating || 0), 0);
    return Math.round(total / checkIns.length);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back!</Text>
            <Text style={styles.userEmail}>
              {user?.user_metadata?.name || user?.email || 'User'}
            </Text>
          </View>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="heart" size={32} color="#ff6b6b" />
            <Text style={styles.statNumber}>{getDaysSober()}</Text>
            <Text style={styles.statLabel}>Days Sober</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={32} color="#51cf66" />
            <Text style={styles.statNumber}>{checkIns.length}</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={32} color="#ffd43b" />
            <Text style={styles.statNumber}>{getMotivationAverage()}/5</Text>
            <Text style={styles.statLabel}>Avg Motivation</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('CheckIn')}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.actionGradient}
            >
              <Ionicons name="add-circle" size={32} color="#fff" />
              <Text style={styles.actionTitle}>New Check-in</Text>
              <Text style={styles.actionSubtitle}>Record your daily progress</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('MySummaries')}
          >
            <LinearGradient
              colors={['#51cf66', '#40c057']}
              style={styles.actionGradient}
            >
              <Ionicons name="document-text" size={32} color="#fff" />
              <Text style={styles.actionTitle}>My Summaries</Text>
              <Text style={styles.actionSubtitle}>Read AI coach advice</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Wins')}
          >
            <LinearGradient
              colors={['#ffd43b', '#fcc419']}
              style={styles.actionGradient}
            >
              <Ionicons name="trophy" size={32} color="#fff" />
              <Text style={styles.actionTitle}>Celebrate Wins</Text>
              <Text style={styles.actionSubtitle}>Track your achievements</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        {checkIns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.recentContainer}>
              {checkIns.slice(0, 3).map((checkIn, index) => (
                <View key={checkIn.id} style={styles.recentItem}>
                  <View style={styles.recentIcon}>
                    <Ionicons name="checkmark-circle" size={20} color="#51cf66" />
                  </View>
                  <View style={styles.recentContent}>
                    <Text style={styles.recentDate}>
                      {new Date(checkIn.created_at).toLocaleDateString()}
                    </Text>
                    <Text style={styles.recentMotivation}>
                      Motivation: {checkIn.motivation_rating}/5
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Check-in Reminder Modal */}
      <Modal
        visible={showCheckInReminder}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCheckInReminder(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="notifications" size={48} color="#667eea" />
            </View>
            <Text style={styles.modalTitle}>Daily Check-in Reminder</Text>
            <Text style={styles.modalMessage}>
              It looks like you haven't checked in today. Would you like to record your daily progress now?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.primaryButton]} 
                onPress={handleCheckInNow}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.modalButtonText}>Check In Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.secondaryButton]} 
                onPress={handleRemindLater}
              >
                <Ionicons name="time" size={20} color="#667eea" />
                <Text style={[styles.modalButtonText, styles.secondaryButtonText]}>Remind Me Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Immediate Check-in Popup Modal */}
      <Modal
        visible={showCheckInPopup}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCheckInPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.popupContent]}>
            <View style={[styles.modalIconContainer, styles.popupIconContainer]}>
              <Ionicons name="heart" size={48} color="#ff6b6b" />
            </View>
            <Text style={styles.modalTitle}>Welcome Back!</Text>
            <Text style={styles.modalMessage}>
              Ready to check in and track your progress? Let's start your day with a quick check-in!
            </Text>
            <View style={styles.modalButtons}>
                             <TouchableOpacity 
                 style={[styles.modalButton, styles.primaryButton]} 
                 onPress={handleCheckInPopupNow}
               >
                 <Text style={styles.modalButtonText}>Check In Now</Text>
               </TouchableOpacity>
                             <TouchableOpacity 
                 style={[styles.modalButton, styles.secondaryButton]} 
                 onPress={handleCheckInPopupLater}
               >
                 <Text style={[styles.modalButtonText, styles.secondaryButtonText]}>Maybe Later</Text>
               </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 24,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  actionCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  actionGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
    flex: 1,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginLeft: 16,
    flex: 1,
  },
  recentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentIcon: {
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  recentMotivation: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalIconContainer: {
    backgroundColor: '#e0f2fe',
    borderRadius: 24,
    padding: 10,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  primaryButton: {
    backgroundColor: '#667eea',
    flex: 1,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#667eea',
    flex: 1,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryButtonText: {
    color: '#667eea',
  },
  popupContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  popupIconContainer: {
    backgroundColor: '#ffe0e0',
    borderRadius: 30,
    padding: 15,
    marginBottom: 20,
  },
}); 