import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, BackHandler, Alert } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Doller from 'react-native-vector-icons/FontAwesome6';
import Gamepad from 'react-native-vector-icons/Entypo';
import TabButton from '../components/TabButton';
import Card from '../components/Card';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { CheckAdminContext } from './ContextApi';


const freefire = require('../assets/freefire.jpeg');
const img1 = require('../assets/ffmap.jpg');
const img2 = require('../assets/image.png');
const img3 = require('../assets/cod.webp');
const img4 = require('../assets/clashsquad.webp');
const pubgfull = require('../assets/pubgfull.jpg');
const tdm = require('../assets/tdm.jpg');

const Home = ({ navigation }) => {
  const [toggle, setToggle] = useState('freefire');
  const {checkadmin,setCheckAdmin}=useContext(CheckAdminContext)
 useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true; // Prevent default back action
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

      return () => backHandler.remove(); // Remove event listener when screen is unfocused
    }, [])
  );


  return (
    <LinearGradient
    colors={['#5e00c0', '#8a00d4', '#b100e8']} // Adjust colors to match the design
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.container}
  >
    <View style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity>
            <Doller name="circle-dollar-to-slot" size={30} color="white" onPress={() =>navigation.navigate('Transcation')} />
          </TouchableOpacity>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
            <TouchableOpacity>
              <Gamepad name="game-controller" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Gamepad
                name="menu"
                size={30}
                color="white"
                onPress={() => navigation.navigate('Setting')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text
            style={{
              width: 200,
              height: 40,
              backgroundColor: 'white',
              borderRadius: 20,
              marginTop: 40,
              justifyContent: 'center',
              fontSize: 25,
              textAlign: 'center',
              fontWeight: '900',
              marginLeft: 70,
            }}
          >
            TOP GAMES
          </Text>
          <View style={styles.box}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 30 }}>
              <TouchableOpacity onPress={()=>setToggle('freefire')} style={toggle === 'freefire'?styles.tabbutton:null}>
                <TabButton images={freefire} toggleset={toggle}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setToggle('pubg')} style={toggle === 'pubg'?styles.tabbutton:null}>
                <TabButton images={img2} toggleset={toggle}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setToggle('cod')} style={toggle === 'cod'?styles.tabbutton:null}>
                <TabButton images={img3} toggleset={toggle} />
              </TouchableOpacity>
            </View>
            <Text style={styles.button}>SELECT MODE</Text>
            <View style={{ marginLeft: 60, marginTop: 20 }}>
              {toggle === 'freefire' && (
                <View>
                  <TouchableOpacity onPress={() => navigation.navigate('FreeFire')}>
                    <Card image={img1} name="Full Map Matches" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('ClashSquad')}>
                    <Card image={img4} name="Clash Squad" />
                  </TouchableOpacity>
                </View>
              )}
              {toggle === 'pubg' && (
                <View>
                  <TouchableOpacity onPress={() => navigation.navigate('Pubg')}>
                    <Card image={pubgfull} name="Full Map Matches" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('TDM')} >
                    <Card image={tdm} name="TDM(Team Death)" />
                  </TouchableOpacity>
                </View>
              )}
              {toggle === 'cod' && <Text>Coming Soon.....</Text>}
            </View>
          </View>
        </View>
      </View>
    </View> 
  </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 80,
    borderRadius: 30,
  },

  tabbutton:{
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth:4,
    borderColor:'black',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
  }
,
  title: {
    color: 'white',
    fontSize: 25,
  },
  header: {
    width: '100%',
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    gap: 230,
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    width: 240,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 20,
    marginTop: 40,
    justifyContent: 'center',
    fontSize: 25,
    textAlign: 'center',
    color: 'white',
    marginLeft: 50,
  },
  map: {
    width: 260,
    height: 150,
  },
  box: {
    width: '100%',
    backgroundColor: 'white',
    height: '80%',
    borderRadius: 50,
    marginTop: 10,
  },
});

export default Home;
