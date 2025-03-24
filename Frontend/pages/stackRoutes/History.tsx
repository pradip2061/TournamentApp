import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Fffullmatchhistory from '../../components/historycard/Fffullmatchhistory';
import Clashsquadhistory from '../../components/historycard/Clashsquadhistory';
import Pubgfullhistory from '../../components/historycard/Pubgfullhistory';
import Tdmhistory from '../../components/historycard/Tdmhistory';

const History = () => {
    const [selectedButton, setSelectedButton] = useState(null);

    return (
        <View style={styles.mainContainer}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    onPress={() => {
                        console.log('Win Matches pressed');
                        setSelectedButton('win');
                    }}
                    style={styles.buttonWrapper}
                >
                    <View style={[
                        styles.button,
                        selectedButton === 'win' && styles.selectedButton,
                    ]}>
                        <Text style={[
                            styles.buttonText,
                            selectedButton === 'win' && styles.selectedText
                        ]}>Win Matches</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => {
                        console.log('Loss Matches pressed');
                        setSelectedButton('loss');
                    }}
                    style={styles.buttonWrapper}
                >
                    <View style={[
                        styles.button,
                        selectedButton === 'loss' && styles.selectedButton,
                    ]}>
                        <Text style={[
                            styles.buttonText,
                            selectedButton === 'loss' && styles.selectedText
                        ]}>Loss Matches</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.matchSection}>
                <View style={styles.matchContainer}>
                    <Fffullmatchhistory />
                    <Clashsquadhistory />
                    <Pubgfullhistory/>
                    <Tdmhistory/>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5', 
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 30,
        paddingBottom: 20,
        gap: 20, 
        backgroundColor: '#fff', 
        elevation: 2, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonWrapper: {
        borderRadius: 20,
    },
    button: {
        backgroundColor: '#e0e0e0', 
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        minWidth: 120,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d0d0d0',
    },
    selectedButton: {
        backgroundColor: '#2196F3', 
        borderColor: '#1976D2',
        transform: [{ scale: 1.05 }], 
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333', 
    },
    selectedText: {
        color: '#fff',
        fontWeight: '700',
    },
    matchSection: {
        flex: 1,
        paddingHorizontal: 15,
    },
    matchContainer: {
        gap: 15, 
        paddingVertical: 20,
    },
});

export default History;