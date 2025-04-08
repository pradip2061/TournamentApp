import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import PubgFullMatchCard from '../../components/PubgFullMatchCard';
import { CheckAdminContext } from '../ContextApi/ContextApi';
import { BASE_URL } from '../../env';
import { useSocket } from '../../SocketContext';

const Pubg = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { checkrole, checkadmin } = useContext(CheckAdminContext);
  const { renderPage, setRenderPage } = useSocket();

  // Check role on mount
  useEffect(() => {
    checkrole();
  }, [checkrole]);

  // Fetch match data
  useEffect(() => {
    const getMatchCard = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/khelmela/getpubg`);
        setData(response.data.card || []);
        console.log('match card data', response.data);
      } catch (err) {
        setError('Failed to load matches. Please try again.');
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    getMatchCard();
  }, [renderPage]);

  // Render item for FlatList
  const renderMatchCard = ({ item }) => (
    <PubgFullMatchCard matches={item} key={item._id} />
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
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
        Note: All matches are made by the admin everyday at the same time
      </Text>

      <View style={styles.liveMatches}>
        <Entypo name="game-controller" size={24} color="#333" />
        <Text style={styles.liveMatchesText}>Live Matches</Text>
      </View>

      {/* Match Cards */}
      {loading ? (
        <Text style={styles.loadingText}>Loading matches...</Text>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={item => item._id}
          renderItem={renderMatchCard}
          contentContainerStyle={styles.flatListContent}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.noMatchesText}>
          No Matches Available Right Now
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F2',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 45,
    marginTop: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: 'black',
  },
  note: {
    color: '#555',
    fontSize: 14,
    marginVertical: 10,
    marginLeft: 20,
  },
  liveMatches: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    width: 150,
    marginVertical: 15,
    marginLeft: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  liveMatchesText: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
  flatListContent: {
    gap: 20,
    paddingBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#red',
  },
  noMatchesText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default Pubg;