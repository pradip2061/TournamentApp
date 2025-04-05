import React, {createContext, useContext, useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import {baseUrl} from './env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

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
        console.log('Big Notify ', data);
        if (data.type === 'newMessage') {
          Alert.alert('New Message', data?.message?.message || 'NEw Message');
        } else if (data.type === 'notification') {
          Alert.alert(
            'New Notification',
            data?.message?.message || 'New Notification',
          );
        } else if (data.type === 'file') {
          Alert.alert('New File', data?.message?.message || 'New File');
        } else {
          Alert.alert('New Notify', data?.message?.message || 'New Notify');
        }
        setTimeout(() => {
          playNotificationSound();
        }, 200);
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
