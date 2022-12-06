import { View, Image, Text, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import styles from './all-deals.scss'
import AppContext from '../../../shared/AppContext'
import Deal from '../deal/deal'

export default function AllDeals(round) {
  const [myCards, setMyCards] = useState([])
  const { user } = useContext(AppContext)
  useEffect(() => {
    console.log(round)
    const newMyCards = round.deals.map((deal) => deal.playerCards.find((cards) => cards.name === user.name)).cards
    setMyCards(newMyCards)
  }, [round])

  function renderDeals(name) {
    const playerCards = round.deals.map((deal) => deal.playerCards.find((cards) => cards.name === name).cards)
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
      <Text style={{ fontSize: 40, margin: 20 }}>You played {round.deals.length} deals</Text>
      <ScrollView className={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
        {renderDeals(user.name)}
        {/* {round.deals.map((deal) => {
          return (
            <View key={deal.id} className={styles.breakdownView}>
              <Text style={{ fontSize: 32 }}>{deal.id}</Text>
              <View className={styles.cardsView}>
                <View className={styles.cardsRow}>
                  {deal.playerCards.map((card, i) => {
                    return (
                      <View key={i} className={styles.playerCard}>
                        {!!card.suit && (
                          <Image
                            className={styles.playerCardSuit}
                            style={{ resizeMode: 'contain' }}
                            source={card.suitImage}
                          />
                        )}
                        {!!card.value && <Text className={styles.cardTopValue}>{card.value}</Text>}
                        {!!card.value && <Text className={styles.cardBottomValue}>{card.value}</Text>}
                      </View>
                    )
                  })}
                </View>
                <View className={styles.cardsRow}>
                  {deal.tableCards.map((card, i) => {
                    return (
                      <View key={i} className={styles.playerCard}>
                        {!!card.suit && (
                          <Image
                            className={styles.playerCardSuit}
                            style={{ resizeMode: 'contain' }}
                            source={card.suitImage}
                          />
                        )}
                        {<Text className={styles.cardTopValue}>{card.value}</Text>}
                        {<Text className={styles.cardBottomValue}>{card.value}</Text>}
                      </View>
                    )
                  })}
                </View>
              </View>
            </View>
          )
        })} */}
      </ScrollView>
    </View>
  )
}
