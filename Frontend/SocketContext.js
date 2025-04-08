import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import {io} from 'socket.io-client';
import {baseUrl} from './env';
import AsyncStorage from '@react-native-async-storage/async-storage';

import NotificationPopup from './components/NotificationModal';
import playNotificationSound from './utility/Notification';

// Create Context
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [renderPage, setRenderPage] = useState(false);
  const socketRef = useRef(null);
  const activeChat = useRef(null);

  // Notification modal state
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');

  const setActiveChat = chat => {
    activeChat.current = chat;
  };

  // Function to show notification
  const showNotification = (message, type = 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setNotificationVisible(true);

    // Play notification sound
    setTimeout(() => {
      playNotificationSound();
    }, 200);
  };

  const setupSocket = async () => {
    try {
      // Check if we already have a socket connection
      if (socketRef.current) {
        console.log('Socket already exists, cleaning up before reconnecting');
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Token not found');
        return;
      }

      // Create new socket with auto reconnect options
      const newSocket = io(baseUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        timeout: 10000,
        forceNew: true, // Ensure a new connection is created
      });

      socketRef.current = newSocket;

      // Set up event listeners
      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        // Register with token after connection
        newSocket.emit('GlobalRegister', token);
      });

      newSocket.on('disconnect', reason => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
        // Let socket.io handle reconnection
      });

      newSocket.on('connect_error', error => {
        console.log('Connection error:', error.message);
        // Let socket.io handle reconnection
      });

      newSocket.on('Notify', data => {
        console.log('Notification received:', data);

        // Determine notification type and message based on data
        let messageText = '';
        let notifyType = 'info';

        if (
          data.type === 'newMessage' &&
          data.message.FriendId === activeChat.current
        ) {
          return;
        }

        if (data.type === 'newMessage') {
          messageText = data?.message?.message || 'New Message';
          notifyType = 'info';
        } else if (data.type === 'notification') {
          messageText = data?.message?.message || 'New Notification';
          notifyType = 'info';
        } else if (data.type === 'file') {
          messageText = data?.message?.message || 'New File';
          notifyType = 'success';
        } else if (data.type == 'render') {
          setRenderPage(prevState => !prevState);
        } else {
          messageText =
            data?.message?.message ||
            (typeof data === 'string'
              ? data
              : typeof data?.message === 'string'
              ? data.message
              : 'New Notification');
          notifyType = 'info';
        }

        // Show notification using our modal
        showNotification(messageText, notifyType);
      });

      // Store the socket reference
      setSocket(newSocket);

      return newSocket;
    } catch (error) {
      console.error('Error setting up socket:', error);
      return null;
    }
  };

  useEffect(() => {
    // Initial socket setup
    setupSocket();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        console.log('Disconnecting socket on unmount');
      }
    };
  }, []);

  return (
    <>
      <SocketContext.Provider
        value={{
          socket,
          isConnected,
          renderPage,
          setRenderPage,
          activeChat,
          setActiveChat,
        }}>
        {children}
      </SocketContext.Provider>

      {/* Notification component positioned outside the main layout */}
      <NotificationPopup
        visible={notificationVisible}
        message={notificationMessage}
        type={notificationType}
        onClose={() => setNotificationVisible(false)}
        duration={4000} // Auto-hide after 4 seconds
      />
    </>
  );
};