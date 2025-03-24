import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
const Pubg = require('../../assets/image.png');
const Pubgfullhistory = () => {
    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={["#0f0c29", "#302b63", "#24243e"]}
                style={styles.container}>
                <View>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Image source={Pubg} style={styles.image} />
                            <Text style={styles.text}>PUBG Full Match</Text>
                        </View>
                    </View>

                    <View style={styles.mid}>
                        <Text style={styles.text}>Position:5/16</Text>
                        <Text style={styles.text}>Mode: Squad</Text>
                    </View>

                    <View style={styles.low}>
                        <Text style={styles.text}>Paid: 100</Text>
                         <Text style={[styles.text , {color:'yellow'}]}>Win: 200</Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 340,
        marginLeft: 15,
        padding: 15,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        marginLeft: -5,
        borderWidth: 2,
        borderColor: '#fff',
    },
    text: {
        fontSize: 14,
        fontWeight: '700',
        color: 'white',
        letterSpacing: 0.5,
    },
    mid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
    },
    low: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 15,
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 15,
    }
});

export default Pubgfullhistory