import { Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";

export default function Main({ navigation, route }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 40 }}>Welcome {route.params.name}</Text>
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
