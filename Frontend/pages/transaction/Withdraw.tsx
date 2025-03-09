import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const Withdraw = () => {
  const [selectedMethod, setSelectedMethod] = useState("eSewa");

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Payment Method</Text>
      <View style={styles.methodContainer}>
        <TouchableOpacity onPress={() => setSelectedMethod("eSewa")}>
          <Image
            source={require("../../assets/esewa.jpg")}
            style={selectedMethod === "eSewa" ? styles.selectedIcon : styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedMethod("Khalti")}>
          <Image
            source={require("../../assets/khalti.jpg")}
            style={selectedMethod === "Khalti" ? styles.selectedIcon : styles.icon}
          />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder={selectedMethod === "eSewa" ? "Enter your eSewa number" : "Enter your Khalti number"}
        placeholderTextColor="black" // Placeholder text set to black
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        placeholderTextColor="black" // Placeholder text set to black
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: 'grey',
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 95,
  },
  methodContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  icon: {
    width: 100,
    height: 45,
    marginHorizontal: 10,
    opacity: 0.8,
  },
  selectedIcon: {
    width: 120,
    height: 55,
    marginHorizontal: 10,
    opacity: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "80%",
    padding: 10,
    marginTop: 39,
    borderRadius: 5,
    backgroundColor: 'white',
    color: 'black', // Input text remains black
  },
  saveButton: {
    backgroundColor: '#007bff', // Blue button, common in your other code
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 39, // Matches input spacing
    height:50,
    width:100
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
   
    textAlign:'center'
  },
});

export default Withdraw;