
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FirstPage from './pages/FirstPage';
import Authenticate from './pages/Authenticate';
import Home from './pages/Home';
import Main from './pages/Main';



const App =()=> {
  const Stack = createStackNavigator()
  return(
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="First" component={FirstPage} options={{headerShown:false}}/>
      <Stack.Screen name="Authenticate" component={Authenticate} options={{headerShown:false}}/>
      <Stack.Screen name="Main" component={Main} options={{headerShown:false}}/>
    </Stack.Navigator>
  </NavigationContainer>
  )
}


const styles = StyleSheet.create({
  
});

export default App;
