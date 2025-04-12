import React, {
  useEffect,
  useState,
  useCallback,
  useReducer,
  useMemo,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Modal,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import {BASE_URL} from '../../env';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputBar from '../../components/PrivateChatComponent/InputBar';
import {
  formatDateSeparator,
  formatTimestamp,
  isImageMessage,
} from '../../components/PrivateChatComponent/Dateformat';

import {useSocket} from '../../SocketContext';
import {useFilteredFriends} from '../../filteredFriend';

// Message item component
const MessageItem = ({
  item,
  index,
  messages,
  userId,
  name,
  photoUrl,
  onImagePress,
}) => {
  const isSent = item.senderID === userId;
  const currentDate = new Date(item.time);
  const previousMessage = index > 0 ? messages[index - 1] : null;
  const showDateSeparator =
    !previousMessage ||
    new Date(previousMessage.time).toDateString() !==
      currentDate.toDateString();
  const showName =
    !isSent && (!previousMessage || previousMessage.senderID !== item.senderID);
  const isImage = isImageMessage(item);

  return (
    <>
      {showDateSeparator && (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateText}>{formatDateSeparator(item.time)}</Text>
        </View>
      )}
      <View
        style={[
          styles.messageContainer,
          isSent ? styles.sentContainer : styles.receivedContainer,
        ]}>
        {!isSent && <Image source={{uri: photoUrl}} style={styles.avatar} />}
        <View style={styles.messageContent}>
          {!isSent && showName && <Text style={styles.senderName}>{name}</Text>}
          <View
            style={[
              styles.messageBubble,
              isSent ? styles.sentBubble : styles.receivedBubble,
              isImage && styles.photoBubble,
            ]}>
            {isImage ? (
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => onImagePress(getImageSource(item.message))}>
                <Image
                  source={{uri: getImageSource(item.message)}}
                  style={styles.photo}
                  resizeMode="contain"
                  onError={e => {
                    console.log('Error loading image:', e.nativeEvent.error);
                    console.log('Failed URL:', getImageSource(item.message));
                  }}
                />
              </TouchableOpacity>
            ) : (
              <Text style={styles.messageText}>{item.message}</Text>
            )}
            <Text
              style={[
                styles.timestamp,
                isSent ? styles.sentTimestamp : styles.receivedTimestamp,
              ]}>
              {item.time ? formatTimestamp(item.time) : ''}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

const ImageViewerModal = ({visible, imageUri, onClose}) => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modalImageContainer}
          activeOpacity={1}
          onPress={onClose}>
          <Image
            source={{uri: imageUri}}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};

<InputBar />;

const getImageSource = url => {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  return url;
};

// Message reducer for better state management
const messagesReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return [...state, action.payload];
    case 'ADD_MESSAGES':
      const existingIds = new Set(state.map(msg => msg.time));
      const newMessages = action.payload.filter(
        msg => !existingIds.has(msg.time),
      );
      return [...state, ...newMessages];
    case 'RESET':
      return [];
    default:
      return state;
  }
};

