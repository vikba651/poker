import { Button, SafeAreaView, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import styles from './start-screen.scss'

export default function StartScreen({ navigation, route }) {
  const name = route.params.name

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ marginBottom: 40, fontSize: 24 }}>What do you want to do, {name}?</Text>
      <Button
        onPress={() => navigation.navigate('AddPlayersScreen', { name: name })}
        title="Settle up"
      />
      <Text>or</Text>

      <Button onPress={() => navigation.navigate('TrackGameScreen')} title="Track poker game" />
    </SafeAreaView>
  )
}
