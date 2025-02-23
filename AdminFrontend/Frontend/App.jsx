import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import PowerRoom from './pages/PowerRoom';
import AdminHome from './pages/AdminHome';
import UploadPhoto from './pages/UploadPhoto';
import Chat from './pages/chat';
import LandingChat from './pages/LandingChat';
import AddMoney from './pages/AddMoney';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AdminLogin">
        <Stack.Screen
          name="AdminLogin"
          component={AdminLogin}
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
        <Stack.Screen name="Chat" component={Chat} />

        <Stack.Screen
          name="UploadPhoto"
          component={UploadPhoto}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
