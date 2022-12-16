import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline'
import React, { useState, useEffect } from 'react'
import styles from './track-game-screen.scss'
import PlayingCard from '../playing-card/playing-card'

import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native'

export default function Cards({ cards, currentDeal, selectedCard, onSelectCard, statsActive }) {
  const [hideCards, onHideCards] = useState(false)

  useEffect(() => {}, [cards])

  return (
    <View className={styles.cardsView}>
      {/* <TouchableOpacity className={styles.restartButton} onPress={() => toggleStats()}>
            <Text className={styles.buttonFont}>Change Stats</Text>
          </TouchableOpacity> */}

      <View style={{ alignItems: 'center', marginBottom: statsActive ? 0 : 40 }}>
        <Text style={{ fontWeight: '800' }}>Deal #{currentDeal + 1}</Text>
      </View>
      <View className={styles.myCards}>
        <Text className={styles.titleFont}>My Cards</Text>
        <View className={styles.myCardsRow} style={{ opacity: hideCards ? 0 : 1 }}>
          {cards &&
            cards.slice(0, 2).map((card) => {
              return (
                <TouchableOpacity key={card.id} onPress={() => onSelectCard(card.id)}>
                  <PlayingCard
                    rank={card.rank}
                    suit={card.suit}
                    isSelected={selectedCard === card.id}
                    isActive={card.isActive}
                    isBigCard={!statsActive}
                  />
                </TouchableOpacity>
              )
            })}
        </View>
        <TouchableOpacity className={styles.hideButton} onPress={() => onHideCards(!hideCards)}>
          {hideCards ? <EyeIcon color="black" /> : <EyeSlashIcon color="black" />}
        </TouchableOpacity>
      </View>
      <View className={styles.tableCards}>
        <Text className={styles.titleFont}>Cards on table</Text>
        <View className={styles.tableCardsRow}>
          {cards &&
            cards.slice(2, 7).map((card, i) => {
              return (
                <TouchableOpacity key={card.id} onPress={() => onSelectCard(card.id)} disabled={!card.isActive}>
                  <PlayingCard
                    rank={card.rank}
                    suit={card.suit}
                    isSelected={selectedCard === card.id}
                    isActive={card.isActive}
                    isBigCard={false}
                  />
                </TouchableOpacity>
              )
            })}
        </View>
      </View>
    </View>
  )
}
