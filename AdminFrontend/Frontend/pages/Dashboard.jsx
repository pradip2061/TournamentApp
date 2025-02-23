import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const Dashboard = () => {
  const navigation = useNavigation();

  const handleDeposite = () => {
    navigation.navigate('AdminHome');
  };

  const findFriends = async () => {
    // axios.get(`${IP}:${host}/findFriends/${Id}`);
    const friends = [
      {id: '1', name: 'Radiden'},
      {id: '2', name: 'Pradip'},
      {id: '3', name: 'Sagar'},
      {id: '4', name: 'Rohan'},
      {id: '5', name: 'Rahul'},
      {id: '6', name: 'Gaurav'},
      {id: '7', name: 'Arjun'},
    ];
    navigation.navigate('LandingChat', {friends: friends});
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Admin Panel</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Login')}>
          <Image source={require('../assets/logout.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Admin Info */}
      <View style={styles.adminInfo}>
        <Image
          source={require('../assets/arjunadmin.png')}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.infoText}>Admin: Arjun Neupane</Text>
          <Text style={styles.infoText}>Username: raiden</Text>
          <Text style={styles.infoText}>Email: raidendemoid@gmail.com</Text>
          <Text style={styles.infoText}>Contact No: 9825662991</Text>
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
          <Text style={styles.boxText}>Money Deposit</Text>
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

        {/* Withdraw Request */}
        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('AdminHome')}>
          <Image
            source={require('../assets/withdrawwallet.png')}
            style={styles.boxImage}
          />
          <Text style={styles.boxText}>Withdraw Request</Text>
        </TouchableOpacity>
      </View>

      {/* Home Icon */}
      <View style={styles.homeContainer}>
        <TouchableOpacity
          onPress={() => {
            findFriends();
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
