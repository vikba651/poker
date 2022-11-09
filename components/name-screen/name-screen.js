import { TouchableOpacity, SafeAreaView, Text, TextInput, View } from 'react-native'
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
  const [prompt, setPrompt] = useState('This will be displayed to your friends.')

  useEffect(() => {
    getData()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text className={styles.titleText}>Pokerdex</Text>
      <Text className={styles.prompt}>What's your name?</Text>
      <Text className={styles.promptSubText}>{prompt}</Text>
      <View className={styles.inputBox}>
        <TextInput
          onChangeText={setName}
          value={name}
          placeholder="Type your name here..."
          maxLength={25}
          autoFocus={true}
          className={styles.inputField}
          returnKeyType="go"
        />
      </View>
      <TouchableOpacity
        className={styles.opaqueButton}
        onPress={() => {
          if (name.length < 2) {
            setPrompt(`'${name}' is not valid.`)
          } else {
            storeData(name)
            navigation.navigate('StartScreen', { name: name })
          }
        }}
      >
        <Text className={styles.buttonText}>Let's get started!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
