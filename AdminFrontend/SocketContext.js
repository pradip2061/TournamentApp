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
import {View} from 'react-native';

import NotificationPopup from './components/NotificationModal';
import playNotificationSound from './utility/Notification';

// Create Context
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000; // 3 seconds between reconnection attempts
  const reconnectTimeoutRef = useRef(null);

  // Notification modal state
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');

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
      // Clear any existing reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Token not found during reconnection attempt');
        return;
      }

      // Create new socket with auto reconnect options
      const newSocket = io(baseUrl, {
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: reconnectInterval,
        timeout: 10000,
      });

      // Set up event listeners
      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        // Register with token after connection
        newSocket.emit('GlobalRegister', token);
      });

      newSocket.on('disconnect', reason => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);

        // If the disconnection is not due to the client explicitly disconnecting,
        // attempt manual reconnection in case the built-in reconnection fails
        if (reason !== 'io client disconnect') {
          handleManualReconnect();
        }
      });

      newSocket.on('connect_error', error => {
        console.log('Connection error:', error.message);
        handleManualReconnect();
      });

      newSocket.on('Notify', data => {
        console.log('Notification received:', data);

        // Determine notification type and message based on data
        let messageText = '';
        let notifyType = 'info';

        if (data.type === 'newMessage') {
          messageText = data?.message?.message || 'New Message';
          notifyType = 'info';
        } else if (data.type === 'notification') {
          messageText = data?.message?.message || 'New Notification';
          notifyType = 'info';
        } else if (data.type === 'file') {
          messageText = data?.message?.message || 'New File';
          notifyType = 'success';
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
      handleManualReconnect();
      return null;
    }
  };

  const handleManualReconnect = () => {
    // Only attempt reconnection if we haven't exceeded the maximum attempts
    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
      reconnectAttemptsRef.current += 1;
      console.log(
        `Attempting manual reconnection (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`,
      );

      // Set a timeout to attempt reconnection
      reconnectTimeoutRef.current = setTimeout(() => {
        setupSocket();
      }, reconnectInterval);
    } else {
      console.log('Maximum reconnection attempts reached');
      // Optionally reset the counter after some longer timeout
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectAttemptsRef.current = 0;
        setupSocket();
      }, reconnectInterval * 5);
    }
  };

  useEffect(() => {
    // Initial socket setup
    let activeSocket;

    const initializeSocket = async () => {
      activeSocket = await setupSocket();
    };

    initializeSocket();

    // Cleanup on unmount
    return () => {
      if (activeSocket) {
        activeSocket.disconnect();
        console.log('Disconnecting socket on unmount');
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <SocketContext.Provider value={{socket, isConnected}}>
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
