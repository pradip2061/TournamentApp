import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import ModalNotify from './ModalNotify';
import { launchImageLibrary } from 'react-native-image-picker';
import { CheckAdminContext } from '../pages/ContextApi/ContextApi';
import { BASE_URL } from '../env';

const img = require('../assets/image.png');
const tdm = require('../assets/tdm.jpg');

const TdmCard = ({ matches, getmatches }) => {
  const [state, setState] = useState({
    check: '',
    customId: '',
    customPassword: '',
    modalVisible: false,
    error: '',
    message: '',
    publish: '',
    modalReset: false,
    modalDidYouWin: false,
    notifyModel: false,
    result: '',
    image: null,
    boolean: null,
    loading: false,
    deleteCardModel: false,
    reportMessage: '',
    reportModel: false,
    checkReport: '',
  });

  const { setTrigger, trigger } = useContext(CheckAdminContext);
  const matchId = matches?._id;

  const updateState = useCallback((newState) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  const notify = useCallback(() => {
    updateState({ notifyModel: true });
    setTimeout(() => updateState({ notifyModel: false }), 900);
  }, [updateState]);

  const getToken = useCallback(async () => {
    return await AsyncStorage.getItem('token');
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = await getToken();
      try {
        const [checkResponse, publishResponse, resultResponse, reportResponse] = await Promise.all([
          axios.post(`${BASE_URL}/khelmela/checkUserOrAdmintdm`, { matchId }, { headers: { Authorization: `${token}` } }),
          axios.post(`${BASE_URL}/khelmela/checkpublishtdm`, { matchId }),
          axios.post(`${BASE_URL}/khelmela/checkresulttdm`, {}, { headers: { Authorization: `${token}` } }),
          axios.post(`${BASE_URL}/khelmela/checkreportTdm`, {}, { headers: { Authorization: `${token}` } }),
        ]);

        updateState({
          check: checkResponse.data.message,
          publish: publishResponse.data.message,
          result: resultResponse.data.message,
          checkReport: reportResponse.data.message,
        });
      } catch (error) {
        updateState({ error: error.response?.data?.message || 'Failed to load initial data' });
      }
    };

    fetchInitialData();
  }, [matchId, trigger, getToken, updateState]);

  const customIdAndPassword = useCallback(async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/khelmela/setpasstdm`, {
        customId: state.customId,
        customPassword: state.customPassword,
        matchId,
      });
      updateState({ message: response.data.message });
      getmatches();
    } catch (error) {
      updateState({ error: error.response?.data?.message || 'Publish failed' });
    }
  }, [state.customId, state.customPassword, matchId, getmatches, updateState]);

  const joinuser = useCallback(async () => {
    const token = await getToken();
    try {
      const response = await axios.post(
        `${BASE_URL}/khelmela/joinuserPubgtdm`,
        { matchId },
        { headers: { Authorization: `${token}` } }
      );
      updateState({
        modalVisible: false,
        message: response.data.message,
      });
      getmatches();
    } catch (error) {
      updateState({ error: error.response?.data?.message || 'Join failed' });
    } finally {
      notify();
    }
  }, [matchId, getToken, getmatches, notify, updateState]);

  const copyToClipboardId = useCallback(() => {
    if (!matches?.customId) {
      updateState({ error: 'No ID available' });
      notify();
      return;
    }
    Clipboard.setString(matches.customId.toString());
  }, [matches?.customId, notify, updateState]);

  const copyToClipboardPass = useCallback(() => {
    if (!matches?.customPassword) {
      updateState({ error: 'No password available' });
      notify();
      return;
    }
    Clipboard.setString(matches.customPassword.toString());
  }, [matches?.customPassword, notify, updateState]);

  const reset = useCallback(async () => {
    const token = await getToken();
    try {
      await axios.post(
        `${BASE_URL}/khelmela/changecustomtdm`,
        { matchId, customId: state.customId, customPassword: state.customPassword },
        { headers: { Authorization: `${token}` } }
      );
      updateState({ modalReset: false });
      setTrigger('done');
      getmatches();
    } catch (error) {
      updateState({ error: error.response?.data?.message || 'Reset failed' });
    } finally {
      notify();
    }
  }, [state.customId, state.customPassword, matchId, getToken, setTrigger, getmatches, notify, updateState]);

  const pickImage = useCallback(() => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.7, // Updated to recommended quality
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      if (!response.didCancel && !response.errorMessage) {
        updateState({ image: response?.assets?.[0]?.base64 });
      }
    });
  }, [updateState]);

  const handleDeposite = useCallback(async (image) => {
    const token = await getToken();
    if (!token || !image) return null;
    try {
      const timestamp = new Date().getTime();
      const filename = `payment_proof_${timestamp}.jpg`;
      const response = await axios.post(
        `${BASE_URL}/khelmela/upload/upload`,
        { image, folderName: 'proof', filename },
        { headers: { Authorization: `${token}` } }
      );
      return response.data.url;
    } catch (error) {
      updateState({ error: error.response?.data?.message || 'Image upload failed' });
      notify();
      return null;
    }
  }, [getToken, notify, updateState]);

  const submitResult = useCallback(async () => {
    if (state.boolean === null) {
      updateState({ error: 'Select Yes or No' });
      notify();
      return;
    }

    const token = await getToken();
    try {
      if (state.boolean) {
        if (!state.image) {
          updateState({ error: 'Please upload an image' });
          notify();
          return;
        }
        const uploadedProof = await handleDeposite(state.image);
        if (uploadedProof) {
          await axios.post(
            `${BASE_URL}/khelmela/checkBooleantdm`,
            { matchId, boolean: state.boolean, proof: uploadedProof },
            { headers: { Authorization: `${token}` } }
          );
          updateState({ message: 'Result submitted' });
          divideMoney(matchId);
          getmatches();
        }
      } else {
        const response = await axios.post(
          `${BASE_URL}/khelmela/checkBooleantdm`,
          { matchId, boolean: state.boolean },
          { headers: { Authorization: `${token}` } }
        );
        updateState({ message: response.data.message });
        divideMoney(matchId);
        getmatches();
      }
    } catch (error) {
      updateState({ error: error.response?.data?.message || 'Submission failed' });
    } finally {
      updateState({ modalDidYouWin: false });
      notify();
    }
  }, [state.boolean, state.image, matchId, getToken, handleDeposite, getmatches, notify, updateState]);

  const submitReport = useCallback(async () => {
    const token = await getToken();
    if (!state.reportMessage || !state.image) {
      updateState({ error: 'All fields are required' });
      notify();
      return;
    }
    try {
      const uploadedProof = await handleDeposite(state.image);
      if (uploadedProof) {
        const response = await axios.post(
          `${BASE_URL}/khelmela/reportTdm`,
          { reportMessage: state.reportMessage, uploadedProof },
          { headers: { Authorization: `${token}` } }
        );
        updateState({ message: response.data.message, reportModel: false });
        getmatches();
      }
    } catch (error) {
      updateState({ error: error.response?.data?.message || 'Report failed' });
    } finally {
      notify();
    }
  }, [state.reportMessage, state.image, getToken, handleDeposite, getmatches, notify, updateState]);

  const deleteCard = useCallback(async () => {
    const token = await getToken();
    try {
      const response = await axios.post(
        `${BASE_URL}/khelmela/deletecardtdm`,
        { matchId },
        { headers: { Authorization: `${token}` } }
      );
      updateState({ message: response.data.message, deleteCardModel: false });
      getmatches();
    } catch (error) {
      updateState({ error: error.response?.data?.message || 'Delete failed' });
    } finally {
      notify();
    }
  }, [matchId, getToken, getmatches, notify, updateState]);

  const handleReportMessageChange = useCallback((text) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= 100) {
      updateState({ reportMessage: text });
    } else {
      updateState({ error: 'Maximum 100 words allowed' });
      notify();
    }
  }, [notify, updateState]);

  const divideMoney = useCallback(async (matchId) => {
    try {
      const response = await axios.post(`${BASE_URL}/khelmela/dividemoney`, { matchId });
      if (response.data.message === "resultconflict") {
        resultConflictNotify(response.data.userid, response.data.hostid);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const resultConflictNotify = useCallback(async (reciver1, reciver2) => {
    try {
      await axios.post(`${BASE_URL}/khelmela/SAP-1/send-notification`, {
        reciver: [reciver1, reciver2],
        message: {
          "message": "conflict detected on your match...",
          type: "notification"
        }
      });
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  }, []);

  return (
    <View style={styles.cardContainer}>
      <LinearGradient colors={["#0f0c29", "#302b63", "#24243e"]} style={styles.gradient}>
        <TouchableOpacity activeOpacity={1}>
          <View style={styles.cardContent}>
            <View style={styles.headerRow}>
              <Image source={img} style={styles.gameIcon} />
              <Text style={styles.title}>PUBG Team DeathMatch</Text>
              {state.check === 'host' && (
                <TouchableOpacity onPress={() => updateState({ deleteCardModel: true })}>
                  <Text style={{ color: 'red', fontSize: 25, marginLeft: 18, marginTop: -40 }}>✖</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>🗺️ MAP: Warehouse</Text>
              <Text style={styles.text}>🎮 Mode: {matches.playermode}</Text>
            </View>
            <Image source={tdm} style={styles.imagemap} />
            <View style={styles.divider} />
            <View style={styles.footer}>
              <Text style={styles.text}>👾 Opponent: Hello</Text>
              <View style={styles.footerRow}>
                <Text style={styles.prizeText}>🏆 Prize: {matches.entryFee * 1.5}</Text>
                {state.check === 'user' ? (
                  <TouchableOpacity style={styles.entryButton} onPress={() => updateState({ modalVisible: true })}>
                    <Text style={styles.entryText}>Entry: {matches.entryFee}</Text>
                  </TouchableOpacity>
                ) : state.check === 'userjoined' ? (
                  <TouchableOpacity style={styles.joinedButton}>
                    <Text style={styles.entryText}>Joined</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {(state.check === 'host' || state.check === 'userjoined') && (
              <View style={styles.container}>
                {state.publish === 'publish' ? (
                  <>
                    <View style={styles.publishRow}>
                      <View style={styles.leftContainer}>
                        <TouchableOpacity onPress={copyToClipboardId}>
                          <Text style={styles.label}>Custom ID:</Text>
                          <View style={styles.inputs}>
                            <Text style={styles.inputText}>{matches.customId}</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={copyToClipboardPass}>
                          <Text style={styles.label}>Custom Pass:</Text>
                          <View style={styles.inputs}>
                            <Text style={styles.inputText}>{matches.customPassword}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      {state.check === 'host' && (
                        <View style={styles.rightContainer}>
                          <TouchableOpacity style={styles.button} onPress={() => updateState({ modalReset: true })}>
                            <Text style={styles.buttonText}>Reset</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                    <View>
                      {state.result === 'resultsubmit' || state.checkReport === 'report' ? (
                        <Text style={styles.centerText}>Response Submitted</Text>
                      ) : (
                        <View style={styles.actionContainer}>
                          <TouchableOpacity onPress={() => updateState({ modalDidYouWin: true })} style={styles.actionButton}>
                            <Text style={styles.actionText}>Submit Your Result</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => updateState({ reportModel: true })} style={styles.actionButton}>
                            <Text style={styles.actionText}>Report Match</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </>
                ) : state.check === 'host' ? (
                  <View style={styles.publishInputRow}>
                    <View style={styles.leftContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder="Custom ID"
                        keyboardType="numeric"
                        value={state.customId}
                        onChangeText={text => updateState({ customId: text })}
                        placeholderTextColor="#aaa"
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Custom Password"
                        keyboardType="numeric"
                        value={state.customPassword}
                        onChangeText={text => updateState({ customPassword: text })}
                        placeholderTextColor="#aaa"
                      />
                    </View>
                    <View style={styles.rightContainer}>
                      <TouchableOpacity style={styles.button} onPress={customIdAndPassword}>
                        <Text style={styles.buttonText}>Publish</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <Text style={{ color: 'grey', fontSize: 15, marginLeft: 7, marginTop: 5 }}>
                    id and pass will provided by host in 5 min
                  </Text>
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </LinearGradient>

      <Modal transparent animationType="slide" visible={state.modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.noButton]} onPress={() => updateState({ modalVisible: false })}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={joinuser}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="slide" visible={state.deleteCardModel}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Did you want to delete this match?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.noButton]} onPress={() => updateState({ deleteCardModel: false })}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={deleteCard}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="slide" visible={state.modalDidYouWin}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalText}>Did You Win?</Text>
              <TouchableOpacity onPress={() => updateState({ modalDidYouWin: false })} style={styles.closeButton}>
                <Text style={styles.closeText}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={[styles.optionButton, state.boolean === true && styles.selectedYes]}
                onPress={() => updateState({ boolean: true })}
              >
                <Text style={styles.optionText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, state.boolean === false && styles.selectedNo]}
                onPress={() => updateState({ boolean: false })}
              >
                <Text style={styles.optionText}>No</Text>
              </TouchableOpacity>
            </View>
            {state.boolean === true && (
              <View style={styles.uploadContainer}>
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                  <Text style={styles.uploadText}>Upload Winning Proof</Text>
                </TouchableOpacity>
                {state.image && <Text style={styles.checkMark}>✓ Photo Uploaded</Text>}
              </View>
            )}
            <TouchableOpacity style={styles.submitButton} onPress={submitResult}>
              <Text style={styles.buttonText}>Submit Result</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent animationType="slide" visible={state.reportModel}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Report Match</Text>
            <TouchableOpacity onPress={() => updateState({ reportModel: false })} style={styles.closeButton}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            <TextInput
              placeholder="Enter your message (max 100 words)"
              style={styles.inputModal}
              value={state.reportMessage}
              onChangeText={handleReportMessageChange}
              placeholderTextColor="#aaa"
              multiline
              textAlignVertical="top"
            />
            <View style={styles.uploadContainer}>
              <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadText}>Click here to upload proof</Text>
              </TouchableOpacity>
              {state.image && <Text style={styles.checkMark}>✓ Photo Uploaded</Text>}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.noButton]} onPress={() => updateState({ reportModel: false })}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.yesButton]} onPress={submitReport}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={state.modalReset} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Custom ID"
              value={state.customId}
              onChangeText={text => updateState({ customId: text })}
              style={styles.inputModal}
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
            <TextInput
              placeholder="Custom Password"
              value={state.customPassword}
              secureTextEntry
              onChangeText={text => updateState({ customPassword: text })}
              style={styles.inputModal}
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={reset} style={styles.yesButton}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => updateState({ modalReset: false })} style={styles.noButton}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ModalNotify visible={state.notifyModel} error={state.error} message={state.message} />
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
  text: {
    fontSize: 14,
    color: '#ddd',
    marginBottom: 6,
  },
  imagemap: {
    width: 140,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    alignSelf: 'center',
    marginBottom: 12,
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
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    padding: 8,
  },
  actionText: {
    color: '#ff4444',
    fontSize: 15,
    fontWeight: '500',
    textDecorationLine: 'underline',
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
    width: 136,
    height: 40,
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  inputs: {
    width: 136,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  inputText: {
    color: '#000',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
    justifyContent: 'center',
    marginTop: 10,
  },
  noButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  yesButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
  },
  selectedNo: {
    backgroundColor: '#ff0000',
  },
  selectedYes: {
    backgroundColor: '#00ff00',
  },
  optionText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  uploadContainer: {
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  uploadButton: {
    backgroundColor: '#87CEEB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  uploadText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  checkMark: {
    color: '#00FF00',
    fontSize: 14,
    marginTop: 8,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  inputModal: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#333',
    minHeight: 50,
    maxHeight: 150,
  },
});

export default TdmCard;