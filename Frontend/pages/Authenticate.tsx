import { View, Text,TouchableOpacity,TextInput,StyleSheet, Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import Lock from 'react-native-vector-icons/AntDesign'
import Email from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
const Authenticate = ({navigation}) => {
  const[show,setShow]=useState(true)
  const[value,setValue]=useState('Signup')
  const[username,setUsername]=useState('')
  const[email,setEmail]=useState('')
  const[password,setPassword]=useState('')
  const[token,setToken]=useState('')
  const shows=()=>{
    show ? setShow(false):setShow(true)
    show?setValue('Login'):setValue('Signup')
  }

    const settoken=async()=>{
      await AsyncStorage.setItem('token',token)
    }
    useEffect(() => {
      // After token is updated, save it to AsyncStorage
      settoken()
    }, [token])

  useEffect(()=>{
    const checkLoginorNot = async()=>{
        const tokens = await AsyncStorage.getItem('token')
        if(!tokens){
        console.log('login first')
      }else{
        navigation.navigate('First')
      }
    }
    checkLoginorNot()
  },[])

  const login = async(e)=>{
   try {
    e.preventDefault()
    await axios.post('http://192.168.1.7:3000/khelmela/login',{email,password},{
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then((response)=>{
        Alert.alert(response.data.message)
        setEmail('')
        setPassword('')
        setToken(response.data.data)
        
        navigation.navigate('Main')
    })
   } catch (error) {
    Alert.alert(error.response.data.message )
   }
        
  }
  const signin= async(e)=>{
try {
  e.preventDefault()
  await axios.post('http://192.168.1.7:3000/khelmela/signup',{username,email,password},{
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response)=>{
    Alert.alert(response.data.message)
    setShow((prev)=>!prev)
    setEmail('')
    setPassword('')
  })
} catch (error) {
  Alert.alert(error.response.data.message )
}

  }
  return (
    <View style={{ padding: 20,backgroundColor:'rgb(0,18,64)',width:'100%',height:'100%'}}>
      <TouchableOpacity onPress={()=>navigation.navigate('First')}><Icon name="arrowleft" size={30} color="white" /></TouchableOpacity>
      {
        show?<View style={styles.loginContainer}>
        <Text style={{ fontSize: 35, marginTop: 40,fontWeight:900,color:'white' }}>Log in</Text>
        <Email name="email-outline" size={30} color="orange" style={styles.loginemailIcon}/>
        <TextInput placeholder='Enter your email id' style={styles.input} value={email} onChangeText={(text)=>setEmail(text)}></TextInput>
                <Lock name='lock1' size={30} color='orange' style={styles.loginlockIcon}/>
        <TextInput placeholder='Enter your password' style={styles.input} value={password} onChangeText={(text)=>setPassword(text)}></TextInput>
        <Text  style={{ fontSize: 15, marginTop: 10,color:'red',marginLeft:140 }}>Forgot Password?</Text>
        <TouchableOpacity style={styles.button} onPress={login}><Text style={{ fontSize: 30,fontWeight:700,color:'white',textAlign:'center'}}>Login</Text></TouchableOpacity>
        <Text  style={{ fontSize: 30, marginTop: 20,fontWeight:400,color:'white' }}>OR</Text>
        </View>:<View style={styles.loginContainer}>
      <Text style={{ fontSize: 35, marginTop: 40,fontWeight:900,color:'white' }}>sign in</Text>
      <Icon name="user" size={30} color="orange" style={{position:'absolute',marginRight:260,marginTop:135,zIndex:10}}/>
      <TextInput placeholder='Enter your name' style={styles.input} value={username} onChangeText={(text)=>setUsername(text)}></TextInput>
      <Email name="email-outline" size={30} color="orange" style={styles.emailIcon}/>
      <TextInput placeholder='Enter your email id' style={styles.input} value={email} onChangeText={(text)=>setEmail(text)}></TextInput>
      <Lock name='lock1' size={30} color='orange' style={styles.lockIcon}/>
      <TextInput placeholder='Enter your password' style={styles.input} value={password} onChangeText={(text)=>setPassword(text)}></TextInput>
      <Text  style={{ fontSize: 15, marginTop: 10,color:'red',marginLeft:140 }}>Forgot Password?</Text>
      <TouchableOpacity style={styles.button} onPress={signin}><Text style={{ fontSize: 30,fontWeight:700,color:'white',textAlign:'center'}}>Signup</Text></TouchableOpacity>
      <Text  style={{ fontSize: 30, marginTop: 20,fontWeight:400,color:'white' }}>OR</Text>
      </View>
      }
      <View style={{display:'flex',flexDirection:'row',marginLeft:50,marginTop:150}}>
      <Text style={{ fontSize: 20,color:'white'}}>Don't have account ?  </Text>
      <TouchableOpacity onPress={shows}><Text style={{color:'orange',fontSize:20}}>{value}</Text></TouchableOpacity>
      </View>
    </View>
  )
}
const styles= StyleSheet.create({
    input:{
        width:300,
        height:50,
        paddingLeft:50,
        backgroundColor:'white',
        color:'black',
        borderWidth:3,
        borderColor:'orange',
        fontSize:18,
        marginTop:40
    },
    button:{
        width:300,
        height:50,
        borderRadius:20,
        backgroundColor:'orange',
        marginTop:40
        
    },
    loginContainer:{
        width:'100%',
        display:'flex',
        flexDirection:'column',
        alignItems:'center'

    },
    emailIcon:{
        position:'absolute',
        marginRight:260,
        marginTop:227,
        zIndex:20
    },
    lockIcon:{
        position:'absolute',
        marginTop:315,
        zIndex:20,
        marginRight:260
    },
    loginemailIcon:{
      position:'absolute',
      marginRight:255,
      marginTop:135,
      zIndex:20
    },
    loginlockIcon:{
      position:'absolute',
      marginTop:225,
      zIndex:20,
      marginRight:260
    }
})

export default Authenticate
