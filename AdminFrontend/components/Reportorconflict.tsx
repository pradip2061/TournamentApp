import { View, Text, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';

const ReportOrConflict = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedWinner, setSelectedWinner] = useState('');

  const handleButtonPress = (action, winner = '') => {
    setSelectedAction(action);
    setSelectedWinner(winner);
    setModalVisible(true);
  };

  const confirmAction = () => {
    console.log(`Confirmed ${selectedAction} for ${selectedWinner}`);
    setModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f0c29', '#302b63', '#24243e']}
        style={styles.gradientCard}
      >
        <View>
          <Text style={styles.text}>import here match card</Text>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.hostheader}>Host Details</Text>
          <Text style={styles.host}>username:arjun</Text>
          <Text style={styles.host}>In-Gamename:raiden.np</Text>
          <Text style={styles.host}>reults:yes || report:so this player do this to me</Text>
          <Text style={styles.host}>proof url:images</Text>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.userheader}>user Details</Text>
          <Text style={styles.user}>username:sagar</Text>
          <Text style={styles.user}>In-Gamename:virus</Text>
          <Text style={styles.user}>reults:yes || report:so this player do this to me</Text>
          <Text style={styles.user}>proof url:images</Text>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.userheader}>Declared winner in this match?</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress('declare', 'host')}
            >
              <Text style={styles.buttonText}>Host</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress('declare', 'user')}
            >
              <Text style={styles.buttonText}>User</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleButtonPress('refund', 'both')}
            >
              <Text style={styles.buttonText}>Refund Both</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Modal for confirmation */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={closeModal}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>
              {selectedAction === 'refund'
                ? 'Are you sure you want to refund both players?'
                : `Are you sure you want to declare ${selectedWinner} as the winner?`}
            </Text>
            <View style={styles.modalButtonContainer}>
              <Button title="Yes" onPress={confirmAction} />
              <Button title="No" onPress={closeModal} />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  gradientCard: {
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
  text: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#FFF',
    marginVertical: 10,
  },
  hostheader: {
    fontSize: 15,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  host: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 10,
  },
  userheader: {
    fontSize: 15,
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
  },
  user: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    position: 'relative',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ReportOrConflict;
