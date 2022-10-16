import {
  Button,
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import React, { Component, useState } from "react";
import styles from "./start-screen.css";

export default function StartScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ marginBottom: 40, fontSize: 24 }}>
        What do you want to do?
      </Text>
      {/* <TextInput
        style={styles.inputField}
        onChangeText={setName}
        value={name}
      ></TextInput> */}
      <Button
        onPress={() => navigation.navigate("AddPlayersScreen")}
        title="Settle up"
      />
      <Text>or</Text>

      <Button
        onPress={() => navigation.navigate("TrackGameScreen")}
        title="Track poker game"
      />
    </SafeAreaView>
  );
}
