import { FlatList, Text, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import MatchCard from '../../components/MatchCard'
import Freefirefullmatchcard from '../../components/Freefirefullmatchcard'
import PubgFullMatchCard from '../../components/PubgFullMatchCard'
import TdmCard from '../../components/TdmCard'
import { ScrollView } from 'react-native-gesture-handler'

const EnrollMatch =()=> {
  const[matchesff,setMatchesFF]=useState([])
const[matchespubg,setMatchesPubg]=useState([])
const[matchesclash,setMatchesClash]=useState([])
const[matchestdm,setMatchesTdm]=useState([])
    useEffect(()=>{
        try {
         const getmatch=async()=>{
           const token = await AsyncStorage.getItem('token')
         const response =  await axios.get(`${process.env.baseUrl}/khelmela/enrollmatch`,{
            headers:{
                Authorization:`${token}`
            }
         })
         setMatchesClash(response.data.matchesclash)
         setMatchesFF(response.data.matchesff)
         setMatchesPubg(response.data.matchespubg)
         setMatchesTdm(response.data.matchestdm)
       }
             getmatch()
        } catch (error) {
         console.log(error)
        }
       },[])
    return (
        <ScrollView>
       <FlatList data={matchesclash} keyExtractor={(item)=>item._id} renderItem={({item})=>(
        <MatchCard match={item} />
       )}  scrollEnabled={false} contentContainerStyle={{ gap: 20 }}  />
       <FlatList data={matchesff} keyExtractor={(item)=>item._id} renderItem={({item})=>(
        <Freefirefullmatchcard matches={item}/>
       )}  scrollEnabled={false} contentContainerStyle={{ paddingBottom: 20 }} />
       <FlatList data={matchespubg} keyExtractor={(item)=>item._id} renderItem={({item})=>(
        <PubgFullMatchCard matches={item}/>
       )}  scrollEnabled={false} contentContainerStyle={{ gap: 20 }} />
       <FlatList data={matchestdm} keyExtractor={(item)=>item._id} renderItem={({item})=>(
        <TdmCard matches={item}/>
       )}  scrollEnabled={false}contentContainerStyle={{ gap: 20,marginTop:20 }}  />
        </ScrollView>     
    )
  }


export default EnrollMatch







