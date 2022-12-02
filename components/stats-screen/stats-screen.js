import React, { useEffect, useState, useContext } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { getRounds } from '../../shared/api'
import AppContext from '../../shared/AppContext'
import Svg, { Circle } from 'react-native-svg'
import { SparklesIcon } from 'react-native-heroicons/solid'

import styles from './stats-screen.scss'

export default function StatsScreen({ navigation, route }) {
  const { user } = useContext(AppContext)
  const [rounds, setRounds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    fetchRounds()
  }, [])

  async function fetchRounds() {
    const rounds = await getRounds(user.name)
    if (rounds) {
      setRounds(rounds.sort((a, b) => b.startTime - a.startTime))
      console.log(rounds[0])
    }
    setIsLoading(false)
  }

  function formatTime(dateTimeString) {
    const date = new Date(dateTimeString)
    const localeString = date.toLocaleString()
    return localeString.slice(0, localeString.length - 3)
  }

  function onClickRound(round) {
    navigation.navigate('GameBreakdown', { round })
  }

  return (
    <SafeAreaView className={styles.container}>
      {isLoading ? (
        <ActivityIndicator />
      ) : rounds.length === 0 ? (
        <Text>You have no rounds.</Text>
      ) : (
        rounds.map((round, i) => (
          <View key={i}>
            <TouchableOpacity className={styles.roundButton} onPress={() => onClickRound(round)}>
              <Text>{formatTime(round.startTime)}</Text>
              <Text>{round.deals.length + ' deals'}</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
      {/* {rounds.length === 0 && <Text>You have no rounds.</Text>}
      {rounds.map((round, i) => (
        <View key={i}>
          <TouchableOpacity className={styles.roundButton}>
            <Text>{formatTime(round.startTime)}</Text>
            <Text>{round.deals.length + ' deals'}</Text>
          </TouchableOpacity>
        </View>
      ))} */}
    </SafeAreaView>
  )
}
