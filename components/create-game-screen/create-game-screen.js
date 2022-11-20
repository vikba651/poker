import { useEffect, useState, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Button, TextInput } from 'react-native'
import styles from './create-game-screen.scss'
import { io } from 'socket.io-client'
import AppContext from '../../context/AppContext'

// HTTP

export default function CreateGameScreen({ navigation, route }) {
  const SERVER_ADDR = 'http://192.168.86.29:8020'

  const { userName } = useContext(AppContext)
  const { serverState } = useContext(AppContext)

  const [inputCode, setInputCode] = useState('')
  const { socket } = useContext(AppContext)
  const { session, setSession } = useContext(AppContext)

  function createSession(name) {
    socket.emit('createSession', { name })
  }

  function joinSession(code) {
    socket.emit('joinSession', { name: userName, code })
  }

  useEffect(() => {

    socket.on('message', (message) => {
      console.log('Websocket message: ', message)
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
        <View className={styles.lobbyView}>
          {!session && (
            <View className={styles.noSessionView}>
              <Text>Are you playing with friends?</Text>
              <TouchableOpacity className={styles.createSessionButton} onPress={() => createSession(userName)}>
                <Text className={styles.createPartyText}>Create party</Text>
              </TouchableOpacity>
            </View>
          )}
          {session && (
            <>
              <View style={{ alignItems: 'center' }}>
                <Text>Session code:</Text>
                <Text className={styles.sessionCode}>{session.code}</Text>
              </View>
              <View className={styles.sessionInfo}>
                <Text className={styles.partyMembersText}>Party Members</Text>
                <Text style={{ fontWeight: '800' }}>Players:</Text>
                {session.players.map((player, i) => (
                  <Text key={i}>
                    {player} {player === userName && '(you)'}
                  </Text>
                ))}
              </View>
            </>
          )}
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
        </View>
      </View>
      <View>
        <TouchableOpacity
          className={styles.startTrackingButton}
          onPress={() => navigation.navigate('TrackGameScreen', { session })}
        >
          <Text className={styles.startTrackingText}>Start Tracking</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
