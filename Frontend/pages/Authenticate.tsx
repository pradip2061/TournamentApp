import { View, Text,TouchableOpacity,TextInput,StyleSheet} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import Lock from 'react-native-vector-icons/AntDesign'
import Email from 'react-native-vector-icons/MaterialCommunityIcons'
const Authenticate = ({navigation}) => {
  return (
    <View style={{ padding: 20,backgroundColor:'rgb(0,18,64)',width:'100%',height:'100%'}}>
      <TouchableOpacity onPress={()=>navigation.navigate('First')}><Icon name="arrowleft" size={30} color="white" /></TouchableOpacity>
      <View style={styles.loginContainer}>
      <Text style={{ fontSize: 35, marginTop: 40,fontWeight:900,color:'white' }}>Log in</Text>
      <Email name="email-outline" size={30} color="orange" style={styles.emailIcon}/>
      <TextInput placeholder='Enter your email id' style={styles.input}></TextInput>
      <Lock name='lock1' size={30} color='orange' style={styles.lockIcon}/>
      <TextInput placeholder='Enter your password' style={styles.input}></TextInput>
      <Text  style={{ fontSize: 15, marginTop: 10,color:'red',marginLeft:140 }}>Forgot Password?</Text>
      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Main')}><Text style={{ fontSize: 35,fontWeight:700,color:'white',textAlign:'center'}}>Login</Text></TouchableOpacity>
      <Text  style={{ fontSize: 30, marginTop: 20,fontWeight:400,color:'white' }}>OR</Text>
      <Text  style={{ fontSize: 26, marginTop: 20,fontWeight:900,color:'white' }}>login with</Text>
      </View>
      <Text style={{ fontSize: 20,color:'white',marginLeft:40,marginTop:130}}>Don't have acccount ? <Text style={{color:'orange'}}>Signup</Text></Text>
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
        marginTop:137,
        zIndex:20
    },
    lockIcon:{
        position:'absolute',
        marginTop:225,
        zIndex:20,
        marginRight:260
    }
})

export default Authenticate
