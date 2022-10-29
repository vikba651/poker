import { Button, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { PokerHand } from '../../algorithms/poker-algorithms'
import styles from './start-screen.scss'

export default function StartScreen({ navigation, route }) {
  // PokerHand('AC KS 5S 8C AH')
  const name = route.params.name

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>What do you want to do, {name}?</Text>
      
      <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity 
      className={styles.settleMode} 
      onPress={() => navigation.navigate('AddPlayersScreen', { name: name })}
      >
        <Text>
        Settle Up
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
      className={styles.trackMode} 
      onPress={() => navigation.navigate('TrackGameScreen')}
      >
        <Text>
        Track Poker Game
        </Text>
      </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}
