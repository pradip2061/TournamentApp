import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
const freefire = require('../assets/freefire.jpeg');
const bermuda = require('../assets/bermuda.jpg');
const purgatory = require('../assets/pugatory.png');
const kalahari = require('../assets/kalahari.webp');
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';
import ModalNotify from './ModalNotify';


const Freefirefullmatchcard = ({matches}) => {
  const [joinModel, setJoinModel] = useState(false);
  const [checKJoined, setCheckJoined] = useState('');
  const[visible,setVisible]=useState(false)
  const[message,setMessage]=useState('')
  const[error,setError]=useState('')
  let matchId = matches._id;
  const joinuser = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios
        .post(
          'http://30.30.6.248:3000/khelmela/joinff',
          {matchId},
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        )
        .then(response => {
          setMessage(response.data.message)
          setJoinModel(false);
          Alert.alert(response.data.message)
        });
    } catch (error) {
      setError(error.data.response.message)
    }
  };
  useEffect(() => {
    const checkuser = async () => {
      const token = await AsyncStorage.getItem('token');
      await axios
        .post(
          'http://30.30.6.248:3000/khelmela/checkuserff',
          {matchId},
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        )
        .then(response => {
          if (response.status == 200) {
            setCheckJoined(response.data.message);
          }
        });
    };
    checkuser();
  }, []);
  const clipboardid=()=>{
Clipboard.setString('hello')
  }
  const clipboardpass=()=>{
    Clipboard.setString('hello')
      }
  return (
    <View style={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 20,
          borderWidth: 2,
          borderColor: 'black',
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}>
          <Image source={freefire} alt={'no image'} style={styles.image} />
          <Text style={styles.text}>Freefire Full Match</Text>
        </View>
        <Text style={styles.text}>Player mode:{matches.playermode}</Text>
      </View>
      <View style={{display: 'flex', flexDirection: 'row', gap: 90}}>
        <Text style={styles.title}>MAP:Random</Text>
        <Text style={styles.title}>Total player:48</Text>
      </View>
      <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
        <Image source={bermuda} alt="no image" style={styles.imagemap} />
        <Image source={purgatory} alt="no image" style={styles.imagemap} />
        <Image source={kalahari} alt="no image" style={styles.imagemap} />
      </View>
      <View style={{display: 'flex', flexDirection: 'row', gap: 60}}>
        <View>
          <Text style={styles.text}>Winnner:</Text>
          <Text>Top:3</Text>
          <Text>Top:15</Text>
        </View>
        <View>
          <Text style={styles.text}>Odds:</Text>
          <Text>3x</Text>
          <Text>1.5x</Text>
        </View>
      </View>
      {checKJoined == 'joined' ? (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 100,
            alignItems: 'center',
          }}>
          <View style={{display: 'flex', gap: 10}}>
            <View style={styles.input}>
              <Text>customid:88997</Text>
              <TouchableOpacity onPress={clipboardid}>
              <AntDesign name='copy1' size={17} style={{marginLeft:10}} />
              </TouchableOpacity>
            </View>
            <View
              style={styles.input}>
              <Text>custom:54988</Text>
              <TouchableOpacity onPress={clipboardpass}>
              <AntDesign name='copy1' size={17} style={{marginLeft:10}} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: 'green',
              height: 30,
              width: '20%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: 'white'}}>joined</Text>
          </TouchableOpacity>
        </View>
      ) : checKJoined == 'notjoined' ? (
        <TouchableOpacity
          style={{backgroundColor: 'green',
            height: 30,
            width: '30%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          marginLeft:200}}
          onPress={() => setJoinModel(true)}>
          <Text style={{color: 'white'}}>entryfee:{matches.entryFee}</Text>
        </TouchableOpacity>
      ) : <Text style ={{color:'black',fontSize:20,marginLeft:10,marginTop:20}}>...loading</Text>}

      <Modal transparent animationType="slide" visible={joinModel}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Did you join Match?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.noButton]}
                onPress={() => setJoinModel(false)}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.yesButton]}>
                <Text style={styles.buttonText} onPress={joinuser}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ModalNotify visible={visible} message={message} error={error}/>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 340,
    height: 350,
    borderWidth: 2,
    borderColor: 'black',
    backgroundColor: 'white',
    marginLeft: 20,
    display: 'flex',

    gap: 15,
    paddingLeft: 5,
    paddingTop: 1,
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
  text: {
    fontSize: 12.5,
    fontWeight: 700,
  },
  title: {fontSize: 12.5, fontWeight: 700},
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
  openButton: {backgroundColor: '#007bff', padding: 10, borderRadius: 5},
  openButtonText: {color: '#fff', fontSize: 16},
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
  input: {
    height: 30,
    paddingInline: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Freefirefullmatchcard;
