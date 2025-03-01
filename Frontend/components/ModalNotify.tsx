import { Text, View ,Modal} from 'react-native'
import React from 'react'
import Icon from "react-native-vector-icons/Ionicons";
 const ModalNotify =({visible,message,error})=> {
  const displayText = message || error || "Error occurred"; // Message has priority over error
  const iconName = message ? "checkmark-circle" : "alert-circle"; // Green icon for message, red for error
  const iconColor = message ? "green" : "red"; // Different colors for success & error

    return (
      <Modal visible={visible} transparent animationType="fade">
      <View style={{ flex: 1, marginTop:650, alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "black", padding: 20, borderRadius: 10 }}>
          <Icon name={iconName} size={24} color={iconColor} style={{ marginRight: 10 }} />
          <Text style={{ color: "white", fontSize: 16 }}>{error ? error :message ?message:'error occur'}</Text>
        </View>
      </View>
    </Modal>
    )
  }


export default ModalNotify