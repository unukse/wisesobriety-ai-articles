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
  Alert,
  PanResponder,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';


const { width } = Dimensions.get('window');

export default function MeditationScreen({ navigation }) {
  const [selectedSession, setSelectedSession] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('beginner');
  const [sound, setSound] = useState(null);

  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAudioPlayerModal, setShowAudioPlayerModal] = useState(false);

  const [isSeeking, setIsSeeking] = useState(false);
  const [sessionDurations, setSessionDurations] = useState({});
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  // Dragging sensitivity - adjust this value to change dragging intensity
  // Higher values = more sensitive (smaller movements = bigger jumps)
  // Lower values = less sensitive (larger movements = smaller jumps)
  const DRAG_SENSITIVITY = 3.0; // You can adjust this: 0.5 = less sensitive, 2.0 = more sensitive

  // PanResponder for dragging the progress thumb
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt, gestureState) => {
      setIsSeeking(true);
      // Store the initial position for relative movement
      panResponder.initialX = gestureState.x0;
      panResponder.initialPercentage = currentPosition / duration;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (progressBarWidth && sound) {
        // Calculate relative movement from the start position
        const deltaX = gestureState.moveX - panResponder.initialX;
        const deltaPercentage = (deltaX / progressBarWidth) * DRAG_SENSITIVITY;
        const newPercentage = Math.max(0, Math.min(1, panResponder.initialPercentage + deltaPercentage));
        const seekTime = newPercentage * duration;
        setCurrentPosition(seekTime);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (progressBarWidth && sound) {
        // Calculate final position using relative movement
        const deltaX = gestureState.moveX - panResponder.initialX;
        const deltaPercentage = (deltaX / progressBarWidth) * DRAG_SENSITIVITY;
        const newPercentage = Math.max(0, Math.min(1, panResponder.initialPercentage + deltaPercentage));
        const seekTime = newPercentage * duration;
        sound.setPositionAsync(seekTime * 1000);
        setCurrentPosition(seekTime);
      }
      setIsSeeking(false);
    },
  });

  const meditationSessions = [
    {
      id: 1,
      title: 'Morning Calm',
      duration: '10:44',
      description: 'Start your day with peace and clarity',
      category: 'advanced', // 10:44 = advanced (10+ min)
      icon: 'sunny',
      color: '#fa709a',
      audioFileName: 'morning-calm.mp3',
      
      bundledAudio: require('../../assets/audio/morning-calm.mp3'),
    },
    {
      id: 2,
      title: 'Stress Relief',
      duration: '4:30',
      description: 'Release tension and find inner peace',
      category: 'beginner', // 4:30 = beginner (1-4:59 min)
      icon: 'leaf',
      color: '#43e97b',
      audioFileName: 'stress-relief.mp3',
      
      bundledAudio: require('../../assets/audio/stress-relief.mp3'),
    },
    {
      id: 3,
      title: 'Deep Breathing',
      duration: '6:21',
      description: 'Simple breathing exercise for instant calm',
      category: 'intermediate', // 6:21 = intermediate (5-9 min)
      icon: 'airplane',
      color: '#4facfe',
      audioFileName: 'deep-breathing.mp3',
      
      bundledAudio: require('../../assets/audio/deep-breathing.mp3'),
    },
    {
      id: 4,
      title: 'Recovery Focus',
      duration: '7:32',
      description: 'Meditation specifically for recovery journey',
      category: 'intermediate', // 7:32 = intermediate (5-9 min)
      icon: 'heart',
      color: '#a8edea',
      audioFileName: 'recovery-focus.mp3',
      
      bundledAudio: require('../../assets/audio/recovery-focus.mp3'),
    },
    {
      id: 5,
      title: 'Sleep Well',
      duration: '15:41',
      description: 'Gentle meditation for better sleep',
      category: 'advanced', // 15:41 = advanced (10+ min)
      icon: 'moon',
      color: '#764ba2',
      audioFileName: 'sleep-well.mp3',
      
      bundledAudio: require('../../assets/audio/sleep-well.mp3'),
    },
    {
      id: 6,
      title: 'Gratitude Practice',
      duration: '11:02',
      description: 'Cultivate gratitude and positive mindset',
      category: 'advanced', // 11:02 = advanced (10+ min)
      icon: 'star',
      color: '#f093fb',
      audioFileName: 'gratitude-practice.mp3',
      
      bundledAudio: require('../../assets/audio/gratitude-practice.mp3'),
    },
    {
      id: 7,
      title: 'Happy Place',
      duration: '8:48',
      description: 'Visualize your perfect happy place for inner peace',
      category: 'intermediate', // 8:48 = intermediate (5-9 min)
      icon: 'happy',
      color: '#ffd89b',
      audioFileName: 'happy-place.mp3',
      
      bundledAudio: require('../../assets/audio/happy-place.mp3'),
    },
    {
      id: 8,
      title: 'Present Moment',
      duration: '4:32',
      description: 'Stay grounded in the here and now',
      category: 'beginner', // 4:32 = beginner (1-4:59 min)
      icon: 'time',
      color: '#a8caba',
      audioFileName: 'present-moment.mp3',
      
      bundledAudio: require('../../assets/audio/present-moment.mp3'),
    },
    {
      id: 9,
      title: 'Self Love',
      duration: '7:00',
      description: 'Cultivate compassion and love for yourself',
      category: 'intermediate', // 7:00 = intermediate (5-9 min)
      icon: 'heart-circle',
      color: '#ff9a9e',
      audioFileName: 'self-love.mp3',
      
      bundledAudio: require('../../assets/audio/self-love.mp3'),
    },
    {
      id: 10,
      title: 'Mindful Moments',
      duration: '9:00',
      description: 'Practice mindfulness in everyday moments',
      category: 'intermediate', // 9:00 = intermediate (5-9 min)
      icon: 'leaf-outline',
      color: '#a8e6cf',
      audioFileName: 'mindful-moments.mp3',
      
      bundledAudio: require('../../assets/audio/mindful-moments.mp3'),
    },
    {
      id: 11,
      title: 'Practice Acceptance',
      duration: '6:06',
      description: 'Learn to accept what is and find peace',
      category: 'intermediate', // 6:06 = intermediate (5-9 min)
      icon: 'checkmark-circle',
      color: '#d4a5a5',
      audioFileName: 'practice-acceptance.mp3',
      
      bundledAudio: require('../../assets/audio/practice-acceptance.mp3'),
    },
    {
      id: 12,
      title: 'Slow Down',
      duration: '0:00', // Will be automatically determined by the app
      description: 'Take a moment to slow down and find your center',
      category: 'intermediate', // Will be updated based on actual duration
      icon: 'pause-circle',
      color: '#667eea',
      audioFileName: 'slow-down.mp3',
      
      bundledAudio: require('../../assets/audio/slow-down.mp3'),
    },
    {
      id: 13,
      title: 'Belly Breathing',
      duration: '8:12',
      description: 'Learn deep belly breathing for relaxation and focus',
      category: 'intermediate', // 8:12 = intermediate (5-9 min)
      icon: 'lungs',
      color: '#74b9ff',
      audioFileName: 'belly-breathing.mp3',
      
      bundledAudio: require('../../assets/audio/belly-breathing.mp3'),
    },
    {
      id: 14,
      title: 'Inner Stillness',
      duration: '0:00', // Will be automatically determined by the app
      description: 'Find deep inner stillness and peace within',
      category: 'intermediate', // Likely a medium-length meditation
      icon: 'moon-outline',
      color: '#6c5ce7',
      audioFileName: 'inner-stillness.mp3',
      
      bundledAudio: require('../../assets/audio/inner-stillness.mp3'),
    },
  ];

  // Function to get audio duration
  const getAudioDuration = async (audioFile) => {
    try {
      const { sound } = await Audio.Sound.createAsync(audioFile, { shouldPlay: false });
      const status = await sound.getStatusAsync();
      await sound.unloadAsync();
      
      if (status.isLoaded) {
        const durationInSeconds = status.durationMillis / 1000;
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = Math.floor(durationInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
      return '0:00';
    } catch (error) {
      console.error('Error getting audio duration:', error);
      return '0:00';
    }
  };

  // Load audio durations on component mount
  useEffect(() => {
    const loadAudioDurations = async () => {
      const durations = {};
      
      for (const session of meditationSessions) {
        const duration = await getAudioDuration(session.bundledAudio);
        durations[session.id] = duration;
      }
      
      setSessionDurations(durations);
    };

    loadAudioDurations();
  }, []);

  // Cleanup sound on unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);



  const handleSessionSelect = async (session) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedSession(session);
    
    // Stop any currently playing audio
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    setSound(null);
    setIsPlaying(false);
    
    // Automatically show the audio player modal when a session is selected
    setShowAudioPlayerModal(true);
  };

  const handlePlayPause = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!selectedSession) return;

    try {
      if (isPlaying) {
        // Pause audio
        await sound?.pauseAsync();
        setIsPlaying(false);
      } else {
        // Play audio
        if (sound) {
          await sound.playAsync();
        } else {
          // Use bundled audio file
          const { sound: newSound } = await Audio.Sound.createAsync(
            selectedSession.bundledAudio,
            { shouldPlay: true }
          );
          setSound(newSound);
          await setupAudioMonitoring(newSound);
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio file. Please try again.');
    }
  };

  const setupAudioMonitoring = async (audioSound) => {
    try {
      const status = await audioSound.getStatusAsync();
      setDuration(status.durationMillis / 1000);
      
      // Set up position monitoring
      audioSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          const currentPos = status.positionMillis / 1000;
          setCurrentPosition(currentPos);
        }
      });
    } catch (error) {
      console.error('Error setting up audio monitoring:', error);
    }
  };





  const handleSeek = async (locationX) => {
    if (!sound || !progressBarWidth) return;
    
    const percentage = locationX / progressBarWidth;
    const seekTime = percentage * duration;
    
    try {
      await sound.setPositionAsync(seekTime * 1000);
      setCurrentPosition(seekTime);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };



  const handleFilterChange = (filter) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFilter(filter);
  };

  const filteredSessions = meditationSessions.filter(session => session.category === selectedFilter);

  const SessionCard = ({ session, isSelected }) => {
    // Use actual duration if available, otherwise fall back to hardcoded duration
    const displayDuration = sessionDurations[session.id] || session.duration;
    
    return (
      <TouchableOpacity
        style={[
          styles.sessionCard,
          isSelected && styles.sessionCardSelected,
        ]}
        onPress={() => handleSessionSelect(session)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isSelected ? [session.color, session.color] : ['#ffffff', '#f8f9fa']}
          style={styles.sessionGradient}
        >
          <View style={styles.sessionHeader}>
            <View style={styles.sessionIconContainer}>
              <Ionicons name={session.icon} size={24} color={isSelected ? '#ffffff' : session.color} />
            </View>
            <View style={styles.sessionInfo}>
              <Text style={[
                styles.sessionTitle,
                isSelected && styles.sessionTitleSelected
              ]}>
                {session.title}
              </Text>
              <Text style={[
                styles.sessionDuration,
                isSelected && styles.sessionDurationSelected
              ]}>
                {displayDuration}
              </Text>
            </View>
            <View style={styles.sessionCategory}>
              <Text style={[
                styles.categoryText,
                isSelected && styles.categoryTextSelected
              ]}>
                {session.category}
              </Text>
            </View>
          </View>
          <Text style={[
            styles.sessionDescription,
            isSelected && styles.sessionDescriptionSelected
          ]}>
            {session.description}
          </Text>
          
        </LinearGradient>
      </TouchableOpacity>
    );
  };

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
          

                       {/* Audio Player Modal */}
            <Modal
              visible={showAudioPlayerModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowAudioPlayerModal(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <LinearGradient
                    colors={[selectedSession?.color || '#667eea', selectedSession?.color + '80' || '#764ba2']}
                    style={styles.modalGradient}
                  >
                    {/* Header */}
                    <View style={styles.modalHeader}>
                      <View style={styles.modalHeaderInfo}>
                        <Ionicons name={selectedSession?.icon} size={32} color="#ffffff" />
                        <View style={styles.modalHeaderText}>
                          <Text style={styles.modalTitle}>{selectedSession?.title}</Text>
                          <Text style={styles.modalSubtitle}>
                            {sessionDurations[selectedSession?.id] || selectedSession?.duration}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => setShowAudioPlayerModal(false)}
                        style={styles.modalCloseButton}
                      >
                        <Ionicons name="close" size={24} color="#ffffff" />
                      </TouchableOpacity>
                    </View>

                    {/* Audio Controls */}
                    <View style={styles.modalAudioControls}>
                      <TouchableOpacity
                        style={styles.modalPlayButton}
                        onPress={handlePlayPause}
                        activeOpacity={0.8}
                      >
                        <Ionicons 
                          name={isPlaying ? 'pause' : 'play'} 
                          size={40} 
                          color="#ffffff" 
                        />
                      </TouchableOpacity>

                      <View style={styles.modalTimeDisplay}>
                        <Text style={styles.modalTimeText}>{formatTime(currentPosition)}</Text>
                        <Text style={styles.modalTimeText}>{formatTime(duration)}</Text>
                      </View>

                                             <View style={styles.modalProgressContainer}>
                         <TouchableOpacity
                           style={styles.modalProgressTrack}
                           onLayout={(event) => {
                             const { width } = event.nativeEvent.layout;
                             setProgressBarWidth(width);
                           }}
                           onPress={(event) => {
                             const { locationX } = event.nativeEvent;
                             handleSeek(locationX);
                           }}
                           activeOpacity={1}
                         >
                           <View 
                             style={[
                               styles.modalProgressFill, 
                               { width: `${(currentPosition / duration) * 100}%` }
                             ]} 
                           />
                         </TouchableOpacity>
                         <View
                           style={[
                             styles.modalProgressThumb,
                             { left: `${(currentPosition / duration) * 100}%` }
                           ]}
                           {...panResponder.panHandlers}
                         />
                       </View>

                      
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </Modal>

           <View style={styles.sessionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Guided Sessions</Text>
            </View>
            
            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedFilter === 'beginner' && styles.filterButtonActive
                ]}
                onPress={() => handleFilterChange('beginner')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === 'beginner' && styles.filterButtonTextActive
                ]}>
                  Beginner
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedFilter === 'intermediate' && styles.filterButtonActive
                ]}
                onPress={() => handleFilterChange('intermediate')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === 'intermediate' && styles.filterButtonTextActive
                ]}>
                  Intermediate
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  selectedFilter === 'advanced' && styles.filterButtonActive
                ]}
                onPress={() => handleFilterChange('advanced')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === 'advanced' && styles.filterButtonTextActive
                ]}>
                  Advanced
                </Text>
              </TouchableOpacity>
            </View>
            
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isSelected={selectedSession?.id === session.id}
              />
            ))}
          </View>

          <View style={styles.tipsSection}>
            <View style={styles.tipsCard}>
              <Ionicons name="bulb" size={24} color="#667eea" style={styles.tipsIcon} />
              <Text style={styles.tipsTitle}>Meditation Tips</Text>
              <Text style={styles.tipsText}>
                Find a quiet space, sit comfortably, and focus on your breath. 
                Don't worry about clearing your mind completely - just observe your thoughts 
                without judgment and gently return to your breath.
              </Text>
            </View>
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
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  
  sessionsSection: {
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterButtonActive: {
    backgroundColor: '#ffffff',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  filterButtonTextActive: {
    color: '#667eea',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  sessionCard: {
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  sessionCardSelected: {
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  sessionCardDisabled: {
    opacity: 0.6,
  },
  sessionGradient: {
    padding: 20,
    borderRadius: 15,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sessionTitleSelected: {
    color: '#ffffff',
  },
  sessionDuration: {
    fontSize: 12,
    color: '#8e8e93',
  },
  sessionDurationSelected: {
    color: '#ffffff',
    opacity: 0.8,
  },
  sessionCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 10,
    color: '#667eea',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  categoryTextSelected: {
    color: '#ffffff',
  },
  sessionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sessionDescriptionSelected: {
    color: '#ffffff',
    opacity: 0.9,
  },
  audioMissingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  audioMissingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#ff6b6b',
    fontWeight: '600',
  },
  tipsSection: {
    marginBottom: 30,
  },
  tipsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  tipsIcon: {
    marginBottom: 10,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  
   
   
       // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      maxWidth: 400,
      borderRadius: 25,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 20,
    },
    modalGradient: {
      padding: 30,
      minHeight: 400,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 40,
    },
    modalHeaderInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    modalHeaderText: {
      marginLeft: 15,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#ffffff',
      marginBottom: 4,
    },
    modalSubtitle: {
      fontSize: 16,
      color: '#ffffff',
      opacity: 0.9,
    },
    modalCloseButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalAudioControls: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    modalPlayButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    modalTimeDisplay: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
    },
    modalTimeText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#ffffff',
    },
    modalProgressContainer: {
      width: '100%',
      position: 'relative',
      marginBottom: 30,
    },
    modalProgressTrack: {
      height: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 3,
      position: 'relative',
    },
    modalProgressFill: {
      height: 6,
      backgroundColor: '#ffffff',
      borderRadius: 3,
      position: 'absolute',
      left: 0,
      top: 0,
    },
    modalProgressThumb: {
      width: 20,
      height: 20,
      backgroundColor: '#ffffff',
      borderRadius: 10,
      position: 'absolute',
      top: -7,
      marginLeft: -10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    
}); 