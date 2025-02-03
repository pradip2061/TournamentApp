import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const FirstPage = ({ navigation }) => {
  const [hover, setHover] = useState(false)

  return (
    <View style={styles.container}>
      <View style={styles.logo} />
      <Text style={styles.title}>ESPORTS</Text>
      <Text style={styles.subtitle}>First Step to Esports journey</Text>
      <Text style={styles.description}>Our app main goal is to promote esports in Nepal</Text>

      <TouchableOpacity
        style={hover ? styles.buttonHover : styles.button}
        onPressIn={() => setHover(true)}
        onPressOut={() => {
          setHover(false)
          navigation.navigate('Authenticate')
        }}
      >
        <Text style={hover ? styles.buttonTextHover : styles.buttonText}>GET STARTED</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(0,18,64)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderColor: 'white',
    borderWidth: 2,
    marginTop: 150,
  },
  title: {
    color: 'white',
    fontSize: 30,
    marginTop: 30,
  },
  subtitle: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 40,
    fontFamily: 'sans-serif',
    textAlign: 'center',
  },
  description: {
    color: 'white',
    fontSize: 16,
    marginTop: 150,
    textAlign: 'center',
  },
  button: {
    width: 300,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: 100,
    justifyContent: 'center',
  },
  buttonHover: {
    width: 300,
    height: 40,
    backgroundColor: 'rgb(0,18,64)',
    borderRadius: 20,
    marginTop: 100,
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 25,
    textAlign: 'center',
    color: 'black',
  },
  buttonTextHover: {
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
  },
})

export default FirstPage
