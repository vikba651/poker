import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import styles from './game-breakdown.scss'
import variables from '../../_variables.scss'

export default function GameBreakDown({ navigation, route }) {
  // const initialCardsList = [
  //   { id: 0, suit: 'heart', suitImage: null, value: '2' },
  //   { id: 1, suit: 'diamond', suitImage: null, value: '3' },
  //   { id: 2, suit: 'club', suitImage: null, value: '4' },
  //   { id: 3, suit: 'heart', suitImage: null, value: 'K' },
  //   { id: 4, suit: 'spade', suitImage: null, value: 'A' },
  //   { id: 5, suit: 'spade', suitImage: null, value: 'J' },
  //   { id: 6, suit: 'heart', suitImage: null, value: 'Q' },
  // ]
  // const rounds = [
  //   {
  //     round: 1,
  //     cards: initialCardsList,
  //   },
  //   {
  //     round: 2,
  //     cards: initialCardsList,
  //   },
  //   {
  //     round: 3,
  //     cards: initialCardsList,
  //   },
  // ]
  const rounds = route.params.allRounds
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 40, margin: 20 }}>You played {rounds.length} rounds</Text>
      <ScrollView className={styles.scrollView}>
        {rounds.map((round) => {
          return (
            <View key={round.round} className={styles.breakdownView}>
              <Text style={{ fontSize: 32 }}>{round.round}</Text>
              <View className={styles.cardsView}>
                <View className={styles.cardsRow}>
                  {round.cards.slice(0, 2).map((card, i) => {
                    return (
                      <View key={card.id} className={styles.playerCard}>
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
                  {round.cards.slice(2, 7).map((card, i) => {
                    return (
                      <View key={card.id} className={styles.playerCard}>
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
                  })

                  }
                </View>
              </View>
            </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>
  )
}
