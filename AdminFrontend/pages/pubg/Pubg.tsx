import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import PubgFullMatchCard from '../../components/PubgFullMatchCard';
import {CheckAdminContext} from '../ContextApi/ContextApi';
import {BASE_URL} from '../../env';
import ShimmerBox from '../../components/ShimmerBox';

const Pubg = ({navigation}) => {
  const [data, setData] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const {checkrole, checkadmin} = useContext(CheckAdminContext);

  useEffect(() => {
    checkrole();
  }, []);

  useEffect(() => {
    const getMatchCard = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/khelmela/getpubg`);
        setData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    getMatchCard();
  }, []);

  // Modified to match FreeFire logic: showHidden shows all matches, otherwise filter out hidden ones
  const filteredMatches = showHidden ? data : data.filter(item => !item.hidden);

  return (
    <View style={styles.container}>
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
        Note: All matches are made by the admin every day at the same time
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            {backgroundColor: showHidden ? '#dc3545' : '#28a745'},
          ]}
          onPress={() => setShowHidden(!showHidden)}>
          <Text style={styles.buttonText}>
            {showHidden ? 'Hide Hidden Matches' : 'Show All Matches'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.matchList}>
        {data.length > 0 ? (
          <FlatList
            data={filteredMatches}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <PubgFullMatchCard matches={item} key={item._id} />
            )}
            contentContainerStyle={{gap: 20, paddingBottom: 20}}
            scrollEnabled={false}
          />
        ) : (
          <ShimmerBox />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 45,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
  },
  note: {
    color: '#555',
    fontSize: 14,
    marginVertical: 10,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  button: {
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  matchList: {
    flex: 1,
  },
});

export default Pubg;
