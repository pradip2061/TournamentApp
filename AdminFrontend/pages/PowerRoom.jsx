import axios from 'axios';
import React, {useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {baseUrl} from '../env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PowerRoom = () => {
  const [id, setId] = useState('');
  const [option, setOption] = useState('Id');
  const [user, setUser] = useState({});
  const [balance, setBalance] = useState('');
  const [trophy, setTrophy] = useState('');
  const [message, setMessage] = useState('No update Initiated ');
  const [matchMessage, setMatchMessage] = useState('Search Match ');
  const [matchId, setMatchId] = useState('');
  const [match, setMatch] = useState({});

  const item = {
    gunAttribute: 'true',
    betAmount: 100,
    coin: 'Default',
    round: 3,
    headshot: 'yes',
  };

  const getUser = async id => {
    if (!id) {
      setMessage('Please enter a valid ID');
      return;
    }
    try {
      console.log(`Fetching user: ${baseUrl}/khelmela/user/${id}`);
      const response = await axios.get(`${baseUrl}/khelmela/user/${id}`);
      setUser(response.data);
      setBalance(response.data.balance?.toString() || '');
      setTrophy(response.data.trophy?.toString() || '');
    } catch (error) {
      console.log('Error fetching user:', error);
      setMessage('User not found');
    }
  };

  const searchMatch = async matchId => {
    try {
      console.log(`${baseUrl}/khelmela/getMatch/${matchId}`);
      const response = await axios.get(
        `${baseUrl}/khelmela/getMatch/${matchId}`,
      );
      setMatch(response.data);
    } catch (error) {
      console.log('Error fetching match:', error);
      setMatchMessage('Match not found');
    }
  };

  const updateUser = async () => {
    const adminId = '67c51b3e4dc5c2c8ab9f4137';

    if (!id) {
      setMessage('Please enter a valid user ID');
      return;
    }

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
            <TouchableOpacity style={styles.button}>
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

          <View style={styles.messagebox}>
            <Text style={styles.messagetext}>{message}</Text>
          </View>
        </View>

        <View style={[styles.box, {height: 500}]}>
          <Text style={styles.header}> Search for Match</Text>

          <View style={styles.itemwrapper}>
            <TextInput
              placeholder={'Match_id'}
              style={styles.input}
              onChangeText={value => {
                setMatchId(value.trim());
              }}
            />
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#cdcdcd'}]}
              onPress={() => searchMatch(matchId)}>
              <Text> Search</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>user-Host</Text>

          <Text style={styles.info.infobox}> ID: {user?.id}</Text>
          <Text style={styles.info.infobox}>Email : {user?.email}</Text>

          <View style={styles.itemwrapper}></View>

          <Text style={styles.userName}> user2 </Text>
          <Text style={styles.info.infobox}> ID: {user?.id}</Text>
          <Text style={styles.info.infobox}> Email: {user?.email}</Text>

          <View style={styles.itemwrapper}></View>

          <Text style={styles.info}></Text>

          <View style={[styles.itemwrapper, {marginTop: -15}]}>
            <View style={styles.column}>
              <Text style={styles.infoMatch}>🎮 Mode:{item?.user} </Text>
              <Text style={styles.infoMatch}>🔫 skills:{item?.skill}</Text>
              <Text style={styles.infoMatch}>🎯 Headshot:{item?.headshot}</Text>
              <Text style={styles.infoMatch}>🗺️ match:{item?.match}</Text>
            </View>
            <View style={styles.itemwrapper}>
              <View style={styles.column}>
                <Text style={styles.infoMatch}>
                  💥 Limited Ammo:{item?.ammo}
                </Text>
                <Text style={styles.infoMatch}>🔄 Rounds:{item?.round}</Text>
                <Text style={styles.infoMatch}>💰 Coin:{item?.coin} </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.info, {fontSize: 20}]}>
            🏆 Prize:{item?.betAmount * 1.8}
          </Text>
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
});

export default PowerRoom;
