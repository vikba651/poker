import { useEffect, useState, useContext } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, Button, Switch } from 'react-native'
import styles from './create-game-screen.scss'
import AppContext from '../../shared/AppContext'
import { UserGroupIcon, UserMinusIcon } from 'react-native-heroicons/outline'
import PrimaryButton from '../../components/primary-button/primary-button'
import SecondaryButton from '../../components/secondary-button/secondary-button'
import { ArrowRightIcon } from 'react-native-heroicons/solid'
import ComponentCard from '../../components/component-card/component-card'

// HTTP

export default function CreateGameScreen({ navigation, route }) {
  const {
    user,
    serverState,
    socket,
    session,
    setSession,
    location,
    createdSession,
    setCreatedSession,
    joinedSession,
    setJoinedSession,
  } = useContext(AppContext)

  const [settings, setSettings] = useState({
    ingameStats: true,
    spectatorMode: false,
    otherSetting: false,
  })

  useEffect(() => {
    // Always create session, even if using the app alone
    // maybe we should just do a post request to save a round instead
    if (!session) {
      socket.emit('createSession', { name: user.name, location }, (session) => {
        setSession(session)
      })
    }
  }, [socket])

  function onCreateSession() {
    if (joinedSession && session) {
      socket.emit('leaveSession', { name: user.name, code: session.code }, () => {
        socket.emit('createSession', { name: user.name, location }, (session) => {
          setSession(session)
          setCreatedSession(true)
        })
      })
    } else {
      setCreatedSession(true)
    }
    setJoinedSession(false)
  }

  function onDisbandParty() {
    socket.emit('disbandSession', { code: session.code })
    setCreatedSession(false)
    socket.emit('createSession', { name: user.name, location }, (session) => {
      setSession(session)
    })
  }

  function startTracking() {
    if (session) {
      if (joinedSession) {
        // Leave joined session and create a solo session
        socket.emit('leaveSession', { name: user.name, code: session.code })
        socket.emit('createSession', { name: user.name, location }, (session) => {
          setSession(session)
          navigation.navigate('TrackGameScreen')
        })
      } else {
        socket.emit('startTracking', { sessionId: session.id })
        navigation.navigate('TrackGameScreen')
      }
    }
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
      <ComponentCard
        content={
          <View className={styles.sessionCard}>
            {!createdSession && (
              <View className={styles.noSessionView}>
                <Text>Are you playing with friends?</Text>
                <SecondaryButton
                  title="Create Party"
                  onPress={() => onCreateSession()}
                  icon={<UserGroupIcon className={styles.createSessionIcon} color="white" size={20} />}
                />
              </View>
            )}
            {createdSession && (
              <View style={{ height: '165%' }}>
                {/* Thats some good styling ^ */}
                <View style={{ alignItems: 'center' }}>
                  <Text className={styles.sessionCodeTitle}>Party code:</Text>
                  <View className={styles.sessionCodeBox}>
                    <Text className={styles.sessionCode}>{session.code}</Text>
                  </View>
                  <View className={styles.separator}></View>
                </View>
                <View className={styles.sessionInfo}>
                  <Text className={styles.sessionMembersText}>Party Members</Text>
                  {session.players.map((player, i) => (
                    <Text key={i}>
                      {player.name} {player.name === user.name && '(you)'}
                    </Text>
                  ))}
                </View>
                <View style={{ alignItems: 'center' }}>
                  <SecondaryButton
                    title="Disband Party"
                    className={styles.disbandSessionButton}
                    onPress={() => onDisbandParty()}
                    icon={<UserMinusIcon className={styles.createSessionIcon} color="white" size={20} />}
                    color="red"
                  />
                </View>
              </View>
            )}
          </View>
        }
      ></ComponentCard>
      <ComponentCard
        title={'Game settings'}
        content={
          <View className={styles.settingsCard}>
            <View className={styles.settingsRow}>
              <Text>Show ingame statistics</Text>
              <Switch
                trackColor={{ false: '#E9E9EA', true: '#65C466' }}
                ios_backgroundColor="#E9E9EA"
                onValueChange={() => setSettings({ ...settings, ingameStats: !settings.ingameStats })}
                value={settings.ingameStats}
              />
            </View>
            <View className={styles.settingsRow}>
              <Text>Spectator mode enabled</Text>
              <Switch
                trackColor={{ false: '#E9E9EA', true: '#65C466' }}
                ios_backgroundColor="#E9E9EA"
                onValueChange={() => setSettings({ ...settings, spectatorMode: !settings.spectatorMode })}
                value={settings.spectatorMode}
              />
            </View>
            <View className={styles.settingsRow}>
              <Text>Other setting? I like 3</Text>
              <Switch
                trackColor={{ false: '#E9E9EA', true: '#65C466' }}
                ios_backgroundColor="#E9E9EA"
                onValueChange={() => setSettings({ ...settings, otherSetting: !settings.otherSetting })}
                value={settings.otherSetting}
              />
            </View>
          </View>
        }
      ></ComponentCard>
      <View className={styles.startTrackingButton}>
        <PrimaryButton
          title="Start tracking"
          onPress={() => startTracking()}
          icon={<ArrowRightIcon className={styles.arrowRightIcon} color="black" size={30} />}
        />
      </View>
    </SafeAreaView>
  )
}
