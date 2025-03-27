import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Dashboard from './pages/Dashboard';
import PowerRoom from './pages/PowerRoom/PowerRoom';
import UploadPhoto from './pages/Match_watcher/UploadPhoto';
import LandingChat from './pages/Chat/LandingChat';
import Authenticate from './pages/Authentication/Authenticate';
import PrivateChat from './pages/Chat/PrivateChat';

import AdminHome from './pages/Transaction/AdminHome';
import Withdraw from './pages/components/Withdraw';
import GamePannel from './pages/Tournament/GamePannel';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Authenticate">
        
        <Stack.Screen
          name="Authenticate"
          component={Authenticate}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AdminHome"
          component={AdminHome}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PowerRoom"
          component={PowerRoom}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LandingChat"
          component={LandingChat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PrivateChat"
          component={PrivateChat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Withdraw"
          component={Withdraw}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="UploadPhoto"
          component={UploadPhoto}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GamePannel"
          component={GamePannel}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
