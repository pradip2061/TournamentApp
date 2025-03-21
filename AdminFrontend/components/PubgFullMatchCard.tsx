import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import {BASE_URL} from '../env';

const img = require('../assets/image.png');
const miramar = require('../assets/miramar.jpg');
const erangle = require('../assets/erangle.jpg');
const sanhok = require('../assets/sanhok.jpg');

const PubgFullMatchCard = ({matches}) => {
  const matchId = matches._id;
  const [checkmatch, setCheckMatch] = useState('');
  const [customId, setCustomId] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const initalTime = matches.time;
  const [amPm, setAmPm] = useState('PM');
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  const [hidematch, setHidematch] = useState(false);

  // Available time options
  const timeOptions = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];

  const clipboardId = () => {
    if (customId) {
      Clipboard.setString(customId);
    }
  };

  const clipboardPass = () => {
    if (customPassword) {
      Clipboard.setString(customPassword);
    }
  };

  const toggleAmPm = () => {
    setAmPm(amPm === 'AM' ? 'PM' : 'AM');
  };

  const handleMatchHide = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const response = await axios.post(
        `${BASE_URL}/khelmela/admin/hideMatch`,
        {
          matchId,
          matchType: 'pubG',
        },
        {
          headers: {Authorization: `${token}`},
        },
      );
      console.log(response);
      Alert.alert('', response.data.message);

      setHidematch(false);
    } catch (error) {
      console.log(error);
      Alert.alert('', 'Error');
    }
  };

  const openTimeSelector = () => {
    setTimeModalVisible(true);
  };

  const selectTime = time => {
    setSelectedTime(time);
    setTimeModalVisible(false);
  };

  const renderTimeItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.timeItem,
        selectedTime === item && styles.selectedTimeItem,
      ]}
      onPress={() => selectTime(item)}>
      <Text
        style={[
          styles.timeItemText,
          selectedTime === item && styles.selectedTimeItemText,
        ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const UpdateIdPassword = async () => {
    try {
      let data = {};
      const token = await AsyncStorage.getItem('token');

      if (selectedTime) {
        data = {
          matchId,
          coustum: {
            id: customId,
            password: customPassword,
          },
          time: selectedTime,
        };
      }
      //
      else {
        data = {
          matchType: 'pubG',
          matchId,
          coustum: {
            id: customId,
            password: customPassword,
          },
        };
      }

      const response = await axios.post(
        `${BASE_URL}/khelmela/admin/updateFullMatch`,
        data,
        {
          headers: {Authorization: `${token}`},
        },
      );

      console.log(data);
      Alert.alert('Sucessful', response?.data?.message);
    } catch (error) {
      console.error('Failed to update:', error);
      Alert.alert('Failed', 'Failed to update');
    }
  };

  return (
    <LinearGradient
      colors={['#0f0c29', '#302b63', '#24243e']}
      style={styles.container}
      key={matches._id}>
      <TouchableOpacity
        style={styles.crossbutton}
        onPress={() => setHidematch(true)}>
        <Text style={styles.cross}>X</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={img} alt={'no image'} style={styles.image} />
          <Text style={styles.text}>PUBG Full Match</Text>
        </View>
        <Text style={styles.text}>Player mode: {matches.playermode}</Text>
      </View>

      <View style={styles.mapContainer}>
        <Text style={styles.title}>MAP: Random</Text>
        <Text style={styles.title}>Total player: {matches.TotalPlayer}</Text>
      </View>

      <View style={styles.mapImages}>
        <Image source={erangle} alt="no image" style={styles.imagemap} />
        <Image source={miramar} alt="no image" style={styles.imagemap} />
        <Image source={sanhok} alt="no image" style={styles.imagemap} />
      </View>

      <View style={styles.detailsContainer}>
        {checkmatch === 'solo' ? (
          <>
            <View>
              <Text style={styles.text}>Winner:</Text>
              <Text style={styles.text}>Top: 4</Text>
              <Text style={styles.text}>Top: 22</Text>
            </View>
            <View>
              <Text style={styles.text}>Odds:</Text>
              <Text style={styles.text}>3x</Text>
              <Text style={styles.text}>1.5x</Text>
            </View>
          </>
        ) : checkmatch === 'squad' ? (
          <>
            <View>
              <Text style={styles.text}>Winner:</Text>
              <Text style={styles.text}>Top: 2</Text>
              <Text style={styles.text}>Top: 6</Text>
            </View>
            <View>
              <Text style={styles.text}>Odds:</Text>
              <Text style={styles.text}>3x</Text>
              <Text style={styles.text}>1.5x</Text>
            </View>
          </>
        ) : (
          <>
            <View>
              <Text style={styles.text}>Winner:</Text>
              <Text style={styles.text}>Top: 2</Text>
              <Text style={styles.text}>Top: 16</Text>
            </View>
            <View>
              <Text style={styles.text}>Odds:</Text>
              <Text style={styles.text}>3x</Text>
              <Text style={styles.text}>1.5x</Text>
            </View>
          </>
        )}
      </View>
      <View style={styles.divider} />

      {/* Time Selection with AM/PM Toggle */}
      <View style={styles.timeAndEntryContainer}>
        <View style={styles.timeSelectionContainer}>
          <TouchableOpacity
            style={styles.timeDisplayButton}
            onPress={openTimeSelector}>
            <Text style={styles.timeDisplayText}>
              {selectedTime || initalTime}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.amPmToggle} onPress={toggleAmPm}>
            <Text style={styles.amPmText}>{amPm}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.joinedContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Custom-Id: </Text>
            <TextInput
              style={[styles.inputBox, {color: 'blue'}]}
              placeholder={matches?.coustum?.id}
              onChangeText={setCustomId}
            />
            <TouchableOpacity onPress={clipboardId}>
              <AntDesign name="copy1" size={17} style={{marginLeft: 10}} />
            </TouchableOpacity>
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password:</Text>
            <TextInput
              placeholder={matches?.coustum?.password}
              style={[styles.inputBox, {marginLeft: 8, color: 'red'}]}
              onChangeText={setCustomPassword}
            />
            <TouchableOpacity onPress={clipboardPass}>
              <AntDesign name="copy1" size={17} style={{marginLeft: 10}} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={UpdateIdPassword}
          style={styles.joinedButton}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      </View>

      {/* Hide Modal */}

      <Modal animationType="slide" transparent={true} visible={hidematch}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Hide Match</Text>
            <Text style={styles.modalText}>
              Are you sure you want to hide this match?
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setHidematch(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() => {
                  setHidematch(false);
                  handleMatchHide();
                }}>
                <Text style={styles.confirmButtonText}>Yes, Hide</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={timeModalVisible}
        onRequestClose={() => setTimeModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={{backgroundColor: 'white'}}>
            <Text style={styles.modalTitle}>Select Time</Text>
            <FlatList
              data={timeOptions}
              renderItem={renderTimeItem}
              keyExtractor={item => item}
              numColumns={4}
              contentContainerStyle={styles.timeList}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setTimeModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  // Existing styles - unchanged
  container: {
    width: 340,
    marginLeft: 30,
    padding: 12,
    gap: 15,
    borderRadius: 25,
  },
  crossbutton: {
    backgroundColor: 'red',
    marginLeft: '90%',
    width: 30,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: -14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginLeft: -10,
  },
  text: {
    fontSize: 13.6,
    fontWeight: '700',
    color: 'white',
  },
  mapContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#fff',
  },
  mapImages: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  imagemap: {
    width: 100,
    height: 80,
    borderRadius: 20,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 76,
    alignItems: 'center',
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 10,
    width: '100%',
  },
  timeAndEntryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  timeSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  timeDisplayButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    minWidth: 60,
    alignItems: 'center',
  },
  timeDisplayText: {
    color: '#24243e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  amPmToggle: {
    backgroundColor: '#24243e',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
  },
  amPmText: {
    color: 'white',
    fontWeight: 'bold',
  },
  joinedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    gap: 10,
    width: '75%',
  },
  input: {
    height: 40,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputBox: {
    flex: 1,
    height: 40,
    fontSize: 13,
    padding: 0,
  },
  joinedButton: {
    backgroundColor: 'green',
    height: 40,
    width: '22%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },

  // Current modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#24243e',
  },
  timeList: {
    width: '100%',
    alignItems: 'center',
  },
  timeItem: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  selectedTimeItem: {
    backgroundColor: '#302b63',
  },
  timeItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#24243e',
  },
  selectedTimeItemText: {
    color: 'white',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#24243e',
    borderRadius: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // New hide match modal styles
  modalBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  confirmButton: {
    backgroundColor: '#ff3b30',
  },
  cancelButtonText: {
    color: '#555',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
export default PubgFullMatchCard;
