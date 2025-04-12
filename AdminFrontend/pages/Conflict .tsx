import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import ReportOrConflict from '../components/Reportorconflict'; 

const Conflict = () => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.text}>Conflict & Reported Matches</Text>
      <ScrollView style={styles.card}>
        <View style={styles.cardContainer}>
            <ReportOrConflict/>
          
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
   
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: '#000', // Added for better contrast
  },
  card: {
  
  },
  cardContainer: {
  
  },
});

export default Conflict;
