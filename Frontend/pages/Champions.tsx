import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const LeaderboardScreen = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [filter, setFilter] = useState("week");

    useEffect(() => {
        // Dummy data (Replace with API call in future)
        const dummyData = Array.from({ length: 50 }, (_, index) => ({
            rank: index + 1,
            name: `@player${index + 1}`,
            score: Math.floor(Math.random() * 10000),
        }));
        setLeaderboardData(dummyData);
    }, [filter]);

    return (
        <LinearGradient
            colors={['#5e00c0', '#8a00d4', '#b100e8']} // Adjust colors to match the design
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.linearColor}
          >
        <View style={styles.container}>
            <Text style={styles.title}>LEADERBOARD</Text>
            
            <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => setFilter("week")} style={styles.filterButton}>
                    <Text style={styles.filterText}>This Week</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter("month")} style={styles.filterButton}>
                    <Text style={styles.filterText}>This Month</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.topThreeContainer}>
                {/* Second place */}
                <View style={[styles.topPlayerContainer, styles.secondPlace]}>
                    <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }} style={styles.avatar} />
                    <Text style={styles.playerName}>{leaderboardData[1]?.name}</Text>
                    <Text style={styles.score}>{leaderboardData[1]?.score}</Text>
                </View>
                
                {/* First place */}
                <View style={[styles.topPlayerContainer, styles.firstPlace]}>
                    <Image source={{ uri: "https://imgs.search.brave.com/4YhsSPJTo2gK7HvyQsKKpZKybWT53c1JG11kQqQsT3g/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nbWFydC5jb20v/ZmlsZXMvNS9Dcm93/bi1QTkctUGljLnBu/Zw" }} style={styles.crown} />
                    <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }} style={styles.avatar} />
                    <Text style={styles.playerName}>{leaderboardData[0]?.name}</Text>
                    <Text style={styles.score}>{leaderboardData[0]?.score}</Text>
                </View>
                
                {/* Third place */}
                <View style={[styles.topPlayerContainer, styles.thirdPlace]}>
                    <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }} style={styles.avatar} />
                    <Text style={styles.playerName}>{leaderboardData[2]?.name}</Text>
                    <Text style={styles.score}>{leaderboardData[2]?.score}</Text>
                </View>
            </View>

            <FlatList
                data={leaderboardData.slice(3)}
                keyExtractor={(item) => item.rank.toString()}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.rank}>{item.rank}</Text>
                        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }} style={styles.avatarSmall} />
                        <View style ={{gap:80 ,flexDirection:"row"}}>
                        <Text style={styles.playerName}>{item.name}</Text>
                        <Text style={styles.score}>{item.score} pts</Text>
                        </View>
                    </View>
                )}
            />
        </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {  padding: 20 },
    title: { fontSize: 22, color: "#fff", textAlign: "center", fontWeight: "bold" },
    filterContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
    filterButton: { backgroundColor: "#FFB400", padding: 10, marginHorizontal: 5, borderRadius: 10 },
    filterText: { color: "#fff", fontWeight: "bold" },
    topThreeContainer: { flexDirection: "row", justifyContent: "center", alignItems: "flex-end", marginVertical: 20 },
    topPlayerContainer: { alignItems: "center", marginHorizontal: 15 },
    firstPlace: { marginBottom: 30 },
    secondPlace: { marginTop: 20 },
    thirdPlace: { marginTop: 40 },
    crown: { width: 70, height: 40, position: "absolute", top: -40 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#FFB400" },
    avatarSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFB400" },
    playerName: { color: "#fff", fontSize: 14, marginTop: 5 },
    score: { color: "#fff", fontSize: 16, fontWeight: "bold", },
    listItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#7D26CD", padding: 10, marginVertical: 5, borderRadius: 10 },
    linearColor:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    rank: { color: "#fff", fontSize: 18, fontWeight: "bold", marginRight: 10 }
});

export default LeaderboardScreen;
