import React, {createContext, useContext, useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import {baseUrl} from './env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import axios from 'axios';
import playNotificationSound from './utility/Notification';

// Create Context
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children}) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(baseUrl);
    setSocket(newSocket);

    const Global = async () => {
      const universalSocket = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Token Not found  ');
          return;
        }
        newSocket.emit('GlobalRegister', token);
      };
      await universalSocket();

      newSocket.on('Notify', data => {
        playNotificationSound();
        console.log(data);
        if (data.type === 'newMessage') {
          Alert.alert('New Message', data.message);
        }
        if (data.type === 'notification') {
          Alert.alert('New Notification', data.message);
        }
      });
    };
    Global();

    return () => {
      newSocket.disconnect();
      console.log('Disconnecting Global socket ');
    };
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
