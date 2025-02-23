import axios from 'axios';
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Image,
} from 'react-native';
import {io} from 'socket.io-client';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import {SERVER_PORT, IP} from '../env';

const API_URL = `${IP}:${SERVER_PORT}`;
const socket = io(API_URL);

const PrivateChat = ({route}) => {
  const {userId, FriendId, photoUrl, name} = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messageInputRef = useRef(null);
  const roomId = [userId, FriendId].sort().join('<->');
  const scrollRef = useRef();

  useEffect(() => {
    const fetchOldMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/khelmela/chat/${roomId}`);
        setMessages(
          response.data.sort((a, b) => new Date(a.time) - new Date(b.time)),
        );
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchOldMessages();
    socket.emit('joinRoom', roomId);

    socket.on('message', newMessage => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('message');
    };
  }, [roomId]);

  const sendMessage = (msg, fileUrl = null) => {
    if (msg.trim() || fileUrl) {
      const newMessage = {
        roomId,
        senderID: userId,
        message: msg,
        fileUrl,
        time: new Date().toISOString(),
      };
      socket.emit('message', {room: roomId, message: newMessage});
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  const selectFile = async () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel || response.errorCode) {
        return;
      }
      const asset = response.assets[0];
      const uploadUri = asset.uri;
      const filename = `${Date.now()}_${asset.fileName}`;
      const storageRef = storage().ref(`chat/${roomId}/${filename}`);

      try {
        await storageRef.putFile(uploadUri);
        const fileUrl = await storageRef.getDownloadURL();
        sendMessage('', fileUrl);
      } catch (error) {
        console.error('File upload error:', error);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.friends}>
          <Image source={{uri: photoUrl}} style={styles.image} />
          <Text style={styles.friendstext}>{name}</Text>
        </View>
      </View>
      <FlatList
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({animated: true})
        }
        data={messages}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageBubble,
              item.senderID === userId ? styles.myMessage : styles.otherMessage,
            ]}>
            <Text style={styles.sender}>{item.senderID}</Text>
            {item.fileUrl ? (
              <Image source={{uri: item.fileUrl}} style={styles.sentImage} />
            ) : (
              <Text style={styles.text}>{item.message}</Text>
            )}
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          ref={messageInputRef}
          style={styles.messageInput}
          placeholder="Type a message"
          value={message}
          onChangeText={setMessage}
          multiline
          returnKeyType="send"
          onSubmitEditing={() => sendMessage(message)}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => sendMessage(message)}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fileButton} onPress={selectFile}>
          <Text style={styles.sendButtonText}>File</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10, backgroundColor: '#f8f0e3'},
  inputContainer: {flexDirection: 'row', marginTop: 10},
  messageInput: {
    flex: 1,
    borderColor: '#d1c4e9',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  sendButton: {
    padding: 11,
    backgroundColor: '#E5F77D',
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 0.5,
  },
  sendButtonText: {color: 'black', fontSize: 14},
  fileButton: {
    padding: 11,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 0.5,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 6,
    borderRadius: 15,
    marginVertical: 6,
  },
  myMessage: {alignSelf: 'flex-end', backgroundColor: '#E5F77D'},
  otherMessage: {alignSelf: 'flex-start', backgroundColor: '#fff3e0'},
  sender: {fontWeight: 'bold', marginBottom: 3, color: '#673ab7', fontSize: 12},
  text: {fontSize: 14, color: '#424242'},
  sentImage: {width: 150, height: 150, borderRadius: 10, marginTop: 5},
  friends: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f0e3',
    marginVertical: 8,
    borderWidth: 1.4,
  },
  image: {
    width: 30,
    height: 30,
    backgroundColor: '#ccc',
    borderRadius: 20,
    marginRight: 12,
  },
});

export default PrivateChat;
