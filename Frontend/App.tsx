import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FirstPage from './pages/stackRoutes/FirstPage';
import Authenticate from './pages/Authentication/Authenticate';
import Main from './pages/bottomRoutes/Main';
import AddMoney from './pages/transaction/AddMoney';
import PrivateChat from './pages/bottomRoutes/PrivateChat';
import TokenCheck from './pages/TokenExpiryCheck/TokenCheck';
import {navigationRef} from './pages/NavigationRef';
import {ContextApi} from './pages/ContextApi/ContextApi';
import Orientation from 'react-native-orientation-locker';
import Withdraw from './pages/transaction/Withdraw';
import NetworkStatus from './NetworkStatus';
import {SocketProvider} from './SocketContext';
const App = () => {
  const Stack = createStackNavigator();
  useEffect(() => {
    Orientation.lockToPortrait(); // Lock to Portrait mode

    return () => {
      Orientation.unlockAllOrientations(); // Unlock when component unmounts
    };
  }, []);
  return (
    <NetworkStatus>
      <ContextApi>
        <SocketProvider>
          <NavigationContainer ref={navigationRef}>
            <TokenCheck />
            <Stack.Navigator>
              <Stack.Screen
                name="First"
                component={FirstPage}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Authenticate"
                component={Authenticate}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Main"
                component={Main}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="PrivateChat"
                component={PrivateChat}
                options={{headerShown: false}}
              />

              <Stack.Screen name="AddMoney" component={AddMoney} />
              <Stack.Screen name="Withdraw" component={Withdraw} />
            </Stack.Navigator>
          </NavigationContainer>
        </SocketProvider>
      </ContextApi>
    </NetworkStatus>
  );
};

const styles = StyleSheet.create({});

export default App;
