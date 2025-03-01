import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
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
  
  const [username, setusername] = useState('');
  const [freefireName, setFreefireName] = useState('');
  const [freefireUid, setFreefireUid] = useState('');
  const [pubgName, setPubgName] = useState('');
  const [pubgUid, setPubgUid] = useState('');
  const[data,setData]=useState([])
  const[visible,setVisible]=useState(false)
  const[message,setMessage]=useState('')
  const[error,setError]=useState('')
 
  useEffect(()=>{
    const getProfile =async()=>{
    const token =await AsyncStorage.getItem('token')
      try {
         axios.get('http://30.30.6.248:3000/khelmela/getprofile',{
          headers:{
            Authorization:`${token}`
          }
        })
        .then((response)=>{
          setData(response.data.data)
          setusername(response.data.data.username)
          setFreefireName(response.data.data.gameName[0].freefire)
          setFreefireUid(response.data.data.uid[0].freefire)
          setPubgName(response.data.data.gameName[0].pubg)
          setPubgUid(response.data.data.uid[0].pubg)
        })
      } catch (error) {
        console.log(error)
      }
       }
       getProfile()
  },[])

  const popup=()=>{
    setVisible(true)
    setTimeout(()=>{
setVisible(false)
    },1000)
  }
  const updateprofile = async()=>{
    setError('')
    setMessage('')
 try {
  const token =await AsyncStorage.getItem('token')
 axios.post('http://30.30.6.248:3000/khelmela/updateprofile',{username},{
  headers:{
    Authorization:`${token}`
  }
 })
 .then((response)=>{
  setMessage(response.data.message)
 })
 } catch (error) {
  setError(error.response.data.message)
 }finally{
  popup()
 }
  }
  const pubgname= async(e)=>{
e.preventDefault()
setError('')
    setMessage('')
    try {
     const token =await AsyncStorage.getItem('token')
    axios.post('http://30.30.6.248:3000/khelmela/pubgname',{pubgName,pubgUid},{
     headers:{
       Authorization:`${token}`
     }
    })
    .then((response)=>{
     setMessage(response.data.message)
    })
    } catch (error) {
     setError(error.response.data.message)
     console.log(error.response.data.message)
    }finally{
     popup()
    }
     }
     const freefirename= async(e)=>{
      e.preventDefault()
      setError('')
      setMessage('')
          try {
           const token =await AsyncStorage.getItem('token')
          axios.post('http://30.30.6.248:3000/khelmela/freefirename',{freefireName,freefireUid},{
           headers:{
             Authorization:`${token}`
           }
          })
          .then((response)=>{
           setMessage(response.data.message)
          })
          } catch (error) {
           setError(error.response.data.message)
          }finally{
           popup()
          }
           }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile</Text>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.profileImageContainer}>
          <Image source={require('../assets/player.png')} style={styles.profileImage} />
          <Text style ={styles.plusIcon}>+</Text>
          
        </TouchableOpacity>
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>Email:{data.email}</Text>
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernamelabel}>Username:{data.username}</Text>
         <TextInput  style={styles.input} 
         placeholder="example:raiden504" value={username}
         onChangeText={(text)=>setusername(text)} />
         <TouchableOpacity style={styles.saveButton} onPress={updateprofile}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        </View>
      </View>
      <ModalNotify visible={visible} error={error} message={message}/>
      <View style={styles.line} />

      
      <Text style={styles.inputTitle}>Enter your InGame name and ID</Text>

      {/* Freefire Section */}
      <View style={styles.gameContainer}>
        <Image source={require('../assets/freefire.jpeg')} style={styles.gameIcon} />
        <Text style={styles.gameTitle}>Freefire</Text>
        <Text style={styles.label}>Ingame Name:{data?.gameName?.[0]?.freefire || 'Not Available'}</Text>
        <TextInput
          style={styles.input}
          placeholder="example: radien"
          value={freefireName}
          onChangeText={setFreefireName}
        />
        <Text style={styles.label}>Uid:{data?.uid?.[0]?.freefire || 'Not Available'}</Text>
        <TextInput
          style={styles.input}
          placeholder="example: 2654841556"
          value={freefireUid}
          onChangeText={setFreefireUid}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.saveButton} onPress={freefirename}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* PUBG Section */}
      <View style={styles.gameContainer}>
        <Image source={require('../assets/image.png')} style={styles.gameIcon} />
        <Text style={styles.gameTitle}>PUBG</Text>
        <Text style={styles.label}>Ingame Name:{data?.gameName?.[0]?.pubg}</Text>
        <TextInput
          style={styles.input}
          placeholder="example: radien"
          value={pubgName}
          onChangeText={(text)=>setPubgName(text)}
        />
        <Text style={styles.label}>Uid:{data?.uid?.[0]?.pubg}</Text>
        <TextInput
          style={styles.input}
          placeholder="example: 2654841556"
          value={pubgUid}
          onChangeText={(text)=>setPubgUid(text)}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.saveButton} onPress={pubgname}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor:"#5D0EAD"
  },

  header: {
    fontWeight:'bold',
    fontSize:25,
    marginLeft:120,
    color:'white'
  },
  profileSection: {
    alignItems: 'center',
    marginTop:50,
    backgroundColor:'white',
    width:320,
    borderRadius:25,
    borderWidth:2,
    marginLeft:20
  },
  profileImageContainer: {
    alignItems: 'center',
    position: 'relative',
    marginTop:40,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    
  },
  plusIcon: {
    position: 'absolute',
    bottom: -17,
    right: -7,
    fontSize: 40,
    color: 'black',
  },
  emailContainer: {
    marginTop: 10,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 15,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  usernameContainer: {
    marginTop: 5,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    width:300,
  },
  usernameText: {
    fontSize: 16,
  },
  line: {
    height: 4,
    backgroundColor: '#000',
    width: '100%',
    marginVertical: 20,
  },
  inputTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight:'bold',
    color:'white'
  },
  gameContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  gameIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop:650
  // Semi-transparent background
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth:2,
    borderColor:'orange',
    marginTop:35
  },
  title: {
    fontSize: 20,
    fontWeight:900
  },
   
});

export default Profile;
