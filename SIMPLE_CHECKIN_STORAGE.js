// SIMPLE_CHECKIN_STORAGE.js
// A simple, reliable alternative to Supabase for storing check-ins and generating AI summaries

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Simple storage key
const CHECKINS_STORAGE_KEY = 'wise_sobriety_checkins';

// OpenAI API configuration
const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

class SimpleCheckInStorage {
  // Save a new check-in
  async saveCheckIn(checkInData) {
    try {
      console.log('=== SAVING CHECK-IN (SIMPLE STORAGE) ===');
      console.log('Check-in data:', checkInData);

      // Get existing check-ins
      const existingData = await AsyncStorage.getItem(CHECKINS_STORAGE_KEY);
      const checkIns = existingData ? JSON.parse(existingData) : [];

      // Create new check-in with timestamp
      const newCheckIn = {
        id: Date.now().toString(), // Simple ID
        user_id: checkInData.userId || 'default-user',
        emotional_state: checkInData.emotionalState,
        alcohol_consumption: checkInData.alcoholConsumption,
        craving_triggers: checkInData.cravingTriggers || [],
        coping_strategies: checkInData.copingStrategies || [],
        proud_of: checkInData.proudOf,
        motivation_rating: checkInData.motivationRating,
        support_need: checkInData.supportNeed,
        ai_summary: null, // Will be generated next
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Add to array
      checkIns.push(newCheckIn);

      // Save back to AsyncStorage
      await AsyncStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(checkIns));

      console.log('✅ Check-in saved successfully!');
      console.log('New check-in:', newCheckIn);
      console.log('Total check-ins:', checkIns.length);

      // Generate AI summary
      const summary = await this.generateAISummary(newCheckIn);
      
      // Update with summary - find the check-in in the array and update it
      const checkInIndex = checkIns.findIndex(checkIn => checkIn.id === newCheckIn.id);
      if (checkInIndex !== -1) {
        checkIns[checkInIndex].ai_summary = summary;
        await AsyncStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(checkIns));
        console.log('✅ AI Summary saved to check-in:', checkIns[checkInIndex]);
      } else {
        console.error('❌ Could not find check-in to update with summary');
      }

      console.log('✅ AI Summary generated:', summary);

      return {
        success: true,
        data: newCheckIn,
        message: 'Check-in saved and AI summary generated successfully!'
      };

    } catch (error) {
      console.error('❌ Error saving check-in:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to save check-in'
      };
    }
  }

  // Generate AI summary using OpenAI API directly
  async generateAISummary(checkIn) {
    try {
      console.log('=== GENERATING AI SUMMARY ===');
      console.log('Check-in data for AI:', checkIn);

      // Format craving triggers (handle both old array format and new object format)
      let cravingTriggersText = '';
      if (Array.isArray(checkIn.craving_triggers)) {
        // Old format - simple array
        cravingTriggersText = checkIn.craving_triggers.join(', ');
      } else if (checkIn.craving_triggers && typeof checkIn.craving_triggers === 'object') {
        // New format - object with selectedOptions and additionalText
        const selected = checkIn.craving_triggers.selectedOptions || [];
        const additional = checkIn.craving_triggers.additionalText || '';
        const parts = [...selected];
        if (additional.trim()) {
          parts.push(additional);
        }
        cravingTriggersText = parts.join(', ');
      }

      // Format coping strategies (handle both old array format and new object format)
      let copingStrategiesText = '';
      if (Array.isArray(checkIn.coping_strategies)) {
        // Old format - simple array
        copingStrategiesText = checkIn.coping_strategies.join(', ');
      } else if (checkIn.coping_strategies && typeof checkIn.coping_strategies === 'object') {
        // New format - object with selectedOptions and additionalText
        const selected = checkIn.coping_strategies.selectedOptions || [];
        const additional = checkIn.coping_strategies.additionalText || '';
        const parts = [...selected];
        if (additional.trim()) {
          parts.push(additional);
        }
        copingStrategiesText = parts.join(', ');
      }

      const prompt = `You are an expert sobriety coach with deep knowledge of recovery psychology. Based on this daily check-in, provide highly specific, actionable advice with concrete steps (4-5 sentences):

Emotional State: ${checkIn.emotional_state}
Alcohol Consumption: ${checkIn.alcohol_consumption}
Craving Triggers: ${cravingTriggersText}
Coping Strategies: ${copingStrategiesText}
Proud Of: ${checkIn.proud_of}
Motivation Rating: ${checkIn.motivation_rating}/5
Support Need: ${checkIn.support_need}

Provide detailed, step-by-step guidance like a personal coach would:

1. **Acknowledge Progress**: Specifically mention what they're doing well based on their answers
2. **Address Triggers**: Give 2-3 specific, practical strategies for their specific triggers
3. **Enhance Coping**: Suggest 1-2 new coping techniques they haven't tried yet
4. **Support Strategy**: Provide concrete steps for their support needs (e.g., "Call your sponsor at 3pm", "Join the 7pm online meeting")
5. **Motivation Boost**: Give specific encouragement based on their motivation level
6. **Next Steps**: Suggest 1-2 specific actions they can take today/tomorrow

Be warm, supportive, and give them exact tools and steps they can implement immediately. Make it feel like having a personal coach who knows them well and gives them specific, actionable guidance.`;

      console.log('Sending request to OpenAI...');
      
      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert sobriety coach with deep knowledge of recovery psychology and addiction science. You provide highly specific, actionable guidance with concrete steps that users can implement immediately. You give detailed strategies, specific time-based suggestions, and practical tools. You acknowledge progress with specific examples, address triggers with multiple coping options, suggest new techniques, provide exact support steps, boost motivation with specific encouragement, and give clear next actions. Your advice should feel like having a personal coach who knows them well and gives them specific, implementable guidance.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 350,
          temperature: 0.7
        })
      });

      console.log('OpenAI response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error response:', errorText);
        throw new Error(`OpenAI API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('OpenAI response data:', data);
      
      if (data.error) {
        console.error('OpenAI API error:', data.error);
        throw new Error(`OpenAI API Error: ${data.error.message}`);
      }

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Unexpected OpenAI response format:', data);
        throw new Error('Unexpected response format from OpenAI API');
      }

      const summary = data.choices[0].message.content.trim();
      console.log('✅ AI Summary generated successfully:', summary);
      
      return summary;

    } catch (error) {
      console.error('❌ Error generating AI summary:', error);
      console.error('Error details:', error.message);
      return 'Unable to generate AI summary at this time. Please try again later.';
    }
  }

  // Get check-ins with storage management
  async getAllCheckIns() {
    try {
      const data = await AsyncStorage.getItem(CHECKINS_STORAGE_KEY);
      const checkIns = data ? JSON.parse(data) : [];
      
      // Sort by date (newest first)
      checkIns.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      return checkIns;
    } catch (error) {
      console.error('❌ Error getting check-ins:', error);
      return [];
    }
  }

  // Get recent check-ins (last 2 years)
  async getRecentCheckIns() {
    try {
      const allCheckIns = await this.getAllCheckIns();
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      
      return allCheckIns.filter(checkIn => 
        new Date(checkIn.created_at) > twoYearsAgo
      );
    } catch (error) {
      console.error('❌ Error getting recent check-ins:', error);
      return [];
    }
  }

  // Get archived check-ins (older than 2 years)
  async getArchivedCheckIns() {
    try {
      const allCheckIns = await this.getAllCheckIns();
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      
      return allCheckIns.filter(checkIn => 
        new Date(checkIn.created_at) <= twoYearsAgo
      );
    } catch (error) {
      console.error('❌ Error getting archived check-ins:', error);
      return [];
    }
  }

  // Get storage statistics
  async getStorageStats() {
    try {
      const allCheckIns = await this.getAllCheckIns();
      const recentCheckIns = await this.getRecentCheckIns();
      const archivedCheckIns = await this.getArchivedCheckIns();
      
      const totalSize = JSON.stringify(allCheckIns).length;
      const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);
      
      return {
        totalCheckIns: allCheckIns.length,
        recentCheckIns: recentCheckIns.length,
        archivedCheckIns: archivedCheckIns.length,
        totalSizeMB: sizeInMB,
        oldestCheckIn: allCheckIns.length > 0 ? allCheckIns[allCheckIns.length - 1].created_at : null,
        newestCheckIn: allCheckIns.length > 0 ? allCheckIns[0].created_at : null
      };
    } catch (error) {
      console.error('❌ Error getting storage stats:', error);
      return {
        totalCheckIns: 0,
        recentCheckIns: 0,
        archivedCheckIns: 0,
        totalSizeMB: '0.00',
        oldestCheckIn: null,
        newestCheckIn: null
      };
    }
  }

  // Export all data (for backup)
  async exportAllData() {
    try {
      const allCheckIns = await this.getAllCheckIns();
      const stats = await this.getStorageStats();
      
      return {
        checkIns: allCheckIns,
        stats: stats,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('❌ Error exporting data:', error);
      return null;
    }
  }

  // Import data (for restore)
  async importData(importData) {
    try {
      if (!importData || !importData.checkIns) {
        throw new Error('Invalid import data format');
      }
      
      // Merge with existing data, avoiding duplicates
      const existingData = await AsyncStorage.getItem(CHECKINS_STORAGE_KEY);
      const existingCheckIns = existingData ? JSON.parse(existingData) : [];
      
      const existingIds = new Set(existingCheckIns.map(checkIn => checkIn.id));
      const newCheckIns = importData.checkIns.filter(checkIn => !existingIds.has(checkIn.id));
      
      const mergedCheckIns = [...existingCheckIns, ...newCheckIns];
      
      await AsyncStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(mergedCheckIns));
      
      console.log(`✅ Imported ${newCheckIns.length} new check-ins`);
      return { success: true, importedCount: newCheckIns.length };
    } catch (error) {
      console.error('❌ Error importing data:', error);
      return { success: false, error: error.message };
    }
  }

  // Get check-ins for a specific user
  async getUserCheckIns(userId) {
    try {
      const allCheckIns = await this.getAllCheckIns();
      return allCheckIns.filter(checkIn => checkIn.user_id === userId);
    } catch (error) {
      console.error('❌ Error getting user check-ins:', error);
      return [];
    }
  }

  // Delete a check-in
  async deleteCheckIn(checkInId) {
    try {
      const checkIns = await this.getAllCheckIns();
      const filteredCheckIns = checkIns.filter(checkIn => checkIn.id !== checkInId);
      await AsyncStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(filteredCheckIns));
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting check-in:', error);
      return { success: false, error: error.message };
    }
  }

  // Clear all data (for testing)
  async clearAllData() {
    try {
      await AsyncStorage.removeItem(CHECKINS_STORAGE_KEY);
      console.log('✅ All data cleared');
      return { success: true };
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      return { success: false, error: error.message };
    }
  }

  // Test the storage system
  async testStorage() {
    try {
      console.log('=== TESTING SIMPLE STORAGE ===');
      
      // Test save
      const testData = {
        userId: 'test-user',
        emotionalState: 'Great',
        alcoholConsumption: 'No',
        cravingTriggers: ['Stress'],
        copingStrategies: ['Meditation'],
        proudOf: 'Staying sober',
        motivationRating: 8,
        supportNeed: 'More sleep'
      };

      const result = await this.saveCheckIn(testData);
      console.log('Test result:', result);

      // Test get
      const allCheckIns = await this.getAllCheckIns();
      console.log('All check-ins:', allCheckIns);

      return {
        success: true,
        message: 'Simple storage test completed successfully!',
        checkInsCount: allCheckIns.length
      };

    } catch (error) {
      console.error('❌ Test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Regenerate AI summaries for check-ins that don't have them
  async regenerateMissingSummaries() {
    try {
      console.log('=== REGENERATING MISSING SUMMARIES ===');
      const allCheckIns = await this.getAllCheckIns();
      let updatedCount = 0;
      
      for (let i = 0; i < allCheckIns.length; i++) {
        const checkIn = allCheckIns[i];
        if (!checkIn.ai_summary || checkIn.ai_summary === 'Unable to generate AI summary at this time. Please try again later.') {
          console.log(`Regenerating summary for check-in ${checkIn.id}...`);
          const summary = await this.generateAISummary(checkIn);
          allCheckIns[i].ai_summary = summary;
          updatedCount++;
        }
      }
      
      if (updatedCount > 0) {
        await AsyncStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(allCheckIns));
        console.log(`✅ Regenerated ${updatedCount} AI summaries`);
      } else {
        console.log('✅ All check-ins already have AI summaries');
      }
      
      return { success: true, updatedCount };
    } catch (error) {
      console.error('❌ Error regenerating summaries:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const simpleStorage = new SimpleCheckInStorage(); 