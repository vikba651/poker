import {
  Text,
  View,
  ScrollView,
  Button,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native'
import React, { useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

import styles from './add-players-screen.scss'
import PlayerCard from '../player-card/player-card'

export default function AddPlayersScreen({ navigation, route }) {
  const [playerCount, setPlayerCount] = useState(1)

  const [players, setPlayers] = useState([
    {
      id: 0,
      name: '',
      buyIn: 0,
      chipsLeft: 0,
    },
  ])

  function onAddPlayer() {
    setPlayerCount(playerCount + 1)
    const newPlayers = [
      ...players,
      { id: playerCount, name: '', buyIn: 0, chipsLeft: 0 },
    ]
    setPlayers(newPlayers)
  }

  function onDeletePlayer(id) {
    const newPlayers = players.filter((player) => player.id != id)
    setPlayers(newPlayers)
  }

  function onChangeName(text, id) {
    let newPlayers = [...players]
    newPlayers.find((player) => player.id == id).name = text
    setPlayers(newPlayers)
  }

  function onChangeBuyIn(text, id) {
    let newPlayers = [...players]
    newPlayers.find((player) => player.id == id).buyIn = text
    setPlayers(newPlayers)
  }

  function onChangeChipsLeft(text, id) {
    let newPlayers = [...players]
    newPlayers.find((player) => player.id == id).chipsLeft = text
    setPlayers(newPlayers)
  }

  function onDone() {
    console.log(players)
    if (players.length > 0) {
      const potTotal = players
        .map((player) => +player.buyIn)
        .reduce((a, b) => a + b)
      const chipsLeftTotal = players
        .map((player) => +player.chipsLeft)
        .reduce((a, b) => a + b)

      if (potTotal === chipsLeftTotal) {
        navigation.navigate('SettleUpScreen', { players })
      } else {
        alert(
          `Total pot (${potTotal}) is not equal to total chips left (${chipsLeftTotal})`
        )
      }
    }
  }

  return (
    <SafeAreaView className={styles.container}>
      <Text className={styles.addPlayers}>Add players</Text>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View className={styles.scrollView}>
          {players.map((player) => {
            return (
              <PlayerCard
                key={player.id}
                player={player}
                onChangeName={onChangeName}
                onChangeBuyIn={onChangeBuyIn}
                onChangeChipsLeft={onChangeChipsLeft}
                onDeletePlayer={onDeletePlayer}
              ></PlayerCard>
            )
          })}
        </View>

        <Button title="Add player" onPress={onAddPlayer}></Button>
        <Button title="Done" onPress={onDone}></Button>
      </KeyboardAwareScrollView>
      {/* <Text className={styles.addPlayers}>Hello</Text> */}
    </SafeAreaView>
  )
}
