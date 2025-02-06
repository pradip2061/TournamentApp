import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Setting = () => {
  const[token,setToken]=useState('')
  useEffect(()=>{
   const gettoken=async()=>{
     const tokens =await  AsyncStorage.getItem('token')
     setToken(tokens)
   }
   gettoken()
  },[])


 const logout=async()=>{
  await AsyncStorage.clear()
  console.log('hello')
 }
  return (
    <ScrollView style={styles.container}>
      {/* User Info Section with Icons */}
      <View style={styles.userSection}>
        <Image source={require('../assets/pubgfull.jpg')} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <View style={styles.userRow}>
            <Ionicons name="person-circle-outline" size={20} color="#555" />
            <Text style={styles.username}>{token}</Text>
          </View>
          <View style={styles.userRow}>
            <MaterialIcons name="email" size={20} color="#555" />
            <Text style={styles.email}> johndoe@gmail.com</Text>
          </View>
        </View>
      </View>

      {/* Personal Details & Password */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="person-outline" size={24} color="#555" />
          <Text style={styles.itemText}>Personal Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="lock-closed-outline" size={24} color="#555" />
          <Text style={styles.itemText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Deposit & Withdraw Money */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.item}>
          <FontAwesome name="money" size={24} color="#555" />
          <Text style={styles.itemText}>Deposit Money</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <MaterialIcons name="account-balance-wallet" size={24} color="#555" />
          <Text style={styles.itemText}>Withdraw Money</Text>
        </TouchableOpacity>
      </View>

      {/* Other Options */}
      <View style={styles.section}>
      <TouchableOpacity style={styles.item}>
          <Entypo name="back-in-time" size={24} color="#555" />
          <Text style={styles.itemText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="share-social-outline" size={24} color="#555" />
          <Text style={styles.itemText}>Share App</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="headset-outline" size={24} color="#555" />
          <Text style={styles.itemText}>Customer Service</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="log-out-outline" size={24} color="red" />
          <Text style={[styles.itemText, { color: 'red' }]} onPress={logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Social Media Links */}
      <View style={styles.socialMedia}>
        <TouchableOpacity>
          <Entypo name="instagram" size={30} color="#E1306C" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="facebook" size={30} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="youtube" size={30} color="#ff0000" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(0,18,64)',
    paddingHorizontal: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    marginTop:10
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    marginLeft: 15,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginLeft: 10,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  itemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  socialMedia: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    backgroundColor:'#fff',
    paddingBlock:10,
    borderRadius:10
  },
});

export default Setting;
