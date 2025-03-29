import axios from 'axios';
import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {baseUrl} from '../env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MatchTypeModal = ({visible, onClose}) => {
  const [matchType, setMatchType] = useState('FreeFire');
  const [amount, setAmount] = useState('');
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [isPM, setIsPM] = useState(false);
  const [playerMode, setPlayerMode] = useState('Solo');
  const {isVisible, setIsVisible} = useState(visible);

  // Dropdown state
  const [showHourDropdown, setShowHourDropdown] = useState(false);
  const [showMinuteDropdown, setShowMinuteDropdown] = useState(false);

  // Hours and minutes options
  const hours = Array.from({length: 12}, (_, i) =>
    String(i + 1).padStart(2, '0'),
  );
  const minutes = ['00', '10', '20', '30', '40', '50'];

  // Player modes
  const playerModes = ['Solo', 'Duo', 'Squad'];

  const toggleMatchType = type => {
    setMatchType(type);
  };

  const toggleAmPm = () => {
    setIsPM(!isPM);
  };

  const handleCreate = async () => {
    if (!amount) {
      alert('Please enter the Entry fee');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const data = {
      playermode: playerMode,
      entryFee: amount,
      time: `${selectedHour}:${selectedMinute}${isPM ? ' PM' : ' AM'}`,
    };
    console.log('Token ......', token);
    console.log('Creating Match with details ......', matchType, data);

    if (matchType === 'FreeFire') {
      console.log('creating for free fire .....> ');
      console.log('BaseUrl -----', baseUrl);
      const response = await axios.post(
        `${baseUrl}/khelmela/createFFfullmap`,
        data,
        {
          headers: {Authorization: ` ${token}`},
        },
      );
      console.log('Response from server', response.data.message);
      if (response.data.message) {
        Alert.alert('Created', response.data.message);
      } else {
        Alert.alert('Try Again', 'Server Did not  respond');
        console.log(response);
        return;
      }
    }

    if (matchType === 'PUBG') {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${baseUrl}/khelmela/admin/createpubg-FM`,
        data,
        {
          headers: {Authorization: ` ${token}`},
        },
      );
      console.log('Response from server', response);
      if (response.data.message) {
        Alert.alert('Created', response.data.message);
        onClose();
      } else {
        Alert.alert('Try Again', 'Server Did not  respond');

        console.log(response);
        return;
      }
    }
  };

  const selectHour = hour => {
    setSelectedHour(hour);
    setShowHourDropdown(false);
  };

  const selectMinute = minute => {
    setSelectedMinute(minute);
    setShowMinuteDropdown(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      isVisible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Match Settings</Text>

          {/* Game Type Toggle */}
          <Text style={styles.sectionTitle}>Game Type</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                matchType === 'FreeFire' && styles.toggleButtonActive,
              ]}
              onPress={() => toggleMatchType('FreeFire')}>
              <Text
                style={[
                  styles.toggleText,
                  matchType === 'FreeFire' && styles.toggleTextActive,
                ]}>
                FreeFire
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                matchType === 'PUBG' && styles.toggleButtonActive,
              ]}
              onPress={() => toggleMatchType('PUBG')}>
              <Text
                style={[
                  styles.toggleText,
                  matchType === 'PUBG' && styles.toggleTextActive,
                ]}>
                PUBG
              </Text>
            </TouchableOpacity>
          </View>

          {/* Player Mode Selection */}
          <Text style={styles.sectionTitle}>Player Mode</Text>
          <View style={styles.playerModeContainer}>
            {playerModes.map(mode => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.playerModeButton,
                  playerMode === mode && styles.playerModeButtonActive,
                ]}
                onPress={() => setPlayerMode(mode)}>
                <Text
                  style={[
                    styles.playerModeText,
                    playerMode === mode && styles.playerModeTextActive,
                  ]}>
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Amount Input */}
          <Text style={styles.sectionTitle}>Entry Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
          />

          {/* Time Selection */}
          <Text style={styles.sectionTitle}>Match Time</Text>
          <View style={styles.timeContainer}>
            {/* Hours Dropdown */}
            <View style={styles.timeInputContainer}>
              <Text style={styles.timeLabel}>Hour</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setShowHourDropdown(!showHourDropdown);
                  setShowMinuteDropdown(false);
                }}>
                <Text style={styles.dropdownButtonText}>{selectedHour}</Text>
              </TouchableOpacity>
              {showHourDropdown && (
                <View style={styles.dropdownList}>
                  <ScrollView
                    nestedScrollEnabled={true}
                    style={{maxHeight: 150}}>
                    {hours.map(hour => (
                      <TouchableOpacity
                        key={hour}
                        style={[
                          styles.dropdownItem,
                          selectedHour === hour && styles.dropdownItemSelected,
                        ]}
                        onPress={() => selectHour(hour)}>
                        <Text
                          style={[
                            styles.dropdownItemText,
                            selectedHour === hour &&
                              styles.dropdownItemTextSelected,
                          ]}>
                          {hour}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Minutes Dropdown */}
            <View style={styles.timeInputContainer}>
              <Text style={styles.timeLabel}>Minute</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setShowMinuteDropdown(!showMinuteDropdown);
                  setShowHourDropdown(false);
                }}>
                <Text style={styles.dropdownButtonText}>{selectedMinute}</Text>
              </TouchableOpacity>
              {showMinuteDropdown && (
                <View style={styles.dropdownList}>
                  <ScrollView
                    nestedScrollEnabled={true}
                    style={{maxHeight: 150}}>
                    {minutes.map(minute => (
                      <TouchableOpacity
                        key={minute}
                        style={[
                          styles.dropdownItem,
                          selectedMinute === minute &&
                            styles.dropdownItemSelected,
                        ]}
                        onPress={() => selectMinute(minute)}>
                        <Text
                          style={[
                            styles.dropdownItemText,
                            selectedMinute === minute &&
                              styles.dropdownItemTextSelected,
                          ]}>
                          {minute}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* AM/PM Toggle */}
            <View style={styles.amPmContainer}>
              <Text style={styles.timeLabel}>AM/PM</Text>
              <View style={styles.amPmToggle}>
                <TouchableOpacity
                  style={[styles.amPmButton, !isPM && styles.amPmButtonActive]}
                  onPress={() => setIsPM(false)}>
                  <Text
                    style={[styles.amPmText, !isPM && styles.amPmTextActive]}>
                    AM
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.amPmButton, isPM && styles.amPmButtonActive]}
                  onPress={() => setIsPM(true)}>
                  <Text
                    style={[styles.amPmText, isPM && styles.amPmTextActive]}>
                    PM
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCreate}>
              <Text style={styles.submitButtonText}>Create Match</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 340,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 15,
    color: '#444',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    marginBottom: 5,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  toggleButtonActive: {
    backgroundColor: '#3498db',
  },
  toggleText: {
    fontWeight: '500',
    color: '#555',
  },
  toggleTextActive: {
    color: 'white',
  },
  playerModeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  playerModeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 2,
    borderRadius: 8,
  },
  playerModeButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  playerModeText: {
    fontWeight: '500',
    color: '#555',
  },
  playerModeTextActive: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
    backgroundColor: '#f9f9f9',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeInputContainer: {
    width: '30%',
    position: 'relative',
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownList: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
    zIndex: 1000,
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#e6f7ff',
  },
  dropdownItemText: {
    textAlign: 'center',
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  amPmContainer: {
    width: '30%',
  },
  amPmToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  amPmButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  amPmButtonActive: {
    backgroundColor: '#3498db',
  },
  amPmText: {
    fontWeight: '500',
    color: '#555',
  },
  amPmTextActive: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#555',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#2ecc71',
    padding: 14,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MatchTypeModal;
