import {View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import {useNavigation} from '@react-navigation/native'
import HomeStackNavigator from '../stackRoutes/HomeStackNavigator'
import LandingChat from './LandingChat'
import Champions from './Champions'
import Profile from './Profile'
import Icon from 'react-native-vector-icons/Entypo'
import User from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import {jwtDecode} from 'jwt-decode'
import{BASE_URL} from '../../env'
const Tab = createBottomTabNavigator()

const ChatTabButton = props => {
  const navigation = useNavigation()

  const handleChatPress = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        return
      }

      const decoded = jwtDecode(token)
      const userId = decoded.id

      const response = await axios.get(`${BASE_URL}/khelmela/friends/${token}`)

      navigation.navigate('Chat', {friends: response.data})
    } catch (error) {
      console.error('Error fetching friends:', error.message)
    }
  }

  return <TouchableOpacity {...props} onPress={handleChatPress} />
}

const Main = () => {
  return (
    <View style={{width: '100%', height: '100%'}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName
            let IconComponent = Icon // Default to Entypo
            if (route.name === 'Home') {
              iconName = 'home'
            } else if (route.name === 'Chat') {
              iconName = 'chat'
            } else if (route.name === 'Champions') {
              iconName = 'trophy'
            } else if (route.name === 'Profile') {
              iconName = 'user'
              IconComponent = User // FontAwesome for user icon
            }

            return <IconComponent name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: 'rgb(247,99,0)',
          tabBarInactiveTintColor: 'rgb(0,18,64)',
          tabBarStyle: {backgroundColor: 'white', height: 60},
          tabBarLabelStyle: {fontSize: 14, fontWeight: 'bold'},
          tabBarHideOnKeyboard: true
        })}>
        <Tab.Screen name="Home" component={HomeStackNavigator} options={{headerShown: false}} />
        <Tab.Screen
          name="Chat"
          component={LandingChat}
          options={{
            headerShown: false,
            tabBarButton: props => <ChatTabButton {...props} />
          }}
        />
        <Tab.Screen name="Champions" component={Champions} options={{headerShown: false}} />
        <Tab.Screen name="Profile" component={Profile} options={{headerShown: false}} />
      </Tab.Navigator>
    </View>
  )
}

export default Main