const PrivateChat = ({route, navigation}) => {
  const {userId, FriendId, name, photoUrl} = route.params || {
    name: 'Unknown',
    photoUrl: 'https://via.placeholder.com/40',
  };

  // Use reducer for messages instead of simple state
  const [messages, dispatchMessages] = useReducer(messagesReducer, []);
  const [newMessage, setNewMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const {socket, isConnected, activeChat, setActiveChat} = useSocket();
  const {filteredFriends, setFilteredFriends} = useFilteredFriends();

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  // New state for image modal
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState('');

  const roomId = useMemo(
    () => [userId, FriendId].sort().join('<->'),
    [userId, FriendId],
  );

  // Handle image press to show modal
  const handleImagePress = useCallback(imageUri => {
    setSelectedImageUri(imageUri);
    setImageModalVisible(true);
  }, []);

  // Close image modal
  const closeImageModal = useCallback(() => {
    setImageModalVisible(false);
  }, []);

  // Setup socket connection

  // Listen for notifications
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log('Connected to socket:', socket.id);
      socket.emit('register', userId);
      socket.emit('joinRoom', roomId);
    };

    const handleMessage = message => {
      console.log('Message Received:', message);
      dispatchMessages({type: 'ADD_MESSAGE', payload: message});
    };

    const handleConnectError = error => {
      console.error('Socket connection error:', error);
      Alert.alert(
        'Connection Error',
        'Unable to connect to chat server. Please try again later.',
      );
    };

    socket.on('connect', handleConnect);
    socket.on('message', handleMessage);
    socket.on('connect_error', handleConnectError);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('message', handleMessage);
      socket.off('connect_error', handleConnectError);
    };
  }, [socket, roomId, userId]);

  useEffect(() => {
    setActiveChat(FriendId);
    return () => {
      setActiveChat(null);
    };
  }, [roomId, FriendId]);

  useEffect(() => {
    console.log('friend Id ', FriendId, activeChat);
  }, [activeChat, FriendId]); // Run whenever activeChat or FriendId changes

  // Fetch messages with pagination
  const fetchMessages = useCallback(
    async (pageNumber = 1, pageSize = 30) => {
      if (!hasMoreMessages && pageNumber > 1) return;

      setIsLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/khelmela/chat/${roomId}?page=${pageNumber}&limit=${pageSize}`,
        );

        // Process messages to ensure correct type properties
        const processedMessages = response.data.map(msg => {
          const processed = {...msg};

          if (
            typeof processed.message === 'string' &&
            (processed.message.match(/\.(jpeg|jpg|gif|png)$/) !== null ||
              processed.message.includes('/fileShare/'))
          ) {
            processed.type = 'file';
          }

          return processed;
        });

        dispatchMessages({
          type: 'ADD_MESSAGES',
          payload: processedMessages,
        });

        // Update pagination state
        setHasMoreMessages(processedMessages.length === pageSize);
        setPage(pageNumber);
      } catch (error) {
        console.error('Error fetching messages:', error);
        Alert.alert('Error', 'Failed to load messages. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [roomId, hasMoreMessages],
  );

  // Initial load
  useEffect(() => {
    fetchMessages(1);
  }, [fetchMessages]);

  // Load more messages when reaching top of list
  const handleLoadMore = () => {
    if (!isLoading && hasMoreMessages) {
      fetchMessages(page + 1);
    }
  };

  // Send text message

  const sendTextMessage = useCallback(() => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      roomId,
      senderID: userId,
      FriendId: FriendId,
      message: newMessage,
      type: 'text',
      time: new Date().toISOString(),
    };

    // Emit message to server
    socket.emit('message', {
      room: roomId,
      message: messageData,
      reciver: FriendId,
    });

    const updateFriendMessage = (FriendId, messageData) => {
      // First, update the friend's latest message
      const updatedFriendsWithNewMessage = filteredFriends.map(friend => {
        if (friend.id === FriendId) {
          return {
            ...friend, // Copy the existing friend data
            latestMessage: {
              message: messageData.message,
              time: messageData.time,
            },
          };
        }
        return friend;
      });

      // Now reorder the list while preserving admin at top

      // Find the admin (should be at index 0)
      const adminIndex = updatedFriendsWithNewMessage.findIndex(
        friend => friend.id === 'admin',
      );
      let adminUser = null;

      // If admin exists, remove it temporarily
      if (adminIndex !== -1) {
        adminUser = updatedFriendsWithNewMessage.splice(adminIndex, 1)[0];
      }

      // Find the index of the updated friend
      const updatedFriendIndex = updatedFriendsWithNewMessage.findIndex(
        friend => friend.id === FriendId,
      );

      // If the friend was found, remove it from its current position
      if (updatedFriendIndex !== -1) {
        const updatedFriend = updatedFriendsWithNewMessage.splice(
          updatedFriendIndex,
          1,
        )[0];

        // Construct the new array with admin first, then updated friend, then the rest
        let newFilteredFriends = [];

        if (adminUser) {
          // Admin at index 0, updated friend at index 1
          newFilteredFriends = [
            adminUser,
            updatedFriend,
            ...updatedFriendsWithNewMessage,
          ];
        } else {
          // No admin, so updated friend goes at index 0
          newFilteredFriends = [updatedFriend, ...updatedFriendsWithNewMessage];
        }

        setFilteredFriends(newFilteredFriends);
      } else {
        // Friend wasn't found, just restore admin at top if it exists
        if (adminUser) {
          setFilteredFriends([adminUser, ...updatedFriendsWithNewMessage]);
        } else {
          setFilteredFriends(updatedFriendsWithNewMessage);
        }
      }

      console.log(
        'Filtered Friends after Update~~~~~~~~~~~~~~~ ',
        filteredFriends,
      );
    };

    updateFriendMessage(FriendId, messageData);

    socket.emit('Notify', {
      type: 'newMessage',
      message: messageData,
      reciver: FriendId,
    });

    // Update local state immediately
    dispatchMessages({type: 'ADD_MESSAGE', payload: messageData});
    setNewMessage('');
    setInputHeight(40);
  }, [newMessage, roomId, socket, userId, filteredFriends, FriendId]);

  // Select photo from library
  const selectPhoto = useCallback(async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.6,
    };

    try {
      const result = await launchImageLibrary(options);

      if (!result.didCancel && result.assets && result.assets.length > 0) {
        setSelectedPhoto(result.assets[0]);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to open image picker. Please try again.');
    }
  }, []);

  // Upload and send photo
  const uploadAndSendPhoto = useCallback(async () => {
    if (!selectedPhoto || !socket) return;

    setIsUploading(true);

    try {
      const base64Image = selectedPhoto.base64;

      const token = await AsyncStorage.getItem('token');

      console.log(token);

      if (!token) {
        Alert.alert('Error', 'Token not Found ');
        return;
      }
      if (!base64Image) {
        throw new Error('No base64 data available for the selected image');
      }

      const response = await axios.post(
        `${BASE_URL}/khelmela/upload/upload`,
        {
          image: base64Image,
          folderName: 'fileShare',
          filename: `${roomId}.jpg`,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );

      const imageUrl = response.data.url;

      if (!imageUrl) {
        throw new Error('No image URL received from server');
      }
      console.log(imageUrl);

      const messageData = {
        roomId,
        senderID: userId,
        message: imageUrl,
        type: 'file',
        time: new Date().toISOString(),
      };

      socket.emit('message', {room: roomId, message: messageData});
      socket.emit('Notify', {
        type: 'newMessage',
        message: messageData,
        reciver: FriendId,
      });

      dispatchMessages({type: 'ADD_MESSAGE', payload: messageData});
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
      Alert.alert('Upload Failed', error);
    } finally {
      setIsUploading(false);
    }
  }, [selectedPhoto, socket, roomId, userId]);

  // Memoize renderItem for FlatList performance
  const renderItem = useCallback(
    ({item, index}) => (
      <MessageItem
        item={item}
        index={index}
        messages={messages}
        userId={userId}
        name={name}
        photoUrl={photoUrl}
        onImagePress={handleImagePress}
      />
    ),
    [messages, userId, name, photoUrl, handleImagePress],
  );

  // Memoize keyExtractor
  const keyExtractor = useCallback((item, index) => {
    // Use a combination of time and index to ensure uniqueness
    return `${item.time || 'undefined'}-${index}`;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Image source={{uri: photoUrl}} style={styles.headerAvatar} />
        <View>
          <Text style={styles.headerName}>{name}</Text>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.messageList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        inverted={false}
        // Performance optimizations
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        initialNumToRender={15}
        ListFooterComponent={
          isLoading && hasMoreMessages ? (
            <ActivityIndicator
              size="small"
              color="#075e54"
              style={{marginVertical: 20}}
            />
          ) : null
        }
      />

      <InputBar
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        inputHeight={inputHeight}
        setInputHeight={setInputHeight}
        selectedPhoto={selectedPhoto}
        setSelectedPhoto={setSelectedPhoto}
        isUploading={isUploading}
        selectPhoto={selectPhoto}
        uploadAndSendPhoto={uploadAndSendPhoto}
        sendTextMessage={sendTextMessage}
      />

      {/* Image Modal Component */}
      <ImageViewerModal
        visible={imageModalVisible}
        imageUri={selectedImageUri}
        onClose={closeImageModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    fontSize: 28,
    color: '#0084FF',
    marginRight: 15,
    fontWeight: '500',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerName: {
    color: '#262626',
    fontSize: 17,
    fontWeight: '600',
  },
  messageList: {
    padding: 12,
    paddingTop: 20,
    flexGrow: 1,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    color: '#65676B',
    fontSize: 12,
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '75%',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  sentContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  receivedContainer: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 5,
  },
  messageContent: {
    flex: 1,
  },
  senderName: {
    fontSize: 13,
    color: '#65676B',
    marginBottom: 3,
    fontWeight: '500',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    minWidth: 80,
  },
  sentBubble: {
    backgroundColor: '#0084FF',
    borderTopRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#D6F5F5', // Light teal
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#C6E5E5',
  },
  photoBubble: {
    padding: 4,
    backgroundColor: 'transparent',
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  receivedMessageText: {
    color: '#2D2D2D', // Darker text for better contrast
  },
  photo: {
    width: 220,
    height: 220,
    borderRadius: 12,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 3,
    textAlign: 'right',
  },
  sentTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  receivedTimestamp: {
    color: '#65676B',
  },
  imageContainer: {
    width: 220,
    height: 220,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E4E6EB',
  },
  // Image modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '90%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Input bar styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#050505',
    marginRight: 10,
    maxHeight: 120,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0084FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedPhotoContainer: {
    position: 'relative',
    marginBottom: 10,
    alignSelf: 'center',
  },
  selectedPhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  cancelPhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelPhotoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default PrivateChat;
