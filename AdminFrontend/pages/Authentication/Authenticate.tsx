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
import Icon from 'react-native-vector-icons/AntDesign';
import Lock from 'react-native-vector-icons/AntDesign';
import Email from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Modal from 'react-native-modal';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {BASE_URL} from '../../env';
const Authenticate = ({navigation}) => {
  const [show, setShow] = useState(true);
  const [value, setValue] = useState('Signup');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpmodel, setOtpmodel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetModal, setResetModal] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const shows = () => {
    show ? setShow(false) : setShow(true);
    show ? setValue('Login') : setValue('Signup');
  };

  const settoken = async () => {
    const expiresIn = 24 * 60 * 60 * 1000;
    const expiryTime = Date.now() + expiresIn;
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('tokenExpiry', expiryTime.toString());
  };

  useEffect(() => {
    settoken();
  }, [token]);

  const login = async e => {
    try {
      e.preventDefault();
      if (!email || !password) {
        return;
      }
      Keyboard.dismiss(); // Dismiss keyboard before login
      setLoading(true);
      await axios
        .post(
          `${BASE_URL}/khelmela/login`,
          {email, password},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then(response => {
          Alert.alert(response.data.message);
          setEmail('');
          setPassword('');
          setToken(response.data.data);
          navigation.navigate('Dashboard');
        });
    } catch (error) {
      setError(
        error?.response?.data?.message || 'An unexpected error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    try {
      Keyboard.dismiss(); // Dismiss keyboard before sending OTP
      setLoading(true);
      await axios
        .post(`${BASE_URL}/khelmela/verifyotp`, {
          otp,
          username,
          email,
          password,
        })
        .then(response => {
          Alert.alert(response.data.message);
          setEmail('');
          setPassword('');
          setUsername('');
          setOtp('');
          setError('');
          if (response.status == 200) {
            setOtpmodel(false);
            setShow(prev => !prev);
          }
        });
    } catch (error) {
      setError(
        error?.response?.data?.message || 'An unexpected error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  const signin = async e => {
    try {
      e.preventDefault();
      console.log('hello');
      if (!username || !email || !password) {
        return;
      }

      Keyboard.dismiss(); // Dismiss keyboard before signup
      setLoading(true);
      await axios
        .post(
          `${BASE_URL}/khelmela/sendOtp`,
          {username, email, password},
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then(response => {
          if (response.status == 200) {
            setError('');
            setOtpmodel(true);
          }
        });
    } catch (error) {
      setError(error.response.data.message);
      console.log(error.response.data.message);
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

  const resetPassword = async () => {
    Keyboard.dismiss(); // Dismiss keyboard before reset
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/khelmela/forgetpassword`, {
        email,
      });
      if (response.status == 200) {
        setResetModal(false);
        setVerifyModal(true);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyforgetpassword = async () => {
    Keyboard.dismiss(); // Dismiss keyboard before verify
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/khelmela/verifyforgetpassword`,
        {email, otp, newPassword, confirmPassword},
      );
      if (response.status == 200) {
        Alert.alert('password changed!!');
        setVerifyModal(false);
        setShow(prev => !prev);
        setValue(prev => 'Login');
        setError('');
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}>
      <View style={styles.mainContent}>
        <TouchableOpacity
          onPress={() => navigation.navigate('First')}
          style={styles.backButton}>
          <Icon name="arrowleft" size={30} color="#FFFFFF" />
        </TouchableOpacity>

        {show ? (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Log In</Text>
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
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setResetModal(true)}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={login}
              disabled={loading}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>OR</Text>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.inputWrapper}>
              <Icon
                name="user"
                size={24}
                color="#666"
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Enter your username"
                style={styles.input}
                placeholderTextColor="#999999"
                value={username}
                onChangeText={setUsername}
              />
            </View>
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
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={signin}
              disabled={loading}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <Text style={styles.orText}>OR</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {value === 'Login'
              ? 'Already have an account? '
              : "Don't have an account? "}
          </Text>
          <TouchableOpacity onPress={shows}>
            <Text style={styles.footerLink}>{value}</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color="#FFFFFF" size="large" />
          </View>
        )}

        {/* OTP Modal */}
        <Modal
          isVisible={otpmodel}
          animationIn="slideInUp"
          animationOut="slideOutDown">
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOtpmodel(false)}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter email"
              placeholderTextColor="#999999"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Enter OTP"
              placeholderTextColor="#999999"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
            />
            <Text style={styles.modalError}>{error}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={sendOtp}
              disabled={loading}>
              <Text style={styles.modalButtonText}>
                {loading ? 'Loading...' : 'Send'}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Reset Password Modal */}
        <Modal
          isVisible={resetModal}
          animationIn="slideInUp"
          animationOut="slideOutDown">
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setResetModal(false)}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter email"
              placeholderTextColor="#999999"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Text style={styles.modalError}>{error}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={resetPassword}
              disabled={loading}>
              <Text style={styles.modalButtonText}>
                {loading ? 'Loading...' : 'Send'}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Verify Password Modal */}
        <Modal
          isVisible={verifyModal}
          animationIn="slideInUp"
          animationOut="slideOutDown">
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVerifyModal(false)}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Verify New Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter email"
              placeholderTextColor="#999999"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Enter OTP"
              placeholderTextColor="#999999"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="New Password"
              placeholderTextColor="#999999"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Confirm Password"
              placeholderTextColor="#999999"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Text style={styles.modalError}>{error}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={verifyforgetpassword}
              disabled={loading}>
              <Text style={styles.modalButtonText}>
                {loading ? 'Loading...' : 'Verify'}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
    marginBottom: 15,
  },
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
  inputIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 1,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  forgotPassword: {
    color: '#FF6666',
    fontSize: 14,
    marginTop: 10,
    marginLeft: 210,
    paddingBottom: 5,
  },
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  orText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  footerLink: {
    color: '#00CC00',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  modalInput: {
    width: 250,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  modalError: {
    color: '#FF4444',
    fontSize: 14,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Authenticate;
