import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';

const NotificationPopup = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [show, setShow] = useState(visible);
  const slideAnim = useState(new Animated.Value(-60))[0]; // Start slightly off-screen
  const opacityAnim = useState(new Animated.Value(0))[0];

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(220, 252, 231, 0.8)'; // Light green with slight transparency
      case 'warning':
        return 'rgba(254, 249, 196, 0.8)'; // Light yellow with slight transparency
      case 'error':
        return 'rgba(254, 226, 226, 0.8)'; // Light red with slight transparency
      case 'info':
      default:
        return 'rgba(207, 233, 252, 0.8)'; // Light blue with slight transparency
    }
  };

  // Border color based on notification type (more refined)
  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return '#86efac'; // Muted green
      case 'warning':
        return '#fde047'; // Muted yellow
      case 'error':
        return '#fca5a5'; // Muted red
      case 'info':
      default:
        return '#bae6fd'; // Muted blue
    }
  };

  // Icon text based on type (larger and bolder)
  const getIconText = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  useEffect(() => {
    setShow(visible);
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 10, // Slide in a bit more gently
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      slideAnim.setValue(-60);
      opacityAnim.setValue(0);
    }
  }, [visible, duration]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -60,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShow(false);
      if (onClose) onClose();
    });
  };

  if (!show && !visible) return null;

  return (
    <Modal
      transparent
      visible={show}
      animationType="none"
      onRequestClose={handleClose}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.notificationContainer,
            {
              transform: [{translateY: slideAnim}],
              opacity: opacityAnim,
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor(),
            },
          ]}>
          <View style={styles.contentContainer}>
            <View style={styles.iconContainer}>
              <Text style={[styles.iconText, {color: getBorderColor()}]}>
                {getIconText()}
              </Text>
            </View>
            <Text style={styles.message}>{message}</Text>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40, // Adjust top position for better spacing from the top
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  notificationContainer: {
    width: '90%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08, // More subtle shadow
    shadowRadius: 3,
    elevation: 3, // Lower elevation for a less pronounced lift
    borderLeftWidth: 5, // Slightly thicker border for better emphasis
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 14, // Slightly more spacing
    width: 28, // Slightly larger icon container
    height: 28,
    borderRadius: 14, // Make it a circle
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0,0,0,0.05)', // Optional: subtle background for the icon
  },
  iconText: {
    fontSize: 20, // Larger icon text
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
    fontSize: 16, // Slightly larger message text
    color: '#334155', // Darker, more readable text color
    fontWeight: '500',
  },
  closeButton: {
    padding: 6, // Adjust close button padding
  },
  closeButtonText: {
    fontSize: 18, // Slightly larger close button text
    color: '#475569', // Darker close button text
    fontWeight: 'bold',
    lineHeight: 18, // Adjust line height for better vertical alignment
  },
});

export default NotificationPopup;
