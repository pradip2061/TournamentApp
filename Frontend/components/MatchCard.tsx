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
import{BASE_URL} from '../env'
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
  const matchId = match._id;
  const { setTrigger,trigger } = useContext(CheckAdminContext);

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
  }, [check, message,trigger]);

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
  }, [message,trigger]);

  const copyToClipboardId = () => Clipboard.setString(match.customId.toString());
  const copyToClipboardPass = () => Clipboard.setString(match.customPassword.toString());

  const reset = async () => {
    try {
     const token= await AsyncStorage.getItem('token')
      setError('');
      setMessage('');
      await axios
        .post(`${BASE_URL}/khelmela/changecustom`, { matchId, customId, customPassword },{
          headers:{
            Authorization:`${token}`
          }
        })
        .then((response) => {
          if (response.status === 200) {
            // setPublish(response.data.message);
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

  const submitresultIfYes = async () => {
    try {
      const boolean = true; // Assuming "Yes" means true
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

  const submitresultIfNo = async () => {
    try {
      const boolean = false;
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

  useEffect(() => {
    const checkresult = async () => {
      try {
        await axios
          .post(`${BASE_URL}/khelmela/checkresult`,{ matchId })
          .then((response) => setResult(response.data.message));
      } catch (error) {
        setError(error.response.data.message);
        notify();
      }
    };
    checkresult();
  }, [trigger]);

  const openGallery = () => {
    const options = { mediaType: 'photo', quality: 0.5 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setSelectedImage(uri);
        const filename = uri.split('/').pop();
        uploadPhoto(filename);
      }
    });
  };

  const uploadPhoto = async (filename) => {
    try {
      await axios.post(
        `${BASE_URL}/khelmela/upload`,
        { selectedImage: filename },
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
    } catch (error) {
      console.log('Upload Error:', error);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={styles.gradient}>
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
                                <View style={styles.inputs}>
                                  <Text>customId: {match.customId}</Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={copyToClipboardPass}>
                                <View style={styles.inputs}>
                                  <Text>customPass: {match.customPassword}</Text>
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
                            {result === 'booleanMatch' ? (
                              <Text style={styles.centerText}>Result submitted</Text>
                            ) : result === 'booleanNotMatch' ? (
                              <TouchableOpacity onPress={openGallery}>
                                <Text style={styles.centerText}>Upload your match photo</Text>
                              </TouchableOpacity>
                            ) : result === 'noresponse' ? (
                              <TouchableOpacity
                                onPress={() => setModalDidYouWin(true)}
                                style={styles.footerText}
                              >
                                <Text style={styles.submitText}>Submit Your Result</Text>
                              </TouchableOpacity>
                            ) : <Text>result submited</Text>}
                          </View>
                        </>
                      ) : (
                        <>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                          <View style={styles.leftContainer}>
                            <TextInput
                              style={styles.input}
                              placeholder="Custom ID"
                              keyboardType="numeric"
                              value={customId}
                              onChangeText={(text)=>setCustomId(text)}
                              placeholderTextColor="white"
                            />
                            <TextInput
                              style={styles.input}
                              placeholder="Custom Password"
                              keyboardType="numeric"
                              value={customPassword}
                              onChangeText={(text)=>setCustomPassword(text)}
                            />
                          </View>
                          <View style={styles.rightContainer}>
                            <TouchableOpacity style={styles.button} onPress={customIdAndPassword}>
                              <Text style={styles.buttonText}>Publish</Text>
                            </TouchableOpacity>
                          </View></View>
                        </>
                      )}
                    </View>
                  ) : check === 'userjoined' ? (
                    <View>
                      <View style={styles.publishRow}>
                        <View style={styles.leftContainer}>
                          <TouchableOpacity onPress={copyToClipboardId}>
                            <View style={styles.inputs}>
                              <Text>customId: {match.customId}</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={copyToClipboardPass}>
                            <View style={styles.inputs}>
                              <Text>customPass: {match.customPassword}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View>
                        {result === 'booleanMatch' ? (
                          <Text style={styles.centerText}>Result submitted</Text>
                        ) : result === 'booleanNotMatch' ? (
                          <TouchableOpacity onPress={openGallery}>
                            <Text style={styles.centerText}>Upload your match photo</Text>
                          </TouchableOpacity>
                        ) : result === 'noresponse' ? (
                          <TouchableOpacity
                            onPress={() => setModalDidYouWin(true)}
                            style={styles.footerText}
                          >
                            <Text style={styles.submitTextRed}>Submit Your Result</Text>
                          </TouchableOpacity>
                        ) : <Text>result submited</Text>}
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
            <TouchableOpacity onPress={()=>setModalDidYouWin(false)} style={{position:'absolute',marginLeft:240,marginTop:10}}>
            <Text style={{fontWeight:900,fontSize:20}}>X</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.noButton]} onPress={submitresultIfNo}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={submitresultIfYes}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalReset} transparent animationType="slide">
        <View style={styles.modalResetContainer}>
          <View style={styles.modalResetContent}>
            <TextInput
              placeholder="Custom ID"
              value={customId}
              onChangeText={setCustomId}
              style={styles.inputModal}
            />
            <TextInput
              placeholder="Custom Password"
              value={customPassword}
              secureTextEntry
              onChangeText={setCustomPassword}
              style={styles.inputModal}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={reset} style={styles.yesButton}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalReset(false)}
                style={styles.noButton}
              >
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
    marginVertical: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'black',
    overflow: 'hidden', // Clips the gradient to the border
  },
  card: {
    
    backgroundColor: 'transparent', // Let gradient handle the background
  },
  gradient: {
    flex: 1,
    borderRadius: 13, // Slightly less than container to fit inside border
    padding: 2, // Adds space so gradient doesn’t touch border
  },
  cardContent: {
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    gap:20
    
  },
  gameIcon: {
    width: 43,
    height: 43,
    borderRadius: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 9,
  },
  column: {
    flex: 1,
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  text: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  divider: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 10,
    width: '100%',
  },
  footer: {
    marginTop: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prizeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  entryButton: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 25,
  },
  joinedButton: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 25,
  },
  entryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  publishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 50,
    gap: 30,
  },
  leftContainer: {
    flex: 1,
  },
  rightContainer: {
    marginLeft: 20,
  },
  input: {
    width: 136,
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
  inputs: {
    width: 180,
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    paddingLeft: 5,
    justifyContent: 'center',
    marginTop: 10,
    backgroundColor:'white'
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  centerText: {
    color: 'white',
  },
  submitText: {
    marginLeft: 25,
    textDecorationLine: 'underline',
    color: 'white',
  },
  submitTextRed: {
    marginLeft: 25,
    textDecorationLine: 'underline',
    color: 'red',
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
  noButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  yesButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  modalResetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalResetContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  inputModal: {
    width: '100%',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
}); 

export default MatchCard;