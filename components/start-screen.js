import {
  Button,
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import React, { Component, useState } from "react";

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
        onPress={() => navigation.navigate("SettleUpScreen")}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  inputField: {
    backgroundColor: "white",
    padding: 5,
    marginTop: 5,
    minWidth: "30%",
  },
});
