import { useEffect, useState, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Button, TextInput } from 'react-native'
import styles from './join-game-screen.scss'
import { io } from 'socket.io-client'
import AppContext, { SERVER_ADDR } from '../../shared/AppContext'
import SecondaryButton from '../../components/secondary-button/secondary-button'

// HTTP

export default function TestScreen({ navigation, route }) {
  const { user, socket, location, serverState, session, setSession } = useContext(AppContext)

  const [inputCode, setInputCode] = useState('')
  const [closeEnough, setCloseEnough] = useState(false)
  const [nearbyGameCode, setNearbyGameCode] = useState('')

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

    socket.on('sendLocation', (serverLocation, code) => {
      console.log('I AM HERE')
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
  }, [socket])

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
          {closeEnough && (
            <SecondaryButton title="Join nearby party" onPress={() => joinSession(nearbyGameCode)}></SecondaryButton>
            // <TouchableOpacity className={styles.createSessionButton} onPress={() => joinSession(nearbyGameCode)}>
            //   <Text className={styles.createPartyText}>Join nearby party with code {nearbyGameCode}</Text>
            // </TouchableOpacity>
          )}
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
