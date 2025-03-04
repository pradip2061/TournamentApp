import React from "react";
import Home from "./Home"; // Your home screen
import FreeFire from "./FreeFire";
import ClashSquad from "./ClashSquad";
import { createStackNavigator } from "@react-navigation/stack";
import Pubg from "./Pubg";
import Setting from "./Setting";
import TDM from "./TDM";
import Transcation from "./Transcation";
import DepositMoney from "./DepositeMoney";
import EnrollMatch from "./EnrollMatch";
const Stack =createStackNavigator()

const  HomeStackNavigator=()=> {
  return (
    <Stack.Navigator>
         <Stack.Screen name="Homes" component={Home} options={{headerShown:false}}/>
      <Stack.Screen name="FreeFire" component={FreeFire} options={{headerShown:false}}/>
      <Stack.Screen name="ClashSquad" component={ClashSquad} options={{headerShown:false}} />
      <Stack.Screen name='Pubg' component={Pubg} options={{headerShown:false}}/>
      <Stack.Screen name='Setting' component={Setting}/>
      <Stack.Screen name='TDM' component={TDM} options={{headerShown:false}}/>
      <Stack.Screen name='EnrollMatch' component={EnrollMatch}/>
      <Stack.Screen name='Transcation' component={Transcation}
      />
        <Stack.Screen name='Deposite' component={DepositMoney} options={{headerShown:false}}
      />
    </Stack.Navigator>
  );
}

export default  HomeStackNavigator