import { Image, SafeAreaView, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import styles from './start-screen.scss'
import AppContext from '../../shared/AppContext'
import * as Location from 'expo-location'

export default function StartScreen({ navigation, route }) {
  const DISABLE_GRADIENT = true

  const { user, session, location, setLocation } = useContext(AppContext)

  const games = [
    {
      id: 0,
      date: '17 Oct',
      result: '114sek',
      plus: true,
    },
    {
      id: 1,
      date: '12 Oct',
      result: '69sek',
      plus: true,
    },
    {
      id: 2,
      date: '24 Sep',
      result: '420sek',
      plus: false,
    },
    {
      id: 3,
      date: '17 Sep',
      result: '12sek',
      plus: true,
    },
  ]

  const [isGradientActivated, setIsGradientActivated] = useState(games.length > 3)

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

  const onScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToEnd = 15
    const isCloseToEnd = layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToEnd
    // console.log(contentSize.width - layoutMeasurement.width - contentOffset.x)
    setIsGradientActivated(!isCloseToEnd)
  }

  const opacityStyle = {
    opacity: !DISABLE_GRADIENT && isGradientActivated ? 1 : 0,
    transition: 'all 1s ease-in',
    resizeMode: 'contain',
    height: 170,
    marginLeft: 10,
  }

  return (
    <SafeAreaView className={styles.container}>
      {session && (
        <View>
          <Text>Your current sesh: {session.code}</Text>
        </View>
      )}
      <View className={styles.welcomeMessage}>
        <Text className={styles.whatDoText}>What do you want to do,</Text>
        <Text className={styles.nameText}>{user.name}?</Text>
      </View>

      <View className={styles.boxShadow}>
        <View className={styles.yourGamesContainer}>
          <Text className={styles.yourGamesText}>Your games</Text>
          <ScrollView
            horizontal
            onScroll={({ nativeEvent }) => {
              onScroll(nativeEvent)
            }}
            scrollEventThrottle={400}
          >
            <View className={styles.gamesRow}>
              {games.map((game) => {
                return (
                  <TouchableOpacity key={game.id}>
                    <View className={styles.game}>
                      <Text className={styles.dateText}>{game.date}</Text>
                      <Text className={game.plus ? styles.resultTextPlus : styles.resultTextMinus}>
                        {(game.plus ? '+' : '-') + game.result}
                      </Text>
                      <Text className={styles.viewMoreText}>view more</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>

          <Image className={styles.gradient} style={opacityStyle} source={require('../../assets/right-gradient.png')} />
        </View>
      </View>

      <View className={styles.boxShadow}>
        <View className={styles.actionContainer}>
          <Text className={styles.cardTitle}>Actions</Text>
          <View className={styles.actionButtons}>
            <TouchableOpacity onPress={() => navigation.navigate('CreateGameScreen')} className={styles.markerButton}>
              <Image
                className={styles.markerImage}
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/blue-marker.png')}
              />
              <View className={styles.actionTextView}>
                <Text className={styles.actionText}>NEW GAME</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('TestScreen')} className={styles.markerButton}>
              <Image
                className={styles.markerImage}
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/green-marker.png')}
              />
              <View className={styles.actionTextView}>
                <Text className={styles.actionText}>JOIN GAME</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AddPlayersScreen')} className={styles.markerButton}>
              <Image
                className={styles.markerImage}
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/red-marker.png')}
              />
              <View className={styles.actionTextView}>
                <Text className={styles.actionText}>SETTLE UP</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('TrackGameScreen')} className={styles.markerButton}>
              <Image
                className={styles.markerImage}
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/black-marker.png')}
              />
              <View className={styles.actionTextView}>
                <Text className={styles.actionText}>STATS</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
