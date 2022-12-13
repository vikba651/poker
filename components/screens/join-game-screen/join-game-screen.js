import { useEffect, useState, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Button, TextInput } from 'react-native'
import styles from './join-game-screen.scss'
import { io } from 'socket.io-client'
import AppContext, { SERVER_ADDR } from '../../../shared/AppContext'
import SecondaryButton from '../../custom-components/secondary-button/secondary-button'

// HTTP

export default function TestScreen({ navigation, route }) {
  const { user, socket, setSocket, serverState, session, setSession } = useContext(AppContext)

  const [inputCode, setInputCode] = useState('')

  function joinSession(code) {
    socket.emit('joinSession', { name: user.name, code })
  }

  function leaveSession(code) {
    // TODO: Add functionality to be able to leave session
  }

  useEffect(() => {
    socket.on('message', (message) => {
      console.log('Websocket server', message)
    })

    socket.on('sessionCreated', (session) => {
      setSession(session)
    })

    socket.on('sessionUpdated', (session) => {
      setSession(session)
    })
    socket.on('trackingStarted', () => {
      navigation.navigate('TrackGameScreen')
    })
  }, [socket])

  return (
    <SafeAreaView style={styles.container}>
      <Text>{serverState}</Text>
      <View className={styles.boxShadow}>
        <View className={styles.card}>
          <Text className={styles.cardTitle}>Join session</Text>
          <TextInput
            autoCapitalize={'characters'}
            placeholder="Enter session code"
            onChangeText={setInputCode}
            autoCorrect={false}
          ></TextInput>

          {!session && <SecondaryButton title="Join session" onPress={() => joinSession(inputCode)} />}
          {session && <SecondaryButton title="Leave session" onPress={() => leaveSession(inputCode)} color="red" />}
        </View>
      </View>
      {session && (
        <View className={styles.boxShadow}>
          <View className={styles.card}>
            <>
              <Text className={styles.cardTitle}>Session Info</Text>
              <Text style={{ fontWeight: '800' }}>Creator:</Text>
              <Text>{session.creator}</Text>
              <Text style={{ fontWeight: '800', marginTop: 20 }}>Players:</Text>
              {session.players.map((player, i) => (
                <Text key={i}>{player.name}</Text>
              ))}
            </>
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}
