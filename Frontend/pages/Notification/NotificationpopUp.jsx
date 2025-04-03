import React, {useState, useEffect} from 'react';
import {View, Text, Animated, StyleSheet} from 'react-native';

const NotificationPopup = ({data}) => {
  const translateY = new Animated.Value(-100);
  const {message, type, onHide} = data;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onHide());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.notification,
        {
          backgroundColor: type === 'message' ? '#4CAF50' : '#FF9800',
          transform: [{translateY}],
        },
      ]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
};

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type) => {
    setNotifications(prev => [...prev, {id: Date.now(), message, type}]);
  };

  return (
    <View style={styles.container}>
      {notifications.map(notif => (
        <NotificationPopup
          key={notif.id}
          message={notif.message}
          type={notif.type}
          onHide={() =>
            setNotifications(prev => prev.filter(n => n.id !== notif.id))
          }
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  notification: {
    width: '90%',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export {NotificationPopup, NotificationSystem};
