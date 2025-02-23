import { View, Text } from 'react-native'
import React from 'react'
import PubgFullMatchCard from '../components/PubgFullMatchCard'
import { SafeAreaView } from 'react-native-safe-area-context'

const Pubg = () => {
  return (
    <SafeAreaView>
    <View>
      
      <PubgFullMatchCard/>
    </View>
    </SafeAreaView>
  )
}

export default Pubg