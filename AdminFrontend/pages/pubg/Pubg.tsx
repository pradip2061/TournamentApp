import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import {FlatList} from 'react-native-gesture-handler';
import PubgFullMatchCard from '../../components/PubgFullMatchCard';
import {CheckAdminContext} from '../ContextApi/ContextApi';
import {BASE_URL} from '../../env';

const Pubg = ({navigation}) => {
  const [data, setData] = useState([]);
  const {checkrole, checkadmin} = useContext(CheckAdminContext);

  useEffect(() => {
    checkrole();
  }, []);

  useEffect(() => {
    const getmatchCard = () => {
      axios.get(`${BASE_URL}/khelmela/getpubg`).then(response => {
        setData(response.data.data);
        console.log(data);
      });
    };
    getmatchCard();
  }, []);

  return (
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
        Note: All matches are made by the admin everyday in same time
      </Text>

      {checkadmin === 'admin' ? (
        <TouchableOpacity>
          <Text>admin</Text>
        </TouchableOpacity>
      ) : (
        <Text></Text>
      )}

      <FlatList
        data={data}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <PubgFullMatchCard matches={item} key={item._id} />
        )}
        contentContainerStyle={{gap: 20, paddingBottom: 20}}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2', // Light gray background
    flex: 1, // Simplified height to flex
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20, // Slightly smaller radius
    paddingHorizontal: 15, // Reduced padding
    height: 45, // Slightly shorter
    marginTop: 20, // Simplified margins
    marginHorizontal: 20, // Centered with equal margins
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10, // Reduced margin
    fontSize: 16,
  },
  note: {
    color: '#555', //te
    fontSize: 14, // Smaller font
    marginVertical: 10, // Simplified margin
    marginLeft: 20, // Consistent left margin
  },
});

export default Pubg;
