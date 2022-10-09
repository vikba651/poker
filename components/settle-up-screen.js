import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Button,
} from "react-native";
import React, { useState } from "react";

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ marginBottom: 40, fontSize: 30 }}>Add players</Text>
      {players.map((player) => {
        return (
          <View key={player.id} style={styles.player}>
            <TextInput
              key={"name" + player.id}
              onChangeText={(text) => onChangeName(text, player.id)}
              value={player.name}
              placeholder="Player name"
              maxLength={20}
              style={{ marginBottom: 20, marginRight: 10 }}
            />
            <TextInput
              key={"buyIn" + player.id}
              keyboardType="numeric"
              onChangeText={(text) => onChangeBuyIn(text, player.id)}
              value={player.buyIn}
              placeholder="Buy in"
              maxLength={10}
              style={{ marginBottom: 20, marginRight: 10 }}
            />
            <TextInput
              key={"chipsLeft" + player.id}
              keyboardType="numeric"
              onChangeText={(text) => onChangeChipsLeft(text, player.id)}
              value={player.chipsLeft}
              placeholder="Chips left"
              maxLength={10}
              style={{ marginBottom: 20 }}
            />
          </View>
        );
      })}

      <Button title="Add player" onPress={onAddPlayer}></Button>
      <Button title="Done" onPress={() => console.log(players)}></Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightblue",
  },
  player: {
    display: "flex",
    flexDirection: "row",
  },
});
