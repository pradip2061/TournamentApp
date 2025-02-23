import axios from 'axios';
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {io} from 'socket.io-client';
import {SERVER_PORT, IP} from '../env';

const API_URL = `${IP}:${SERVER_PORT}`;
const socket = io(API_URL);

const Chat = ({route}) => {
  console.log('Route Object:', route);
  console.log('Route Params:', route.params);

  // Extract userId and friendId correctly
  const {userId, FriendId} = route.params; // Ensure these names match what was passed in navigation
  console.log('User ID:', userId, 'Friend ID:', FriendId);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const roomId = [userId, FriendId].sort().join('<->');
  const messageInputRef = useRef(null);

  // Function to format date correctly
  const formattedDate = dte => {
    if (!dte) return 'Invalid Date'; // Handle cases where the date is undefined or null
    const date = new Date(dte);
    const options = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  useEffect(() => {
    const fetchOldMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/chat/${roomId}`);
        const sortedMessages = response.data.sort(
          (a, b) => new Date(a.time) - new Date(b.time),
        );
        setMessages(sortedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchOldMessages();

    socket.emit('joinRoom', roomId);

    socket.on('message', newMessage => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      socket.off('message');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        roomId,
        senderID: userId,
        message,
        time: new Date().toISOString(),
      };
      socket.emit('message', {room: roomId, message: newMessage});
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      // Reset input height after sending
      if (messageInputRef.current) {
        messageInputRef.current.setNativeProps({
          style: {height: 40}, // Reset to initial height
        });
      }
    }
  };

  const handleInputChange = text => {
    setMessage(text);
    // Dynamically adjust input height
    if (messageInputRef.current) {
      const numberOfLines = text.split('\n').length;
      const newHeight = Math.max(40, numberOfLines * 20); // min height 40
      messageInputRef.current.setNativeProps({
        style: {height: newHeight},
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageBubble,
              item.senderID === userId ? styles.myMessage : styles.otherMessage,
            ]}>
            <Text style={styles.sender}>{item.senderID}</Text>
            <Text style={styles.text}>{item.message}</Text>
            <Text
              style={
                item.senderID === userId
                  ? styles.dateText
                  : styles.otherdateText
              }>
              {formattedDate(item.time)}
            </Text>
          </View>
        )}
        keyExtractor={item => item._id}
      />
      <View style={styles.inputContainer}>
        <TextInput
          ref={messageInputRef}
          style={styles.messageInput}
          placeholder="Type a message"
          value={message}
          onChangeText={handleInputChange}
          multiline // Enable multiline input
          returnKeyType="send" // Show 'send' on keyboard
          onSubmitEditing={sendMessage} // Send on Enter
          blurOnSubmit={false} // Keep keyboard open after sending
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},
  inputContainer: {flexDirection: 'row', marginTop: 10},
  messageInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 40, // Initial height
    justifyContent: 'center', // Center text vertically
  },
  sendButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 20,
    marginLeft: 10,
  },
  sendButtonText: {color: 'white'},

  messageBubble: {
    maxWidth: '80%', // Limit message bubble width
    padding: 8,
    borderRadius: 10,
    marginVertical: 4,
  },

  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },
  sender: {fontWeight: 'bold'},
  text: {fontSize: 16},
  dateText: {
    fontSize: 9,
    color: 'gray',
    textAlign: 'right',
  },
  otherdateText: {
    fontSize: 9,
    color: 'gray',
    textAlign: 'left',
  },
});

export default Chat;
