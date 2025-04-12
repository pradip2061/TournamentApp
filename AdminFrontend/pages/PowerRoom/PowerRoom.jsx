import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {baseUrl} from '../../env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import AccountHistoryModal from '../../components/AccountHistory';

const PowerRoom = () => {
  const [id, setId] = useState('');
  const [option, setOption] = useState('Id');
  const [user, setUser] = useState({});
  const [balance, setBalance] = useState('');
  const [trophy, setTrophy] = useState('');
  const [message, setMessage] = useState('No update Initiated ');

  const [match, setMatch] = useState({});
  const [token, setToken] = useState('');
  const [historyVisible, setHistoryVisible] = useState(false);
  let user1;

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setMessage('Please login first');
        return;
      }
      setToken(token);
      const adminId = await jwtDecode(token).id;
      console.log('admin___id: ', adminId);
    };
    getToken();
  }, []);

  const getUser = async id => {
    if (!id) {
      setMessage('Please enter a valid ID');
      return;
    }
    try {
      const response = await axios.get(`${baseUrl}/khelmela/userRequest/user`, {
        headers: {Authorization: `${token}`},
      });
      setUser(response.data);
      user1 = response.data;

      setBalance(response.data.balance?.toString() || '');
      setTrophy(response.data.trophy?.toString() || '');
    } catch (error) {
      console.log('Error fetching user:', error);
      setMessage('User not found');
    }
  };

  const updateUser = async () => {
    try {
      const updatedData = {
        balance: Number(balance) || 0,
        trophy: Number(trophy) || 0,
      };

      console.log('Updating user:', updatedData);

      const response = await axios.post(
        `${baseUrl}/khelmela/admin/updateUser/${adminId}/${id}`,
        updatedData,
      );

      setMessage(`${user.username} ${response.data.message}`);
    } catch (error) {
      console.log('Error updating user:', error);
      setMessage('Failed to update user');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Power Room</Text>

        {/* User box  */}

        <View style={styles.box}>
          <Text style={styles.header}>Search for User</Text>
          <View style={styles.itemwrapper}>
            <TextInput
              placeholder={option}
              style={styles.input}
              onChangeText={value => setId(value.trim())}
            />
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#cdcdcd'}]}
              onPress={() => getUser(id)}>
              <Text>Search</Text>
            </TouchableOpacity>
          </View>

          {user?.image && (
            <View style={styles.imageContainer}>
              <Image source={{uri: user.image}} style={styles.userImage} />
            </View>
          )}

          <Text style={styles.info}>ID: {user?._id || 'N/A'}</Text>
          <Text style={styles.info}>Email: {user?.email || 'N/A'}</Text>
          <Text style={styles.info}>Name: {user?.username || 'N/A'}</Text>

          <View style={styles.itemwrapper}>
            <Text style={styles.info}>Balance:</Text>
            <TextInput
              style={[styles.info, styles.update]}
              value={balance}
              keyboardType="numeric"
              onChangeText={value => setBalance(value)}
            />
          </View>

          <View style={styles.itemwrapper}>
            <Text style={styles.info}>Trophy🏆:</Text>
            <TextInput
              style={[styles.info, styles.update]}
              value={trophy}
              keyboardType="numeric"
              onChangeText={value => setTrophy(value)}
            />
          </View>

          <View style={styles.itemwrapper}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                console.log('User from power room: ', user);
                if (!user.username) {
                  Alert.alert(
                    'User not Found !',
                    'Please search for a user first',
                  );
                  return;
                } else {
                  setHistoryVisible(true);
                }
              }}>
              <Text style={{color: 'white'}}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {marginLeft: '55%', backgroundColor: 'green'},
              ]}
              onPress={updateUser}>
              <Text style={{color: 'white'}}>Update</Text>
            </TouchableOpacity>
          </View>

          <AccountHistoryModal
            visible={historyVisible}
            user={user}
            onClose={() => {
              setHistoryVisible(false);
            }}
          />

          <View style={styles.messagebox}>
            <Text style={styles.messagetext}>{message}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#DFF8EB', flex: 1},
  box: {
    backgroundColor: '#DFF8EB',
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
  },
  header: {fontSize: 20, fontWeight: 'bold'},
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    width: 200,
  },
  info: {marginVertical: 5},
  update: {
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderRadius: 10,
    height: 37,
    width: 70,
    textAlign: 'center',
  },
  messagebox: {
    backgroundColor: 'white',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  itemwrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    width: 80,
    height: 40,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
  },

  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

export default PowerRoom;
