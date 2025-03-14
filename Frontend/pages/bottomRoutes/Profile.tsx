import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
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
import {launchImageLibrary} from 'react-native-image-picker';
import { CheckAdminContext } from '../ContextApi/ContextApi';
import{BASE_URL} from '../../env'
const Profile = () => {
  const [username, setUsername] = useState('');
  const [freefireName, setFreefireName] = useState('');
  const [freefireUid, setFreefireUid] = useState('');
  const [pubgName, setPubgName] = useState('');
  const [pubgUid, setPubgUid] = useState('');
  // const [data, setData] = useState({});
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const[image,setImage]=useState(null)
  const[loading,setLoading]=useState(false)
  const{trigger,setTrigger,getProfile,data}=useContext(CheckAdminContext)
  // Popup notification handler
  const popup = () => {
    setVisible(true);
    setTimeout(() => setVisible(false), 1000);
  };

  // Update profile username
  const updateProfile = async () => {
    if (!username) {
      setError('Username cannot be empty');
      popup();
      return;
    }
    setError('');
    setMessage('');
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/khelmela/updateprofile`,
        {username}, // Ensure the payload matches API expectations
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json', // Explicitly set content type
          },
        },
      );
      setMessage(response.data.message || 'Username updated successfully');
      // setData(prev => ({...prev, username})); // Update local state
    } catch (error) {
      console.log(
        'Update profile error:',
        error.response?.data || error.message,
      );
      setError(error.response?.data?.message || 'Failed to update username');
    } finally {
      setLoading(false)
      popup();
    }
  };

  useEffect(()=>{
    getProfile()
    setFreefireName(data?.gameName?.[0]?.freefire)
    setFreefireUid(data?.uid?.[0]?.freefire)
    setUsername(data?.username)
    setPubgName(data?.gameName?.[0]?.pubg)
    setPubgUid(data?.uid?.[0]?.pubg)
  },[trigger])
  // Update PUBG name and UID
  const pubgNameUpdate = async () => {
    setError('');
    setMessage('');
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/khelmela/pubgname`,
        {pubgName, pubgUid},
        {headers: {Authorization: `${token}`}},
      );
      setMessage(response.data.message || 'PUBG details updated');
      // setData(prev => ({
      //   ...prev,
      //   gameName: [{...prev.gameName?.[0], pubg: pubgName}],
      //   uid: [{...prev.uid?.[0], pubg: pubgUid}],
      // }));
    } catch (error) {
      setError(error.response?.data?.message || 'PUBG update failed');
    } finally {
      setLoading(false)
      popup();
    }
  };

  // Update Freefire name and UID
  const freefireNameUpdate = async () => {
    setError('');
    setMessage('');
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/khelmela/freefirename`,
        {freefireName, freefireUid},
        {headers: {Authorization: `${token}`}},
      );
      setMessage(response.data.message || 'Freefire details updated');
      // setData(prev => ({
      //   ...prev,
      //   gameName: [{...prev.gameName?.[0], freefire: freefireName}],
      //   uid: [{...prev.uid?.[0], freefire: freefireUid}],
      // }));
    } catch (error) {
      setError(error.response?.data?.message || 'Freefire update failed');
    } finally {
      setLoading(false)
      popup();
    }
  };
  const isUsernameChanged =
  (username ?? '').trim() !== '' &&
  (username ?? '').trim() !== (data?.username ?? '').trim();

const isFreefireChanged =
  ((freefireName ?? '').trim() !== '' || (freefireUid ?? '').trim() !== '') && // ✅ Ensures at least one input has a value
  ((freefireName ?? '').trim() !== (data?.gameName?.[0]?.freefire ?? '').trim() ||
   (freefireUid ?? '').trim() !== (data?.uid?.[0]?.freefire ?? '').trim());

const isPubgChanged =
  ((pubgName ?? '').trim() !== '' || (pubgUid ?? '').trim() !== '') && // ✅ Ensures at least one input has a value
  ((pubgName ?? '').trim() !== (data?.gameName?.[0]?.pubg ?? '').trim() ||
   (pubgUid ?? '').trim() !== (data?.uid?.[0]?.pubg ?? '').trim());





  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800, // Set max width to reduce size
      maxHeight: 800, // Set max height to reduce size
      quality: 0.3, // Adjust compression quality (0.1 - 1)
      includeBase64: true, // Convert image to base64
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        uploadImage(response?.assets?.[0]?.base64);
        // setImage(response?.assets?.[0]?.uri)
      }
    });
  };
  const uploadImage = async (image) => {
    try {
      setLoading(true)
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/khelmela/upload/upload`,
        {
          image: image,
          folderName: 'users',
          filename: '.jpg',
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      console.log(response)
      if(response.status == 200){
        imageset(response.data.url)
      }
    } catch (error) {
      console.error('Upload Error:', error);
    }
  };

  const imageset =async(image)=>{
    try {
      setTrigger('')
      const token = await AsyncStorage.getItem('token')
      console.log(token)
     const response = await axios.post(`${BASE_URL}/khelmela/imageset`,{image},{
        headers:{
       Authorization:`${token}`
        }
      })
      setMessage(response.data.message)
      setTrigger('done')
    } catch (error) {
      setError(error.response.data.message)
    }finally{
      setLoading(false)
      popup()
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile</Text>

      {/* Profile Section */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={pickImage}>
          <Image
            source={{uri:data?.image ||"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}}
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
          style={[styles.saveButton, {opacity: isUsernameChanged ? 1 : 0.5}]}
          onPress={ updateProfile}
          disabled={!isUsernameChanged}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ModalNotify visible={visible} error={error} message={message} />
      <View style={styles.line} />

      <Text style={styles.inputTitle}>Enter your InGame Name and ID</Text>

      {/* Freefire Section */}
      <View style={styles.card}>
        <Image
          source={require('../../assets/freefire.jpeg')}
          style={styles.gameIcon}
        />
        <Text style={styles.gameTitle}>Freefire</Text>
        <Text style={styles.label}>
          Ingame Name: {data?.gameName?.[0]?.freefire}
        </Text>
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
          style={[styles.saveButton, {opacity: isFreefireChanged? 1 : 0.5}]}
          onPress={freefireNameUpdate}
          disabled={!isFreefireChanged}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* PUBG Section */}
      <View style={styles.card}>
        <Image
          source={require('../../assets/image.png')}
          style={styles.gameIcon}
        />
        <Text style={styles.gameTitle}>PUBG</Text>
        <Text style={styles.label}>
          Ingame Name: {data?.gameName?.[0]?.pubg}
        </Text>
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
          style={[styles.saveButton, {opacity: isPubgChanged? 1 : 0.5}]}
          onPress={pubgNameUpdate}
          disabled={!isPubgChanged}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={loading} transparent>
      <ActivityIndicator size={30} style={{marginTop:380}}/>
      </Modal>
    </ScrollView>
  );
};

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
    width: '100%', // Consistent size across all sections
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
