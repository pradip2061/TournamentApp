import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const NetworkStatus = ({ children }) => {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isConnected === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={40}/>
        <Text style={{ fontSize:20, marginTop:10}}>No internet connection</Text>
      </View>
    );
  }

  return children;
};

export default NetworkStatus;
