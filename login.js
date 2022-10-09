import {
  Button,
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
import React, { Component, useState } from "react";

export default function StartScreen({ handleGo }) {
  const [name, setName] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <Text>Whats good?</Text>
      <Text>Enter your name:</Text>
      <TextInput
        style={styles.inputField}
        onChangeText={setName}
        value={name}
      ></TextInput>
      <View style={{ marginTop: 30 }}>
        <Button onPress={() => handleGo(name)} title="GO" />
      </View>
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
