import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {IP, SERVER_PORT} from '../env';

const PhotoUploadButton = ({photo, setPhoto, setBase64}) => {
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
        <Image source={{uri: photo}} style={styles.uploadedImage} />
      ) : (
        <Text style={styles.plusText}>+</Text>
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
      setMessage('Please select a photo and enter a match ID.');
      return;
    }

    try {
      const url = `${IP}:${SERVER_PORT}/gemini/geminiValidate`;
      console.log(`Sending request to: ${url}`);

      const response = await axios.post(url, {
        photo: base64Image,
        which,
        matchId,
      });

      setMessage(response?.data?.message || 'Nothing ⛔️');
      console.log('Response:', response.data);
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
    messageStyle,
  ) => (
    <View style={styles.uploadSection}>
      <Text style={styles.title}>{title}</Text>
      <PhotoUploadButton
        setPhoto={setPhoto}
        photo={photo}
        setBase64={setBase64}
      />
      <TextInput
        placeholder="Match ID"
        style={styles.input}
        value={matchId}
        onChangeText={setMatchId}
      />
      <Text style={messageStyle}>{message}</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => sendPhoto(base64, which, setMessage)}>
        <Text style={styles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {renderUploadSection(
        'Upload Starting Match Photo',
        firstPhoto,
        setFirstPhoto,
        setFirstBase64,
        firstBase64,
        'first',
        firstMessage,
        setFirstMessage,
        styles.messageText1,
      )}
      {renderUploadSection(
        'Upload End Match Photo',
        lastPhoto,
        setLastPhoto,
        setLastBase64,
        lastBase64,
        'last',
        lastMessage,
        setLastMessage,
        styles.messageText2,
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightgreen',
    paddingVertical: 20,
    alignItems: 'center',
  },
  uploadSection: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  uploadBox: {
    height: 230,
    width: 300,
    backgroundColor: 'cyan',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
  },
  plusText: {
    fontSize: 50,
    textAlign: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    width: 290,
    padding: 10,
    backgroundColor: 'orange',
  },
  messageText1: {
    fontSize: 15,
    color: 'blue',
    textAlign: 'left',
    height: 100,
    width: 300,
    backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 30,
    marginTop: 30,
    borderWidth: 1,
  },
  messageText2: {
    fontSize: 15,
    color: 'blue',
    textAlign: 'left',
    height: 250,
    width: 300,
    backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 30,
    marginTop: 30,
    borderWidth: 1,
  },

  uploadButton: {
    marginTop: 20,
    height: 30,
    width: 120,
    backgroundColor: 'green',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 15,
    color: 'white',
  },
});

export default UploadPhoto;
