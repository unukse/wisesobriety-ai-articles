import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import audioManager from '../utils/audioManager';

export default function AudioImportScreen({ navigation }) {
  const [importedFiles, setImportedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pre-installed meditation files with custom names
  const preInstalledFiles = [
    {
      name: 'Morning Calm',
      defaultFile: 'morning-calm.mp3',
      customFile: 'my-morning-meditation.mp3',
      description: '5-minute morning meditation'
    },
    {
      name: 'Stress Relief', 
      defaultFile: 'stress-relief.mp3',
      customFile: 'my-stress-relief.mp3',
      description: '10-minute stress relief meditation'
    },
    {
      name: 'Deep Breathing',
      defaultFile: 'deep-breathing.mp3', 
      customFile: 'my-breathing-exercise.mp3',
      description: '3-minute breathing exercise'
    },
    {
      name: 'Recovery Focus',
      defaultFile: 'recovery-focus.mp3',
      customFile: 'my-recovery-meditation.mp3', 
      description: '15-minute recovery-focused meditation'
    },
    {
      name: 'Sleep Well',
      defaultFile: 'sleep-well.mp3',
      customFile: 'my-sleep-meditation.mp3',
      description: '20-minute sleep meditation'
    },
    {
      name: 'Gratitude Practice',
      defaultFile: 'gratitude-practice.mp3',
      customFile: 'my-gratitude-meditation.mp3',
      description: '8-minute gratitude meditation'
    },
    {
      name: 'Slow Down',
      defaultFile: 'slow-down.mp3',
      customFile: 'my-slow-down-meditation.mp3',
      description: 'Slow down meditation for finding center'
    }
  ];

  useEffect(() => {
    loadImportedFiles();
  }, []);

  const loadImportedFiles = async () => {
    try {
      const files = await audioManager.getAudioFiles();
      setImportedFiles(files);
    } catch (error) {
      console.error('Error loading imported files:', error);
    }
  };

  const pickAudioFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        await importAudioFile(result);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick audio file');
    }
  };

  const importAudioFile = async (fileResult) => {
    setLoading(true);
    try {
      // Copy file to app documents
      const fileName = `custom_${Date.now()}.mp3`;
      await audioManager.saveAudioFile(fileResult.uri, fileName);
      
      setImportedFiles(prev => [...prev, {
        name: fileResult.name,
        fileName: fileName,
        size: fileResult.size,
      }]);
      
      Alert.alert('Success', 'Audio file imported successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to import audio file');
    } finally {
      setLoading(false);
    }
  };

  const deleteAudioFile = async (fileName) => {
    try {
      await audioManager.deleteAudioFile(fileName);
      setImportedFiles(prev => prev.filter(file => file.fileName !== fileName));
      Alert.alert('Success', 'Audio file deleted successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete audio file');
    }
  };

  const AudioFileCard = ({ file, isPreInstalled = false }) => (
    <View style={[styles.audioCard, isPreInstalled && styles.preInstalledCard]}>
      <View style={styles.audioInfo}>
        <Ionicons 
          name={isPreInstalled ? "checkmark-circle" : "musical-notes"} 
          size={24} 
          color={isPreInstalled ? "#43e97b" : "#667eea"} 
        />
        <View style={styles.audioDetails}>
          <Text style={styles.audioName}>{file.name || file}</Text>
          {isPreInstalled && (
            <Text style={styles.audioDescription}>{file.description}</Text>
          )}
          {!isPreInstalled && (
            <Text style={styles.audioSize}>{(file.size / 1024 / 1024).toFixed(1)} MB</Text>
          )}
          {isPreInstalled && (
            <Text style={styles.preInstalledText}>Pre-installed</Text>
          )}
          {isPreInstalled && (
            <Text style={styles.customFileName}>Custom: {file.customFile}</Text>
          )}
        </View>
      </View>
      {!isPreInstalled && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteAudioFile(file.fileName)}
        >
          <Ionicons name="trash" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Audio Files</Text>
          <Text style={styles.subtitle}>
            Manage your meditation audio files
          </Text>
        </View>

        <TouchableOpacity
          style={styles.importButton}
          onPress={pickAudioFile}
          disabled={loading}
        >
          <Ionicons name="add-circle" size={32} color="#fff" />
          <Text style={styles.importButtonText}>
            {loading ? 'Importing...' : 'Import Custom Audio'}
          </Text>
        </TouchableOpacity>

        <View style={styles.filesSection}>
          <Text style={styles.sectionTitle}>Pre-installed Meditations</Text>
          <Text style={styles.sectionSubtitle}>
            These meditation files come with the app
          </Text>
          {preInstalledFiles.map((file, index) => (
            <AudioFileCard key={`pre-${index}`} file={file} isPreInstalled={true} />
          ))}
        </View>

        <View style={styles.filesSection}>
          <Text style={styles.sectionTitle}>Custom Imported Files</Text>
          {importedFiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="musical-notes-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>
                No custom audio files imported yet
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Import your own meditation files to replace the pre-installed ones
              </Text>
            </View>
          ) : (
            importedFiles.map((file, index) => (
              <AudioFileCard key={`custom-${index}`} file={file} />
            ))
          )}
        </View>

        <View style={styles.tipsSection}>
          <View style={styles.tipsCard}>
            <Ionicons name="information-circle" size={24} color="#667eea" />
            <Text style={styles.tipsTitle}>How It Works</Text>
            <Text style={styles.tipsText}>
              • Pre-installed meditations are always available{'\n'}
              • Import custom files with specific names to replace defaults{'\n'}
              • Custom file names: my-morning-meditation.mp3, my-stress-relief.mp3, etc.{'\n'}
              • Supported formats: MP3, WAV, M4A{'\n'}
              • Maximum file size: 50MB{'\n'}
              • Imported files are stored locally on your device
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 70,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  importButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  filesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
    marginBottom: 15,
  },
  audioCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preInstalledCard: {
    backgroundColor: 'rgba(77, 209, 130, 0.1)', // A light green background for pre-installed
    borderColor: 'rgba(77, 209, 130, 0.3)',
    borderWidth: 1,
  },
  audioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  audioDetails: {
    marginLeft: 15,
    flex: 1,
  },
  audioName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  audioSize: {
    fontSize: 12,
    color: '#666',
  },
  preInstalledText: {
    fontSize: 12,
    color: '#43e97b',
    fontWeight: '600',
  },
  audioDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  customFileName: {
    fontSize: 11,
    color: '#667eea',
    fontWeight: '500',
    marginTop: 2,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  tipsSection: {
    marginBottom: 30,
  },
  tipsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
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
}); 