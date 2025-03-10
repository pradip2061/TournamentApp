import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {jwtDecode} from 'jwt-decode';

const LandingChat = ({navigation, route}) => {
  const {friends} = route.params;
  const [user, setUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFriends, setFilteredFriends] = useState(friends);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded = jwtDecode(token);
        setUser(decoded.id);
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    getUser();
  }, []); // Run only on component mount

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFriends(friends);
    } else {
      const fetchFilteredFriends = async () => {
        try {
          const response = await axios.get(
            `${process.env.baseUrl}/khelmela/users/search?name=${searchTerm}`,
          );
          setFilteredFriends(response.data);
        } catch (error) {
          console.error('Error fetching filtered friends:', error);
          setFilteredFriends([]);
        }
      };
      fetchFilteredFriends();
    }
  }, [searchTerm, friends]);

  const handleOnpress = item => {
    navigation.navigate('PrivateChat', {
      userId: user,
      FriendId: item.id,
      photoUrl: item.photoUrl,
      name: item.name,
    });
  };

  return (
    <View style={styles.mainCointainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Chat</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search player ......."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        <FlatList
          data={filteredFriends}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleOnpress(item)}>
              <View style={styles.friends}>
                <Image source={{uri: item.photoUrl}} style={styles.image} />
                <Text style={styles.friendstext}>{item.username}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default LandingChat;

const styles = StyleSheet.create({
  mainCointainer: {
    backgroundColor: '#5DADB0',
    height: '100%',
  },
  container: {
    padding: 16,
    backgroundColor: '#5DADB0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  searchBar: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  friends: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#5DADB0',
    marginVertical: 8,
    borderRadius: 10,
    elevation: 4,
    borderWidth: 1,
  },
  image: {
    width: 40,
    height: 40,
    backgroundColor: '#ccc',
    borderRadius: 20,
    marginRight: 12,
  },
  friendstext: {
    fontSize: 16,
    fontWeight: '500',
  },
});