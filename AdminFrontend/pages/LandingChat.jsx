import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';
const LandingChat = ({navigation, route}) => {
  const {friends} = route.params;
  const handleOnpress = ID => {
    navigation.navigate('Chat', {userId: '123', FriendId: ID});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat</Text>

      <FlatList
        data={friends} // Pass the array directly
        keyExtractor={item => item.id} // Use id for key
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleOnpress(item.id)}>
            <View style={styles.friends}>
              <View style={styles.image}></View>
              <Text style={styles.friendstext}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default LandingChat;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  friends: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
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
