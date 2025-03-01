import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native'; // Import navigation hook
import HomeStackNavigator from './HomeStackNavigator';
import LandingChat from './LandingChat';
import Champions from './Champions';
import Profile from './Profile';
import Icon from 'react-native-vector-icons/Entypo';
import User from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const ChatTabButton = props => {
  const navigation = useNavigation();

  const handleChatPress = () => {
    //  ****** Fix ME   ****     Use effect to get this dummy data when page Loads
    const friends = [
      {
        id: 1,
        name: 'Sagar',
        photoUrl:
          'https://storage.googleapis.com/cg-bucket2/sagar_profesional.png',
      },
      {
        id: 2,
        name: 'Arjun',
        photoUrl: 'https://storage.googleapis.com/cg-bucket2/logo.png',
      },
      {
        id: 3,
        name: 'Pradip',
        photoUrl: 'https://storage.googleapis.com/cg-bucket2/logo.png',
      },
      {
        id: 4,
        name: 'Sagar',
        photoUrl: 'https://storage.googleapis.com/cg-bucket2/logo.png',
      },
      {
        id: 5,
        name: 'Rohan',
        photoUrl: 'https://storage.googleapis.com/cg-bucket2/logo.png',
      },
      {
        id: 6,
        name: 'Sarthak',
        photoUrl: 'https://storage.googleapis.com/cg-bucket2/logo.png',
      },
    ];

    navigation.navigate('Chat', {friends}); // Navigate with friends data
  };

  return <TouchableOpacity {...props} onPress={handleChatPress} />;
};

const Main = () => {
  return (
    <View style={{width: '100%', height: '100%'}}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let iconComponent;
            if (route.name === 'Home') {
              iconName = 'home';
              iconComponent = (
                <Icon name={iconName} size={size} color={color} />
              );
            } else if (route.name === 'Chat') {
              iconName = 'chat';
              iconComponent = (
                <Icon name={iconName} size={size} color={color} />
              );
            } else if (route.name === 'Champions') {
              iconName = 'trophy';
              iconComponent = (
                <Icon name={iconName} size={size} color={color} />
              );
            } else if (route.name === 'Profile') {
              iconName = 'user';
              iconComponent = (
                <User name={iconName} size={size} color={color} />
              );
            }
            return iconComponent;
          },
          tabBarActiveTintColor: 'rgb(247,99,0)',
          tabBarInactiveTintColor: 'rgb(0,18,64)',
          tabBarStyle: {backgroundColor: 'white', height: 60},
          tabBarLabelStyle: {fontSize: 14, fontWeight: 'bold'},
          tabBarHideOnKeyboard: true,
        })}>
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Chat"
          component={LandingChat}
          options={{
            headerShown: false,
            tabBarButton: props => <ChatTabButton {...props} />, // Custom button
          }}
        />
        <Tab.Screen
          name="Champions"
          component={Champions}
          options={{headerShown: false}}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
      </Tab.Navigator>
    </View>
  );
};

export default Main;
