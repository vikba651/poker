import { View, SafeAreaView, Image, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import styles from './suit-choose.scss'

export default function SuiteChoose({ selectSuit }) {
  return (
    <View className={styles.selectionContainer}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity className={styles.suit} onPress={() => selectSuit('heart')}>
          <Image
            className={styles.suitImage}
            style={{ resizeMode: 'contain' }}
            source={require('../../assets/heart.png')}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity className={styles.suit} onPress={() => selectSuit('spade')}>
          <Image
            className={styles.suitImage}
            style={{ resizeMode: 'contain' }}
            source={require('../../assets/spade.png')}
          ></Image>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          className={styles.suit}
          style={{ resizeMode: 'contain' }}
          onPress={() => selectSuit('club')}
        >
          <Image
            className={styles.suitImage}
            style={{ resizeMode: 'contain' }}
            source={require('../../assets/club.png')}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity className={styles.suit} onPress={() => selectSuit('diamond')}>
          <Image
            className={styles.suitImage}
            style={{ resizeMode: 'contain' }}
            source={require('../../assets/diamond.png')}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  )
}
