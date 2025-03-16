import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Linking,
  Image,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../../env';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';

// Confirmation popup component remains the same
const ConfirmationPopup = ({visible, onConfirm, onCancel, message}) => (
  <Modal
    transparent
    visible={visible}
    animationType="slide"
    onRequestClose={onCancel}>
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

// New animated notification modal component
const NotificationModal = ({visible, onClose, message, type}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

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

      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const backgroundColor = type === 'success' ? '#4CAF50' : '#F44336';

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.notificationContainer}>
        <Animated.View
          style={[
            styles.notificationContent,
            {
              backgroundColor,
              transform: [{translateY: slideAnim}],
              opacity: opacityAnim,
            },
          ]}>
          <View style={styles.notificationIconContainer}>
            <Text style={styles.notificationIcon}>
              {type === 'success' ? '✅' : '❌'}
            </Text>
          </View>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationTitle}>
              {type === 'success' ? 'Success' : 'Error'}
            </Text>
            <Text style={styles.notificationMessage}>{message}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationCloseButton}
            onPress={handleClose}>
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
  image,
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
  const [proofImage, setProofImage] = useState(null);
  const [base64Image, setBase64Image] = useState('');

  // New state for notification modal
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  // Check if request is completed (approved or rejected)
  const isCompleted = status === 'approved' || status === 'rejected';

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setAuthToken(storedToken || '');
    };
    fetchToken();
  }, []);

  // Function to show notification
  const showNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setNotificationVisible(true);
  };

  // Function to get status text with appropriate emoji
  const getStatusText = () => {
    if (status === 'approved') return 'Approved ✅';
    if (status === 'rejected') return 'Rejected ❌';
    return 'Pending ‼️';
  };

  // Function to get completion message
  const getCompletionMessage = () => {
    if (status === 'approved')
      return statusmessage || 'This request has been approved and processed.';
    if (status === 'rejected')
      return statusmessage || 'This request has been rejected.';
    return '';
  };

  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.5,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        showNotification(
          'Error selecting image: ' + response.errorMessage,
          'error',
        );
      } else {
        const source = {uri: response.assets[0].uri};
        setProofImage(source);
        setBase64Image(response.assets[0].base64);
        showNotification('Image successfully selected', 'success');
      }
    });
  };

  const handleDropConfirm = async () => {
    setDropPopupVisible(false);

    try {
      const withdrawResponse = await axios.post(
        `${BASE_URL}/khelmela/admin/money/withdraw/drop`,
        {
          requestId: id,
          message: message,
        },
        {
          headers: {
            Authorization: `${authToken}`,
          },
        },
      );

      console.log('Success', withdrawResponse.data.message);
      showNotification(withdrawResponse.data.message, 'success');
      setTimeout(() => {
        handleRefresh();
      }, 2500);
    } catch (error) {
      console.error('Error dropping request:', error);
      showNotification(
        error.response?.data?.message || 'Failed to drop request',
        'error',
      );
    }
  };

  const handleReleaseConfirm = async () => {
    setReleasePopupVisible(false);

    if (!base64Image && !isCompleted) {
      showNotification(
        'Please upload a proof image before releasing the request',
        'error',
      );
      return;
    }

    try {
      const imageResponse = await axios.post(
        `${BASE_URL}/khelmela/upload/upload`,
        {
          image: base64Image,
          folderName: 'withdraw',
          filename: `${username}_${Number}.jpg`,
        },
        {
          headers: {
            Authorization: `${authToken}`,
          },
        },
      );

      if (imageResponse.data.uri) {
        showNotification('Upload Failed', 'error');
        return;
      }

      const withdrawResponse = await axios.post(
        `${BASE_URL}/khelmela/admin/money/withdraw/release`,
        {
          requestId: id,
          image: imageResponse.data.uri,
          message: message,
        },
        {
          headers: {
            Authorization: `${authToken}`,
          },
        },
      );

      console.log('Success', withdrawResponse.data);

      showNotification(withdrawResponse.data.message, 'success');
      setTimeout(() => {
        handleRefresh();
      }, 2100);
    } catch (error) {
      console.error('Error releasing request:', error);
      showNotification('Error releasing request', 'error');
      console.log(error);
    }
  };

  // Function to handle opening the image URL
  const handleOpenImage = () => {
    if (image) {
      Linking.openURL(image).catch(err => {
        console.error('Failed to open URL:', err);
        showNotification('Could not open the photo URL', 'error');
      });
    }
  };

  return (
    <View
      style={[
        styles.container,
        status === 'approved'
          ? styles.approvedContainer
          : status === 'rejected'
          ? styles.rejectedContainer
          : styles.container,
      ]}>
      <Text style={styles.statusText}>Status: {getStatusText()}</Text>
      <Text style={styles.detailText}>Amount: ₹{amount}</Text>
      <Text style={styles.detailText}>Method: {selectedMethod}</Text>
      {Number && <Text style={styles.detailText}>Esewa Number: {Number}</Text>}
      <Text style={styles.detailText}>Date: {date}</Text>
      <View style={styles.photoLinkContainer}>
        <Text style={styles.detailText}>Withdrawal Request Image: </Text>
        <TouchableOpacity onPress={handleOpenImage}>
          <Text style={styles.photoLink}>Photo URL</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.detailText}>Sender ID: {senderId}</Text>
      <Text style={styles.detailText}>Username: {username}</Text>

      {!isCompleted ? (
        // Show input, image upload and buttons only for pending requests
        <>
          <TextInput
            style={styles.messageInput}
            placeholder="Enter message for the user"
            value={message}
            onChangeText={setMessage}
          />

          <Text style={styles.uploadText}>Upload Proof of Payment:</Text>

          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleSelectImage}>
            <Text style={styles.buttonText}>
              {proofImage ? 'Change Image' : 'Select Image'}
            </Text>
          </TouchableOpacity>

          {proofImage && (
            <View style={styles.imagePreviewContainer}>
              <Image source={proofImage} style={styles.imagePreview} />
              <Text style={styles.imageConfirmText}>✓ Image Selected</Text>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.dropButton}
              onPress={() => setDropPopupVisible(true)}>
              <Text style={styles.buttonText}>Drop</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.releaseButton}
              onPress={() => setReleasePopupVisible(true)}>
              <Text style={styles.buttonText}>Release</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // Show completion message for approved/rejected requests
        <View style={styles.completionMessageContainer}>
          <Text style={styles.completionMessageText}>
            {getCompletionMessage()}
          </Text>
        </View>
      )}

      {/* Confirmation Popups */}
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
        message={
          base64Image || isCompleted
            ? 'Are you sure you want to Release this withdrawal request?'
            : 'Please upload a proof image before releasing the request'
        }
      />

      {/* Notification Modal */}
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
    backgroundColor: '#778DA9',
    borderRadius: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  approvedContainer: {
    backgroundColor: '#a8d5ba', // Light green for approved
  },
  rejectedContainer: {
    backgroundColor: '#ffb6b6', // Light red for rejected
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  photoLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoLink: {
    fontSize: 16,
    color: '#0066CC',
    textDecorationLine: 'underline',
  },
  messageInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  uploadButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  imagePreviewContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 5,
    marginBottom: 5,
  },
  imageConfirmText: {
    color: 'green',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dropButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  releaseButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  popupMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  popupButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  completionMessageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  completionMessageText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
  },
  // New styles for notification modal
  notificationContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    backgroundColor: 'transparent',
  },
  notificationContent: {
    width: '90%',
    flexDirection: 'row',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  notificationIconContainer: {
    marginRight: 15,
    justifyContent: 'center',
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  notificationMessage: {
    color: 'white',
    fontSize: 14,
  },
  notificationCloseButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WithdrawRequestCard;
