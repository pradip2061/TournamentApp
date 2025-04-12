import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ModalNotify = ({ visible, message, error, duration = 3000, onClose, position = 'bottom' }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onClose && onClose());
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, fadeAnim, onClose]);

  if (!visible) return null;

  const displayText = message || error || 'Error occurred';
  const iconName = message ? 'checkmark-circle' : 'alert-circle';
  const iconColor = message ? '#28a745' : '#dc3545';

  return (
    <View style={[styles.overlay, position === 'top' ? styles.top : styles.bottom]}>
      <Animated.View style={[styles.popup, { opacity: fadeAnim }]}>
        <Icon name={iconName} size={24} color={iconColor} style={styles.icon} />
        <Text style={styles.message}>{displayText}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  top: {
    top: 40,
  },
  bottom: {
    bottom: 20,
  },
  popup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '90%',
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default ModalNotify;