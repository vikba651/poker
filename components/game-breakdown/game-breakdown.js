import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import styles from './game-breakdown.scss'
import AllDeals from './all-deals'
import GeneralStats from './general-stats'


export default function GameBreakDown({ navigation, route }) {
  const deals = route.params.allDeals

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
