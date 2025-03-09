import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io(process.env.baseUrl);

console.log('baseUrl', process.env.baseUrl);

const PrivateChat = ({route}) => {
  const {userId, FriendId, name} = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const roomId = [userId, FriendId].sort().join('<->'); // Unique room ID

  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('message', message => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('message');
    };
  }, [roomId]);

  useEffect(() => {
    console.log(`${process.env.baseUrl}/khelmela/chat/${roomId}`);
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://192.168.162.225:3000/khelmela/chat/${roomId}`,
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      roomId,
      senderID: userId,
      message: newMessage,
      time: new Date().toISOString(),
    };

    socket.emit('message', {room: roomId, message: messageData});
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{name}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View
            style={[
              styles.message,
              item.senderID === userId ? styles.sent : styles.received,
            ]}>
            <Text>{item.message}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={newMessage}
        onChangeText={setNewMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {padding: 10, marginVertical: 5, borderRadius: 5},
  sent: {alignSelf: 'flex-end', backgroundColor: '#DCF8C6'},
  received: {alignSelf: 'flex-start', backgroundColor: '#ECECEC'},
  input: {borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 5},
});

export default PrivateChat;