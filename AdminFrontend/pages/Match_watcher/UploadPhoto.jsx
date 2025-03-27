import React, { useState } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { baseUrl } from '../../env';

const PhotoUploadButton = ({ photo, setPhoto, setBase64 }) => {
  const selectPhoto = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets?.length > 0) {
        const selectedImage = response.assets[0];
        setPhoto(selectedImage.uri);
        setBase64(selectedImage.base64);
      }
    });
  };

  return (
    <TouchableOpacity onPress={selectPhoto} style={styles.uploadBox}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.uploadedImage} />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.plusText}>+</Text>
          <Text style={styles.uploadHint}>Tap to upload</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const UploadPhoto = () => {
  const [firstMessage, setFirstMessage] = useState('No photo selected');
  const [lastMessage, setLastMessage] = useState('No photo selected');
  const [firstPhoto, setFirstPhoto] = useState(null);
  const [lastPhoto, setLastPhoto] = useState(null);
  const [firstBase64, setFirstBase64] = useState(null);
  const [lastBase64, setLastBase64] = useState(null);
  const [matchId, setMatchId] = useState('');

  const sendPhoto = async (base64Image, which, setMessage) => {
    if (!base64Image || !matchId.trim()) {
      setMessage('Please select a photo and enter a match ID');
      return;
    }

    try {
      const url = `${baseUrl}/khelmela/matchValidation/geminiValidate`;
      const response = await axios.post(url, {
        photo: base64Image,
        which,
        matchId,
      });

      setMessage(response?.data?.message || 'Nothing ⛔️');
    } catch (error) {
      setMessage(
        'Upload failed: ' + (error.response?.data?.message || error.message),
      );
    }
  };

  const renderUploadSection = (
    title,
    photo,
    setPhoto,
    setBase64,
    base64,
    which,
    message,
    setMessage,
  ) => (
    <View style={styles.uploadSection}>
      <Text style={styles.title}>{title}</Text>
      <PhotoUploadButton
        setPhoto={setPhoto}
        photo={photo}
        setBase64={setBase64}
      />
      <TextInput
        placeholder="Enter Match ID"
        style={styles.input}
        value={matchId}
        onChangeText={setMatchId}
        placeholderTextColor="#999999"
      />
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{message}</Text>
      </View>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => sendPhoto(base64, which, setMessage)}>
        <Text style={styles.uploadButtonText}>Upload Photo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Result Validation</Text>
      </View>
      {renderUploadSection(
        'Starting Match Photo',
        firstPhoto,
        setFirstPhoto,
        setFirstBase64,
        firstBase64,
        'first',
        firstMessage,
        setFirstMessage,
      )}
      {renderUploadSection(
        'End Match Photo',
        lastPhoto,
        setLastPhoto,
        setLastBase64,
        lastBase64,
        'last',
        lastMessage,
        setLastMessage,
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F7FA',
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E2A3C',
  },
  uploadSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E2A3C',
    marginBottom: 15,
  },
  uploadBox: {
    height: 200,
    width: 300,
    backgroundColor: '#E8ECEF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#DEE2E6',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  plusText: {
    fontSize: 40,
    color: '#6B7280',
    fontWeight: '300',
  },
  uploadHint: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  input: {
    height: 48,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 15,
    width: '100%',
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#1E2A3C',
  },
  messageContainer: {
    minHeight: 60,
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 10,
    marginTop: 15,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  messageText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '500',
  },
  uploadButton: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default UploadPhoto;