import { View, SafeAreaView, Image, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import styles from './suit-choose.scss'
import heart from '../../assets/heart.png'
import spade from '../../assets/spade.png'
import diamond from '../../assets/diamond.png'
import club from '../../assets/club.png'

export default function SuiteChoose({ selectSuit, statsActive }) {
  const suitsFirstRow = [
    {
      id: 'heart',
      image: heart,
    },
    {
      id: 'spade',
      image: spade,
    },
  ]

  const suitsSecondRow = [
    {
      id: 'club',
      image: club,
    },
    {
      id: 'diamond',
      image: diamond,
    },
  ]

  return (
    <View
      // styles={selectedCard === card.id ? styles.selectedCard : ''}
      className={statsActive ? styles.selectionContainer : styles.statsActiveselectionContainer}
    >
      <View style={{ flexDirection: 'row' }}>
        {suitsFirstRow.map((suit) => (
          <TouchableOpacity
            key={suit.id}
            className={statsActive ? [styles.suit] : [styles.suit, styles.statsActiveSuit]}
            onPress={() => selectSuit(suit.id)}
          >
            <Image
              className={statsActive ? styles.suitImage : styles.statsActiveImage}
              style={{ resizeMode: 'contain' }}
              source={suit.image}
            ></Image>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: 'row' }}>
        {suitsSecondRow.map((suit) => (
          <TouchableOpacity
            key={suit.id}
            className={statsActive ? [styles.suit] : [styles.suit, styles.statsActiveSuit]}
            onPress={() => selectSuit(suit.id)}
          >
            <Image
              className={statsActive ? styles.suitImage : styles.statsActiveImage}
              style={{ resizeMode: 'contain' }}
              source={suit.image}
            ></Image>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
