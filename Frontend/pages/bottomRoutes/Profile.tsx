import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import ModalNotify from '../../components/ModalNotify';
import { launchImageLibrary } from 'react-native-image-picker';
import { CheckAdminContext } from '../ContextApi/ContextApi';
import { BASE_URL } from '../../env';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [freefireName, setFreefireName] = useState('');
  const [freefireUid, setFreefireUid] = useState('');
  const [pubgName, setPubgName] = useState('');
  const [pubgUid, setPubgUid] = useState('');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { getProfile, data } = useContext(CheckAdminContext); // Use only getProfile and data

  // Popup notification handler
  const popup = () => {
    setVisible(true);
    setTimeout(() => setVisible(false), 1000);
  };

  // Reset input fields to server data
  const resetFields = () => {
    setUsername(data?.username || '');
    setFreefireName(data?.gameName?.[0]?.freefire || '');
    setFreefireUid(data?.uid?.[0]?.freefire || '');
    setPubgName(data?.gameName?.[0]?.pubg || '');
    setPubgUid(data?.uid?.[0]?.pubg || '');
  };

  // Update profile username and refresh data
  const updateProfile = async () => {
    if (!username) {
      setError('Username cannot be empty');
      popup();
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/khelmela/updateprofile`,
        { username },
        { headers: { Authorization: `${token}`, 'Content-Type': 'application/json' } },
      );
      setMessage(response.data.message || 'Username updated successfully');
      await getProfile(); // Fetch latest data from server
    } catch (error) {
      console.log('Update profile error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to update username');
    } finally {
      setLoading(false);
      popup();
    }
  };

  // Update PUBG name and UID and refresh data
  const pubgNameUpdate = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/khelmela/pubgname`,
        { pubgName, pubgUid },
        { headers: { Authorization: `${token}` } },
      );
      setMessage(response.data.message || 'PUBG details updated');
      await getProfile(); // Fetch latest data from server
    } catch (error) {
      console.log('PUBG update error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'PUBG update failed');
    } finally {
      setLoading(false);
      popup();
    }
  };

  // Update Freefire name and UID and refresh data
  const freefireNameUpdate = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/khelmela/freefirename`,
        { freefireName, freefireUid },
        { headers: { Authorization: `${token}` } },
      );
      setMessage(response.data.message || 'Freefire details updated');
      await getProfile(); // Fetch latest data from server
    } catch (error) {
      console.log('Freefire update error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Freefire update failed');
    } finally {
      setLoading(false);
      popup();
    }
  };

  // Fetch initial profile data on mount
  useEffect(() => {
    getProfile(); // Fetch profile data once on mount
  }, []);

  // Sync input fields with server data when it changes
  useEffect(() => {
    resetFields();
  }, [data]);

  // Image picker and upload with refresh
  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.3,
      includeBase64: true,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const base64Image = response?.assets?.[0]?.base64;
        setLoading(true);

        try {
          const token = await AsyncStorage.getItem('token');
          const uploadResponse = await axios.post(
            `${BASE_URL}/khelmela/upload/upload`,
            { image: base64Image, folderName: 'users', filename: '.jpg' },
            { headers: { Authorization: `${token}` } },
          );

          if (uploadResponse.status === 200) {
            const imageUrl = uploadResponse.data.url;
            await axios.post(
              `${BASE_URL}/khelmela/imageset`,
              { image: imageUrl },
              { headers: { Authorization: `${token}` } },
            );
            setMessage('Image updated successfully');
            await getProfile(); // Fetch latest data from server
          }
        } catch (error) {
          console.error('Image update error:', error);
          setError(error.response?.data?.message || 'Failed to update image');
        } finally {
          setLoading(false);
          popup();
        }
      }
    });
  };

  const isUsernameChanged = username.trim() !== (data?.username ?? '').trim();
  const isFreefireChanged =
    freefireName.trim() !== (data?.gameName?.[0]?.freefire ?? '').trim() ||
    freefireUid.trim() !== (data?.uid?.[0]?.freefire ?? '').trim();
  const isPubgChanged =
    pubgName.trim() !== (data?.gameName?.[0]?.pubg ?? '').trim() ||
    pubgUid.trim() !== (data?.uid?.[0]?.pubg ?? '').trim();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile</Text>

      {/* Profile Section */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
          <Image
            source={{
              uri: data?.image || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
        <Text style={styles.emailText}>Email: {data?.email || 'N/A'}</Text>
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          placeholder="example: raiden504"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity
          style={[styles.saveButton, { opacity: isUsernameChanged ? 1 : 0.5 }]}
          onPress={updateProfile}
          disabled={!isUsernameChanged}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ModalNotify visible={visible} error={error} message={message} />
      <View style={styles.line} />

      <Text style={styles.inputTitle}>Enter your InGame Name and ID</Text>

      {/* Freefire Section */}
      <View style={styles.card}>
        <Image source={require('../../assets/freefire.jpeg')} style={styles.gameIcon} />
        <Text style={styles.gameTitle}>Freefire</Text>
        <Text style={styles.label}>Ingame Name: {data?.gameName?.[0]?.freefire}</Text>
        <TextInput
          style={styles.input}
          placeholder="example: raiden"
          placeholderTextColor="#888"
          value={freefireName}
          onChangeText={setFreefireName}
        />
        <Text style={styles.label}>UID: {data?.uid?.[0]?.freefire}</Text>
        <TextInput
          style={styles.input}
          placeholder="example: 2654841556"
          placeholderTextColor="#888"
          value={freefireUid}
          onChangeText={setFreefireUid}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.saveButton, { opacity: isFreefireChanged ? 1 : 0.5 }]}
          onPress={freefireNameUpdate}
          disabled={!isFreefireChanged}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* PUBG Section */}
      <View style={styles.card}>
        <Image source={require('../../assets/image.png')} style={styles.gameIcon} />
        <Text style={styles.gameTitle}>PUBG</Text>
        <Text style={styles.label}>Ingame Name: {data?.gameName?.[0]?.pubg}</Text>
        <TextInput
          style={styles.input}
          placeholder="example: raiden"
          placeholderTextColor="#888"
          value={pubgName}
          onChangeText={setPubgName}
        />
        <Text style={styles.label}>UID: {data?.uid?.[0]?.pubg}</Text>
        <TextInput
          style={styles.input}
          placeholder="example: 2654841556"
          placeholderTextColor="#888"
          value={pubgUid}
          onChangeText={setPubgUid}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.saveButton, { opacity: isPubgChanged ? 1 : 0.5 }]}
          onPress={pubgNameUpdate}
          disabled={!isPubgChanged}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={loading} transparent>
        <ActivityIndicator size={30} style={{ marginTop: 380 }} />
      </Modal>
    </ScrollView>
  );
};

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F2F2F2',
    flexGrow: 1,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 6,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
    elevation: 4,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  plusIcon: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    fontSize: 20,
    color: '#333',
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFF',
    width: '100%',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  line: {
    height: 1,
    backgroundColor: '#DDD',
    width: '100%',
    marginVertical: 20,
  },
  inputTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  gameIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
});

export default Profile;