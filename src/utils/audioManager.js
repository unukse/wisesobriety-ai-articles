import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';

class AudioManager {
  constructor() {
    this.audioDirectory = `${FileSystem.documentDirectory}audio/`;
  }

  // Create audio directory if it doesn't exist
  async ensureAudioDirectory() {
    const dirInfo = await FileSystem.getInfoAsync(this.audioDirectory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.audioDirectory, { intermediates: true });
    }
  }

  // Save audio file from local path to app documents
  async saveAudioFile(localPath, fileName) {
    await this.ensureAudioDirectory();
    const destinationUri = `${this.audioDirectory}${fileName}`;
    
    try {
      await FileSystem.copyAsync({
        from: localPath,
        to: destinationUri
      });
      return destinationUri;
    } catch (error) {
      console.error('Error saving audio file:', error);
      throw error;
    }
  }

  // Get list of available audio files
  async getAudioFiles() {
    await this.ensureAudioDirectory();
    try {
      const files = await FileSystem.readDirectoryAsync(this.audioDirectory);
      return files.filter(file => file.endsWith('.mp3'));
    } catch (error) {
      console.error('Error reading audio directory:', error);
      return [];
    }
  }

  // Play audio file by name
  async playAudioFile(fileName) {
    const fileUri = `${this.audioDirectory}${fileName}`;
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: true }
      );
      return sound;
    } catch (error) {
      console.error('Error playing audio file:', error);
      throw error;
    }
  }

  // Delete audio file
  async deleteAudioFile(fileName) {
    const fileUri = `${this.audioDirectory}${fileName}`;
    try {
      await FileSystem.deleteAsync(fileUri);
    } catch (error) {
      console.error('Error deleting audio file:', error);
      throw error;
    }
  }
}

export default new AudioManager(); 