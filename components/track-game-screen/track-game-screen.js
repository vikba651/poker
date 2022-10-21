import { View, SafeAreaView, Image, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import styles from './track-game-screen.scss'

export default function TrackGameScreen({ navigation, route }) {
  const [firstCard, setFirstCard] = useState({
    suit: '',
    suitImage: null,
    value: null,
  })
  const [secondCard, setSecondCard] = useState({
    suit: '',
    suitImage: null,
    value: null,
  })
  const [selectedCard, setSelectedCard] = useState(0)

  const [isSuitMode, setIsSuitMode] = useState(true)

  const heartImageSrc = require(`../../assets/heart.png`)
  const spadeImageSrc = require(`../../assets/spade.png`)
  const diamondImageSrc = require(`../../assets/diamond.png`)
  const clubImageSrc = require(`../../assets/club.png`)

  const [imageSource, setImageSource] = useState(null)

  function getSuitImage(suit) {
    if (suit === 'heart') {
      return heartImageSrc
    } else if (suit === 'spade') {
      return spadeImageSrc
    } else if (suit === 'diamond') {
      return diamondImageSrc
    } else if (suit === 'club') {
      return clubImageSrc
    }
  }

  function selectSuit(suit) {
    if (selectedCard === 0) {
      setFirstCard({
        suit,
        suitImage: getSuitImage(suit),
        value: firstCard.value,
      })
    } else {
      setSecondCard({
        suit,
        suitImage: getSuitImage(suit),
        value: secondCard.value,
      })
    }
    setImageSource(getSuitImage(suit))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Choose {selectedCard === 0 ? 'first' : 'second'} card</Text>
        {isSuitMode && (
          <>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                className={styles.suit}
                onPress={() => selectSuit('heart')}
              >
                <Image
                  className={styles.suitImage}
                  style={{ resizeMode: 'contain' }}
                  source={require('../../assets/heart.png')}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity
                className={styles.suit}
                style={{ resizeMode: 'contain' }}
                onPress={() => selectSuit('club')}
              >
                <Image
                  className={styles.suitImage}
                  style={{ resizeMode: 'contain' }}
                  source={require('../../assets/club.png')}
                ></Image>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                className={styles.suit}
                onPress={() => selectSuit('diamond')}
              >
                <Image
                  className={styles.suitImage}
                  style={{ resizeMode: 'contain' }}
                  source={require('../../assets/diamond.png')}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity
                className={styles.suit}
                onPress={() => selectSuit('spade')}
              >
                <Image
                  className={styles.suitImage}
                  style={{ resizeMode: 'contain' }}
                  source={require('../../assets/spade.png')}
                ></Image>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <View className={styles.cardsView}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            className={styles.card}
            style={{
              borderWidth: selectedCard === 0 ? 2 : 0,
              borderColor: 'black',
            }}
            onPress={() => setSelectedCard(0)}
          >
            {!!firstCard.suit && (
              <Image
                className={styles.cardSuit}
                style={{ resizeMode: 'contain' }}
                source={firstCard.suitImage}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className={styles.card}
            style={{
              borderWidth: selectedCard === 1 ? 2 : 0,
              borderColor: 'black',
            }}
            onPress={() => setSelectedCard(1)}
          >
            {!!secondCard.suit && (
              <Image
                className={styles.cardSuit}
                style={{ resizeMode: 'contain' }}
                source={secondCard.suitImage}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
