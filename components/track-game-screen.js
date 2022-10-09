import { Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";

export default function TrackGameScreen({ navigation, route }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 40 }}>TrackGameScreen </Text>
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
