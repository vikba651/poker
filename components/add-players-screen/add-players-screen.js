import {
  Text,
  View,
  TextInput,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'

import styles from './add-players-screen.scss'

export default function AddPlayersScreen({ navigation, route }) {
  const [playerCount, setPlayerCount] = useState(3) // Add players here

  const name = route.params.name
  const [players, setPlayers] = useState(
    Array.from({ length: playerCount }, (_, i) => {
      return {
        id: i,
        name: i ? '' : name,
        buyIn: 0,
        chipsLeft: 0,
      }
    })
  )

  useEffect(() => {
    let newPlayers = [...players]
    newPlayers[0].name = route.params.name
    setPlayers(newPlayers)
  }, [route])

  function onAddPlayer() {
    setPlayerCount(playerCount + 1)
    const newPlayers = [
      ...players,
      { id: playerCount, name: '', buyIn: 0, chipsLeft: 0 },
    ]
    setPlayers(newPlayers)
  }

  function onDeletePlayer(id) {
    if (players.length > 2) {
      const newPlayers = players.filter((player) => player.id != id)
      setPlayers(newPlayers)
    } else {
      alert('You need at least 2 players to play poker!')
    }
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

  function onSetDefaultBuyIn(text) {
    let newPlayers = [...players]

    if (
      newPlayers.length -
        newPlayers.filter((player) => player.buyIn === 0).length ===
      1
    ) {
      newPlayers = newPlayers.map((player) => {
        return {
          id: player.id,
          name: player.name,
          buyIn: text,
          player: player.chipsLeft,
        }
      })
    }
    setPlayers(newPlayers)
  }

  function onChangeChipsLeft(text, id) {
    let newPlayers = [...players]
    newPlayers.find((player) => player.id == id).chipsLeft = text
    setPlayers(newPlayers)
  }

  function onDone() {
    if (players.length > 0) {
      const potTotal = players
        .map((player) => +player.buyIn)
        .reduce((a, b) => a + b)
      const chipsLeftTotal = players
        .map((player) => +player.chipsLeft)
        .reduce((a, b) => a + b)

      if (potTotal === 0) {
        alert(`Total pot is 0, add some 'buy ins'!`)
      } else if (potTotal !== chipsLeftTotal) {
        alert(
          `Total pot (${potTotal}) is not equal to total chips left (${chipsLeftTotal})`
        )
      } else {
        navigation.navigate('SettleUpScreen', {
          players,
          name: route.params.name,
        })
      }
    }
  }

  return (
    <SafeAreaView className={styles.container}>
      <Text className={styles.addPlayers}>Add players</Text>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View className={styles.scrollView}>
          {players.map((player, i) => {
            return (
              <View key={player.id} className={styles.playerCard}>
                <View className={styles.topRow}>
                  <TextInput
                    key={'name' + player.id}
                    onChangeText={(text) => onChangeName(text, player.id)}
                    value={player.name}
                    placeholder="Player name"
                    maxLength={25}
                    className={styles.textInput}
                    style={{ flexGrow: 2 }}
                  />
                  <TouchableOpacity onPress={() => onDeletePlayer(player.id)}>
                    <Text className={styles.deleteButton}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <View className={styles.bottomRow}>
                  <TextInput
                    key={'buyIn' + player.id}
                    keyboardType="numeric"
                    onChangeText={(text) => onChangeBuyIn(text, player.id)}
                    value={player.buyIn}
                    placeholder="Buy in"
                    maxLength={10}
                    className={[styles.textInput, styles.bottomRowInput]}
                    style={{ marginRight: 10 }}
                    autoFocus={i === 0}
                  />
                  <TextInput
                    key={'chipsLeft' + player.id}
                    keyboardType="numeric"
                    onChangeText={(text) => onChangeChipsLeft(text, player.id)}
                    value={player.chipsLeft}
                    placeholder="Chips left"
                    maxLength={10}
                    className={[styles.textInput, styles.bottomRowInput]}
                  />
                </View>
              </View>
            )
          })}
        </View>
        <Button title="Add player" onPress={onAddPlayer}></Button>
        <Button title="Done" onPress={onDone}></Button>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
