import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";

export default function Main({ name }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 40 }}>Welcome {name}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "lightblue",
  },
});
