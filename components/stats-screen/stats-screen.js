import React, { useEffect, useState, useContext } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { getRounds } from '../../shared/api'
import AppContext from '../../shared/AppContext'

import styles from './stats-screen.scss'

export default function StatsScreen({ navigation, route }) {
  const { user } = useContext(AppContext)
  const [rounds, setRounds] = useState([])
  useEffect(() => {
    fetchRounds()
  }, [])

  async function fetchRounds() {
    const rounds = await getRounds(user.name)
    if (rounds) {
      setRounds(rounds)
    }
  }

  function formatTime(dateTimeString) {
    const date = new Date(dateTimeString)
    const localeString = date.toLocaleString()
    return localeString.slice(0, localeString.length - 3)
  }

  return (
    <SafeAreaView className={styles.container}>
      {rounds.length === 0 && <Text>You have no rounds.</Text>}
      {rounds.map((round, i) => (
        <View key={i}>
          <TouchableOpacity className={styles.roundButton}>
            <Text>{formatTime(round.startTime)}</Text>
            <Text>{round.deals.length + ' deals'}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </SafeAreaView>
  )
}
