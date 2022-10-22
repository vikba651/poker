import {
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Text,
  Button,
} from 'react-native'
import React, { useState } from 'react'
import styles from './track-game-screen.scss'
import SuiteChoose from '../suit-choose/suit-choose'
import ValueChoose from '../value-choose/value-choose'

export default function TrackGameScreen({ navigation, route }) {
  const [firstCard, setFirstCard] = useState({
    suit: '',
    suitImage: null,
    value: '',
  })
  const [secondCard, setSecondCard] = useState({
    suit: '',
    suitImage: null,
    value: '',
  })
  const [selectedCard, setSelectedCard] = useState(1) // 1 or 2

  const [isSuitMode, setIsSuitMode] = useState(true)

  const heartImageSrc = require(`../../assets/heart.png`)
  const spadeImageSrc = require(`../../assets/spade.png`)
  const diamondImageSrc = require(`../../assets/diamond.png`)
  const clubImageSrc = require(`../../assets/club.png`)

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
    if (selectedCard === 1) {
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
    setIsSuitMode(false)
  }

  function selectValue(value) {
    if (selectedCard === 1) {
      setFirstCard({
        suit: firstCard.suit,
        suitImage: firstCard.suit,
        value,
      })
      setSelectedCard(2)
      setIsSuitMode(true)
    } else {
      setSecondCard({
        suit: secondCard.suit,
        suitImage: secondCard.suitImage,
        value,
      })
    }
  }

  function onSelectCard(cardNumber) {
    setSelectedCard(cardNumber)
    setIsSuitMode(true)
  }

  function onDone() {
    if (firstCard.value.length > 0 && secondCard.value.length > 0) {
      alert('good')
    } else {
      alert('bad')
    }
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
        <View className={styles.cardsView}>
          <Text style={{ fontSize: '30px' }}>
            Edit {selectedCard === 1 ? 'first' : 'second'} card
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              className={[
                styles.card,
                selectedCard === 1 && styles.selectedCard,
              ]}
              onPress={() => onSelectCard(1)}
            >
              {!!firstCard.suit && (
                <Image
                  className={styles.cardSuit}
                  style={{ resizeMode: 'contain' }}
                  source={firstCard.suitImage}
                />
              )}
              {!!firstCard.value && (
                <Text className={styles.cardValue}>{firstCard.value}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className={[
                styles.card,
                selectedCard === 2 && styles.selectedCard,
              ]}
              onPress={() => onSelectCard(2)}
            >
              {!!secondCard.suit && (
                <Image
                  className={styles.cardSuit}
                  style={{ resizeMode: 'contain' }}
                  source={secondCard.suitImage}
                />
              )}
              {!!secondCard.value && (
                <Text className={styles.cardValue}>{secondCard.value}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View className={styles.chooseView}>
          {isSuitMode && <SuiteChoose selectSuit={selectSuit}></SuiteChoose>}
          {!isSuitMode && <ValueChoose selectValue={selectValue}></ValueChoose>}
          <View style={{ paddingTop: 20 }}>
            <Button title="Done" onPress={() => onDone()}></Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
