import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';

const Transcation = ({navigation}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Deposite')}>
        <View
          style={{
            backgroundColor: 'white',
            height: 80,
            width: 335,
            borderRadius: 20,
            marginBottom: 50,
            alignItems: 'center',
          }}>
          <Text style={styles.text}>Deposit</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('Withdraw')}>
      <View
        style={{
          backgroundColor: 'white',
          height: 80,
          width: 335,
          borderRadius: 20,
          marginBottom: 5,
          alignItems: 'center',
        }}>
          <Text style={styles.text}>Withdraw Money</Text>
      
      </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 100,
    alignItems: 'center',
    backgroundColor: '#5D0EAD',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
  },
});
export default Transcation;
