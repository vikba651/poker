import { Text, SafeAreaView, StyleSheet } from "react-native";
import React from "react";
import styles from "./track-game-screen.css";

export default function TrackGameScreen({ navigation, route }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 40 }}>TrackGameScreen </Text>
    </SafeAreaView>
  );
}
