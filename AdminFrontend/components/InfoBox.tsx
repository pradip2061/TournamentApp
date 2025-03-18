import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import MaterialIcons

const InfoBox = ({rules}) => {
  return (
    <View style={styles.box}>
      {/* First Section: Rule with Icon */}
      <View style={styles.section}>
        <Icon name="info" size={20} color="#007AFF" style={styles.icon} />
        <Text style={styles.ruleText}>
         {rules}
        </Text>
      </View>

      {/* Second Section (Optional) */}
      <View style={styles.section}>
        <Text style={styles.additionalText}>For more details, contact support.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    margin: 10,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginRight:8
  },
  icon: {
    marginRight: 10,
  },
  ruleText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  additionalText: {
    fontSize: 12,
    color: "#666",
    paddingLeft:30
  },
});

export default InfoBox;
