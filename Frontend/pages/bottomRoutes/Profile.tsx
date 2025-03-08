import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import ModalNotify from '../components/ModalNotify';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [freefireName, setFreefireName] = useState('');
  const [freefireUid, setFreefireUid] = useState('');
  const [pubgName, setPubgName] = useState('');
  const [pubgUid, setPubgUid] = useState('');
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        axios
          .get('http://30.30.17.80:3000/khelmela/getprofile', {
            headers: { Authorization: `${token}` },
          })
          .then((response) => {
            setData(response.data.data);
            setUsername(response.data.data.username);
            setFreefireName(response.data.data.gameName[0].freefire);
            setFreefireUid(response.data.data.uid[0].freefire);
            setPubgName(response.data.data.gameName[0].pubg);
            setPubgUid(response.data.data.uid[0].pubg);
          });
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
  }, []);

  const popup = () => {
    setVisible(true);
    setTimeout(() => setVisible(false), 1000);
  };

  const updateProfile = async () => {
    setError('');
    setMessage('');
    try {
      const token = await AsyncStorage.getItem('token');
      axios
        .post(
          'http://30.30.17.80:3000/khelmela/updateprofile',
          { username },
          { headers: { Authorization: `${token}` } }
        )
        .then((response) => {
          setMessage(response.data.message);
        });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      popup();
    }
  };

  const pubgNameUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const token = await AsyncStorage.getItem('token');
      axios
        .post(
          'http://30.30.17.80:3000/khelmela/pubgname',
          { pubgName, pubgUid },
          { headers: { Authorization: `${token}` } }
        )
        .then((response) => {
          setMessage(response.data.message);
        });
    } catch (error) {
      setError(error.response.data.message);
      console.log(error.response.data.message);
    } finally {
      popup();
    }
  };

  const freefireNameUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const token = await AsyncStorage.getItem('token');
      axios
        .post(
          'http://30.30.17.80:3000/khelmela/freefirename',
          { freefireName, freefireUid },
          { headers: { Authorization: `${token}` } }
        )
        .then((response) => {
          setMessage(response.data.message);
        });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      popup();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile</Text>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.profileImageContainer}>
          <Image source={require('../assets/player.png')} style={styles.profileImage} />
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>Email: {data.email}</Text>
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernamelabel}>Username:</Text>
          <TextInput
            style={styles.input}
            placeholder="example: raiden504"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TouchableOpacity
            style={username === data.email ? styles.hoversave : styles.saveButton}
            onPress={updateProfile}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ModalNotify visible={visible} error={error} message={message} />
      <View style={styles.line} />

      <Text style={styles.inputTitle}>Enter your InGame name and ID</Text>

      {/* Freefire Section */}
      <View style={styles.gameContainer}>
        <Image source={require('../assets/freefire.jpeg')} style={styles.gameIcon} />
        <Text style={styles.gameTitle}>Freefire</Text>
        <Text style={styles.label}>Ingame Name: {data?.gameName?.[0]?.freefire}</Text>
        <TextInput
          style={styles.input}
          placeholder="example: radien"
          value={freefireName}
          onChangeText={setFreefireName}
        />
        <Text style={styles.label}>Uid: {data?.uid?.[0]?.freefire}</Text>
        <TextInput
          style={styles.input}
          placeholder="example: 2654841556"
          value={freefireUid}
          onChangeText={setFreefireUid}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.saveButton} onPress={freefireNameUpdate}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* PUBG Section */}
      <View style={styles.gameContainer}>
        <Image source={require('../assets/image.png')} style={styles.gameIcon} />
        <Text style={styles.gameTitle}>PUBG</Text>
        <Text style={styles.label}>Ingame Name: {data?.gameName?.[0]?.pubg}</Text>
        <TextInput
          style={styles.input}
          placeholder="example: radien"
          value={pubgName}
          onChangeText={(text) => setPubgName(text)}
        />
        <Text style={styles.label}>Uid: {data?.uid?.[0]?.pubg}</Text>
        <TextInput
          style={styles.input}
          placeholder="example: 2654841556"
          value={pubgUid}
          onChangeText={(text) => setPubgUid(text)}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.saveButton} onPress={pubgNameUpdate}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
    letterSpacing: 2, // Adds a modern touch
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 15,
    padding: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    elevation: 5, // Subtle shadow for depth
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
  },
  plusIcon: {
    position: 'absolute',
    bottom: 8,
    right: 5,
    fontSize: 22,
    color: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slight background for contrast
    borderRadius: 14,
    width: 23,
    height: 23,
    textAlign: 'center',
    lineHeight: 28,
  },
  emailContainer: {
    marginTop: 10,
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  usernameContainer: {
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  usernamelabel: {
    color: 'black',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '100%',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3, // Shadow for button
  },
  hoversave: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  line: {
    height: 2,
    backgroundColor: '#000',
    width: '100%',
    marginVertical: 25,
    borderRadius: 1,
  },
  inputTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'black',
    letterSpacing: 1.5,
  },
  gameContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 4, // Slight shadow for depth
  },
  gameIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 15,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: 'black',
    letterSpacing: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: 'black',
  },
});

export default Profile;
