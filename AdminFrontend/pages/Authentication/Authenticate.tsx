import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  BackHandler,
  Keyboard,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';

import Lock from 'react-native-vector-icons/AntDesign';
import Email from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {BASE_URL} from '../../env';

const Authenticate = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      const expiryTime = await AsyncStorage.getItem('tokenExpiry');
      if (savedToken && expiryTime && Date.now() < parseInt(expiryTime)) {
        navigation.replace('Dashboard');
      }
    };
    checkToken();
  }, []);

  const login = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter email and password');
        return;
      }
      Keyboard.dismiss();
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/khelmela/login`,
        {email, password},
        {headers: {'Content-Type': 'application/json'}},
      );
      Alert.alert('Success', response.data.message);
      const userToken = response.data.data;
      setToken(userToken);
      await AsyncStorage.setItem('token', userToken);
      await AsyncStorage.setItem(
        'tokenExpiry',
        (Date.now() + 24 * 60 * 60 * 1000).toString(),
      );
      navigation.replace('Dashboard');
    } catch (error) {
      setError(
        error?.response?.data?.message || 'An unexpected error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit?', [
          {text: 'Cancel', onPress: () => null, style: 'cancel'},
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []),
  );

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Admin Login</Text>
          <View style={styles.inputWrapper}>
            <Email
              name="email-outline"
              size={24}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Enter your email"
              style={styles.input}
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Lock
              name="lock1"
              size={24}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Enter your password"
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#999999"
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={login}
            disabled={loading}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  mainContent: {flex: 1, padding: 20},
  formContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  title: {fontSize: 36, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 30},
  inputWrapper: {position: 'relative', width: '100%', marginBottom: 15},
  input: {
    width: '100%',
    height: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingLeft: 45,
    fontSize: 16,
    color: '#333',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  inputIcon: {position: 'absolute', left: 15, top: 15, zIndex: 1},
  actionButton: {
    width: 200,
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    elevation: 3,
  },
  buttonText: {color: '#FFFFFF', fontSize: 18, fontWeight: '600'},
});

export default Authenticate;
