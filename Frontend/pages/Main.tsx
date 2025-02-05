import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from './Home'
import Chat from './Chat'
import Champions from './Champions'
import Profile from './Profile'
import Icon from 'react-native-vector-icons/Entypo'
import User from 'react-native-vector-icons/FontAwesome'
import HomeStackNavigator from './HomeStackNavigator'
const Tab = createBottomTabNavigator()
const Main = () => {

  return (
    <View style={{width:'100%',height:'100%'}}>
        <Tab.Navigator screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let iconComponent
            // Choose icon based on route name
            if (route.name === 'Home') {
              iconName ='home'
              iconComponent = <Icon name={iconName} size={size} color={color} />
            } else if (route.name === 'Chat') {
              iconName =  'chat'
              iconComponent = <Icon name={iconName} size={size} color={color} />
            } else if (route.name === 'Champions') {
              iconName = 'trophy' 
              iconComponent = <Icon name={iconName} size={size} color={color} />
            }else if(route.name=='Profile'){
                iconName='user'
                iconComponent = <User name={iconName} size={size} color={color} />
            }
            return iconComponent
                
        },
        tabBarActiveTintColor: 'rgb(247,99,0)', 
          tabBarInactiveTintColor: 'rgb(0,18,64)', 
          tabBarStyle: { backgroundColor: 'white', height: 60 }, 
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' }, 
          tabBarHideOnKeyboard: true, 
    
        })}
      
     >
            <Tab.Screen name='Home' component={HomeStackNavigator}  options={{ headerShown: false }}/>
            <Tab.Screen name='Chat' component={Chat}  options={{ headerShown: false }}/>
            <Tab.Screen name='Champions' component={Champions} options={{ headerShown: false }}/>
            <Tab.Screen name='Profile' component={Profile}  options={{ headerShown: false }}/>
        </Tab.Navigator>
    
    </View>
  )
}

export default Main