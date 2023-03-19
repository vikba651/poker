import { View, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import styles from './all-deals.scss'
import AppContext from '../../../shared/AppContext'
import Deal from '../deal/deal'

export default function AllDeals({ roundSummary }) {
  const { user } = useContext(AppContext)

  useEffect(() => {
    // let newMyCards = deals.map((deal) => deal.playerCards.find((cards) => cards.name === user.name)?.cards)
    // newMyCards = newMyCards.filter((cards) => cards) // Filter undefined
    // setMyCards(newMyCards)

    const myDeal = roundSummary.deals[0].playerCards.find((playerCards) => playerCards.name === user.name)
    console.log(myDeal)
  }, [roundSummary])

  function renderDeals(name) {
    if (roundSummary.deals.length > 0) {
      let playerCards = roundSummary.deals.map((deal) => deal.playerCards.find((cards) => cards.name === name)?.cards)
      playerCards = playerCards.filter((cards) => cards) // Filter undefined
      if (playerCards) {
        const dealComponents = []
        for (let i = 0; i < playerCards.length; i++) {
          dealComponents.push(
            <Deal
              key={i}
              title={`Deal ${i + 1}`}
              playerCards={playerCards[i]}
              tableCards={roundSummary.deals[i].tableCards}
            />
          )
        }
        return dealComponents
      }
    }
  }

  return (
    <View className={styles.container}>
      <ScrollView className={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
        {/* <Text style={{ fontSize: 40, margin: 20 }}>You played {myCards ? myCards.length : 0} deals</Text> */}
        {renderDeals(user.name)}
        <View style={{ height: 80 }}>{/* This adds to height to make space for footerbutton */}</View>
      </ScrollView>
    </View>
  )
}
