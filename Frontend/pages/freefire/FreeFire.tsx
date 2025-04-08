import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Animated,
  ImageBackground,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Freefirefullmatchcard from '../../components/Freefirefullmatchcard';
import axios from 'axios';
import {FlatList, TouchableWithoutFeedback} from 'react-native-gesture-handler';
import ShimmerBox from '../../components/ShimmerBox';
import {CheckAdminContext} from '../ContextApi/ContextApi';

import {useSocket} from '../../SocketContext';

import {BASE_URL} from '../../env';


const FreeFire = ({navigation}) => {
  const [card, setCard] = useState([]);
 
  const {renderPage} = useSocket();
  useEffect(() => {
    checkrole();
  }, []);
  useEffect(() => {
    try {
      const getmatch = async () => {
        const match = await axios.get(`${BASE_URL}/khelmela/getff`);
        setCard(match.data.card);
      };
      getmatch();
    } catch (error) {
      console.log(error);
    }
  }, [renderPage]);
  

  return (
    <ImageBackground style={styles.matchCard}>
      <ScrollView style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="menu-outline" size={24} color="black" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your match"
            placeholderTextColor="#666"
          />
          <FontAwesome5 name="search" size={20} color="black" />
        </View>
        <Text style={styles.note}>
          Note: All matches are created by admin . Everyday at the same time
        </Text>
        <View style={styles.liveMatches}>
                  <Entypo name="game-controller" size={24} color="#333" />
                  <Text style={styles.liveMatchesText}>Live Matches</Text>
                </View>
                <View></View>
        {card.length > 0 ? (
          <FlatList
            data={card}
            scrollEnabled={false}
            keyExtractor={(item, id) => id.toString()}
            renderItem={({item}) => <Freefirefullmatchcard matches={item} />}
            contentContainerStyle={{gap: 35, marginLeft: 8}}
          />
        ) : (
          <Text style={{ textAlign: 'center',marginTop:100,fontSize:15, color: '#333' }}>
                        No Matches Right now.
                      </Text>
        )}
       
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingRight: 15,
    backgroundColor: 'F2F2F2',
  },

  MatchCard: {
    borderRadius: 40,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 15,
    height: 48,
    width: 350,
    marginBottom: 30,
    marginTop: 28,
    marginLeft: 25,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 16,
    color: 'black',
  },
  note: {
    color: '#555',
    fontSize: 14,
    marginBottom: 20,
    marginLeft: 15,
    fontStyle: 'italic',
  },
  liveMatches: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    width: 150,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginLeft: 20,
  },
  liveMatchesText: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
});

export default FreeFire;
