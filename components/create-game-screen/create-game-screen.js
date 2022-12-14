import { useEffect, useState, useContext } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Button, TextInput } from 'react-native'
import styles from './create-game-screen.scss'
import AppContext from '../../shared/AppContext'
import { UserGroupIcon } from 'react-native-heroicons/outline'
import MainButton from '../main-button/main-button'

// HTTP

export default function CreateGameScreen({ navigation, route }) {
  const { user, serverState, socket, session, setSession, location } = useContext(AppContext)

  const [isCreator, setIsCreator] = useState(true)
  const [sessionCreated, setSessionCreated] = useState(false)
  const [inputCode, setInputCode] = useState('')
  const [nearbyGameCode, setNearbyGameCode] = useState('')
  const [closeEnough, setCloseEnough] = useState(false)

  function onCreateSession() {
    // socket.emit('createSession', { name: user.name, location })
    setSessionCreated(true)
  }

  function onJoinSession(code) {
    socket.emit('joinSession', { name: user.name, code })
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
      setIsCreator(session.creator === user.name)
    })

    socket.on('sendLocation', (serverLocation, code) => {
      if (!location || !serverLocation) {
        return
      }
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

    // Always create session, even if using the app alone
    // maybe we should just do a post request to save a round instead
    socket.emit('createSession', { name: user.name, location })
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
          {!sessionCreated && (
            <View className={styles.noSessionView}>
              <Text>Are you playing with friends?</Text>
              <TouchableOpacity className={styles.createSessionButton} onPress={() => onCreateSession()}>
                <Text className={styles.createPartyText}>Create party</Text>
                <UserGroupIcon className={styles.createPartyIcon} color="white" size={20} />
              </TouchableOpacity>
              {closeEnough && (
                <TouchableOpacity className={styles.createSessionButton} onPress={() => onJoinSession(nearbyGameCode)}>
                  <Text className={styles.createPartyText}>Join nearby party with code {nearbyGameCode}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {sessionCreated && (
            <>
              <View style={{ alignItems: 'center' }}>
                <Text>Party code:</Text>
                <Text className={styles.sessionCode}>{session.code}</Text>
              </View>
              <View className={styles.sessionInfo}>
                <Text className={styles.partyMembersText}>Party Members</Text>
                <Text style={{ fontWeight: '800' }}>Players:</Text>
                {session.players.map((player, i) => (
                  <Text key={i}>
                    {player.name} {player.name === user.name && '(you)'}
                  </Text>
                ))}
              </View>
            </>
          )}
        </View>
      </View>
      <View className={styles.boxShadow}>
        <View className={styles.card}>
          <Text className={styles.cardTitle}>Join party</Text>
          <TextInput
            autoCapitalize={'characters'}
            placeholder="Enter party code"
            onChangeText={setInputCode}
            autoCorrect={false}
          ></TextInput>

          <Button title="Join party" onPress={() => onJoinSession(inputCode)}></Button>
        </View>
      </View>
      <View>
        {isCreator ? (
          <MainButton title="Start tracking" onPress={() => startTracking()} />
        ) : (
          <Text>Wait for party leader to start game</Text>
        )}
      </View>
    </SafeAreaView>
  )
}
