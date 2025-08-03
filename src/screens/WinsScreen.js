import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { simpleStorage } from '../../SIMPLE_CHECKIN_STORAGE';

const { width } = Dimensions.get('window');

export default function WinsScreen({ navigation }) {
  const { user } = useAuth();
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      generateAchievements();
    }
  }, [user]);

  const generateAchievements = async () => {
    try {
      setLoading(true);
      const checkIns = await simpleStorage.getUserCheckIns(user.id);
      
      if (!checkIns || checkIns.length === 0) {
        setWins([]);
        setLoading(false);
        return;
      }

      const achievements = [];
      
      // Sort check-ins by date (newest first)
      const sortedCheckIns = checkIns.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      // 1. Sobriety Milestones
      const sobrietyAchievements = generateSobrietyAchievements(sortedCheckIns);
      achievements.push(...sobrietyAchievements);
      
      // 2. Motivation Achievements
      const motivationAchievements = generateMotivationAchievements(sortedCheckIns);
      achievements.push(...motivationAchievements);
      
      // 3. Coping Strategy Achievements
      const copingAchievements = generateCopingAchievements(sortedCheckIns);
      achievements.push(...copingAchievements);
      
      // 4. Trigger Management Achievements
      const triggerAchievements = generateTriggerAchievements(sortedCheckIns);
      achievements.push(...triggerAchievements);
      
      // 5. Consistency Achievements
      const consistencyAchievements = generateConsistencyAchievements(sortedCheckIns);
      achievements.push(...consistencyAchievements);

      setWins(achievements);
    } catch (error) {
      console.error('Error generating achievements:', error);
      setWins([]);
    } finally {
      setLoading(false);
    }
  };

  const generateSobrietyAchievements = (checkIns) => {
    const achievements = [];
    let consecutiveSoberDays = 0;
    let currentStreak = 0;
    
    // Count consecutive sober days
    for (let i = 0; i < checkIns.length; i++) {
      const checkIn = checkIns[i];
      const alcoholConsumption = checkIn.alcohol_consumption?.toLowerCase() || '';
      
      if (alcoholConsumption.includes('none') || alcoholConsumption.includes('no') || 
          alcoholConsumption.includes('0') || alcoholConsumption.includes('zero')) {
        consecutiveSoberDays++;
        currentStreak++;
      } else {
        currentStreak = 0;
      }
    }

    // Generate milestone achievements
    if (consecutiveSoberDays >= 7) {
      achievements.push({
        id: 'sober_7_days',
        title: '7 Days Sober',
        description: `Completed ${consecutiveSoberDays} consecutive days of sobriety`,
        date: new Date().toISOString().split('T')[0],
        type: 'milestone',
        icon: 'trophy',
        color: '#fa709a',
      });
    }
    
    if (consecutiveSoberDays >= 30) {
      achievements.push({
        id: 'sober_30_days',
        title: '30 Days Strong',
        description: `Reached one month milestone with ${consecutiveSoberDays} sober days`,
        date: new Date().toISOString().split('T')[0],
        type: 'milestone',
        icon: 'star',
        color: '#4facfe',
      });
    }
    
    if (consecutiveSoberDays >= 100) {
      achievements.push({
        id: 'sober_100_days',
        title: '100 Days Champion',
        description: `Incredible! ${consecutiveSoberDays} days of sobriety`,
        date: new Date().toISOString().split('T')[0],
        type: 'milestone',
        icon: 'diamond',
        color: '#ffd700',
      });
    }

    return achievements;
  };

  const generateMotivationAchievements = (checkIns) => {
    const achievements = [];
    const highMotivationDays = checkIns.filter(checkIn => 
      checkIn.motivation_rating >= 4
    ).length;
    
    const consistentMotivationDays = checkIns.filter(checkIn => 
      checkIn.motivation_rating >= 3
    ).length;

    if (highMotivationDays >= 5) {
      achievements.push({
        id: 'high_motivation',
        title: 'High Motivation',
        description: `Maintained high motivation for ${highMotivationDays} days`,
        date: new Date().toISOString().split('T')[0],
        type: 'achievement',
        icon: 'trending-up',
        color: '#43e97b',
      });
    }

    if (consistentMotivationDays >= 10) {
      achievements.push({
        id: 'consistent_progress',
        title: 'Consistent Progress',
        description: `Stayed motivated for ${consistentMotivationDays} days`,
        date: new Date().toISOString().split('T')[0],
        type: 'achievement',
        icon: 'heart',
        color: '#a8edea',
      });
    }

    return achievements;
  };

  const generateCopingAchievements = (checkIns) => {
    const achievements = [];
    const copingCounts = {};
    
    checkIns.forEach(checkIn => {
      let copingStrategies = [];
      
      if (Array.isArray(checkIn.coping_strategies)) {
        copingStrategies = checkIn.coping_strategies;
      } else if (checkIn.coping_strategies?.selectedOptions) {
        copingStrategies = checkIn.coping_strategies.selectedOptions;
      }
      
      copingStrategies.forEach(strategy => {
        copingCounts[strategy] = (copingCounts[strategy] || 0) + 1;
      });
    });

    if (copingCounts['Exercise'] >= 5) {
      achievements.push({
        id: 'exercise_enthusiast',
        title: 'Exercise Enthusiast',
        description: `Used exercise as coping strategy ${copingCounts['Exercise']} times`,
        date: new Date().toISOString().split('T')[0],
        type: 'achievement',
        icon: 'fitness',
        color: '#ff6b6b',
      });
    }

    if (copingCounts['Meditation'] >= 10) {
      achievements.push({
        id: 'meditation_master',
        title: 'Meditation Master',
        description: `Practiced meditation ${copingCounts['Meditation']} times`,
        date: new Date().toISOString().split('T')[0],
        type: 'achievement',
        icon: 'leaf',
        color: '#4ecdc4',
      });
    }

    if (copingCounts['Called a friend'] >= 3) {
      achievements.push({
        id: 'support_seeker',
        title: 'Support Seeker',
        description: `Reached out for support ${copingCounts['Called a friend']} times`,
        date: new Date().toISOString().split('T')[0],
        type: 'achievement',
        icon: 'call',
        color: '#45b7d1',
      });
    }

    return achievements;
  };

  const generateTriggerAchievements = (checkIns) => {
    const achievements = [];
    const triggerCounts = {};
    
    checkIns.forEach(checkIn => {
      let triggers = [];
      
      if (Array.isArray(checkIn.craving_triggers)) {
        triggers = checkIn.craving_triggers;
      } else if (checkIn.craving_triggers?.selectedOptions) {
        triggers = checkIn.craving_triggers.selectedOptions;
      }
      
      triggers.forEach(trigger => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      });
    });

    if (triggerCounts['Stress'] >= 5) {
      achievements.push({
        id: 'stress_handler',
        title: 'Stress Handler',
        description: `Successfully managed stress triggers ${triggerCounts['Stress']} times`,
        date: new Date().toISOString().split('T')[0],
        type: 'achievement',
        icon: 'shield-checkmark',
        color: '#667eea',
      });
    }

    if (triggerCounts['Social situations'] >= 3) {
      achievements.push({
        id: 'social_butterfly',
        title: 'Social Butterfly',
        description: `Handled social situations without drinking ${triggerCounts['Social situations']} times`,
        date: new Date().toISOString().split('T')[0],
        type: 'achievement',
        icon: 'people',
        color: '#ff9a9e',
      });
    }

    return achievements;
  };

  const generateConsistencyAchievements = (checkIns) => {
    const achievements = [];
    
    // Check for daily check-in consistency
    const checkInStreak = checkIns.length;
    
    if (checkInStreak >= 7) {
      achievements.push({
        id: 'daily_checkin_7',
        title: 'Daily Check-in',
        description: `Completed ${checkInStreak} daily check-ins`,
        date: new Date().toISOString().split('T')[0],
        type: 'achievement',
        icon: 'calendar',
        color: '#a8edea',
      });
    }

    if (checkInStreak >= 30) {
      achievements.push({
        id: 'daily_checkin_30',
        title: 'Monthly Commitment',
        description: `Maintained daily check-ins for ${checkInStreak} days`,
        date: new Date().toISOString().split('T')[0],
        type: 'achievement',
        icon: 'calendar',
        color: '#4facfe',
      });
    }

    return achievements;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const WinCard = ({ win, index }) => (
    <View style={styles.winCard}>
      <LinearGradient
        colors={[win.color, win.color + '80']}
        style={styles.winGradient}
      >
        <View style={styles.winHeader}>
          <View style={styles.winIconContainer}>
            <Ionicons name={win.icon} size={24} color="#ffffff" />
          </View>
          <View style={styles.winInfo}>
            <Text style={styles.winTitle}>{win.title}</Text>
            <Text style={styles.winDate}>{formatDate(win.date)}</Text>
          </View>
          <View style={styles.winType}>
            <Text style={styles.winTypeText}>
              {win.type === 'milestone' ? '🏆' : '⭐'}
            </Text>
          </View>
        </View>
        <Text style={styles.winDescription}>{win.description}</Text>
      </LinearGradient>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Generating your achievements...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.winsSection}>
            <Text style={styles.sectionTitle}>
              {wins.length > 0 ? 'Your Achievements' : 'No Achievements Yet'}
            </Text>
            {wins.length > 0 ? (
              wins.map((win, index) => (
                <WinCard key={win.id} win={win} index={index} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="trophy-outline" size={48} color="#ccc" />
                <Text style={styles.emptyStateTitle}>No Achievements Yet</Text>
                <Text style={styles.emptyStateText}>
                  Complete daily check-ins to start earning achievements!
                </Text>
              </View>
            )}
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
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 25,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  addWinSection: {
    marginBottom: 20,
  },
  addWinButton: {
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  addWinGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 15,
  },
  addWinText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 10,
  },
  winsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  winCard: {
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  winGradient: {
    padding: 20,
    borderRadius: 15,
  },
  winHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  winIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  winInfo: {
    flex: 1,
  },
  winTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  winDate: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
  },
  winType: {
    alignItems: 'center',
  },
  winTypeText: {
    fontSize: 20,
  },
  winDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 20,
  },
  encouragementSection: {
    marginBottom: 30,
  },
  encouragementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  encouragementIcon: {
    marginBottom: 10,
  },
  encouragementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  encouragementText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#667eea',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
}); 