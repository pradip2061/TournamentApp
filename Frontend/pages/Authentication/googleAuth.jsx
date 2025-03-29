import React, {useEffect} from 'react';
import {View, Button, Alert} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';

const GoogleSignInScreen = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID', // From Google Developer Console
      offlineAccess: true, // Needed for server authentication
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Extract user details
      const {idToken} = userInfo;
      const {email, name, photo} = userInfo.user;

      const data = {
        email,
        name,
        photo,
        idToken,
      };

      console.log('Google Auth Data...... ', data);
      // Send data to backend
      // await axios.post('', );

      Alert.alert('Login Successful', `Welcome ${name}!`);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Login Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Login in Progress');
      } else {
        Alert.alert('Something went wrong', error.message);
      }
    }
  };

  return (
    <View>
      <Button title="Sign in with Google" onPress={signInWithGoogle} />
    </View>
  );
};

export default GoogleSignInScreen;
