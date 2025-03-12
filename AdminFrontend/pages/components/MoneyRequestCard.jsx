import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from '../../env';
import {tokens} from 'react-native-paper/lib/typescript/styles/themes/v3/tokens';
import axios from 'axios';

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

const MoneyRequestCard = ({
  id,
  amount,
  selectedMethod,
  image,
  esewaNumber,
  date,
  username,
  status,
  senderId,
  statusmessage,
}) => {
  console.log('top--->' + status);
  const [isDropPopupVisible, setDropPopupVisible] = useState(false);
  const [isReleasePopupVisible, setReleasePopupVisible] = useState(false);
  const [message, setMessage] = useState('Request Successful');
  const [authToken, setAuthToken] = useState('');

  // Check if request is completed (approved or rejected)
  const isCompleted = status === 'approved' || status === 'rejected';

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setAuthToken(storedToken || '');
    };
    fetchToken();
  }, []);

  // Function to get status text with appropriate emoji
  const getStatusText = () => {
    if (status === 'approved') return 'Approved ✅';
    if (status === 'rejected') return 'Rejected ❌';
    return 'Pending ‼️';
  };

  // Function to get completion message
  const getCompletionMessage = () => {
    if (status === 'approved')
      return 'This request has been approved and processed.';
    if (status === 'rejected')
      return statusmessage || 'This request has been rejected.';
    return '';
  };

  const handleDropConfirm = async () => {
    console.log(status);
    setDropPopupVisible(false);
    console.log(status);
    console.log(`${baseUrl}/khelmela/admin/money/release/${authToken}`);
    const response = await axios.post(
      `${baseUrl}/khelmela/admin/money/drop/${authToken}`,
      {
        message: message,
        id: id,
        senderId: senderId,
      },
    );
    console.log(response);
    Alert.alert(response.data.message);
  };

  const handleReleaseConfirm = async () => {
    setReleasePopupVisible(false);
    console.log(authToken);
    console.log(message);
    console.log(
      `Releasing amount: ₹${amount} via ${selectedMethod}, Date: ${date}`,
    );

    console.log(`${baseUrl}/khelmela/admin/money/release/${authToken}`);
    const response = await axios.post(
      `${baseUrl}/khelmela/admin/money/release/${authToken}`,
      {
        message: message,
        id: id,
        senderId: senderId,
      },
    );
    console.log(response);
    Alert.alert(response.data.message);
  };

  // Function to handle opening the image URL
  const handleOpenImage = () => {
    if (image) {
      Linking.openURL(image).catch(err => {
        console.error('Failed to open URL:', err);
        Alert.alert('Error', 'Could not open the photo URL');
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
      {esewaNumber && (
        <Text style={styles.detailText}>Esewa Number: {esewaNumber}</Text>
      )}
      <Text style={styles.detailText}>Date: {date}</Text>
      <View style={styles.photoLinkContainer}>
        <Text style={styles.detailText}>Image: </Text>
        <TouchableOpacity onPress={handleOpenImage}>
          <Text style={styles.photoLink}>Photo URL</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.detailText}>Sender ID: {senderId}</Text>
      <Text style={styles.detailText}>Username : {username}</Text>

      {!isCompleted ? (
        // Show input and buttons only for pending requests
        <>
          <TextInput
            style={styles.messageInput}
            placeholder="Enter message for the user"
            value={message}
            onChangeText={setMessage}
          />

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

      <ConfirmationPopup
        visible={isDropPopupVisible}
        onConfirm={handleDropConfirm}
        onCancel={() => setDropPopupVisible(false)}
        message="Are you sure you want to Drop this request?"
      />

      <ConfirmationPopup
        visible={isReleasePopupVisible}
        onConfirm={handleReleaseConfirm}
        onCancel={() => setReleasePopupVisible(false)}
        message="Are you sure you want to Release this request?"
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
    marginBottom: 20,
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
});

export default MoneyRequestCard;
