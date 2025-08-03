import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { simpleStorage } from '../../SIMPLE_CHECKIN_STORAGE';

export default function CheckInScreen({ navigation }) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    emotionalState: '',
    alcoholConsumption: '',
    cravingTriggers: { selectedOptions: [], additionalText: '' },
    copingStrategies: { selectedOptions: [], additionalText: '' },
    proudOf: '',
    motivationRating: 5,
    supportNeed: '',
  });

  const questions = [
    {
      id: 'emotionalState',
      title: 'How are you feeling today?',
      subtitle: 'Be honest about your emotional state',
      type: 'text',
      placeholder: 'e.g., stressed, happy, anxious, calm...',
    },
    {
      id: 'alcoholConsumption',
      title: 'Did you consume alcohol today?',
      subtitle: 'Be completely honest - no judgment',
      type: 'text',
      placeholder: 'e.g., none, 2 beers, 1 glass of wine...',
    },
    {
      id: 'cravingTriggers',
      title: 'What triggered cravings today?',
      subtitle: 'Identify what made you want to drink',
      type: 'multiSelectWithText',
      options: ['Stress', 'Social situations', 'Boredom', 'Celebration', 'Sadness', 'Work pressure', 'None'],
      textPlaceholder: 'Add any other triggers...',
    },
    {
      id: 'copingStrategies',
      title: 'What coping strategies did you use?',
      subtitle: 'What helped you stay sober?',
      type: 'multiSelectWithText',
      options: ['Exercise', 'Meditation', 'Called a friend', 'Deep breathing', 'Distraction', 'Therapy', 'None'],
      textPlaceholder: 'Add any other coping strategies...',
    },
    {
      id: 'proudOf',
      title: 'What are you proud of today?',
      subtitle: 'Celebrate your wins, no matter how small',
      type: 'text',
      placeholder: 'e.g., stayed sober, helped someone, exercised...',
    },
    {
      id: 'motivationRating',
      title: 'Rate your motivation to stay sober',
      subtitle: '1 = very low, 5 = very high',
      type: 'rating',
      min: 1,
      max: 5,
    },
    {
      id: 'supportNeed',
      title: 'What support do you need?',
      subtitle: 'Be specific about what would help',
      type: 'text',
      placeholder: 'e.g., call sponsor, attend meeting, therapy...',
    },
  ];

  const handleMultiSelect = (questionId, value) => {
    setFormData(prev => {
      const currentValues = prev[questionId] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [questionId]: newValues };
    });
  };

  const handleMultiSelectWithText = (questionId, option, additionalText) => {
    setFormData(prev => {
      const currentValue = prev[questionId] || { selectedOptions: [], additionalText: '' };
      
      if (option !== null) {
        // Handle option selection/deselection
        const newSelectedOptions = currentValue.selectedOptions.includes(option)
          ? currentValue.selectedOptions.filter(item => item !== option)
          : [...currentValue.selectedOptions, option];
        
        return { 
          ...prev, 
          [questionId]: {
            ...currentValue,
            selectedOptions: newSelectedOptions
          }
        };
      } else if (additionalText !== undefined) {
        // Handle additional text input
        return { 
          ...prev, 
          [questionId]: {
            ...currentValue,
            additionalText: additionalText
          }
        };
      }
      
      return prev;
    });
  };

  const handleRatingChange = (value) => {
    setFormData(prev => ({ ...prev, motivationRating: value }));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'Please sign in to save your check-in');
      return;
    }

    setLoading(true);
    try {
      const result = await simpleStorage.saveCheckIn({
        userId: user.id,
        ...formData,
      });

      if (result.success) {
        Alert.alert(
          'Success!',
          'Your check-in has been saved and AI coach advice generated!',
          [
            {
              text: 'View Summary',
              onPress: () => navigation.navigate('MySummaries'),
            },
            {
              text: 'Continue',
              style: 'cancel',
            },
          ]
        );
        // Reset form
        setFormData({
          emotionalState: '',
          alcoholConsumption: '',
          cravingTriggers: { selectedOptions: [], additionalText: '' },
          copingStrategies: { selectedOptions: [], additionalText: '' },
          proudOf: '',
          motivationRating: 5,
          supportNeed: '',
        });
        setCurrentStep(0);
      } else {
        Alert.alert('Error', result.message || 'Failed to save check-in');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question) => {
    const value = formData[question.id];

    switch (question.type) {
      case 'text':
        return (
          <TextInput
            style={styles.textInput}
            placeholder={question.placeholder}
            placeholderTextColor="#8e8e93"
            value={value}
            onChangeText={(text) => setFormData(prev => ({ ...prev, [question.id]: text }))}
            multiline
            numberOfLines={3}
          />
        );

      case 'multiSelect':
        return (
          <View style={styles.optionsContainer}>
            {question.options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  value?.includes(option) && styles.optionButtonSelected,
                ]}
                onPress={() => handleMultiSelect(question.id, option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    value?.includes(option) && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'multiSelectWithText':
        return (
          <View style={styles.optionsContainer}>
            {question.options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  value?.selectedOptions?.includes(option) && styles.optionButtonSelected,
                ]}
                onPress={() => handleMultiSelectWithText(question.id, option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    value?.selectedOptions?.includes(option) && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={[styles.textInput, styles.additionalTextInput]}
              placeholder={question.textPlaceholder}
              placeholderTextColor="#8e8e93"
              value={value?.additionalText || ''}
              onChangeText={(text) => handleMultiSelectWithText(question.id, null, text)}
              multiline
              numberOfLines={2}
            />
          </View>
        );

      case 'rating':
        return (
          <View style={styles.ratingContainer}>
            {Array.from({ length: question.max }, (_, i) => i + 1).map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[
                  styles.ratingButton,
                  value >= rating && styles.ratingButtonSelected,
                ]}
                onPress={() => handleRatingChange(rating)}
              >
                <Text
                  style={[
                    styles.ratingText,
                    value >= rating && styles.ratingTextSelected,
                  ]}
                >
                  {rating}
                </Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.ratingLabel}>
              {value}/5
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    const currentQuestion = questions[currentStep];
    const value = formData[currentQuestion.id];
    
    if (currentQuestion.type === 'multiSelect') {
      return value && value.length > 0;
    }
    if (currentQuestion.type === 'multiSelectWithText') {
      return value && (value.selectedOptions?.length > 0 || (value.additionalText && value.additionalText.trim() !== ''));
    }
    return value && value.toString().trim() !== '';
  };

  const canSubmit = () => {
    return questions.every(question => {
      const value = formData[question.id];
      if (question.type === 'multiSelect') {
        return value && value.length > 0;
      }
      if (question.type === 'multiSelectWithText') {
        return value && (value.selectedOptions?.length > 0 || (value.additionalText && value.additionalText.trim() !== ''));
      }
      return value && value.toString().trim() !== '';
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Saving your check-in...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Check-in</Text>
          <Text style={styles.headerSubtitle}>
            Question {currentStep + 1} of {questions.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentStep + 1) / questions.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Question */}
        {questions[currentStep] && (
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>
              {questions[currentStep].title}
            </Text>
            <Text style={styles.questionSubtitle}>
              {questions[currentStep].subtitle}
            </Text>
            {renderQuestion(questions[currentStep])}
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Ionicons name="arrow-back" size={20} color="#667eea" />
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
          )}

          {currentStep < questions.length - 1 ? (
            <TouchableOpacity
              style={[styles.navButton, !canProceed() && styles.navButtonDisabled]}
              onPress={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
            >
              <Text style={styles.navButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="#667eea" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitButton, !canSubmit() && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit()}
            >
              <Text style={styles.submitButtonText}>Submit Check-in</Text>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  questionContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  questionSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  additionalTextInput: {
    marginTop: 16,
    minHeight: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  optionButtonSelected: {
    backgroundColor: '#fff',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  optionTextSelected: {
    color: '#667eea',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ratingButtonSelected: {
    backgroundColor: '#fff',
  },
  ratingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingTextSelected: {
    color: '#667eea',
  },
  ratingLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#51cf66',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 