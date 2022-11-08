import { Image, SafeAreaView, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import styles from './start-screen.scss'

export default function StartScreen({ navigation, route }) {
  const name = route.params.name
  // onPress={() => navigation.navigate('AddPlayersScreen', { name: name })}
  // onPress={() => navigation.navigate('TrackGameScreen')}

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

  const [isGradientActivated, setIsGradientActivated] = useState(true)

  const isCloseToEnd = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToEnd = 15
    return layoutMeasurement.width + contentOffset.x >= contentSize.width - paddingToEnd
  }

  const opcaityStyle = {
    opacity: isGradientActivated ? 1 : 0,
    transition: 'all 1s ease-in',
    resizeMode: 'contain',
  }

  return (
    <SafeAreaView className={styles.container}>
      <View className={styles.welcomeMessage}>
        <Text className={styles.whatDoText}>What do you want to do,</Text>
        <Text className={styles.nameText}>{name}?</Text>
      </View>

      <View className={styles.yourGamesContainer}>
        <Text className={styles.yourGamesText}>Your games</Text>
        <ScrollView
          horizontal={true}
          onScroll={({ nativeEvent }) => {
            if (isCloseToEnd(nativeEvent)) {
              setIsGradientActivated(false)
            } else {
              setIsGradientActivated(true)
            }
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

        <Image
          className={styles.gradient}
          style={opcaityStyle}
          source={require('../../assets/right-gradient.png')}
        />
      </View>

      <View className={styles.actionContainer}>
        <Text className={styles.cardTitle}>Actions</Text>
        <View className={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TrackGameScreen')}
            className={styles.markerButton}
          >
            <Image
              className={styles.markerImage}
              style={{ resizeMode: 'contain' }}
              source={require('../../assets/blue-marker.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('TrackGameScreen')}
            className={styles.markerButton}
          >
            <Image
              className={styles.markerImage}
              style={{ resizeMode: 'contain' }}
              source={require('../../assets/green-marker.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddPlayersScreen', { name: name })}
            className={styles.markerButton}
          >
            <Image
              className={styles.markerImage}
              style={{ resizeMode: 'contain' }}
              source={require('../../assets/red-marker.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('TrackGameScreen')}
            className={styles.markerButton}
          >
            <Image
              className={styles.markerImage}
              style={{ resizeMode: 'contain' }}
              source={require('../../assets/black-marker.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
