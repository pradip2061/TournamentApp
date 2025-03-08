import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
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
import ModalNotify from '../../components/ModalNotify';
import { CheckAdminContext } from '../ContextApi/ContextApi';
import { launchImageLibrary } from 'react-native-image-picker';

const Profile = () => { 
  
  const [username, setusername] = useState('');
  const [freefireName, setFreefireName] = useState('');
  const [freefireUid, setFreefireUid] = useState('');
  const [pubgName, setPubgName] = useState('');
  const [pubgUid, setPubgUid] = useState('');
  const[visible,setVisible]=useState(false)
  const[message,setMessage]=useState('')
  const[error,setError]=useState('')
 const{data}=useContext(CheckAdminContext)
 useEffect(()=>{
setFreefireName(data.gameName[0].freefire)
setFreefireUid(data?.uid?.[0]?.freefire)
setPubgName(data.gameName[0].pubg)
setPubgUid(data?.uid?.[0]?.pubg)
setusername(data?.username)
 },[data])
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
 axios.post(`${process.env.baseUrl}/khelmela/updateprofile`,{username},{
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
    axios.post(`${process.env.baseUrl}/khelmela/pubgname`,{pubgName,pubgUid},{
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
          axios.post(`${process.env.baseUrl}/khelmela/freefirename`,{freefireName,freefireUid},{
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

           const pickImage = () => {
            const options = {
              mediaType: 'photo',
              maxWidth: 800, // Set max width to reduce size
              maxHeight: 800, // Set max height to reduce size
              quality: 0.5, // Adjust compression quality (0.1 - 1)
              // includeBase64: true, // Convert image to base64
            };
        
            launchImageLibrary(options, (response) => {
              if (response.didCancel) {
                console.log('User cancelled image picker');
              } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
              } else {
                uploadImage(response?.assets?.[0]?.uri);
              // setImage(response?.assets?.[0]?.uri)
              }
            });
          };
          const uploadImage = async (image) => {
            const formData = new FormData();
            formData.append('image', {
              uri: image.uri.replace('file://', ''), // Fix the URI format
              name: `photo_${Date.now()}.jpg`, // Unique filename
              type: image.type || 'image/jpeg', // Correct MIME type
            });
          
            try {
              const response = await axios.post(`${process.env.baseUrl}/khelmela/upload`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
          
              console.log('Upload Success:', response.data);
            } catch (error) {
              console.error('Upload Error:', error);
            }
          };
  return (
        <LinearGradient
        colors={["#0f0c29", "#302b63", "#24243e"]}
        // Adjust colors to match the design
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.header}>Profile</Text>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
          <Image source={require('../../assets/player.png')} style={styles.profileImage} />
          <Text style ={styles.plusIcon}>+</Text>
          
        </TouchableOpacity>
        <View style={styles.emailContainer}>
          <Text style={styles.emailText}>Email:{data?.email}</Text>
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernamelabel}>Username:</Text>
         <TextInput  style={styles.input} 
         placeholder="example:raiden504" value={username}
         onChangeText={(text)=>setusername(text)} />
         <TouchableOpacity style={username == data?.email? styles.hoversave:styles.saveButton} onPress={updateprofile}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        </View>
      </View>
      <ModalNotify visible={visible} error={error} message={message}/>
      <View style={styles.line} />

      
      <Text style={styles.inputTitle}>ENTER YOUR  <Text style={{color:'yellow'}}>INGAME NAME</Text>  &  <Text style={{color:'yellow'}}>ID</Text></Text>

      {/* Freefire Section */}
      <View style={styles.gameContainer}>
        <Image source={require('../../assets/freefire.jpeg')} style={styles.gameIcon} />
        <Text style={styles.gameTitle}>Freefire</Text>
        <Text style={styles.label}>Ingame Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="example: radien"
          value={freefireName}
          onChangeText={setFreefireName}
        />
        <Text style={styles.label}>Uid:</Text>
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
        <Image source={require('../../assets/image.png')} style={styles.gameIcon} />
        <Text style={styles.gameTitle}>PUBG</Text>
        <Text style={styles.label}>Ingame Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="example: radien"
          value={pubgName}
          onChangeText={(text)=>setPubgName(text)}
        />
        <Text style={styles.label}>Uid:</Text>
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
    </LinearGradient>
    
  );
};

const styles = StyleSheet.create({
  container: {
    padding:20,
  },
  
  header: {
    fontWeight:'bold',
    fontSize:32,
    marginLeft:120,
    color:'white'
  },
  profileSection: {
    alignItems: 'center',
    marginTop:30,
    backgroundColor:'white',
    width:330,
    borderRadius:25,
    marginLeft:12,
    height:300,
    borderColor:'#ddd',
    borderWidth:1
    
  },
  
  profileImageContainer: {
    alignItems: 'center',
    position: 'relative',
    marginTop:7,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 100,
    borderWidth:2
    
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
    marginRight:10,
    width:250
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  usernameContainer: {
    marginTop: 10,
    
    padding: 10,
    borderRadius: 5,
    width:300,
  },
  usernameText: {
    fontSize: 100,
    fontWeight:'bold'
  },
  line: {
    height: 0.5,
    backgroundColor: '#F8FAFC',
    width: '100%',
    marginVertical: 20,
  },
  inputTitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight:'900',
    color:'white',
    paddingBottom:3,
    borderBottomWidth:1,
    width:280,
    marginLeft:35,
    borderBottomColor:'grey'
  },
  gameContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
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
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  hoversave:{
    backgroundColor: 'red',
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
  usernamelabel:{
    color:'Black',
    fontSize:17 

  },
   
});

export default Profile;