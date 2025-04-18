import { View,Text,StyleSheet,TouchableOpacity,BackHandler,Alert,} from 'react-native';
import React, {useCallback,useContext,useState,
} from 'react';
import Doller from 'react-native-vector-icons/FontAwesome6';
import Gamepad from 'react-native-vector-icons/Entypo';
import TabButton from '../../components/TabButton';
import Card from '../../components/Card';

import {useFocusEffect} from '@react-navigation/native';
import {CheckAdminContext} from '../ContextApi/ContextApi';
import FastImage from 'react-native-fast-image';

const freefire = require('../../assets/freefire.jpeg');
const img1 = require('../../assets/ffmap.jpg');
const img2 = require('../../assets/image.png');
const img3 = require('../../assets/cod.webp');
const img4 = require('../../assets/clashsquad.webp');
const pubgfull = require('../../assets/pubgfull.jpg');
const tdm = require('../../assets/tdm.jpg');

const bg1 = require('../../assets/bg9.gif');

const Home = ({navigation}) => {
  const [toggle, setToggle] = useState('freefire');
  const { data, getProfile} = useContext(CheckAdminContext);

  useFocusEffect(
    useCallback(() => {
      console.log('Tab Screen Mounted');
      getProfile();
      return () => {
        console.log('Tab Screen Unmounted');
      };
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit?', [
          {text: 'Cancel', onPress: () => null, style: 'cancel'},
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );
      return () => backHandler.remove();
    }, []),
  );

  return (
    <FastImage style={styles.container} source={bg1}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{flexDirection: 'row', gap: -5, alignItems: 'center'}}
          onPress={() => navigation.navigate('Transcation')}>
          <Doller name="circle-dollar-to-slot" size={32} color="gold" />
          <Text style={{color: 'white', fontSize: 17, fontWeight: 'bold'}}>
            {data?.balance} +
          </Text>
        </TouchableOpacity>
        <View style={{marginLeft:185}}>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('EnrollMatch')}>
            <Gamepad name="game-controller" size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Gamepad
              name="menu"
              size={34}
              color="grey"
              onPress={() => navigation.navigate('Setting')}
            />
          </TouchableOpacity>
        </View>
        </View>
      </View>

      <Text style={styles.topGamesText}>TOP GAMES</Text>
      <View style={styles.box}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setToggle('freefire')}
            style={
              toggle === 'freefire' ? styles.tabButtonActive : styles.tabButton
            }>
            <TabButton images={freefire} toggleset={toggle} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setToggle('pubg')}
            style={
              toggle === 'pubg' ? styles.tabButtonActive : styles.tabButton
            }>
            <TabButton images={img2} toggleset={toggle} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setToggle('cod')}
            style={
              toggle === 'cod' ? styles.tabButtonActive : styles.tabButton
            }>
            <TabButton images={img3} toggleset={toggle} />
          </TouchableOpacity>
        </View>
        <Text style={styles.selectModeText}>SELECT MODE</Text>
        <View style={styles.cardContainer}>
          {toggle === 'freefire' && (
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('FreeFire')}>
                <Card image={img1} name="Full Map Matches" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('ClashSquad')}>
                <Card image={img4} name="Clash Squad" />
              </TouchableOpacity>
            </View>
          )}
          {toggle === 'pubg' && (
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('Pubg')}>
                <Card image={pubgfull} name="Full Map Matches" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('TDM')}>
                <Card image={tdm} name="TDM(Team Death Match)" />
              </TouchableOpacity>
            </View>
          )}
          {toggle === 'cod' && (
            <Text style={styles.comingSoonText}>Coming Soon...</Text>
          )}
        </View>
      </View>
    </FastImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 13,
  
    marginLeft: -15,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 40,
    marginRight: 15,
  },
  topGamesText: {
    width: 180,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 25, // Increased border radius
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 40,
    color: '#333',
    marginTop: 60,
    marginBottom: 20,
  },
  box: {
    width: 320,
    backgroundColor: 'white',
    height: '70%',
    borderRadius: 55,
    paddingTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
  },
  tabButton: {
    width: 70,
    height: 70,
    borderRadius: 40, // Increased border radius
    borderWidth: 2,
    backgroundColor: 'transparent',
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8, // Reduced opacity for unselected
  },
  tabButtonActive: {
    width: 70, // Increased size when selected
    height: 70, // Increased size when selected
    borderRadius: 45, // Increased border radius
    borderWidth: 3,
    borderColor: 'F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1, // Full opacity when selected
  },
  selectModeText: {
    width: 200,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 25, // Increased border radius
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
    color: '#fff',
    marginVertical: 20,
    alignSelf: 'center',
  },
  cardContainer: {
    paddingHorizontal: 30,
    marginTop: -10,
    marginLeft: -2,
  },
  comingSoonText: {
    fontSize: 18,
    width: '80%',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Home;
