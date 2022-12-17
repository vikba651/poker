import { View, Image, Text, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import styles from './all-deals.scss'
import AppContext from '../../../../shared/AppContext'
import Deal from '../deal/deal'

export default function AllDeals({ deals }) {
  const [myCards, setMyCards] = useState([])
  const { user } = useContext(AppContext)

  useEffect(() => {
    let newMyCards = deals.map((deal) => deal.playerCards.find((cards) => cards.name === user.name)?.cards)
    newMyCards = newMyCards.filter((cards) => cards) // Filter undefined
    setMyCards(newMyCards)
  }, [deals])

  function renderDeals(name) {
    if (deals.length > 0) {
      let playerCards = deals.map((deal) => deal.playerCards.find((cards) => cards.name === name)?.cards)
      playerCards = playerCards.filter((cards) => cards) // Filter undefined
      if (playerCards) {
        const dealComponents = []
        for (let i = 0; i < playerCards.length; i++) {
          console.log('playercards', playerCards)
          dealComponents.push(<Deal key={i} playerCards={playerCards[i]} tableCards={deals[i].tableCards} />)
        }
        return dealComponents
      }
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
