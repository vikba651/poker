import React, { useEffect, useState, useContext } from 'react'
import { Image, SafeAreaView, Text, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native'
import { getRounds, deleteRound, getPlayer } from '../../shared/api'
import AppContext from '../../shared/AppContext'
import { SparklesIcon, TrashIcon } from 'react-native-heroicons/outline'

import styles from './stats-screen.scss'
import ComponentCard from '../../components/component-card/component-card'

export default function StatsScreen({ navigation, route }) {
  const { user } = useContext(AppContext)
  const [rounds, setRounds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const player = getPlayer(user.name)
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
    const monthNames = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const date = new Date(dateTimeString)
    const dateString =
      date.getDate() +
      ' ' +
      monthNames[date.getMonth()] +
      ' ' +
      date.getFullYear() +
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
    <SafeAreaView className={styles.container}>
      <ComponentCard
        title="Overview"
        content={<Text style={styles.overviewText}>An overview of your games' statistics will show up here.</Text>}
      ></ComponentCard>
      <ComponentCard
        title="Your games"
        content={
          <>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
              {isLoading && <ActivityIndicator />}
              {!isLoading && rounds.length === 0 && <Text>You have no rounds.</Text>}
              {!isLoading &&
                rounds.length > 0 &&
                rounds.map((round, i) => (
                  <View key={i} className={styles.roundContent}>
                    <TouchableOpacity className={styles.roundButton} onPress={() => onClickRound(round)}>
                      <TouchableOpacity className={styles.emojiSide}>
                        <Image
                          className={styles.chooseEmoji}
                          style={{ resizeMode: 'contain' }}
                          source={require('../../assets/choose-emoji.png')}
                        />
                      </TouchableOpacity>

                      <Text style={{ fontWeight: 'bold' }}>{formatTime(round.startTime)} </Text>
                      <Text>{round.deals.length + ' deals'}</Text>
                      <TouchableOpacity className={styles.binSide} onPress={() => deleteRound(round._id, user.name)}>
                        <TrashIcon color="red" style={{ marginRight: '5%' }}></TrashIcon>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
          </>
        }
      ></ComponentCard>
    </SafeAreaView>
  )
}
