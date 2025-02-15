import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const Profile = () => { 
  
  const [username, setusername] = useState('');
  const [freefireName, setFreefireName] = useState('');
  const [freefireUid, setFreefireUid] = useState('');
  const [pubgName, setPubgName] = useState('');
  const [pubgUid, setPubgUid] = useState('');

  
  const handleSave = (game) => {
    console.log(`${game} Saved:`, game === 'Freefire' ? { freefireName, freefireUid } : { pubgName, pubgUid });
    alert(`${game} details saved!`);
  };

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
          <Text style={styles.emailText}>Email: raidendemoid@gmail.com</Text>
        </View>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernamelabel}>Username:</Text>
         <TextInput  style={styles.input} 
         placeholder="example:raiden504" value={username}
         onChangeText={setusername} />
         <TouchableOpacity style={styles.saveButton} onPress={() => handleSave('Username')}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        </View>
      </View>

      
      <View style={styles.line} />

      
      <Text style={styles.inputTitle}>Enter your InGame name and ID</Text>

      {/* Freefire Section */}
      <View style={styles.gameContainer}>
        <Image source={require('../assets/freefire.jpeg')} style={styles.gameIcon} />
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
        <TouchableOpacity style={styles.saveButton} onPress={() => handleSave('Freefire')}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* PUBG Section */}
      <View style={styles.gameContainer}>
        <Image source={require('../assets/image.png')} style={styles.gameIcon} />
        <Text style={styles.gameTitle}>PUBG</Text>
        <Text style={styles.label}>Ingame Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="example: radien"
          value={pubgName}
          onChangeText={setPubgName}
        />
        <Text style={styles.label}>Uid:</Text>
        <TextInput
          style={styles.input}
          placeholder="example: 2654841556"
          value={pubgUid}
          onChangeText={setPubgUid}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.saveButton} onPress={() => handleSave('PUBG')}>
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
    borderWidth:2


    
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
    borderRadius:15
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
});

export default Profile;
