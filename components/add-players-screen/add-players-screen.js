import { Text, View, ScrollView, Button } from "react-native";
import React, { useState } from "react";
import styles from "./add-players-screen.css";
import PlayerCard from "../player-card/player-card";

export default function AddPlayersScreen({ navigation, route }) {
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

  function onDeletePlayer(id) {
    const newPlayers = players.filter((player) => player.id != id);
    setPlayers(newPlayers);
  }

  function onChangeName(text, id) {
    let newPlayers = [...players];
    newPlayers.find((player) => player.id == id).name = text;
    setPlayers(newPlayers);
  }

  function onChangeBuyIn(text, id) {
    let newPlayers = [...players];
    newPlayers.find((player) => player.id == id).buyIn = text;
    setPlayers(newPlayers);
  }

  function onChangeChipsLeft(text, id) {
    let newPlayers = [...players];
    newPlayers.find((player) => player.id == id).chipsLeft = text;
    setPlayers(newPlayers);
  }

  function onDone() {
    console.log(players);
    if (players) {
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
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Text className={styles.addPlayers}>Add players</Text>
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
        );
      })}

      <Button title="Add player" onPress={onAddPlayer}></Button>
      <Button title="Done" onPress={onDone}></Button>
    </ScrollView>
  );
}
