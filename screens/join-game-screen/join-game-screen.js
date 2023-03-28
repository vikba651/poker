import { useEffect, useState, useContext } from 'react'
import { View, Text, SafeAreaView, TextInput } from 'react-native'
import styles from './join-game-screen.scss'
import AppContext from '../../shared/AppContext'
import SecondaryButton from '../../components/secondary-button/secondary-button'
import ComponentCard from '../../components/component-card/component-card'
import { UserGroupIcon, UserMinusIcon } from 'react-native-heroicons/outline'

export default function JoinGameScreen({ navigation, route }) {
  const {
    user,
    socket,
    location,
    serverState,
    session,
    setSession,
    setCreatedSession,
    joinedSessionRef,
    setJoinedSession,
  } = useContext(AppContext)

  const [inputCode, setInputCode] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [closeEnough, setCloseEnough] = useState(false)
  const [nearbyGameCode, setNearbyGameCode] = useState('')

  function joinSession(code) {
    socket.emit('joinSession', { name: user.name, code }, (session) => {
      setSession(session)
      setCreatedSession(false)
      setJoinedSession(true)
    })
  }

  function leaveSession(code) {
    socket.emit('leaveSession', { name: user.name, code }, () => {
      setJoinedSession(false)
      setSession(null)
      setErrorMessage('Left party')
    })
  }

  useEffect(() => {
    socket.on('message', (message) => {
      setErrorMessage(message)
    })

    socket.on('trackingStarted', (session) => {
      if (navigation.getState().routes[navigation.getState().index].name === 'JoinGameScreen') {
        navigation.navigate('TrackGameScreen', { loading: true })
      }
      updateSession(session)
    })

    function updateSession(session) {
      if (
        session &&
        session.players.find((player) => {
          return user.name == player.name
        })
      ) {
        setSession(session)
      } else {
        setSession(null)
        setErrorMessage('Party was disbanded')
        setJoinedSession(false)
      }
    }

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

    return () => {
      socket.removeAllListeners('sendLocation')
      socket.removeAllListeners('message')
    }
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
      {!session || !joinedSessionRef.current ? (
        <View className={styles.noPartyView}>
          <Text className={styles.partyCodeTitle}>Party code</Text>
          <View className={styles.inputBox}>
            <TextInput
              className={styles.inputField}
              value={inputCode}
              autoCapitalize={'characters'}
              placeholder="Enter code here"
              onChangeText={setInputCode}
              autoCorrect={false}
            />
          </View>
          <SecondaryButton
            title="Join Party"
            onPress={() => joinSession(inputCode)}
            icon={<UserGroupIcon className={styles.joinSessionIcon} color="white" size={20} />}
          />
          <Text className={styles.errorMessage}>{errorMessage}</Text>
          {/* {closeEnough && (
            <SecondaryButton title="Join nearby party" onPress={() => joinSession(nearbyGameCode)}></SecondaryButton>
            <TouchableOpacity className={styles.createSessionButton} onPress={() => joinSession(nearbyGameCode)}>
              <Text className={styles.createPartyText}>Join nearby party with code {nearbyGameCode}</Text>
            </TouchableOpacity>
          )} */}
        </View>
      ) : (
        <ComponentCard
          content={
            <View style={styles.partyView}>
              <View style={{ alignItems: 'center', width: '100%' }}>
                <Text className={styles.sessionCodeTitle}>Party code:</Text>
                <View className={styles.sessionCodeBox}>
                  <Text className={styles.sessionCode}>{session.code}</Text>
                </View>
                <View className={styles.separator} />
              </View>
              <View className={styles.sessionMembersView}>
                <Text className={styles.sessionMembersText}>Party Members</Text>
                {session.players.map((player, i) => (
                  <Text key={i}>
                    {player.name} {player.name === user.name && '(you)'}
                  </Text>
                ))}
              </View>
              <View className={styles.leaveSessionButton}>
                <SecondaryButton
                  title="Leave Party"
                  onPress={() => leaveSession(session.code)}
                  icon={<UserMinusIcon className={styles.createSessionIcon} color="white" size={20} />}
                  color="red"
                />
              </View>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}
