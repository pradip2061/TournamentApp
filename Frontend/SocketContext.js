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

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const activeChat = useRef(null);
  const [renderPage, setRenderPage] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');

  const setActiveChat = chat => {
    activeChat.current = chat;
  };

  const showNotification = (message, type = 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setNotificationVisible(true);
    setTimeout(() => {
      playNotificationSound();
    }, 200);
  };

  useEffect(() => {
    let activeSocket;

    const initializeSocket = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('Token not found during initial setup');
        return;
      }

      const newSocket = io(baseUrl, {
        reconnection: true,
        reconnectionAttempts: 5, // Keep these if desired
        reconnectionDelay: 3000,
        timeout: 10000,
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        newSocket.emit('GlobalRegister', token);
      });

      newSocket.on('disconnect', reason => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
        // You might want to show a UI indicator here
      });

      newSocket.on('connect_error', error => {
        console.log('Connection error:', error.message);
        setIsConnected(false);
        // You might want to show a UI indicator here
      });

      newSocket.on('Notify', data => {
        // ... (Notification handling logic)
      });

      setSocket(newSocket);
      activeSocket = newSocket;
    };

    initializeSocket();

    return () => {
      if (activeSocket) {
        activeSocket.disconnect();
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

      <NotificationPopup
        visible={notificationVisible}
        message={notificationMessage}
        type={notificationType}
        onClose={() => setNotificationVisible(false)}
        duration={4000}
      />
    </>
  );
};
