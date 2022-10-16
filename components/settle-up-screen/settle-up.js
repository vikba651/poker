import { Text, View, ScrollView, Button } from "react-native";
import React from "react";
import styles from "./settle-up.scss";

export default function SettleUpScreen({ navigation, route }) {
  const players = route.params.players;
  console.log(players)

  function onBackToStart() {
    navigation.navigate("StartScreens");

  }


  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      {players.map((player) => {
        return (
          <Text>
            {player.name} should swish *insert money calculating algo here* to person
          </Text>
          
        );
      })}
      <Button title="Back to Start" onPress={onBackToStart}></Button>

    </ScrollView>
  );
}
