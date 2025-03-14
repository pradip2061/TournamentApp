import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import {BASE_URL} from '../../env';

const socket = io(process.env.baseUrl);

const PrivateChat = ({route, navigation}) => {
  const {userId, FriendId, name, friendPhoto} = route.params || {
    name: 'Unknown',
    friendPhoto: 'https://via.placeholder.com/40',
  };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const roomId = [userId, FriendId].sort().join('<->');

  useEffect(() => {
    // Join the room
    socket.emit('joinRoom', roomId);

    // Listen for new messages
    socket.on('message', message => {
      setMessages(prev => [...prev, message]);
    });

    // Fetch existing messages when the component mounts
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/khelmela/chat/${roomId}`);
        setMessages(prev => {
          // Merge fetched messages with existing state to avoid overwriting
          const existingIds = new Set(prev.map(msg => msg.time));
          const newMessages = response.data.filter(
            msg => !existingIds.has(msg.time),
          );
          return [...prev, ...newMessages];
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();

    // Cleanup socket listener on unmount, but do not clear messages
    return () => {
      socket.off('message');
      // No setMessages([]) or deletion here to ensure persistence
    };
  }, [roomId, navigation]);

  const sendTextMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      roomId,
      senderID: userId,
      message: newMessage,
      type: 'text',
      time: new Date().toISOString(),
    };

    // Emit message to server
    socket.emit('message', {room: roomId, message: messageData});

    // Update local state immediately
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
    setInputHeight(40);
  };

  const sendPhotoMessage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const photoUri = result.assets[0].uri;
      const messageData = {
        roomId,
        senderID: userId,
        message: photoUri,
        type: 'photo',
        time: new Date().toISOString(),
      };

      // Emit message to server
      socket.emit('message', {room: roomId, message: messageData});

      // Update local state immediately
      setMessages(prev => [...prev, messageData]);
    }
  };

  const formatTimestamp = isoString => {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    } else {
      return date
        .toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        .toUpperCase();
    }
  };

  const formatDateSeparator = isoString => {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return 'TODAY';
    } else {
      return date
        .toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
        })
        .toUpperCase();
    }
  };

  const renderItem = ({item, index}) => {
    const isSent = item.senderID === userId;
    const currentDate = new Date(item.time);
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showDateSeparator =
      !previousMessage ||
      new Date(previousMessage.time).toDateString() !==
        currentDate.toDateString();
    const showName =
      !isSent &&
      (!previousMessage || previousMessage.senderID !== item.senderID);

    return (
      <>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>
              {formatDateSeparator(item.time)}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageContainer,
            isSent ? styles.sentContainer : styles.receivedContainer,
          ]}>
          {!isSent && (
            <Image source={{uri: friendPhoto}} style={styles.avatar} />
          )}
          <View style={styles.messageContent}>
            {!isSent && showName && (
              <Text style={styles.senderName}>{name}</Text>
            )}
            <View
              style={[
                styles.messageBubble,
                isSent ? styles.sentBubble : styles.receivedBubble,
                item.type === 'photo' && styles.photoBubble,
              ]}>
              {item.type === 'photo' ? (
                <Image
                  source={{uri: item.message}}
                  style={styles.photo}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.messageText}>{item.message}</Text>
              )}
              <Text
                style={[
                  styles.timestamp,
                  isSent ? styles.sentTimestamp : styles.receivedTimestamp,
                ]}>
                {formatTimestamp(item.time)}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Image source={{uri: friendPhoto}} style={styles.headerAvatar} />
        <View>
          <Text style={styles.headerName}>{name}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.photoButton} onPress={sendPhotoMessage}>
          <Text style={styles.photoButtonText}>📷</Text>
        </TouchableOpacity>
        <TextInput
          style={[styles.input, {height: Math.min(inputHeight, 100)}]}
          placeholder="Type a message..."
          value={newMessage}
          placeholderTextColor={'#8E8E92'}
          onChangeText={setNewMessage}
          multiline
          onContentSizeChange={e =>
            setInputHeight(e.nativeEvent.contentSize.height)
          }
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendTextMessage}
          disabled={!newMessage.trim()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEFE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F4F4F5',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    borderColor: 'grey',
    elevation: 10,
  },
  backButton: {
    fontSize: 40,
    color: 'black',
    marginRight: 10,
    fontWeight: '900',
    height: 50,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  headerIcons: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  icon: {
    fontSize: 20,
    color: '#fff',
    marginLeft: 15,
  },
  messageList: {
    padding: 10,
    paddingTop: 60,
    flexGrow: 1,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 12,
  },
  dateText: {
    color: '#aaa',
    fontSize: 12,
    backgroundColor: '#222',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    textTransform: 'uppercase',
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '70%',
    flexDirection: 'row',
    alignItems: 'flex-end',
    minWidth: 'auto',
  },
  sentContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  receivedContainer: {},
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 3,
  },
  messageContent: {
    flex: 1,
  },
  senderName: {
    fontSize: 1,
    color: '#aaa',
    marginBottom: 2,
  },
  messageBubble: {
    padding: 8,
    borderRadius: 15,
    minWidth: 100,
  },
  sentBubble: {
    backgroundColor: 'blue',
  },
  receivedBubble: {
    backgroundColor: 'grey',
    borderRadius: 15,
  },
  photoBubble: {
    padding: 5,
    backgroundColor: 'transparent',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'right',
  },
  sentTimestamp: {
    color: '#e0e0e0',
  },
  receivedTimestamp: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#F4F4F5',
    elevation: 5,
    borderBottomColor: '#333',
    borderColor: 'grey',

    alignItems: 'center',
  },
  photoButton: {
    padding: 10,
  },
  photoButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    color: 'black',
    minHeight: 40,
  },
  sendButton: {
    backgroundColor: '#075e54',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PrivateChat;