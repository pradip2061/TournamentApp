import { FlatList, Text, View, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import MatchCard from '../../components/MatchCard'
import Freefirefullmatchcard from '../../components/Freefirefullmatchcard'
import PubgFullMatchCard from '../../components/PubgFullMatchCard'
import TdmCard from '../../components/TdmCard'
import { ScrollView } from 'react-native-gesture-handler'
import { BASE_URL } from '../../env'

const EnrollMatch = () => {
  const [matchesff, setMatchesFF] = useState([])
  const [matchespubg, setMatchesPubg] = useState([])
  const [matchesclash, setMatchesClash] = useState([])
  const [matchestdm, setMatchesTdm] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getMatches = async () => {
      try {
        setLoading(true)
        const token = await AsyncStorage.getItem('token')
        const response = await axios.get(`${BASE_URL}/khelmela/enrollmatch`, {
          headers: {
            Authorization: `${token}`
          }
        })
        
        // Log the data to verify we're getting all matches
        console.log('API Response:', response.data)
        console.log('Clash Squad:', response.data.matchesclash)
        console.log('Free Fire:', response.data.matchesff)
        console.log('PUBG:', response.data.matchespubg)
        console.log('TDM:', response.data.matchestdm)

        setMatchesClash(response.data.matchesclash || [])
        setMatchesFF(response.data.matchesff || [])
        setMatchesPubg(response.data.matchespubg || [])
        setMatchesTdm(response.data.matchestdm || [])
      } catch (error) {
        setError('Failed to load matches. Please try again.')
        console.log('Error fetching matches:', error)
      } finally {
        setLoading(false)
      }
    }

    getMatches()
  }, [])

  const hasJoinedMatches = 
    (matchesclash && matchesclash.length > 0) || 
    (matchesff && matchesff.length > 0) || 
    (matchespubg && matchespubg.length > 0) || 
    (matchestdm && matchestdm.length > 0)

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>Loading your matches...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {!hasJoinedMatches ? (
        <View style={styles.noMatchesContainer}>
          <Text style={styles.noMatchesText}>You haven't joined any matches yet</Text>
        </View>
      ) : (
        <>
         
          {matchesff.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Free Fire Matches ({matchesff.length})</Text>
              <FlatList 
                data={matchesff} 
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <Freefirefullmatchcard matches={item} />}
                scrollEnabled={false} 
                contentContainerStyle={styles.listContainer}
              />
            </View>
          )}
          {matchespubg.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>PUBG Matches ({matchespubg.length})</Text>
              <FlatList 
                data={matchespubg} 
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                  <PubgFullMatchCard matches={item} />
                )}
                scrollEnabled={false} 
                contentContainerStyle={styles.listContainer}
              />
            </View>
          )}
          <View style ={styles.short}>
           {matchesclash.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Clash Squad Matches ({matchesclash.length})</Text>
              <FlatList 
                data={matchesclash} 
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <MatchCard match={item} />}
                scrollEnabled={false} 
                contentContainerStyle={styles.listContainer}
              />
            </View>
          )}
          {matchestdm.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>TDM Matches ({matchestdm.length})</Text>
              <FlatList 
                data={matchestdm} 
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <TdmCard matches={item} />}
                scrollEnabled={false} 
                contentContainerStyle={styles.listContainer}
              />
            </View>
          )}
          </View>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 5,
    flex: 1,
    
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  noMatchesText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    gap: 20,
    paddingBottom: 20,
  },
  short:{
    padding:20
  }
})

export default EnrollMatch