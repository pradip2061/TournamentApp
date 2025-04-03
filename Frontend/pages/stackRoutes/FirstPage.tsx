import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';

const bg1 = require('../../assets/bg2.gif');
const FirstPage = ({navigation}) => {
  const verify = async () => {
    const tokens = await AsyncStorage.getItem('token');
    if (!tokens) {
      navigation.navigate('Authenticate');
    } else {
      navigation.navigate('Main');
    }
  };
  return (
    <FastImage style={styles.container} source={bg1}>
      <Text style={styles.esportsText}>ESPORTS</Text>
      <Text style={styles.goalText}>
        First step towards your Esport journey
      </Text>

      {/* 🇳🇵 Our App's Goal */}
      <TouchableOpacity style={styles.button} onPress={verify}>
        <Text style={styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
    </FastImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    gap: 20,
    paddingTop: 90,
  },
  gamepadGif: {
    width: 350,
    height: 250,
  },
  esportsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'orange', // Golden color
    marginBottom: 10,
  },
  subText: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
  },
  goalText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: '-10%',
    paddingHorizontal: 20,
    marginTop: '150%',
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 25, // Rounded corners
    marginTop: '10%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FirstPage;
