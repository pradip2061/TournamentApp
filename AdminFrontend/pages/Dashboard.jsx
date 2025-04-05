import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../env';

const Dashboard = ({navigation}) => {
  const [userdata, setUserdata] = useState({});
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

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
    navigation.navigate('LandingChat');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Admin Panel</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setModalVisible(true)}>
          <Image source={require('../assets/logout.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.adminInfo}>
        <Image source={{uri: userdata.image}} style={styles.profileImage} />
        <View>
          <Text style={styles.infoText}>Username: {userdata?.username} </Text>
          <Text style={styles.infoText}>Email: {userdata?.email} </Text>
        </View>
      </View>

      <View style={styles.line} />

      <Text style={styles.dashboardTitle}>Dashboard</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.box} onPress={() => handleDeposite()}>
          <Image
            source={require('../assets/deposit.png')}
            style={styles.boxImage}
          />
          <Text style={styles.boxText}>Money Request </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('UploadPhoto')}>
          <Image
            source={require('../assets/game.png')}
            style={styles.boxImage}
          />
          <Text style={styles.boxText}>Match Result </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('PowerRoom')}>
          <Image
            source={require('../assets/user.png')}
            style={styles.boxImage}
          />
          <Text style={styles.boxText}>Power Room</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.box}
          onPress={() => navigation.navigate('GamePannel')}>
          <Image
            source={require('../assets/withdrawwallet.png')}
            style={styles.boxImage}
          />
          <Text style={styles.boxText}> Live Tournament </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeContainer}>
        <TouchableOpacity
          onPress={() => {
            console.log('Landing Chat .........');
            handleChatPress();
          }}>
          <Image
            source={require('../assets/home.webp')}
            style={styles.homeIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButtonCancel}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonYes}
                onPress={() => {
                  AsyncStorage.clear();
                }}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2A3C',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#fff',
    backgroundColor: '#23A5B7',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoutButton: {
    padding: 5,
  },
  icon: {
    width: 45,
    height: 45,
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#23A5B7',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 20,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 15,
    textTransform: 'uppercase',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  box: {
    width: 150,
    height: 130,
    backgroundColor: '#fff',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  boxImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  boxText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E2A3C',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  homeContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  homeIcon: {
    width: 50,
    height: 50,

    marginTop: -30,
    borderRadius: 25,
    padding: 10,
    elevation: 5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent backdrop
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E2A3C',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonCancel: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonYes: {
    flex: 1,
    backgroundColor: '#23A5B7',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Dashboard;
