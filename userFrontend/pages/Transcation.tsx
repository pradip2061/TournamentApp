import { View, Text , StyleSheet} from 'react-native'
import React from 'react'

const Transcation = () => {
  return (


    <View style={styles.container}>
    <View style ={{ backgroundColor:'white',height:80,width:335, borderRadius:20,marginBottom:50,alignItems:'center'}}>
      <Text style={styles.text}>Deposit</Text>

    </View>


    <View style ={{ backgroundColor:'white',height:80,width:335, borderRadius:20,marginBottom:5,alignItems:'center'}}>
      <Text style={styles.text}>Withdraw Money</Text>
    </View>
    
    </View>

  )
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:100,
    alignItems:'center',
    backgroundColor:'#5D0EAD'
    
  },
  text:{
    fontSize:20,
    fontWeight:'bold',
    color:'black', 
    marginTop:20

    
  }
})
export default Transcation


