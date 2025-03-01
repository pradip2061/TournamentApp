import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
const img = require('../assets/loading.gif')
import { Modal } from 'react-native';
const Setting = ({navigation}) => {
  const[changepass,setChangepass]=useState(false)
  const[loading,setLoading]=useState(false)
  const[data,setData]=useState([])
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  
 const logout=async()=>{
  await AsyncStorage.clear()
  navigation.navigate('Authenticate')
  
 }

 const changepassword= async(e)=>{
  e.preventDefault();
  setLoading(true)
  const token =await AsyncStorage.getItem('token')
try {
  axios.post(`${process.env.baseUrl}/khelmela/changepassword`,{oldPassword,newPassword},{
    headers:{
      Authorization:`${token}`,
      "Content-Type":'application/json'
    }
  })
  .then((response)=>{
    Alert.alert(response.data.message)
    setLoading(false)
    setNewPassword('')
    setOldPassword('')
    setChangepass(false)
  })
} catch (error) {
  Alert.alert(error.response.data.message)
}finally{
  setLoading(false)
}
 }
useEffect(()=>{
  const getProfile =async()=>{
  const token =await AsyncStorage.getItem('token')
    try {
       axios.get(`${process.env.baseUrl}/khelmela/getprofile`,{
        headers:{
          Authorization:`${token}`
        }
      })
      .then((response)=>{
        setData(response.data.data)
      })
    } catch (error) {
      
    }
     }
     getProfile()
},[])
  return (
    <ScrollView style={styles.container}>
      {/* User Info Section with Icons */}
      <View style={styles.userSection}>
        <Image source={require('../assets/pubgfull.jpg')} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <View style={styles.userRow}>
            <Ionicons name="person-circle-outline" size={20} color="#555" />
            <Text style={styles.username}>{data?.username}</Text>
          </View>
          <View style={styles.userRow}>
            <MaterialIcons name="email" size={20} color="#555" />
            <Text style={styles.email}>{data?.email}</Text>
          </View>
        </View>
      </View>

      {/* Personal Details & Password */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.item}>
          <Ionicons name="person-outline" size={24} color="#555" />
          <Text style={styles.itemText}>Personal Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}  onPress={()=>setChangepass(true)}>
          <Ionicons name="lock-closed-outline" size={24} color="#555" />
          <Text style={styles.itemText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Deposit & Withdraw Money */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate('Deposite')}>
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
        <TouchableOpacity style={styles.item} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="red" />
          <Text style={[styles.itemText, { color: 'red' }]} >Logout</Text>
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
      <Modal transparent={true} animationType="fade" visible={changepass}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Change Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Old Password"
            secureTextEntry
            value={oldPassword}
            onChangeText={(text)=>setOldPassword(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={(text)=>setNewPassword(text)}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={()=>setChangepass(false)}>
              <Text style={styles.buttonText} >Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={changepassword}>
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    <Modal transparent={true} animationType="fade" visible={loading}>
    <View style={styles.overlay}>
      <Image source={img} alt='no image'/>
      </View>
      </Modal>
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
  }, overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Setting;
