import { View, Image, TouchableOpacity, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import styles from './game-breakdown-screen.scss'
import GameStats from './game-stats/game-stats'
import AppContext from '../../shared/AppContext'
import { getRoundSummary } from '../../shared/api'
import ViewDeals from '../../assets/view-deals.png'
import SettleUp from '../../assets/settle-up.png'
import { HomeIcon } from 'react-native-heroicons/outline'

export default function GameBreakDownScreen({ navigation, route }) {
  const [round, setRound] = useState(route.params.round)
  const { socket } = useContext(AppContext)
  const [roundSummary, setRoundSummary] = useState()

  function onViewDeals() {
    navigation.navigate('AllDeals', { roundSummary })
  }

  function onSettleUp() {
    navigation.navigate('AddPlayersScreen', { round })
  }

  function onHome() {
    navigation.navigate('StartScreen')
  }

  const fetchRoundSummary = async (id) => {
    const roundSummary = await getRoundSummary(id)
    setRoundSummary(roundSummary)
  }

  useEffect(() => {
    socket.on('playerEndedGame', (round) => {
      setRound(round)
      fetchRoundSummary(round._id)
    })
    fetchRoundSummary(round._id)
  }, [])

  return (
    <View style={styles.container}>
      <GameStats navigation={navigation} deals={round.deals} roundSummary={roundSummary}></GameStats>

      <View className={styles.footerButtonsView}>
        <TouchableOpacity onPress={() => onViewDeals()} className={styles.footerButton}>
          <Image className={styles.icon} source={ViewDeals} />
          <Text className={styles.buttonText}>View Deals</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSettleUp()} className={styles.footerButton}>
          <Image className={styles.icon} source={SettleUp} />
          <Text className={styles.buttonText}>Settle Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onHome()
          }}
          className={styles.footerButton}
        >
          <HomeIcon color="black" />
          <Text className={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
