import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../env';
import axios from 'axios';

const ConfirmationPopup = ({ visible, onConfirm, onCancel, message }) => (
  <Modal transparent visible={visible} animationType="slide" onRequestClose={onCancel}>
    <View style={styles.popupContainer}>
      <View style={styles.popupContent}>
        <Text style={styles.popupMessage}>{message}</Text>
        <View style={styles.popupButtons}>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const NotificationModal = ({ visible, onClose, message, type }) => {
  const slideAnim = useState(new Animated.Value(-100))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => handleClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(onClose);
  };

  const backgroundColor = type === 'success' ? '#4CAF50' : '#F44336';

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.notificationContainer}>
        <Animated.View style={[styles.notificationContent, { backgroundColor, transform: [{ translateY: slideAnim }], opacity: opacityAnim }]}>
          <Text style={styles.notificationIcon}>{type === 'success' ? '✅' : '❌'}</Text>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationTitle}>{type === 'success' ? 'Success' : 'Error'}</Text>
            <Text style={styles.notificationMessage}>{message}</Text>
          </View>
          <TouchableOpacity style={styles.notificationCloseButton} onPress={handleClose}>
            <Text style={styles.notificationCloseText}>✕</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const WithdrawRequestCard = ({
  id,
  amount,
  selectedMethod,
  Number,
  date,
  username,
  status,
  senderId,
  statusmessage,
  handleRefresh,
}) => {
  const [isDropPopupVisible, setDropPopupVisible] = useState(false);
  const [isReleasePopupVisible, setReleasePopupVisible] = useState(false);
  const [message, setMessage] = useState('Request Successful');
  const [authToken, setAuthToken] = useState('');
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  const isCompleted = status === 'approved' || status === 'rejected';

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setAuthToken(storedToken || '');
    };
    fetchToken();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setNotificationVisible(true);
  };

  const getStatusText = () => {
    if (status === 'approved') return 'Approved ✅';
    if (status === 'rejected') return 'Rejected ❌';
    return 'Pending ‼️';
  };

  const getCompletionMessage = () => {
    if (status === 'approved') return statusmessage || 'This request has been approved and processed.';
    if (status === 'rejected') return statusmessage || 'This request has been rejected.';
    return '';
  };

  const handleDropConfirm = async () => {
    setDropPopupVisible(false);
    try {
      const response = await axios.post(
        `${BASE_URL}/khelmela/admin/money/withdraw/drop`,
        { requestId: id, message },
        { headers: { Authorization: `${authToken}` } }
      );
      showNotification(response.data.message, 'success');
      setTimeout(handleRefresh, 2500);
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to drop request', 'error');
    }
  };

  const handleReleaseConfirm = async () => {
    setReleasePopupVisible(false);
    try {
      const response = await axios.post(
        `${BASE_URL}/khelmela/admin/money/withdraw/release`,
        { requestId: id, message },
        { headers: { Authorization: `${authToken}` } }
      );
      showNotification(response.data.message, 'success');
      setTimeout(handleRefresh, 2100);
    } catch (error) {
      showNotification('Error releasing request', 'error');
    }
  };

  return (
    <View style={[
      styles.container,
      status === 'approved' ? styles.approvedContainer :
      status === 'rejected' ? styles.rejectedContainer : styles.container
    ]}>
      <Text style={styles.statusText}>Status: {getStatusText()}</Text>
      <Text style={styles.detailText}>Amount: ₹{amount}</Text>
      <Text style={styles.detailText}>Method: {selectedMethod}</Text>
      {Number && <Text style={styles.detailText}>Esewa Number: {Number}</Text>}
      <Text style={styles.detailText}>Date: {date}</Text>
      <Text style={styles.detailText}>Sender ID: {senderId}</Text>
      <Text style={styles.detailText}>Username: {username}</Text>

      {!isCompleted ? (
        <>
          <TextInput
            style={styles.messageInput}
            placeholder="Enter message for the user"
            value={message}
            onChangeText={setMessage}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.dropButton} onPress={() => setDropPopupVisible(true)}>
              <Text style={styles.buttonText}>Drop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.releaseButton} onPress={() => setReleasePopupVisible(true)}>
              <Text style={styles.buttonText}>Release</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.completionMessageContainer}>
          <Text style={styles.completionMessageText}>{getCompletionMessage()}</Text>
        </View>
      )}

      <ConfirmationPopup
        visible={isDropPopupVisible}
        onConfirm={handleDropConfirm}
        onCancel={() => setDropPopupVisible(false)}
        message="Are you sure you want to Drop this withdrawal request?"
      />
      <ConfirmationPopup
        visible={isReleasePopupVisible}
        onConfirm={handleReleaseConfirm}
        onCancel={() => setReleasePopupVisible(false)}
        message="Are you sure you want to Release this withdrawal request?"
      />
      <NotificationModal
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
        message={notificationMessage}
        type={notificationType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  approvedContainer: {
    backgroundColor: '#E6FFE6',
    borderLeftWidth: 5,
    borderLeftColor: '#00CC00',
  },
  rejectedContainer: {
    backgroundColor: '#FFE6E6',
    borderLeftWidth: 5,
    borderLeftColor: '#FF3333',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
    fontWeight: '500',
  },
  messageInput: {
    height: 48,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
    fontSize: 16,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  dropButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  releaseButton: {
    backgroundColor: '#00CC00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  popupContent: {
    width: 320,
    padding: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  popupMessage: {
    fontSize: 17,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  popupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#00CC00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  completionMessageContainer: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  completionMessageText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666666',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  notificationContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  notificationContent: {
    width: '90%',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  notificationIcon: {
    fontSize: 26,
    marginRight: 15,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 5,
  },
  notificationMessage: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  notificationCloseButton: {
    justifyContent: 'center',
    paddingLeft: 10,
  },
  notificationCloseText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default WithdrawRequestCard;