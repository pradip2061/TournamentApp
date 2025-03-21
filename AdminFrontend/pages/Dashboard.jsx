import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../env';
const Dashboard = ({navigation}) => {
  const [userdata, setUserdata] = useState({});
  useEffect(() => {
    const getdata = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Unauthorized ', 'Please login to access dashboard');
        navigation.navigate('Authenticate');
        return;
      }

      const response = await axios.get(
        `${BASE_URL}/khelmela/userRequest/user`,
        {
          headers: {Authorization: `${token}`},
        },
      );
      setUserdata(response.data);
    };
    getdata();
  }, []);

  const handleDeposite = () => {
    navigation.navigate('AdminHome');
  };

  const handleChatPress = async () => {
    console.log('Chat Press...........');
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(
      `${BASE_URL}/khelmela/userRequest/friends`,
      {
        headers: {Authorization: `${token}`},
      },
    );

    console.log(response);
    navigation.navigate('LandingChat', {friends: response.data});
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Admin Panel</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            AsyncStorage.clear;
            navigation.navigate('Authenticate');
          }}>
          <Image source={require('../assets/logout.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Admin Info */}
      <View style={styles.adminInfo}>
        <Image source={{uri: userdata.image}} style={styles.profileImage} />
        <View>
          <Text style={styles.infoText}>Username: {userdata?.username} </Text>
          <Text style={styles.infoText}>Email: {userdata?.email} </Text>
          <Text style={styles.infoText}>Contact No: {userdata?.number}</Text>
        </View>
      </View>

      <View style={styles.line} />

      {/* Dashboard Title */}
      <Text style={styles.dashboardTitle}>Dashboard</Text>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        {/* Money Deposit */}
        <TouchableOpacity style={styles.box} onPress={handleDeposite}>
          <Image
            source={require('../assets/deposit.png')}
            style={styles.boxImage}
          />
          <Text style={styles.boxText}>Money Request </Text>
        </TouchableOpacity>

        {/* Games Data */}
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('UploadPhoto')}>
          <Image
            source={require('../assets/game.png')}
            style={styles.boxImage}
          />
          <Text style={styles.boxText}>Match Validation </Text>
        </TouchableOpacity>

        {/* User Data */}
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('PowerRoom')}>
          <Image
            source={require('../assets/user.png')}
            style={styles.boxImage}
          />
          <Text style={styles.boxText}>Power Room</Text>
        </TouchableOpacity>

        {/* GamePannel  */}
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('GamePannel')}>
          <Image
            source={require('../assets/withdrawwallet.png')}
            style={styles.boxImage}
          />
          <Text style={styles.boxText}> Tournament </Text>
        </TouchableOpacity>
      </View>

      {/* Home Icon */}
      <View style={styles.homeContainer}>
        <TouchableOpacity
          onPress={() => {
            console.log('Landing Chat .........');
            handleChatPress();
          }}>
          <Image
            source={require('../assets/home.png')}
            style={styles.homeIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23A5B7',
    padding: 10,
  },

  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginLeft: 80,
    marginTop: 55,
    width: 170,
    backgroundColor: '#fff',
  },
  logoutButton: {
    position: 'absolute',
    marginLeft: 295,
  },
  icon: {
    width: 50,
    height: 45,
  },
  adminInfo: {
    justifyContent: 'center',
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginLeft: 5,
  },
  profileImage: {
    width: 70,
    height: 70,
    marginBottom: 5,
    borderRadius: 50,
  },
  infoText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  line: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    marginVertical: 1,
    marginTop: 40,
  },

  dashboardTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 20,
  },
  box: {
    width: 130,
    height: 110,
    backgroundColor: '#e0e0e0',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  boxImage: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  boxText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  homeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70,
  },
  homeIcon: {
    width: 40,
    height: 40,
  },
});

export default Dashboard;
