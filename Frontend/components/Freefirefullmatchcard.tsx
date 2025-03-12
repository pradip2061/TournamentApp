import React, { useContext, useEffect, useState } from 'react';
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
import { CheckAdminContext } from '../pages/ContextApi/ContextApi';
import{BASE_URL} from '../env'
// Placeholder images (replace with your actual image paths)
const freefire = require('../assets/freefire.jpeg');
const bermuda = require('../assets/bermuda.jpg');
const purgatory = require('../assets/pugatory.png');
const kalahari = require('../assets/kalahari.webp');

const Freefirefullmatchcard = ({ matches }) => {
  const { setTrigger,data} = useContext(CheckAdminContext);
  const [joinModel, setJoinModel] = useState(false);
  const [checKJoined, setCheckJoined] = useState('');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [player1, setPlayer1] = useState(data?.gameName?.[0]?.freefire);
  const [player2, setPlayer2] = useState('');
  const [player3, setPlayer3] = useState('');
  const [player4, setPlayer4] = useState('');
  const matchId = matches._id;
  const joinuser = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      if(matches.TotalPlayer === 54){
        setMessage('Slot is full!')
        return 
      }
      await axios
        .post(
          `${BASE_URL}/khelmela/joinff`,
          { matchId },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((response) => {
          setMessage(response.data.message);
          setTrigger('done');
        });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      notify();
      setJoinModel(false);
    }
  };

  useEffect(()=>{
    const getName=()=>{
      const Name = matches.gameName.filter((item)=>item.userid === data._id)
      setPlayer2(Name?.[0]?.player2)
      setPlayer3(Name?.[0]?.player3)
      setPlayer4(Name?.[0]?.player4)
        }
        getName()
  },[])
 

  const notify = () => {
    setJoinModel(false);
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
          `${BASE_URL}/khelmela/checkuserff`,
          { matchId },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            setCheckJoined(response.data.message);
          }
        });
    };
    checkuser();
  }, [matchId]);
  console.log(matches)
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
          `${BASE_URL}/khelmela/addNameff`,
          { matchId, player1, player2, player3,player4 },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        )
        .then((response) => {
          setMessage(response.data.message);
        });
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      notify();
    }
  };



  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   style={{ flex: 1 }}
    // >
      <View>
        {/* Removed LinearGradient from here */}
        <LinearGradient
          colors={["#0f0c29", "#302b63", "#24243e"]}
          style={styles.container} // Applied LinearGradient to container
        >
          <View>
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
                <Text style={styles.text}>Top: 3</Text>
                <Text style={styles.text}>Top: 15</Text>
              </View>
              <View>
                <Text style={styles.text}>Odds:</Text>
                <Text style={styles.text}>3x</Text>
                <Text style={styles.text}>1.5x</Text>
              </View>
              </View>
              <View style={styles.divider} />
              
              <View style={styles.timeContainer}>
                <Text style={styles.texttime}>Time: 9:00 AM</Text>
              {
                checKJoined === 'joined'?(
                  <TouchableOpacity style={styles.joinedButton}>
                    <Text style={{ color: 'white' }}>Joined</Text>
                  </TouchableOpacity>
                ):<TouchableOpacity
                style={styles.entryButton}
                onPress={() => setJoinModel(true)}
              >
                <Text style={{ color: 'white' }}>Entry fee: {matches.entryFee}</Text>
              </TouchableOpacity>
              }
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
                </View>
                <View style={styles.playerbox}>
                 <TextInput
                    style={styles.inputs}
                    placeholder="player 1"
                    value={player1}
                    onChangeText={(text) => setPlayer1(text)}
                  />
                  <TextInput
                    style={styles.inputs}
                    placeholder="player 2"
                    value={player2}
                    onChangeText={(text) => setPlayer2(text)}
                  />
                  <TextInput
                    style={styles.inputs}
                    placeholder="player 3"
                    value={player3}
                    onChangeText={(text) => setPlayer3(text)}
                  />
                  <TextInput
                    style={styles.inputs}
                    placeholder="player 4"
                    value={player4}
                    onChangeText={(text) => setPlayer4(text)}
                  />
                  
                  <TouchableOpacity style={styles.joinedButton}>
                    <Text style={{ color: 'white' }} onPress={addName}>
                      Add gameName
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ):null }

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
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 340,
    marginLeft: 20,
    padding: 10,
    gap: 15,
    overflow: 'scroll', // Note: 'overflow' should be handled differently in React Native (e.g., with ScrollView)
    borderRadius:25,
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
    marginLeft:-10

  },
  text: {
    fontSize: 13.6,
    fontWeight: '700',
    color: 'white', // White text to contrast with gradient
    gap:20
  },
  divider:{
    height: 1,
    backgroundColor: 'white',
    marginVertical: 10,
    width: '100%',
  },
  mapContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:6
  },
  title: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#fff', // White text for visibility
  },
  mapImages: {
    flexDirection: 'row',
    gap: 10,
    marginTop:10,
    
  },
  imagemap: {
    width: 100,
    height: 80,
    borderRadius:20
  },
  detailsContainer: {
    flexDirection: 'row',
    gap: 76,
    alignItems: 'center',
    marginTop:10
  },
  timeContainer: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius:25,
    width: 110,
    padding: 1,
    height: 30,
    alignItems:'center',
    flexDirection:"row",
    backgroundColor:'white',
    gap:110,
    marginTop:10
  },
  texttime:{
    color:'black',
  },
  joinedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:30
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slight transparency for contrast
  },
  inputs: {
    width: 120,
    height: 40,
    borderWidth: 1,
    borderColor: '#fff', // White border
    marginVertical: 5,
    paddingHorizontal: 10,
    color: '#fff', // White text
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent white background
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  loadingText: {
    color: '#fff', // White text for visibility
    fontSize: 20,
    marginLeft: 10,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
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