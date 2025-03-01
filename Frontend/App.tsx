import React, { useEffect } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FirstPage from './pages/FirstPage';
import Authenticate from './pages/Authenticate';
import Main from './pages/Main';
import AddMoney from './pages/AddMoney';
import PrivateChat from './pages/PrivateChat';
import TokenCheck from './pages/TokenCheck';
import { navigationRef } from './pages/NavigationRef';
import { ContextApi } from './pages/ContextApi';


const App = () => {
  const Stack = createStackNavigator();

  return (
    <ContextApi>
    <NavigationContainer ref={navigationRef}>
      <TokenCheck/>
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
      </Stack.Navigator>
    </NavigationContainer>
    </ContextApi>
  );
};

const styles = StyleSheet.create({});

export default App;
