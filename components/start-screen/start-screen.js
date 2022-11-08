import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { PokerHand } from '../../algorithms/poker-algorithms'
import styles from './start-screen.scss'

export default function StartScreen({ navigation, route }) {
  const name = route.params.name
  // onPress={() => navigation.navigate('AddPlayersScreen', { name: name })}
  // onPress={() => navigation.navigate('TrackGameScreen')}

  const games = [
    {
      id: 0,
      date: '17 Oct',
      result: '+114sek',
    },
    {
      id: 1,
      date: '12 Oct',
      result: '+69sek',
    },
    {
      id: 2,
      date: '24 Sep',
      result: '-420sek',
    },
    {
      id: 3,
      date: '17 Sep',
      result: '-12sek',
    },
  ]

  return (
    <SafeAreaView className={styles.container}>
      <Text className={styles.welcomeText}>What do you want to do, {name}?</Text>
      <View className={styles.yourGamesContainer}>
        <Text className={styles.cardTitle}>Your games</Text>
        <View className={styles.gamesRow}>
          {games.map((game) => {
            return (
              <View className={styles.game}>
                <Text>17 Oct</Text>
              </View>
            )
          })}
          <View className={styles.game}>
            <Text>17 Oct</Text>
          </View>
        </View>
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
