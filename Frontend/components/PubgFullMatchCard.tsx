import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalNotify from './ModalNotify';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';

const img = require('../assets/image.png');
const miramar = require('../assets/miramar.jpg');
const erangle = require('../assets/erangle.jpg');
const sanhok = require('../assets/sanhok.jpg');

const PubgFullMatchCard = ({ matches }) => {
  const [modal, setModal] = useState(false);
  const matchId = matches._id;
  const [notifyModel, setNotifyModel] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [checkJoined, setCheckJoined] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player3, setPlayer3] = useState('');
  const [checkmatch, setCheckMatch] = useState('');

  const notify = () => {
    setModal(false);
    setNotifyModel(true);
    setTimeout(() => {
      setNotifyModel(false);
    }, 900);
  };

  const joinuser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${process.env.baseUrl}/khelmela/joinuserPubg`,
        { matchId },
        {
          headers: {
            Authorization: `${token}`,
          },
        },
      );
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      notify();
    }
  };

  useEffect(() => {
    const checkuser = async () => {
      const token = await AsyncStorage.getItem('token');
      await axios
        .post(
          'http://30.30.17.80:3000/khelmela/checkuserPubg',
          { matchId },
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        )
        .then(response => {
          if (response.status === 200) {
            setCheckJoined(response.data.message);
            console.log(response.data.message);
          }
        });
    };
    checkuser();
  }, [matchId]);

  const clipboardid = () => {
    Clipboard.setString('hello');
  };

  const clipboardpass = () => {
    Clipboard.setString('hello');
  };

  const addName = async () => {
    setError('');
    setMessage('');
    const token = await AsyncStorage.getItem('token');
    try {
      await axios
        .post(
          `${process.env.baseUrl}/khelmela/addName`,
          { matchId, player1, player2, player3 },
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        )
        .then(response => {
          setMessage(response.data.message);
        });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      notify();
    }
  };

  useEffect(() => {
    const checkmatchType = () => {
      axios
        .post('http://30.30.17.80:3000/khelmela/checkmatchTypePubg', { matchId })
        .then(response => {
          if (response.status === 200) {
            setCheckMatch(response.data.message);
          }
        });
    };
    checkmatchType();
  }, []);

  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.container}
      key={matches._id}
    >
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

      {/* Time and Entry Fee in the same row */}
      <View style={styles.timeAndEntryContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.texttime}>Time: {matches.time || '3:00 PM'}</Text>
          {checkJoined === 'notjoined' ? (
          <TouchableOpacity
            style={styles.entryButton}
            onPress={() => setModal(true)}
          >
            <Text style={{ color: 'white' }}>Entry fee: {matches.entryFee}</Text>
          </TouchableOpacity>
        ): <TouchableOpacity style={styles.joinedButton}>
        <Text style={{ color: 'white' }}>Joined</Text>
      </TouchableOpacity>}
        </View>
        
      </View>

      <Modal transparent animationType="slide" visible={modal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Did you join match?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.noButton]}
                onPress={() => setModal(false)}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.yesButton]}
                onPress={joinuser}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ModalNotify visible={notifyModel} error={error} message={message} />

      {checkJoined === 'joined' ? (
        <View style={styles.joinedContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <Text>customid: 88997</Text>
              <TouchableOpacity onPress={clipboardid}>
                <AntDesign name="copy1" size={17} style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>
            <View style={styles.input}>
              <Text>custom: 54988</Text>
              <TouchableOpacity onPress={clipboardpass}>
                <AntDesign name="copy1" size={17} style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <TextInput
              style={styles.inputs}
              placeholder="player 1"
              value={player1}
              onChangeText={text => setPlayer0(text)}
            />
            <TextInput
              style={styles.inputs}
              placeholder="player 2"
              value={player1}
              onChangeText={text => setPlayer1(text)}
            />
            <TextInput
              style={styles.inputs}
              placeholder="player 3"
              value={player2}
              onChangeText={text => setPlayer2(text)}
            />
            <TextInput
              style={styles.inputs}
              placeholder="player 4"
              value={player3}
              onChangeText={text => setPlayer3(text)}
            />
            <TouchableOpacity style={styles.joinedButton} onPress={addName}>
              <Text style={{ color: 'white' }}>Add gameName</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : checkJoined === 'notjoined' ? null : (
        <Text style={styles.loadingText}>...loading</Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 340,
    marginLeft: 20,
    padding: 10,
    gap: 15,
    borderRadius: 25,
    elevation: 4,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  timeContainer: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 25,
    width: 110,
    height: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection:'row',
    gap:120
  },
  texttime: {
    color: 'black',
    fontSize: 12, // Slightly smaller for fit
    fontWeight: '600',
  },
  joinedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    gap: 10,
  },
  input: {
    height: 30,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  inputs: {
    width: 120,
    height: 40,
    borderWidth: 1,
    borderColor: '#fff',
    marginVertical: 5,
    paddingHorizontal: 10,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  joinedButton: {
    backgroundColor: 'green',
    height: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:25
  },
  entryButton: {
    backgroundColor: 'green',
    height: 30,
    width: 110, // Match timeContainer width
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25, // Match timeContainer's rounded style
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  noButton: {
    backgroundColor: '#dc3545',
  },
  yesButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PubgFullMatchCard;