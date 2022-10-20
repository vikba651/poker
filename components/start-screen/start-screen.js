import { Button, SafeAreaView, Text } from 'react-native'
import React from 'react'
import styles from './start-screen.scss'

export default function StartScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ marginBottom: 40, fontSize: 24 }}>
        What do you want to do?
      </Text>
      <Button
        onPress={() => navigation.navigate('AddPlayersScreen')}
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
