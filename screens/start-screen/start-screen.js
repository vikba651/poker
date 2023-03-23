import { Image, SafeAreaView, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import styles from './start-screen.scss'
import AppContext from '../../shared/AppContext'
import * as Location from 'expo-location'
import { PlusIcon, ChartBarIcon, UserPlusIcon, CurrencyDollarIcon } from 'react-native-heroicons/outline'
import ComponentCard from '../../components/component-card/component-card'
import { getRound, getPlayerEarnings } from '../../shared/api'

export default function StartScreen({ navigation, route }) {
  const DISABLE_GRADIENT = true

  const { user, session, location, setLocation } = useContext(AppContext)

  const placeholderGames = [
    {
      id: 0,
      date: '17 Oct',
      result: '114sek',
      plus: true,
      roundId: undefined,
    },
    {
      id: 1,
      date: '12 Oct',
      result: '69sek',
      plus: true,
      roundId: undefined,
    },
    {
      id: 2,
      date: '24 Sep',
      result: '420sek',
      plus: false,
      roundId: undefined,
    },
    {
      id: 3,
      date: '17 Sep',
      result: '12sek',
      plus: true,
      roundId: undefined,
    },
  ]
  const [games, setGames] = useState(placeholderGames)
  const [isGradientActivated, setIsGradientActivated] = useState(games.length > 3)

  const formatTime = (dateTime) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const dateObj = new Date(dateTime)
    const dateString = `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]}`
    return dateString
  }

  const fetchGames = async (name) => {
    let playerEarnings = await getPlayerEarnings(name)
    if (!playerEarnings) {
      return
    }
    playerEarnings = playerEarnings.sort((a, b) => b.startTime - a.startTime)
    const newGames = playerEarnings.map((playerEarning, i) => {
      const newGame = {
        id: i,
        date: formatTime(playerEarning.startTime),
        result: Math.abs(playerEarning.earning),
        plus: playerEarning.earning > 0,
        roundId: playerEarning.roundId,
      }
      return newGame
    })
    if (newGames.length) {
      setGames(newGames)
      setIsGradientActivated(newGames.length > 3)
    }
  }

  useEffect(() => {
    if (user.name && user.name != 'No connection boy') {
      fetchGames(user.name)
    }
  }, [user, route])

  const onClickRound = async (roundId) => {
    if (roundId) {
      const round = await getRound(roundId)
      navigation.navigate('GameBreakdown', { round })
    }
  }

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
      <View className={styles.welcomeMessage}>
        <Text className={styles.whatDoText}>What do you want to do,</Text>
        <Text className={styles.nameText}>{user.name}?</Text>
      </View>

      <ComponentCard
        title="Your games"
        content={
          <>
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
                    <TouchableOpacity key={game.id} onPress={() => onClickRound(game.roundId)}>
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

            {/* <Image
              className={styles.gradient}
              style={opacityStyle}
              source={require('../../assets/right-gradient.png')}
            /> */}
          </>
        }
      ></ComponentCard>

      <ComponentCard
        title="Actions"
        content={
          <View className={styles.actionButtons}>
            <TouchableOpacity onPress={() => navigation.navigate('CreateGameScreen')} className={styles.markerButton}>
              <Image
                className={styles.markerImage}
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/blue-marker.png')}
              />
              <View className={styles.actionTextView}>
                <PlusIcon color="white" />
                <Text className={styles.actionText}>NEW GAME</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('JoinGameScreen')} className={styles.markerButton}>
              <Image
                className={styles.markerImage}
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/green-marker.png')}
              />
              <View className={styles.actionTextView}>
                <UserPlusIcon color="white" />
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
                <CurrencyDollarIcon color="white" />
                <Text className={styles.actionText}>SETTLE UP</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('StatsScreen')} className={styles.markerButton}>
              <Image
                className={styles.markerImage}
                style={{ resizeMode: 'contain' }}
                source={require('../../assets/black-marker.png')}
              />
              <View className={styles.actionTextView}>
                <ChartBarIcon color="white" />
                <Text className={styles.actionText}>STATS</Text>
              </View>
            </TouchableOpacity>
          </View>
        }
      ></ComponentCard>
    </SafeAreaView>
  )
}
