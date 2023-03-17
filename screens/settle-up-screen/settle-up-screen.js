import { Text, View, ScrollView, Button } from 'react-native'
import React from 'react'
import styles from './settle-up-screen.scss'

export default function SettleUpScreen({ navigation, route }) {
  let players = route.params.players

  const addPlayerDept = (sourceId, targetId, amount) => {
    return players.map((player) => {
      if (player.id === sourceId) {
        let newPlayer = { ...player }
        newPlayer.debts.push({
          to: targetId,
          amount,
        })
        return newPlayer
      }
      return player
    })
  }

  const settleDebts = () => {
    let negBals = []
    let posBals = []
    players = players.map((player) => {
      const balance = player.chipsLeft - player.buyIn
      if (balance < 0) {
        negBals.push({
          id: player.id,
          balance: -balance,
          name: player.name,
        })
      } else if (balance > 0) {
        posBals.push({
          id: player.id,
          balance: balance,
          name: player.name,
        })
      }
      return {
        ...player,
        debts: [],
      }
    })
    negBals = negBals.sort(function (a, b) {
      return a.balance - b.balance
    })
    posBals = posBals.sort(function (a, b) {
      return a.balance - b.balance
    })

    negBals.forEach((negBal) => {
      while (negBal.balance > posBals[0].balance) {
        players = addPlayerDept(negBal.id, posBals[0].id, posBals[0].balance)
        negBal.balance -= posBals[0].balance
        posBals = posBals.slice(1)
      }
      if (negBal.balance !== 0) {
        players = addPlayerDept(negBal.id, posBals[0].id, negBal.balance)
        posBals[0].balance -= negBal.balance
        negBal.balance = 0
      }
    })
  }

  settleDebts()

  function onBackToStart() {
    // Send ping to trigger update of StartScreen
    navigation.navigate('StartScreen', { ping: route.params.ping ? route.params.ping + 1 : 0 })
  }

  function getName(id) {
    return players.filter((player) => player.id === id).map((player) => player.name)
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {players.map((player) => {
        if (player.debts.length > 0) {
          return (
            <View key={player.id} style={{ flexDirection: 'row', marginBottom: 20 }}>
              <Text style={{ fontWeight: 'bold' }} key={player.id}>
                {player.name + ' '}
              </Text>
              <Text>
                {'should swish '}
                {player.debts.map((debt, i) => {
                  return (
                    <Text key={i}>
                      <Text style={{ fontWeight: 'bold' }}>
                        {debt.amount} to {getName(debt.to)}{' '}
                      </Text>
                      <Text>{i !== player.debts.length - 1 && 'and '}</Text>
                    </Text>
                  )
                })}
              </Text>
            </View>
          )
        }
      })}
      <Button title="Back to Start" onPress={onBackToStart}></Button>
    </ScrollView>
  )
}
