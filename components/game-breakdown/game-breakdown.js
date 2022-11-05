import { View, SafeAreaView, Image, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import styles from './game-breakdown.scss'

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
    <SafeAreaView
      style={{
        flex: 1,
        width: '100%',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 40, margin: 20 }}>You played {rounds.length} rounds</Text>
      {rounds.map((round) => {
        return (
          <View className={styles.chooseView}>
            <Text key={round.round} style={{ fontSize: 32 }}>
              {round.round}
            </Text>
            {round.cards.map((card) => {
              return <Text>{card.value + ' ' + card.suit}</Text>
            })}
          </View>
        )
      })}
    </SafeAreaView>
  )
}
