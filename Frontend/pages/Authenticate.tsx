import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Image, ActivityIndicator, BackHandler } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import Lock from 'react-native-vector-icons/AntDesign'
import Email from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import Modal from "react-native-modal";
import { useFocusEffect } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient'
const Authenticate = ({ navigation }) => {
  const [show, setShow] = useState(true)
  const [value, setValue] = useState('Signup')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [otp, setOtp] = useState("")
  const [otpmodel, setOtpmodel] = useState(false)
  const [loading, setLoading] = useState(false)
  const[resetModal,setResetModal]=useState(false)
  const[verifyModal,setVerifyModal]=useState(false)
  const[confirmPassword,setConfirmPassword]=useState('')
  const[newPassword,setNewPassword]=useState('')
  const shows = () => {
    show ? setShow(false) : setShow(true)
    show ? setValue('Login') : setValue('Signup')
  }

  const settoken = async () => {
    const expiresIn = 24 * 60 * 60 * 1000;
    const expiryTime = Date.now() + expiresIn;
    await AsyncStorage.setItem('token', token)
    await AsyncStorage.setItem('tokenExpiry', expiryTime.toString())
  }
  useEffect(() => {
    // After token is updated, save it to AsyncStorage
    settoken()
  }, [token])



  const login = async (e) => {
    try {
      e.preventDefault()
      if (!email || !password) {
        return
      }
      setLoading(true)
      await axios.post(`${process.env.baseUrl}/khelmela/login`, { email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          Alert.alert(response.data.message)
          setEmail('')
          setPassword('')
          setToken(response.data.data)
          navigation.navigate('Main')
        })
    } catch (error) {
      setError(error?.response?.data?.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const sendOtp = async () => {
    try {
      setLoading(true)
      await axios.post(`${process.env.baseUrl}/khelmela/verifyotp`, { otp, username, email, password })
        .then((response) => {
          Alert.alert(response.data.message)
          setEmail('')
          setPassword('')
          setUsername('')
          setOtp('')
          setError('')
          if (response.status == 200) {
            setOtpmodel(false)
            setShow((prev) => !prev)
          }
        })
    } catch (error) {
      setError(error?.response?.data?.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }
  const signin = async (e) => {
    try {
      e.preventDefault()
      if (!username || !email || !password) {
        return
      }
      setLoading(true)
      await axios.post('http://30.30.14.54:3000/khelmela/sendOtp', { username, email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          if (response.status == 200) {
            setError('')
            setOtpmodel(true)
          }

        })
    } catch (error) {
      setError(error.response.data.message)
      console.log(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true; // Prevent default back action
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

      return () => backHandler.remove(); // Remove event listener when screen is unfocused
    }, [])
  );
  const resetPassword =async()=>{
    setLoading(true)
   try {
    const response =await axios.post(`${process.env.baseUrl}/khelmela/forgetpassword`,{email})
    if(response.status == 200){
      setResetModal(false)
      setVerifyModal(true)
    }
   } catch (error) {
    setError(error.response.data.message)
   }finally{
    setLoading(false)
   }
  }

  const verifyforgetpassword=async()=>{
    setLoading(true)
   try {
    const response =await axios.post(`${process.env.baseUrl}/khelmela/verifyforgetpassword`,{email,otp,newPassword,confirmPassword})
    if(response.status ==200){
      Alert.alert('password changed!!')
      setVerifyModal(false)
      setShow((prev)=>!prev)
      setValue((prev)=>"Login")
      setError('')
    }
   } catch (error) {
    setError(error.response.data.message)
   }finally{
    setLoading(false)
   }
  }
  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.gradient}
    >
      <View style={{ padding: 20, width: '100%', height: '100%' }}>

        <TouchableOpacity onPress={() => navigation.navigate('First')} style={{ position: 'absolute', left: 5 , top:19}}>
          <Icon name="arrowleft" size={40} color="white" />
        </TouchableOpacity>

        {
          show ? <View style={styles.loginContainer}>
            <Text style={{ fontSize: 37, marginTop: 40, fontWeight: 900, color: 'white' }}>Log in</Text>
            <Email name="email-outline" size={30} color="black" style={styles.loginemailIcon} />
            <TextInput placeholder="Enter your email id" style={[styles.input, email === '' && styles.placeholderShift]} placeholderTextColor="gray" value={email} onChangeText={setEmail} />

            <Lock name='lock1' size={30} color='black' style={styles.loginlockIcon} />
            <TextInput placeholder="Enter your password" secureTextEntry style={[styles.input, password === '' && styles.placeholderShift]} placeholderTextColor="gray" value={password} onChangeText={setPassword} />

            <Text style={{ color: 'white', fontSize: 20 }}>{error}</Text>
            <Text style={{ fontSize: 15, marginTop: 10, color: 'red', marginLeft: 189 }}>Forgot Password?</Text>
            <TouchableOpacity style={styles.button} onPress={login}><Text style={{ fontSize: 30, fontWeight: 700, color: 'white', textAlign: 'center' }} disabled={loading}>Login</Text></TouchableOpacity>
            <Text style={{ fontSize: 30, marginTop: 20, fontWeight: 400, color: 'white' }}>OR</Text>
          </View> : <View style={styles.loginContainer}>
            <Text style={{ fontSize: 40, marginTop: 30, fontWeight: 900, color: 'white' }}>Sign in</Text>
            <Icon name="user" size={30} color="black" style={{ position: 'absolute', marginRight: 260, marginTop: 135, zIndex: 10 }} />
            <TextInput placeholder="Enter your username" style={[styles.input, username === '' && styles.placeholderShift]} placeholderTextColor="gray" value={username} onChangeText={setUsername} />

            <Email name="email-outline" size={30} color="black" style={styles.emailIcon} />
            <TextInput placeholder="Enter your email id" style={[styles.input, email === '' && styles.placeholderShift]} placeholderTextColor="gray" value={email} onChangeText={setEmail} />
            <Lock name='lock1' size={30} color='black' style={styles.lockIcon} />
            <TextInput placeholder="Enter your password" secureTextEntry style={[styles.input, password === '' && styles.placeholderShift]} placeholderTextColor="gray" value={password} onChangeText={setPassword} />
            <TouchableOpacity style={styles.button} onPress={signin}><Text style={styles.signupButton} disabled={loading}>Signup</Text></TouchableOpacity>
            <Text style={{ fontSize: 30, marginTop: 20, fontWeight: 400, color: 'white' }}>or</Text>
          </View>
        }
        <View style={{ display: 'flex', flexDirection: 'row', marginLeft: 30, marginTop: 210 }}>
          <Text style={{ fontSize: 20, color: 'white' }}>   {value === "Login" ? "Already account exist? " : "Don't have account? "}</Text>
          <TouchableOpacity onPress={shows}><Text style={{ color: 'green', fontSize: 20 }}>{value}</Text></TouchableOpacity>
        </View>
        {
          loading ? <View style={styles.overlay}><ActivityIndicator color="#fff" size={'large'} /></View> : null
        }
        <Modal isVisible={otpmodel} animationIn="zoomIn" animationOut="zoomOut">
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity style={styles.CloseButton} onPress={() => setOtpmodel(false)}>
              <Icon name="close" size={24} color="black" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Enter OTP</Text>

            {/* Email Input */}
            <TextInput
              style={styles.inputs}
              placeholder="Enter email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}

            />

            {/* OTP Input */}
            <TextInput
              style={styles.inputs}
              placeholder="Enter OTP"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
            />
            <Text style={{ color: 'red' }}>{error}</Text>
            {/* Send Button */}
            <TouchableOpacity style={styles.sendButton} disabled={loading}>
              <Text style={loading ? styles.sendButtonText : styles.buttonpress} onPress={sendOtp}>{loading ? '...loading' : 'send'}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal isVisible={resetModal} animationIn="zoomIn" animationOut="zoomOut">
      <View style={styles.modalContainer}>
        {/* Close Button */}
        <TouchableOpacity style={styles.CloseButton} onPress={()=>setResetModal(false)}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Enter the email</Text>

        {/* Email Input */}
        <TextInput
          style={styles.inputs}
          placeholder="Enter email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={{color:'red'}}>{error}</Text>
        {/* Send Button */}
        <TouchableOpacity style={styles.sendButton} disabled={loading}>
          <Text style={loading ?styles.sendButtonText :styles.buttonpress} onPress={resetPassword}>{loading  ?'...loading':'send'}</Text>
        </TouchableOpacity>
      </View>
    </Modal>

    <Modal isVisible={verifyModal} animationIn="zoomIn" animationOut="zoomOut">
      <View style={styles.modalContainer}>
        {/* Close Button */}
        <TouchableOpacity style={styles.CloseButton} onPress={()=>setVerifyModal(false)}>
          <Icon name="close" size={24} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Enter the otp</Text>

        {/* Email Input */}
        <TextInput
          style={styles.inputs}
          placeholder="Enter email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.inputs}
          placeholder="Enter OTP"
          keyboardType="numeric"
          value={otp}
          onChangeText={setOtp}
        />
            <TextInput
          style={styles.inputs}
          placeholder="new Password"
          keyboardType="numeric"
          value={newPassword}
          onChangeText={setNewPassword}
        />
            <TextInput
          style={styles.inputs}
          placeholder="Confirm Password"
          keyboardType="numeric"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Text style={{color:'red'}}>{error}</Text>
        {/* Send Button */}
        <TouchableOpacity style={styles.sendButton} disabled={loading}>
          <Text style={loading ?styles.sendButtonText :styles.buttonpress} onPress={verifyforgetpassword}>{loading  ?'...loading':'send'}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
      </View>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({

  input: {
    width: 325,
    height: 50,
    paddingLeft: 60,
    backgroundColor: 'white',
    color: 'black',
    borderWidth: 1,
    borderRadius: 19,

    fontSize: 18,
    marginTop: 40
  },
  placeholderShift: {
    paddingLeft: 60, // Apply extra left padding only for placeholder
  },
  gradient: {
    padding: 20,

  },
  button: {
    width: 300,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#007BFF',
    marginTop: 25

  },
  loginContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop:15

  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  emailIcon: {
    position: 'absolute',
    marginRight: 260,
    marginTop: 227,
    zIndex: 20
  },
  lockIcon: {
    position: 'absolute',
    marginTop: 315,
    zIndex: 20,
    marginRight: 260
  },
  loginemailIcon: {
    position: 'absolute',
    marginRight: 255,
    marginTop: 135,
    zIndex: 20
  },
  loginlockIcon: {
    position: 'absolute',
    marginTop: 225,
    zIndex: 20,
    marginRight: 260
  },
  closeButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    position: "relative",
  },
  CloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputs: {
    width: 250,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  sendButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonpress: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupButton: {
    fontSize: 30, fontWeight: 700, color: 'white', textAlign: 'center'
  },
  signupButtonDisable: {
    backgroundColor: 'grey'
  }
})

export default Authenticate