import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
const FirstPage = ({ navigation }) => {
  const verify= async()=>{
    const tokens = await AsyncStorage.getItem('token')
    if(!tokens){
    navigation.navigate('Authenticate')
  }else{
    navigation.navigate('Main')
  }
}
  return (
    <View style={styles.container}>
      <FastImage
        source={require('../assets/logo.gif')} // Replace with a better GIF URL if needed
        style={styles.gamepadGif}
        resizeMode={FastImage.resizeMode.contain}
      />

      <Text style={styles.esportsText}>ESPORTS</Text>
      <Text style={styles.subText}>First step to Esport's journey</Text>

      {/* 🇳🇵 Our App's Goal */}
      <Text style={styles.goalText}>
        Our app's main goal is to promote esports in Nepal.
      </Text>
      <TouchableOpacity style={styles.button} onPress={verify}>
        <Text style={styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor:'rgb(252,255,252)',
    gap:20,
    paddingTop:90
  },
  gamepadGif: {
    width: 350,
    height: 250,
  },
  esportsText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "orange", // Golden color
    marginBottom: 10,
  },
  subText: {
    fontSize: 18,
    color: "black",
    marginBottom: 10,
  },
  goalText: {
    fontSize: 16,
    color: "#B0B0B0",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "orange",
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 25, // Rounded corners
    marginTop:40
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FirstPage;
