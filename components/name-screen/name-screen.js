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
        navigation.navigate('StartScreen', { name: value })
      }
    } catch (e) {}
  }
  const [name, setName] = useState('')
  const [prompt, setPrompt] = useState("Welcome, what's your name?")

  useEffect(() => {
    getData()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text className={styles.prompt}>{prompt}</Text>
      <TextInput
        onChangeText={setName}
        value={name}
        placeholder="Name"
        maxLength={25}
        autoFocus={true}
        className={styles.inputField}
      />
      <Button
        onPress={() => {
          if (name.length < 2) {
            setPrompt(`'${name}' is not valid.`)
          } else {
            storeData(name)
            navigation.navigate('StartScreen', { name: name })
          }
        }}
        title="Go"
      />
    </SafeAreaView>
  )
}
