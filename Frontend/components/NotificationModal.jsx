import React, { useEffect, useCallback } from 'react';
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
  const [isVisible, setIsVisible] = React.useState(visible);
  const slideAnim = React.useRef(new Animated.Value(-80)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  const getBackgroundColor = useCallback(() => {
    switch (type) {
      case 'success': return '#e6ffe6';
      case 'warning': return '#fff3e6';
      case 'error': return '#ffe6e6';
      default: return '#f0f7ff';
    }
  }, [type]);

  const getIconText = useCallback(() => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '!';
      case 'error': return '✕';
      default: return 'i';
    }
  }, [type]);

  const getIconColor = useCallback(() => {
    switch (type) {
      case 'success': return '#28a745';
      case 'warning': return '#ff9500';
      case 'error': return '#dc3545';
      default: return '#007bff';
    }
  }, [type]);

  const animateNotification = useCallback((show) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: show ? 0 : -80,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: show ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (!show) {
        setIsVisible(false);
        if (onClose) onClose();
      }
    });
  }, [slideAnim, opacityAnim, onClose]);

  useEffect(() => {
    setIsVisible(visible);
    if (visible) {
      animateNotification(true);
      if (duration > 0) {
        const timer = setTimeout(() => animateNotification(false), duration);
        return () => clearTimeout(timer);
      }
    } else {
      animateNotification(false);
    }
  }, [visible, duration, animateNotification]);

  if (!isVisible && !visible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={() => animateNotification(false)}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.popup,
            {
              transform: [{ translateY: slideAnim }],
              opacity: opacityAnim,
              backgroundColor: getBackgroundColor(),
            },
          ]}
        >
          <View style={styles.iconWrapper}>
            <Text style={[styles.icon, { color: getIconColor() }]}>
              {getIconText()}
            </Text>
          </View>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => animateNotification(false)}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
  },
  popup: {
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
});

export default NotificationPopup;