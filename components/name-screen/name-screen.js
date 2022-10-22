import { Button, SafeAreaView, Text, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from './name-screen.scss'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function NameScreen({ navigation }) {
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@storage_Key', value)
    } catch (e) {
      // saving error
    }
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key')
      if (value !== null) {
        setName(value)
        navigation.navigate('StartScreens', { name: value })
      }
    } catch (e) {}
  }
  const [name, setName] = useState('')
  const [prompt, setPrompt] = useState("Welcome, what's your name?")

  useEffect(() => {
    getData()
    if (name.length < 2) {
    }
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ marginBottom: 40, fontSize: 24 }}>{prompt}</Text>
      <TextInput
        onChangeText={setName}
        value={name}
        placeholder="Name"
        maxLength={25}
        className={styles.textInput}
        style={{ flexGrow: 2 }}
      />
      <Button
        onPress={() => {
          if (name.length < 2) {
            setPrompt(`${name} is not valid.`)
          }
          storeData(name)
          navigation.navigate('StartScreens', { name: name })
        }}
        title="Play"
      />
    </SafeAreaView>
  )
}
