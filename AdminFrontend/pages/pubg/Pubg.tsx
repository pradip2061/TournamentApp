import {
  View,
  ScrollView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import PubgFullMatchCard from '../../components/PubgFullMatchCard';
import axios from 'axios';
import ShimmerBox from '../../components/ShimmerBox';
import {BASE_URL} from '../../env';

const Pubg = () => {
  const [card, setCard] = useState([]);
  const [showHidden, setShowHidden] = useState(false);

  useEffect(() => {
    const getMatch = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/khelmela/getpubg`);
        setCard(response.data.card);
        console.log('Pubg Matches -----', response.data.card);
      } catch (error) {
        console.error(error);
      }
    };
    getMatch();
  }, []);

  const filteredMatches = showHidden ? card : card.filter(item => !item.hidden);

  return (
    <View style={styles.container}>
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
        {filteredMatches.length > 0 ? (
          <FlatList
            data={filteredMatches}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => <PubgFullMatchCard matches={item} />}
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
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
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
