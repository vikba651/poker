import React, { useEffect, useState, useContext } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native'
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
    }
    setIsLoading(false)
  }

  function formatTime(dateTimeString) {
    const date = new Date(dateTimeString)
    const dateString =
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1) +
      '-' +
      date.getDate() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes()
    return dateString
  }

  function onClickRound(round) {
    navigation.navigate('GameBreakdown', { round })
  }

  return (
    <ScrollView className={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
      {isLoading && <ActivityIndicator />}
      {!isLoading && rounds.length === 0 && <Text>You have no rounds.</Text>}
      {!isLoading &&
        rounds.length > 0 &&
        rounds.map((round, i) => (
          <View key={i}>
            <TouchableOpacity className={styles.roundButton} onPress={() => onClickRound(round)}>
              <Text>{formatTime(round.startTime)}</Text>
              <Text>{round.deals.length + ' deals'}</Text>
            </TouchableOpacity>
          </View>
        ))}
    </ScrollView>
  )
}
