import { TouchableOpacity, SafeAreaView, Text, TextInput, View} from 'react-native'
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
  const [prompt, setPrompt] = useState("What's your name?")

  useEffect(() => {
    getData()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Text className={styles.titleText}>Pokerdex</Text>
      <Text className={styles.prompt}>{prompt}</Text>
      <Text className={styles.promptSubText}>This will be displayed to your friends.</Text>
      <View className={styles.inputBox}> 
      <TextInput
        onChangeText={setName}
        value={name}
        placeholder="Type your name here..."
        maxLength={25}
        autoFocus={true}
        className={styles.inputField}
        />
        </View>
      <TouchableOpacity
      className = {styles.opaqueButton}
        onPress={() => {
          if (name.length < 2) {
            setPrompt(`'${name}' is not valid.`)
          } else {
            storeData(name)
            navigation.navigate('StartScreen', { name: name })
          }
        }}
      >
        <Text className = {styles.buttonText}>Let's get started!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
