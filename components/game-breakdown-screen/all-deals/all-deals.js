import { View, Image, Text, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import styles from './all-deals.scss'
import AppContext from '../../../shared/AppContext'
import Deal from '../deal/deal'

export default function AllDeals(round) {
  const [myCards, setMyCards] = useState([])
  const { user } = useContext(AppContext)
  useEffect(() => {
    let newMyCards = round.deals.map((deal) => deal.playerCards.find((cards) => cards.name === user.name)?.cards)
    newMyCards = newMyCards.filter((cards) => cards) // Filter undefined
    setMyCards(newMyCards)
  }, [round])

  function renderDeals(name) {
    let playerCards = round.deals.map((deal) => deal.playerCards.find((cards) => cards.name === name)?.cards)
    playerCards = playerCards.filter((cards) => cards) // Filter undefined
    if (playerCards) {
      const deals = []
      for (let i = 0; i < round.deals.length; i++) {
        deals.push(<Deal key={i} playerCards={playerCards[i]} tableCards={round.deals[i].tableCards} />)
      }
      return deals
    }
  }

  return (
    <View className={styles.container}>
      <ScrollView className={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 40, margin: 20 }}>You played {myCards ? myCards.length : 0} deals</Text>
        {renderDeals(user.name)}
      </ScrollView>
    </View>
  )
}
