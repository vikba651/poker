import { useEffect, useState, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Button, TextInput } from 'react-native'
import styles from './create-game-screen.scss'
import { io } from 'socket.io-client'
import AppContext from '../../context/AppContext'

// HTTP

export default function CreateGameScreen({ navigation, route }) {
  const SERVER_ADDR = 'http://192.168.0.11:8020'

  const { userName, serverState, socket, session, setSession, location } = useContext(AppContext)

  const [isCreator, setIsCreator] = useState(true)
  const [inputCode, setInputCode] = useState('')
  const [nearbyGameCode, setNearbyGameCode] = useState('')
  const [closeEnough, setCloseEnough] = useState(false)

  function createSession(name) {
    socket.emit('createSession', { name, location })
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
      setIsCreator(session.creator === userName)
    })

    socket.on('sendLocation', (serverLocation, code) => {
      let lat1 = serverLocation.coords.latitude
      let lon1 = serverLocation.coords.longitude
      let lat2 = location.coords.latitude
      let lon2 = location.coords.longitude

      let distance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)
      if (distance < 3) {
        setCloseEnough(true)
        setNearbyGameCode(code)
      }
    })

    socket.on('trackingStarted', () => {
      navigation.navigate('TrackGameScreen')
    })
  }, [])

  function startTracking() {
    if (session) {
      socket.emit('startTracking', { sessionId: session.id })
    }
    navigation.navigate('TrackGameScreen')
  }

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371 // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1) // deg2rad below
    var dLon = deg2rad(lon2 - lon1)
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c // Distance in km
    return d
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
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
              {closeEnough && (
                <TouchableOpacity className={styles.createSessionButton} onPress={() => joinSession(nearbyGameCode)}>
                  <Text className={styles.createPartyText}>Join nearby game with code {nearbyGameCode}</Text>
                </TouchableOpacity>
              )}
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
        {isCreator ? (
          <TouchableOpacity className={styles.startTrackingButton} onPress={() => startTracking()}>
            <Text className={styles.startTrackingText}>Start Tracking</Text>
          </TouchableOpacity>
        ) : (
          <Text>Wait for party leader to start game</Text>
        )}
      </View>
    </SafeAreaView>
  )
}
