import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';

const ConfirmationPopup = ({visible, onConfirm, onCancel, message}) => {
  return (
    <Modal
      transparent={true}
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
};

const MoneyRequestCard = ({
  id,
  gameName,
  amount,
  senderId,
  remark,
  status,
  onRelease,
}) => {
  const [isDropPopupVisible, setDropPopupVisible] = useState(false);
  const [isReleasePopupVisible, setReleasePopupVisible] = useState(false);
  const [message, setMessage] = useState('Request Successful');

  useEffect(() => {
    console.log('Drop Popup:', isDropPopupVisible);
    console.log('Release Popup:', isReleasePopupVisible);
  }, [isDropPopupVisible, isReleasePopupVisible]);

  const dropRequest = () => {
    setDropPopupVisible(true);
  };

  const releaseRequest = () => {
    setReleasePopupVisible(true);
  };

  const handleDropConfirm = (message, adminName, amount, remark, gameName) => {
    console.log('Dropping money request...');
    setDropPopupVisible(false);

    sendData('databasename', {
      adminName: adminName,
      amount: amount,
      remark: remark,
      gameName: gameName,
      status: 'Cancelled ❌',
    });

    updateData('db_name', {status: 'Cancelled ❌'});

    sendNotification('user', `Transaction Failed due to ${message}`);
  };

  const handleReleaseConfirm = (
    adminName,
    amount,
    remark,
    senderId,
    gameName,
  ) => {
    setReleasePopupVisible(false);

    sendData('databasename', {
      adminName: adminName,
      amount: amount,
      remark: remark,
      gameName: gameName,
      status: 'Done ✅',
    });

    updateData('db_name', {status: 'Done ✅'});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>
        Status: {status === 'done' ? 'Done ✅' : 'Pending ‼️'}
      </Text>
      <Text style={styles.gameNameText}>Game Name: 🎮 {gameName}</Text>
      <Text style={styles.amountText}>Amount: ₹ {amount}</Text>
      <Text style={styles.gameNameText}>Remark: {remark}</Text>

      <TextInput
        style={styles.messageInput}
        placeholder="Enter Message for the user"
        value={message}
        onChangeText={setMessage}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.dropButton} onPress={dropRequest}>
          <Text style={styles.buttonText}>Drop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.releaseButton} onPress={releaseRequest}>
          <Text style={styles.buttonText}>Release</Text>
        </TouchableOpacity>
      </View>

      {/* Drop Confirmation Popup */}
      <ConfirmationPopup
        visible={isDropPopupVisible}
        onConfirm={() =>
          handleDropConfirm(message, 'Admin1', amount, remark, gameName)
        }
        onCancel={() => setDropPopupVisible(false)}
        message="Are you sure you want to Drop this request?"
      />

      {/* Release Confirmation Popup */}
      <ConfirmationPopup
        visible={isReleasePopupVisible}
        onConfirm={() =>
          handleReleaseConfirm('Admin1', amount, remark, gameName)
        }
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
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amountText: {
    fontSize: 16,
    marginBottom: 10,
  },
  gameNameText: {
    fontSize: 16,
    marginBottom: 10,
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
});

export default MoneyRequestCard;
