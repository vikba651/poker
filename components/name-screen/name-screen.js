import { TouchableOpacity, SafeAreaView, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import styles from './name-screen.scss'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppContext, { SERVER_ADDR } from '../../shared/AppContext'
import { getPlayer, createPlayer } from '../../shared/api'

export default function NameScreen({ navigation }) {
  const [prompt, setPrompt] = useState('This will be displayed to your friends.')
  const [userName, setUserName] = useState('')
  const { setUser } = useContext(AppContext)

  useEffect(() => {
    loadUserName()
  }, [])

  const loadUserName = async () => {
    try {
      const value = await AsyncStorage.getItem('userName')
      if (value !== null) {
        const player = await getPlayer(value)
        if (player) {
          setUserName(player.name)
          setUser(player)
          navigation.navigate('StartScreen')
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const saveUserName = async (name) => {
    try {
      await AsyncStorage.setItem('userName', name)
      let player = await getPlayer(name)
      if (!player) {
        player = await createPlayer(name)
      }
      if (player) {
        setUser(player)
      }
      navigation.navigate('StartScreen')
    } catch (e) {
      console.log(e)
    }
  }

  const onGetStarted = () => {
    if (userName.length > 1) {
      saveUserName(userName)
    } else {
      setPrompt(`'${userName}' is not valid.`)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text className={styles.titleText}>Pokerdex</Text>
      <Text className={styles.prompt}>What's your name?</Text>
      <Text className={styles.promptSubText}>{prompt}</Text>
      <View className={styles.inputBox}>
        <TextInput
          onChangeText={setUserName}
          value={userName}
          placeholder="Type your name here..."
          maxLength={25}
          autoFocus={true}
          className={styles.inputField}
          returnKeyType="go"
        />
      </View>
      <TouchableOpacity className={styles.opaqueButton} onPress={() => onGetStarted()}>
        <Text className={styles.buttonText}>Go</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
