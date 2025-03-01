import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalNotify from './ModalNotify';
import Clipboard from '@react-native-clipboard/clipboard';
const img = require('../assets/image.png');
const miramar = require('../assets/miramar.jpg');
const erangle = require('../assets/erangle.jpg');
const sanhok = require('../assets/sanhok.jpg');
const PubgFullMatchCard = ({matches}) => {
  const [modal, setModal] = useState(false);
  const matchId = matches._id;
  const [notifyModel, setNotifyModel] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [checkJoined, setCheckJoined] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player3, setPlayer3] = useState('');
  const[checkmatch,setCheckMatch]=useState('')
  const notify = () => {
    setModal(false)
    setNotifyModel(true);
    setTimeout(() => {
      setNotifyModel(false);
    }, 900);
  };
  const joinuser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        'http://30.30.6.248:3000/khelmela/joinuserPubg',
        {matchId},
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
          'http://30.30.6.248:3000/khelmela/checkuserPubg',
          {matchId},
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
          'http://30.30.6.248:3000/khelmela/addName',
          {matchId, player1, player2, player3},
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
        .post('http://30.30.6.248:3000/khelmela/checkmatchTypePubg', {matchId})
        .then(response => {
          if (response.status === 200) {
            setCheckMatch(response.data.message);
          }
        });
    };
    checkmatchType();
  }, []);
  return (
    <View style={styles.container} key={matches._id}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20,
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}>
          <Image source={img} alt={'no image'} style={styles.image} />
          <Text style={styles.text}>PUBG Full Match</Text>
        </View>
        <Text style={styles.text}>Player mode:{matches.playermode}</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 30,
        }}>
        <Text style={styles.title}>MAP:Random</Text>
        <Text style={styles.title}>Total player:{matches.TotalPlayer}</Text>
      </View>
      <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
        <Image source={erangle} alt="no image" style={styles.imagemap} />
        <Image source={miramar} alt="no image" style={styles.imagemap} />
        <Image source={sanhok} alt="no image" style={styles.imagemap} />
      </View>
      <View style={{display: 'flex', flexDirection: 'row', gap: 60}}>
        {
          checkmatch === 'solo'?<><View>
          <Text style={styles.text}>Winnner:</Text>
          <Text>Top:4</Text>
          <Text>Top:22</Text>
        </View>
        <View>
        <Text style={styles.text}>Odds:</Text>
        <Text>3x</Text>
        <Text>1.5x</Text>
      </View></>
        : checkmatch === 'squad' ?<><View>
        <Text style={styles.text}>Winnner:</Text>
        <Text>Top:2</Text>
        <Text>Top:6</Text>
      </View>
      <View>
      <Text style={styles.text}>Odds:</Text>
      <Text>3x</Text>
      <Text>1.5x</Text>
    </View></>:<><View>
          <Text style={styles.text}>Winnner:</Text>
          <Text>Top:2</Text>
          <Text>Top:16</Text>
        </View>
        <View>
        <Text style={styles.text}>Odds:</Text>
        <Text>3x</Text>
        <Text>1.5x</Text>
      </View></>
        }
        <View>
          <Text
            style={{
              width: 56,
              borderWidth: 1,
              borderColor: 'black',
              textAlign: 'center',
            }}>
            {matches.time}
          </Text>
        </View>
      </View>
      <Modal transparent animationType="slide" visible={modal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Did you join match </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.noButton]}
                onPress={() => setModal(false)}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.yesButton]}
                onPress={joinuser}>
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
                <AntDesign name="copy1" size={17} style={{marginLeft: 10}} />
              </TouchableOpacity>
            </View>
            <View style={styles.input}>
              <Text>custom: 54988</Text>
              <TouchableOpacity onPress={clipboardpass}>
                <AntDesign name="copy1" size={17} style={{marginLeft: 10}} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.joinedButton}>
              <Text style={{color: 'white'}}>Joined</Text>
            </TouchableOpacity>
          </View>
          <View>
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
              <Text style={{color: 'white'}}>Add gameName</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : checkJoined === 'notjoined' ? (
        <TouchableOpacity
          style={styles.entryButton}
          onPress={() => setModal(true)}>
          <Text style={{color: 'white'}}>Entry fee:{matches.entryFee}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.loadingText}>...loading</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 360,
    borderWidth: 2,
    borderColor: 'black',
    marginLeft: 20,
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
    paddingLeft: 14,
    backgroundColor: 'white',
    padding: 10,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  imagemap: {
    width: 100,
    height: 80,
  },
  text: {fontSize: 17, fontWeight: 700},
  title: {fontSize: 16, fontWeight: 700},
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
  modalText: {fontSize: 18, marginBottom: 20},
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  noButton: {backgroundColor: '#dc3545'},
  yesButton: {backgroundColor: '#28a745'},
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
  joinedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  },
  inputs: {
    width: 120,
    height: 50,
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  joinedButton: {
    backgroundColor: 'green',
    height: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryButton: {
    backgroundColor: 'green',
    height: 30,
    justifyContent: 'center',
    paddingInline: 5,
    marginTop: 10,
  },
  loadingText: {
    color: 'black',
    fontSize: 20,
    marginLeft: 10,
    marginTop: 20,
  },
});

export default PubgFullMatchCard;
