import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import styles from './game-breakdown-screen.scss'
import AllDeals from './all-deals'
import GeneralStats from './general-stats'
import AppContext from '../../shared/AppContext'

export default function GameBreakDownScreen({ navigation, route }) {
  const deals = route.params.allDeals
  const { socket, session } = useContext(AppContext)

  const [showAllDeals, setShowAllDeals] = useState(false)

  function onToggleViewAll() {
    setShowAllDeals(!showAllDeals)
  }

  function onSettleUp() {
    navigation.navigate('AddPlayersScreen')
  }

  function onHome() {
    navigation.navigate('StartScreen')
  }

  useEffect(() => {}, [])

  return (
    <SafeAreaView style={styles.container}>
      {!showAllDeals && <GeneralStats></GeneralStats>}
      {showAllDeals && <AllDeals deals={deals}></AllDeals>}

      <View className={styles.footerButtonsView}>
        <TouchableOpacity onPress={() => onToggleViewAll()} className={styles.footerButton}>
          {showAllDeals && <Text className={styles.buttonText}>View Stats</Text>}
          {!showAllDeals && <Text className={styles.buttonText}>View Deals</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSettleUp()} className={styles.footerButton}>
          <Text className={styles.buttonText}>Settle Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onHome()
          }}
          className={styles.footerButton}
        >
          <Text className={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}