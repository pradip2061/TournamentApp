import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from './env';
import NotificationPopup from './components/NotificationModal';
import playNotificationSound from './utility/Notification';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [renderPage, setRenderPage] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: '', type: 'info' });
  const socketRef = useRef(null);
  const activeChat = useRef(null);

  const setActiveChat = (chat) => {
    activeChat.current = chat;
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ visible: true, message, type });
    setTimeout(() => playNotificationSound(), 200);
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };

  const initializeSocket = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      if (socketRef.current) {
        socketRef.current.off();
        socketRef.current.disconnect();
      }

      const newSocket = io(baseUrl, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        timeout: 10000,
        auth: { token },
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on('connect', () => {
        setIsConnected(true);
        newSocket.emit('GlobalRegister', token);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
      });

      newSocket.on('Notify', (data) => {
        if (data.type === 'newMessage' && data.message?.FriendId === activeChat.current) return;

        const { type: notifyType, message: msg } = processNotificationData(data);
        if (notifyType === 'render') {
          setRenderPage((prev) => !prev);
        } else {
          showNotification(msg, notifyType);
        }
      });
    } catch (error) {
      console.error('Socket initialization failed:', error);
    }
  };

  const processNotificationData = (data) => {
    if (data.type === 'newMessage') {
      return { type: 'info', message: data?.message?.message || 'New Message' };
    }
    if (data.type === 'notification') {
      return { type: 'info', message: data?.message?.message || 'New Notification' };
    }
    if (data.type === 'file') {
      return { type: 'success', message: data?.message?.message || 'New File' };
    }
    if (data.type === 'render') {
      return { type: 'render', message: '' };
    }
    return {
      type: 'info',
      message: data?.message?.message || typeof data === 'string' ? data : 'New Notification',
    };
  };

  useEffect(() => {
    initializeSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.off();
        socketRef.current.disconnect();
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
        }}
      >
        {children}
      </SocketContext.Provider>
      <NotificationPopup
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        duration={4000}
        onClose={hideNotification}
      />
    </>
  );
};

export default SocketProvider;