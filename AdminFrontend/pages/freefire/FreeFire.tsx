import {View, ScrollView, FlatList, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import Freefirefullmatchcard from '../../components/Freefirefullmatchcard';
import axios from 'axios';
import ShimmerBox from '../../components/ShimmerBox';
import {BASE_URL} from '../../env';

const FreeFire = () => {
  const [card, setCard] = useState([]);

  useEffect(() => {
    const getMatch = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/khelmela/getff`);
        setCard(response.data.card);
      } catch (error) {
        console.error(error);
      }
    };
    getMatch();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {card.length > 0 ? (
        <FlatList
          data={card}
          scrollEnabled={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <Freefirefullmatchcard matches={item} />}
        />
      ) : (
        <ShimmerBox />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default FreeFire;
