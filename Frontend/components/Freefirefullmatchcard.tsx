import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import ModalNotify from './ModalNotify';
import LinearGradient from 'react-native-linear-gradient';

// Placeholder images (replace with your actual image paths)
const freefire = require('../assets/freefire.jpeg');
const bermuda = require('../assets/bermuda.jpg');
const purgatory = require('../assets/pugatory.png');
const kalahari = require('../assets/kalahari.webp');

const Freefirefullmatchcard = ({ matches }) => {
  const [joinModel, setJoinModel] = useState(false);
  const [checKJoined, setCheckJoined] = useState('');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player3, setPlayer3] = useState('');
  const matchId = matches._id;
console.log(matches)
  const joinuser = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios
        .post(
          `${process.env.baseUrl}/khelmela/joinff`,
          { matchId },
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        )
        .then((response) => {
          setMessage(response.data.message);
        });
    } catch (error) {
      setError(error.response.data.message);
    }finally{
      notify();
      setJoinModel(false);
    }
  };

  const notify = () => {
    setJoinModel(false)
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 900);
  };

  useEffect(() => {
    const checkuser = async () => {
      const token = await AsyncStorage.getItem('token');
      await axios
        .post(
          `${process.env.baseUrl}/khelmela/checkuserff`,
          { matchId },
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        )
        .then((response) => {
          if (response.status === 200) {
            setCheckJoined(response.data.message);
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
    const token = await AsyncStorage.getItem('token');
    try {
      await axios
        .post(
          `${process.env.baseUrl}/khelmela/addName`,
          { matchId,player1,player2,player3 },
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        )
        .then((response) => {
          setMessage(response.data.message);
        });
    } catch (error) {
      setError(error.response.data.message);
    }finally{
      notify();
    }
  };
  useEffect(()=>{
    const match = matches.gameName[0]
setPlayer1(match[0])
setPlayer2(match[1])
setPlayer3(match[2])
  },[])

  const checking =async()=>{
    try {
      setError('')
      setMessage('')
     const token = await AsyncStorage.getItem('token')
     console.log(token)
     await axios.post(`${process.env.baseUrl}/khelmela/check`,{},{
       headers:{
         Authorization:`${token}`
       }
     })
     .then((response)=>{
       if(response.status == 200){
         setJoinModel(true)
         setMessage('user is free')
       }else{
        setJoinModel(false)
       }
     })
    } catch (error) { 
     console.log(error)
     setError(error.response.data.message)
    }finally{
     notify()
    }
   }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View>
      <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.gradient}
    >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image source={freefire} style={styles.image} />
              <Text style={styles.text}>Freefire Full Match</Text>
            </View>
            <Text style={styles.text}>Player mode: {matches.playermode}</Text>
          </View>

          <View style={styles.mapContainer}>
            <Text style={styles.title}>MAP: Random</Text>
            <Text style={styles.title}>Total player: 48</Text>
          </View>

          <View style={styles.mapImages}>
            <Image source={bermuda} style={styles.imagemap} />
            <Image source={purgatory} style={styles.imagemap} />
            <Image source={kalahari} style={styles.imagemap} />
          </View>

          <View style={styles.detailsContainer}>
            <View>
              <Text style={styles.text}>Winner:</Text>
              <Text>Top: 3</Text>
              <Text>Top: 15</Text>
            </View>
            <View>
              <Text style={styles.text}>Odds:</Text>
              <Text>3x</Text>
              <Text>1.5x</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text>Time: 9:00</Text>
            </View>
          </View>

          {checKJoined === 'joined' ? (
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
                  <TouchableOpacity style={styles.joinedButton}>
                  <Text style={{ color: 'white' }}>Joined</Text>
                </TouchableOpacity>
                </View>
                <View>
                  <TextInput
                    style={styles.inputs}
                    placeholder="player 2"
                    value={player1}
                    onChangeText={(text) => setPlayer1(text)}
                  />
                  <TextInput
                    style={styles.inputs}
                    placeholder="player 3"
                    value={player2}
                    onChangeText={(text) => setPlayer2(text)}
                  />
                  <TextInput
                    style={styles.inputs}
                    placeholder="player 4"
                    value={player3}
                    onChangeText={(text) => setPlayer3(text)}
                  />
                  <TouchableOpacity style={styles.joinedButton}><Text style={{color:'white'}} onPress={addName}>Add gameName</Text></TouchableOpacity>
                </View>
             </View>
          ) : checKJoined === 'notjoined' ? (
            <TouchableOpacity
              style={styles.entryButton}
              onPress={checking}
            >
              <Text style={{ color: 'white' }}>Entry fee: {matches.entryFee}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.loadingText}>...loading</Text>
          )}

          <ModalNotify visible={visible} message={message} error={error} />

          <Modal transparent animationType="slide" visible={joinModel}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Did you join Match?</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.noButton]}
                    onPress={() => setJoinModel(false)}
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
        </View>
        </LinearGradient>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 340,
    backgroundColor: 'white',
    marginLeft: 20,
    padding: 10,
    gap: 15,
    overflow:'scroll'},
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
  },
  text: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  mapContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  mapImages: {
    flexDirection: 'row',
    gap: 10,
  },
  imagemap: {
    width: 100,
    height: 80,
  },
  detailsContainer: {
    flexDirection: 'row',
    gap:76,
    alignItems: 'center',
  },
  timeContainer: {
    borderWidth: 2,
    borderColor: 'black',
    width: 80,
    padding: 1,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
  backgroundColor:'#ffb400',
    height: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryButton: {
    backgroundColor: 'green',
    height: 30,
    width: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 200,
  },
  loadingText: {
    color: 'black',
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

export default Freefirefullmatchcard;