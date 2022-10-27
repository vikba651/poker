import { Button, SafeAreaView, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { PokerHand } from '../../algorithms/poker-algorithms'
import styles from './start-screen.scss'

export default function StartScreen({ navigation, route }) {
  // PokerHand('AC KS 5S 8C AH')
  const name = route.params.name

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcomeText}>What do you want to do, {name}?</Text>
      <Button
        onPress={() => navigation.navigate('AddPlayersScreen', { name: name })}
        title="Settle up"
      />
      <Text>or</Text>

      <Button
        onPress={() => navigation.navigate('TrackGameScreen')}
        title="Track poker game"
      />
    </SafeAreaView>
  )
}
