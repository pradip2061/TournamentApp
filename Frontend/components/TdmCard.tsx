import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalNotify from './ModalNotify';
import Clipboard from '@react-native-clipboard/clipboard';
const img = require('../assets/image.png');
const tdm = require('../assets/tdm.jpg')
import { BASE_URL } from '../env'

const TdmCard = ({ matches }) => {
  const [modal, setModal] = useState(false);
  const matchId = matches._id;
  const [notifyModel, setNotifyModel] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [checkJoined, setCheckJoined] = useState('');
  const [isHost, setIsHost] = useState(false); // New state to track if user is host
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player3, setPlayer3] = useState('');
  const [checkMatch, setCheckMatch] = useState('');

  const notify = () => {
    setModal(false);
    setNotifyModel(true);
    setTimeout(() => {
      setNotifyModel(false);
    }, 900);
  };

  const joinuser = async () => {
    setMessage('');
    setError('');
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${BASE_URL}/khelmela/joinuserPubgtdm`, { matchId }, {
        headers: {
          Authorization: `${token}`
        }
      });
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data.message || 'Failed to join match');
    } finally {
      notify();
    }
  };

  // Check if user is host (example API call, adjust based on your backend)
  useEffect(() => {
    const checkHostStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        const response = await axios.post(
          `${BASE_URL}/khelmela/checkhostPubgtdm`, // Hypothetical endpoint
          { matchId },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response.status === 200) {
          setIsHost(response.data.isHost || false); // Default to false if no isHost
        }
      } catch (err) {
        console.log('Error checking host status:', err.message);
        setIsHost(false); // Default to false on error
      }
    };
    checkHostStatus();
  }, [matchId]);

  useEffect(() => {
    const checkuser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        const response = await axios.post(
          `${BASE_URL}/khelmela/checkuserPubgtdm`,
          { matchId },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        if (response.status === 200) {
          setCheckJoined(response.data.message);
          console.log(response.data.message);
        }
      } catch (err) {
        console.log('Error checking user status:', err.message);
      }
    };
    checkuser();
  }, [matchId]);

  const clipboardid = () => {
    Clipboard.setString('88997');
  };

  const clipboardpass = () => {
    Clipboard.setString('54988');
  };

  const publishMatch = async () => {
    setMessage('');
    setError('');
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const response = await axios.post(
        `${BASE_URL}/khelmela/publishMatch`, // Hypothetical endpoint
        { matchId },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setMessage(response.data.message || 'Match published successfully!');
    } catch (error) {
      setError(error.response?.data.message || 'Failed to publish match');
    } finally {
      notify();
    }
  };

  useEffect(() => {
    const checkmatchType = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/khelmela/checkmatchType`,
          { matchId },
        );
        if (response.status === 200) {
          setCheckMatch(response.data.message);
          console.log(checkMatch);
        }
      } catch (err) {
        console.log('Error checking match type:', err.message);
      }
    };
    checkmatchType();
  }, [matchId]);

  return (
    <View style={[
      styles.container,
      { height: checkJoined === 'joined' ? 430 : 300 }
    ]}>
      <LinearGradient
        colors={["#0f0c29", "#302b63", "#24243e"]}
        style={styles.linearGradient}
      >
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Image source={img} style={styles.gameIcon} />
            <Text style={styles.titleText}>PUBG Team DeathMatch</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.mapText}>MAP: Warehouse</Text>
          <Text style={styles.modeText}>Mode: {matches.playermode}</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={tdm} style={styles.matchImage} />
        </View>

        <View style={styles.divider} />

        <View style={styles.matchDetails}>
          <Text style={styles.detailText}>👾 Opponent: arjun</Text>
          <View style={styles.prizeEntryContainer}>
            <Text style={styles.prizeText}>🏆 Prize: {matches.prize || 50}</Text>
            {checkJoined === 'joined' ? (
              <TouchableOpacity style={styles.joinedButton}>
                <Text style={styles.buttonText}>Joined</Text>
              </TouchableOpacity>
            ) : checkJoined === 'notjoined' ? (
              <TouchableOpacity
                style={styles.entryButton}
                onPress={() => setModal(true)}
              >
                <Text style={styles.buttonText}>Entry: {matches.entryFee}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.loadingText}>...loading</Text>
            )}
          </View>

          {/* Clipboard section shown only when joined */}
          {checkJoined === 'joined' && (
            <View style={styles.clipboardContainer}>
              <View style={styles.inputField}>
                <Text style={styles.inputText}>Room ID: 88997</Text>
                <TouchableOpacity onPress={clipboardid}>
                  <AntDesign name="copy1" size={17} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.inputField}>
                <Text style={styles.inputText}>Password: 54988</Text>
                <TouchableOpacity onPress={clipboardpass}>
                  <AntDesign name="copy1" size={17} color="#fff" />
                </TouchableOpacity>
              </View>
              {/* Publish button for host */}
              {isHost && (
                <TouchableOpacity
                  style={styles.publishButton}
                  onPress={publishMatch}
                >
                  <Text style={styles.buttonText}>Publish Match</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <Modal transparent animationType="slide" visible={modal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Did you join match?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.noButton]}
                  onPress={() => setModal(false)}
                >
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.yesButton]}
                  onPress={joinuser}
                >
                  <Text style={styles.modalButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <ModalNotify visible={notifyModel} error={error} message={message} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 330,
    marginLeft: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  linearGradient: {
    padding: 15,
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gameIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  matchImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 10,
  },
  matchDetails: {
    gap: 8,
    flex: 1,
  },
  detailText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  prizeEntryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prizeText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  joinedButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
  },
  entryButton: {
    backgroundColor: '#17a2b8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
  },
  clipboardContainer: {
    marginTop: 10,
    gap: 10,
    padding: 10,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    width: '100%',
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  publishButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    elevation: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: 300,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
    justifyContent: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 2,
  },
  noButton: {
    backgroundColor: '#dc3545',
  },
  yesButton: {
    backgroundColor: '#28a745',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default TdmCard;