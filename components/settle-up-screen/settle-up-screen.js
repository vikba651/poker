import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Button,
} from "react-native";
import React, { useState } from "react";
import styles from "./settle-up-screen.css";

export default function SettleUpScreen({ navigation, route }) {
  const [playerCount, setPlayerCount] = useState(1);

  const [players, setPlayers] = useState([
    {
      id: 0,
      name: "",
      buyIn: 0,
      chipsLeft: 0,
    },
  ]);

  function onAddPlayer() {
    setPlayerCount(playerCount + 1);
    const newPlayers = [
      ...players,
      { id: playerCount, name: "", buyIn: 0, chipsLeft: 0 },
    ];
    setPlayers(newPlayers);
  }

  function onChangeName(text, id) {
    let newPlayers = [...players];
    newPlayers[id].name = text;
    setPlayers(newPlayers);
  }

  function onChangeBuyIn(text, id) {
    let newPlayers = [...players];
    newPlayers[id].buyIn = text;
    setPlayers(newPlayers);
  }

  function onChangeChipsLeft(text, id) {
    let newPlayers = [...players];
    newPlayers[id].chipsLeft = text;
    setPlayers(newPlayers);
  }

  function onDone() {
    console.log(players);
    const potTotal = players
      .map((player) => +player.buyIn)
      .reduce((a, b) => a + b);
    const chipsLeftTotal = players
      .map((player) => +player.chipsLeft)
      .reduce((a, b) => a + b);

    if (potTotal !== chipsLeftTotal) {
      console.log(
        `Total pot (${potTotal}) is not equal to total chips left (${chipsLeftTotal})`
      );
    }
  }

  return (
    <SafeAreaView className={styles.container}>
      <Text style={{ marginBottom: 40, fontSize: 30 }}>Add players</Text>
      {players.map((player) => {
        return (
          <View key={player.id} className={styles.player}>
            <TextInput
              key={"name" + player.id}
              onChangeText={(text) => onChangeName(text, player.id)}
              value={player.name}
              placeholder="Player name"
              maxLength={20}
              className={styles.textInput}
            />
            <TextInput
              key={"buyIn" + player.id}
              keyboardType="numeric"
              onChangeText={(text) => onChangeBuyIn(text, player.id)}
              value={player.buyIn}
              placeholder="Buy in"
              maxLength={10}
              className={styles.textInput}
            />
            <TextInput
              key={"chipsLeft" + player.id}
              keyboardType="numeric"
              onChangeText={(text) => onChangeChipsLeft(text, player.id)}
              value={player.chipsLeft}
              placeholder="Chips left"
              maxLength={10}
              style={{ marginBottom: 20 }}
              className={styles.textInput}
            />
          </View>
        );
      })}

      <Button title="Add player" onPress={onAddPlayer}></Button>
      <Button title="Done" onPress={onDone}></Button>
    </SafeAreaView>
  );
}
