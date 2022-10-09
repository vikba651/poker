import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import StartScreen from "./login";
import Main from "./main";

export default function App() {
  const [view, setView] = useState("LAUNCH");
  const [name, setName] = useState("");

  const handleGo = (name) => {
    setView("MAIN");
    setName(name);
  };

  return (
    <>
      {view === "LAUNCH" && <StartScreen handleGo={handleGo} />}
      {view === "MAIN" && <Main name={name} />}
    </>
  );
}
