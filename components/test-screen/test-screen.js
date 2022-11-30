import { useEffect, useState, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Button, TextInput } from 'react-native'
import styles from './test-screen.scss'
import { io } from 'socket.io-client'
import AppContext from '../../shared/AppContext'

// HTTP

export default function TestScreen({ navigation, route }) {
  const SERVER_ADDR = 'http://192.168.86.29:8020'

  const { user, socket, setSocket, serverState, session, setSession } = useContext(AppContext)

  const [inputCode, setInputCode] = useState('')

  function createSession(name) {
    socket.emit('createSession', { name })
  }

  function joinSession(code) {
    socket.emit('joinSession', { name: user.name, code })
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
  }, [socket])

  const [httpStatus, setHttpStatus] = useState('')

  const HttpTest = (name) => {
    fetch(`${SERVER_ADDR}/players/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
      .then(async (res) => {
        try {
          const jsonRes = await res.json()
          console.log(jsonRes)
          setHttpStatus(res.status)
          if (res.status === 200) {
            console.log('Good request, res:', jsonRes)
          }
        } catch (err) {
          console.log(err)
        }
      })
      .catch((err) => {
        console.log('error', err)
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text>{serverState}</Text>
      <View className={styles.boxShadow}>
        <View className={styles.card}>
          <Text className={styles.cardTitle}>Create session</Text>
          <Text>Session code: {session && session.code}</Text>

          <Button title="Create session" onPress={() => createSession(user.name)}></Button>
        </View>
      </View>
      <View className={styles.boxShadow}>
        <View className={styles.card}>
          <Text className={styles.cardTitle}>Join session</Text>
          <TextInput
            autoCapitalize={'characters'}
            placeholder="Enter session code"
            onChangeText={setInputCode}
            autoCorrect={false}
          ></TextInput>

          <Button title="Join session" onPress={() => joinSession(inputCode)}></Button>

          {session && (
            <>
              <Text className={styles.cardTitle}>Session Info</Text>
              <Text style={{ fontWeight: '800' }}>Creator:</Text>
              <Text>{session.creator}</Text>
              <Text style={{ fontWeight: '800', marginTop: 20 }}>Players:</Text>
              {session.players.map((player, i) => (
                <Text key={i}>{player}</Text>
              ))}
            </>
          )}
        </View>
      </View>
      <View className={styles.boxShadow}>
        <View className={styles.card}>
          <Text className={styles.cardTitle}>HTTP request</Text>
          <Button title="Test HTTP" onPress={() => HttpTest(user.name)}></Button>
          {httpStatus && <Text>Http status: {httpStatus}</Text>}
        </View>
      </View>
    </SafeAreaView>
  )
}
