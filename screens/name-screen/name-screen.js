import { SafeAreaView, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import styles from './name-screen.scss'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppContext from '../../shared/AppContext'
import { getPlayer, createPlayer } from '../../shared/api'
import PrimaryButton from '../../components/primary-button/primary-button'
import { ArrowRightIcon } from 'react-native-heroicons/outline'

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
        getPlayer(value).then((player) => {
          setUserName(value)
          if (player) {
            setUser(player)
          }
        })
        navigation.navigate('StartScreen')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const saveUserName = async (name) => {
    console.log('something')
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
          onSubmitEditing={() => onGetStarted()}
          autoCorrect={false}
        />
      </View>
      <PrimaryButton
        title="Here we go"
        onPress={() => onGetStarted()}
        icon={<ArrowRightIcon className={styles.icon} color="black" size={30} strokeWidth={2} />}
      />
    </SafeAreaView>
  )
}
