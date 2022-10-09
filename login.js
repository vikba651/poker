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
  const [name, setName] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <Text>Whats good my man?</Text>
      <Text>Enter your name:</Text>
      <TextInput
        style={styles.inputField}
        onChangeText={setName}
        value={name}
      ></TextInput>
      <View style={styles.buttonView}>
        <Button
          onPress={() => navigation.navigate("Main", { name })}
          title="GO"
        />
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
