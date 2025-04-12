import React, {useEffect} from 'react';
import {View, Button, Alert} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import axios from 'axios';

const GoogleSignInScreen = () => {
  useEffect(() => {
    console.log('[GoogleSignIn] Configuring...');
    GoogleSignin.configure({
      webClientId:
        '358939671305-5jtt9037g0to856skm3d8h568q36tv5l.apps.googleusercontent.com',

      offlineAccess: true, // Needed for server authentication
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('[GoogleSignIn] Checking for Play Services...');
      await GoogleSignin.hasPlayServices();

      console.log('[GoogleSignIn] Initiating sign-in...');
      const userInfo = await GoogleSignin.signIn();

      console.log('[GoogleSignIn] Sign-in successful, userInfo:', userInfo);

      const {idToken} = userInfo;
      const {email, name, photo} = userInfo.user;

      const data = {
        email,
        name,
        photo,
        idToken,
      };

      console.log('[GoogleSignIn] Auth Data to send to backend:', data);

      // Optionally send to your server:
      // await axios.post('<YOUR_BACKEND_ENDPOINT>', data);

      Alert.alert('Login Successful', `Welcome ${name}!`);
    } catch (error) {
      console.log('[GoogleSignIn] Error during sign-in:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('[GoogleSignIn] User cancelled the login.');
        Alert.alert('Login Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('[GoogleSignIn] Sign-in already in progress.');
        Alert.alert('Login in Progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('[GoogleSignIn] Google Play Services not available.');
        Alert.alert('Play Services Not Available');
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
