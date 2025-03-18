import React from 'react';
import {Image} from 'react-native'; // Import Image for custom back arrow
import Home from '../bottomRoutes/Home'; // Your home screen
import FreeFire from '../freefire/FreeFire';
import ClashSquad from '../freefire/ClashSquad';
import {createStackNavigator} from '@react-navigation/stack';
import Pubg from '../pubg/Pubg';
import Setting from './Setting';
import TDM from '../pubg/TDM';
import Transcation from '../transaction/Transcation';
import DepositMoney from '../transaction/DepositeMoney';
import EnrollMatch from './EnrollMatch';
import Withdraw from '../transaction/Withdraw';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center', // Centers the header title
        headerTitleStyle: {fontSize: 25}, // Font size for titles
        headerBackTitleVisible: false, // Hides the back title text
        headerTintColor: '#000', // Color of back arrow (optional)
        headerBackImage: () => (
          // Custom larger back arrow
          <Image
            source={require('../../assets/back.jpg')}
            style={{width: 26, height: 26}} // Increase size of back arrow (adjust as needed)
          />
        ),
      }}>
      <Stack.Screen
        name="Homes"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FreeFire"
        component={FreeFire}
        options={{headerShown: true, title: 'FreeFire Full Match'}}
      />
      <Stack.Screen
        name="ClashSquad"
        component={ClashSquad}
        options={{headerShown: true, title: 'Clash Squad Match'}}
      />
      <Stack.Screen
        name="Pubg"
        component={Pubg}
        options={{headerShown: true, title: 'PUBG Full Match'}}
      />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen
        name="TDM"
        component={TDM}
        options={{headerShown: true, title: 'Team Death Match'}}
      />
      <Stack.Screen name="EnrollMatch" component={EnrollMatch} />
      <Stack.Screen name="Transcation" component={Transcation} />
      <Stack.Screen
        name="Withdraw"
        component={Withdraw}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Deposite"
        component={DepositMoney}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
