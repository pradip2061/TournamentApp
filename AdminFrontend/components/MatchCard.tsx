import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import ModalNotify from './ModalNotify';
import { launchImageLibrary } from 'react-native-image-picker';
import { CheckAdminContext } from '../pages/ContextApi/ContextApi';
import { BASE_URL } from '../env';

const MatchCard = ({ match }) => {
  const [check, setCheck] = useState('');
  const [customId, setCustomId] = useState(0);
  const [customPassword, setCustomPassword] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [publish, setPublish] = useState('');
  const [modalReset, setModalReset] = useState(false);
  const [modalDidYouWin, setModalDidYouWin] = useState(false);
  const [notifyModel, setNotifyModel] = useState(false);
  const [result, setResult] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [boolean, setBoolean] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [proof, setProof] = useState('');
  const matchId = match._id;
  const { setTrigger, trigger } = useContext(CheckAdminContext);
  console.log(match);
  console.log(check);

  useEffect(() => {
    const checkUserOrAdmin = async () => {
      const token = await AsyncStorage.getItem('token');
      await axios
        .post(`${BASE_URL}/khelmela/checkUserOrAdmin`, { matchId }, {
          headers: { Authorization: `${token}` },
        })
        .then((response) => {
          setCheck(response.data.message);
        });
    };
    checkUserOrAdmin();
  }, [check, message, trigger]);

  const checking = async () => {
    try {
      setError('');
      setMessage('');
      const token = await AsyncStorage.getItem('token');
      await axios
        .post(`${BASE_URL}/khelmela/check`, {}, { headers: { Authorization: `${token}` } })
        .then((response) => {
          if (response.status === 200) {
            setModalVisible(true);
            setMessage('user is free');
          } else {
            setModalVisible(false);
          }
        });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      notify();
    }
  };

  const notify = () => {
    setNotifyModel(true);
    setTimeout(() => setNotifyModel(false), 900);
  };

  const customIdAndPassword = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(`${BASE_URL}/khelmela/setpass`, { customId, customPassword, matchId })
        .then((response) => {
          if (response.status === 200) setMessage(response.data.message);
        });
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const joinuser = async () => {
    try {
      setError('');
      setMessage('');
      const token = await AsyncStorage.getItem('token');
      await axios
        .post(`${BASE_URL}/khelmela/join`, { matchId }, { headers: { Authorization: `${token}` } })
        .then((response) => {
          if (response.status === 200) {
            setModalVisible(false);
            setMessage(response.data.message);
          } else {
            setModalVisible(true);
          }
        });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      notify();
    }
  };

  useEffect(() => {
    const checkpublish = async () => {
      try {
        await axios
          .post(`${BASE_URL}/khelmela/checkpublish`, { matchId })
          .then((response) => {
            if (response.status === 200) setPublish(response.data.message);
          });
      } catch (error) {
        setError(error.response.data.message);
      }
    };
    checkpublish();
  }, [message, trigger]);

  const copyToClipboardId = () => Clipboard.setString(match.customId.toString());
  const copyToClipboardPass = () => Clipboard.setString(match.customPassword.toString());

  const reset = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setError('');
      setMessage('');
      await axios
        .post(`${BASE_URL}/khelmela/changecustom`, { matchId, customId, customPassword }, {
          headers: { Authorization: `${token}` },
        })
        .then((response) => {
          if (response.status === 200) {
            setModalReset(false);
            setTrigger('done');
          }
        });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      notify();
    }
  };

  useEffect(() => {
    const checkresult = async () => {
      try {
        console.log(matchId);
        const token = await AsyncStorage.getItem('token');
        await axios
          .post(`${BASE_URL}/khelmela/checkresult`, { matchId }, {
            headers: { Authorization: `${token}` },
          })
          .then((response) => setResult(response.data.message));
      } catch (error) {
        setError(error.response.data.message);
        notify();
      }
    };
    checkresult();
  }, []);

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.3,
      includeBase64: true,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        setImage(response?.assets?.[0]?.base64);
      }
    });
  };

  const uploadImage = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/khelmela/upload/upload`,
        { image: image, folderName: 'report', filename: '.jpg' },
        { headers: { Authorization: `${token}` } }
      );
      console.log(response);
      if (response.status === 200) {
        setProof(response.data.url);
      }
    } catch (error) {
      console.error('Upload Error:', error);
    }
  };

  const submitResult = async () => {
    if (boolean === true) {
      if (!image || typeof boolean !== 'boolean') {
        setError("plz fill all field!");
        notify();
        return;
      }
      uploadImage();
    }
    try {
      const token = await AsyncStorage.getItem('token');
      await axios
        .post(
          `${BASE_URL}/khelmela/uploadproof`,
          { proof, matchId },
          { headers: { Authorization: `${token}` } }
        )
        .then((response) => setMessage(response.data.message));
    } catch (error) {
      setError(error.response?.data.message);
    }
    try {
      const token = await AsyncStorage.getItem('token');
      await axios
        .post(
          `${BASE_URL}/khelmela/checkBoolean`,
          { matchId, boolean },
          { headers: { Authorization: `${token}` } }
        )
        .then((response) => setMessage(response.data.message));
    } catch (error) {
      setError(error.response?.data.message);
    } finally {
      setModalDidYouWin(false);
      notify();
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <LinearGradient colors={['#1e1b4b', '#3b3477', '#2a2957']} style={styles.gradient}>
          <FlatList
            data={match.matchDetails}
            scrollEnabled={false}
            keyExtractor={(item, id) => id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity activeOpacity={1}>
                <View style={styles.cardContent}>
                  <View style={styles.headerRow}>
                    <Image source={require('../assets/freefire.jpeg')} style={styles.gameIcon} />
                    <Text style={styles.title}>FREEFIRE CLASH SQUAD</Text>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Text style={styles.text}>🎮 Mode: {item.player}</Text>
                      <Text style={styles.text}>🔫 Skills: {item.skill}</Text>
                      <Text style={styles.text}>🎯 Headshot: {item.headshot}</Text>
                      <Text style={styles.text}>🗺️ Match: {item.match}</Text>
                    </View>
                    <View style={styles.column}>
                      <Text style={styles.text}>💥 Limited Ammo: {item.ammo}</Text>
                      <Text style={styles.text}>🔄 Rounds: {item.round}</Text>
                      <Text style={styles.text}>💰 {item.coin ? `Coin: ${item.coin}` : ''}</Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.footer}>
                    <Text style={styles.text}>👾 Opponent: {item.gameName}</Text>
                    <View style={styles.footerRow}>
                      <Text style={styles.prizeText}>🏆 Prize: {item.betAmount * 1.5}</Text>
                      {check === 'user' ? (
                        <TouchableOpacity
                          activeOpacity={1}
                          style={styles.entryButton}
                          onPress={checking}
                        >
                          <Text style={styles.entryText}>Entry: {item.betAmount}</Text>
                        </TouchableOpacity>
                      ) : check === 'userjoined' ? (
                        <TouchableOpacity style={styles.joinedButton}>
                          <Text style={styles.entryText}>Joined</Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>

                  {check === 'host' ? (
                    <View style={styles.container}>
                      {publish === 'publish' ? (
                        <>
                          <View style={styles.publishRow}>
                            <View style={styles.leftContainer}>
                              <TouchableOpacity onPress={copyToClipboardId}>
                                <Text style={styles.label}>Custom ID:</Text>
                                <View style={styles.inputs}>
                                  <Text style={styles.inputText}>{match.customId}</Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={copyToClipboardPass}>
                                <Text style={styles.label}>Custom Pass:</Text>
                                <View style={styles.inputs}>
                                  <Text style={styles.inputText}>{match.customPassword}</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                            <View style={styles.rightContainer}>
                              <TouchableOpacity
                                style={styles.button}
                                onPress={() => setModalReset(true)}
                              >
                                <Text style={styles.buttonText}>Reset</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View>
                            {result === 'resultsubmit' ? (
                              <Text style={styles.centerText}>Result Submitted</Text>
                            ) : (
                              <TouchableOpacity
                                onPress={() => setModalDidYouWin(true)}
                                style={styles.footerText}
                              >
                                <Text style={styles.submitTextRed}>Submit Your Result</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </>
                      ) : (
                        <View style={styles.publishInputRow}>
                          <View style={styles.leftContainer}>
                            <TextInput
                              style={styles.input}
                              placeholder="Custom ID"
                              keyboardType="numeric"
                              value={customId}
                              onChangeText={(text) => setCustomId(text)}
                              placeholderTextColor="#aaa"
                            />
                            <TextInput
                              style={styles.input}
                              placeholder="Custom Password"
                              keyboardType="numeric"
                              value={customPassword}
                              onChangeText={(text) => setCustomPassword(text)}
                              placeholderTextColor="#aaa"
                            />
                          </View>
                          <View style={styles.rightContainer}>
                            <TouchableOpacity style={styles.button} onPress={customIdAndPassword}>
                              <Text style={styles.buttonText}>Publish</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )}
                    </View>
                  ) : check === 'userjoined' ? (
                    <View>
                      <View style={styles.publishRow}>
                        <View style={styles.leftContainer}>
                          <TouchableOpacity onPress={copyToClipboardId}>
                            <Text style={styles.label}>Custom ID:</Text>
                            <View style={styles.inputs}>
                              <Text style={styles.inputText}>{match.customId}</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={copyToClipboardPass}>
                            <Text style={styles.label}>Custom Pass:</Text>
                            <View style={styles.inputs}>
                              <Text style={styles.inputText}>{match.customPassword}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        {result === 'resultsubmit' ? (
                          <Text style={styles.centerText}>Result Submitted</Text>
                        ) : (
                          <TouchableOpacity
                            onPress={() => setModalDidYouWin(true)}
                            style={styles.footerText}
                          >
                            <Text style={styles.submitTextRed}>Submit Your Result</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
          />
        </LinearGradient>
      </View>

      <Modal transparent animationType="slide" visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.noButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={joinuser}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="slide" visible={modalDidYouWin}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Did you Win Match?</Text>
            <TouchableOpacity onPress={() => setModalDidYouWin(false)} style={styles.closeButton}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.noButton]}
                onPress={() => setBoolean(false)}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.yesButton]}
                onPress={() => setBoolean(true)}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
            {boolean === true ? (
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadText}>Click here to upload proof </Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.submitButton} onPress={submitResult}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalReset} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Custom ID"
              value={customId}
              onChangeText={setCustomId}
              style={styles.inputModal}
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Custom Password"
              value={customPassword}
              secureTextEntry
              onChangeText={setCustomPassword}
              style={styles.inputModal}
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={reset} style={styles.yesButton}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalReset(false)} style={styles.noButton}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ModalNotify visible={notifyModel} error={error} message={message} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  card: {
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    borderRadius: 19,
    padding: 4,
  },
  cardContent: {
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  gameIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  column: {
    flex: 1,
    padding: 4,
  },
  text: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#fff',
    marginVertical: 12,
    opacity: 0.7,
  },
  footer: {
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prizeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
  },
  entryButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  joinedButton: {
    backgroundColor: '#17a2b8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  entryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  container: {
    padding: 12,
  },
  publishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  publishInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flex: 1,
    gap: 8,
  },
  rightContainer: {
    marginLeft: 12,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  input: {
    width: 136, // Fixed width to match inputs
    height: 40, // Fixed height to match inputs
    backgroundColor: '#fff', // White background as requested
    color: '#000', // Black text as requested
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  inputs: {
    width: 136, // Same width as input
    height: 40, // Same height as input
    backgroundColor: '#fff', // White background to maintain consistency
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  inputText: {
    color: '#000', // Black text to match input
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  centerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
  submitTextRed: {
    color: '#ff4444',
    textDecorationLine: 'underline',
    fontSize: 15,
    textAlign: 'center',
  },
  footerText: {
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 90,
    width: '100%',
    justifyContent: 'center',
  },
  noButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  yesButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  uploadButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 1,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    paddingBottom:8
  },
  uploadText: {
    color: 'black',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 29,
    marginTop: 12,
  },
  inputModal: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
  },
});

export default MatchCard;