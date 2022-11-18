import { useEffect, useState, useRef } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Button, TextInput } from 'react-native'
import styles from './test-screen.scss'
import { io } from 'socket.io-client'

// HTTP

export default function TestScreen({ navigation, route }) {
  const SERVER_ADDR = 'http://192.168.0.11:8020'

  const name = route.params.name
  const socket = useRef(io(SERVER_ADDR)).current
  const [serverState, setServerState] = useState('Loading Websocket...')

  const [inputCode, setInputCode] = useState('')
  const [session, setSession] = useState(null)

  function createSession(name) {
    socket.emit('createSession', { name })
  }

  function joinSession(code) {
    socket.emit('joinSession', { name, code })
  }

  useEffect(() => {
    // socket.onmessage = (e) => {
    //   // serverMessagesList.push(e.data)
    //   // setServerMessages([...serverMessagesList])
    //   console.log('server message', e.data)
    // }

    socket.on('connect', () => {
      setServerState('Connected to Websocket')
    })

    socket.on('disconnect', () => {
      setServerState('Disconnected from Websocket')
    })

    socket.on('message', (message) => {
      console.log('Websocket server', message)
    })

    socket.on('sessionCreated', (session) => {
      setSession(session)
    })

    socket.on('sessionUpdated', (session) => {
      setSession(session)
    })
  }, [])

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

          <Button title="Create session" onPress={() => createSession(name)}></Button>
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
          <Button title="Test HTTP" onPress={() => HttpTest(name)}></Button>
          {httpStatus && <Text>Http status: {httpStatus}</Text>}
        </View>
      </View>
    </SafeAreaView>
  )
}
