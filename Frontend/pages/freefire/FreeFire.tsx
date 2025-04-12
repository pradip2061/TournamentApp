import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import Freefirefullmatchcard from '../../components/Freefirefullmatchcard';
import { useSocket } from '../../SocketContext';
import { BASE_URL } from '../../env';

const FreeFire = ({ navigation }) => {
  const [card, setCard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { renderPage } = useSocket();

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/khelmela/getff`);
      setCard(response.data.card || []);
    } catch (err) {
      setError('Failed to load matches. Please try again.');
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [renderPage, fetchMatches]);

  const renderMatchCard = useCallback(({ item }) => (
    <Freefirefullmatchcard matches={item} />
  ), []);

  return (
    <ImageBackground style={styles.matchCard}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
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
          Note: All matches are created by admin. Everyday at the same time
        </Text>
        <View style={styles.liveMatches}>
          <Entypo name="game-controller" size={24} color="#333" />
          <Text style={styles.liveMatchesText}>Live Matches</Text>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading matches...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : card.length > 0 ? (
          <FlatList
            data={card}
            scrollEnabled={false}
            keyExtractor={(item, id) => id.toString()}
            renderItem={renderMatchCard}
            contentContainerStyle={styles.flatListContent}
          />
        ) : (
          <Text style={styles.noMatchesText}>
            No Matches Right Now
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
    backgroundColor: '#F2F2F2',
  },
  matchCard: {
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
    shadowOffset: { width: 0, height: 1 },
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
  flatListContent: {
    gap: 35,
    marginLeft: 8,
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
    fontSize: 15,
    color: '#333',
  },
});

export default FreeFire;