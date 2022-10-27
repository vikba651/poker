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
import { PokerHand } from '../../algorithms/poker-algorithms'

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

  const initialCardsList = [
    { id: 0, suit: '', suitImage: null, value: '' },
    { id: 1, suit: '', suitImage: null, value: '' },
    { id: 2, suit: '', suitImage: null, value: '' },
    { id: 3, suit: '', suitImage: null, value: '' },
    { id: 4, suit: '', suitImage: null, value: '' },
    { id: 5, suit: '', suitImage: null, value: '' },
    { id: 6, suit: '', suitImage: null, value: '' },
  ]

  const [cards, setCards] = useState(initialCardsList)

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
    let newCards = [...cards]
    newCards.find((card) => card.id == selectedCard).suitImage =
      getSuitImage(suit)
    newCards.find((card) => card.id == selectedCard).suit = suit
    setCards(newCards)

    setIsSuitMode(false)
  }

  function selectValue(value) {
    let newCards = [...cards]
    newCards.find((card) => card.id == selectedCard).value = value
    setCards(newCards)

    if (selectedCard < cards.length) {
      setSelectedCard(selectedCard + 1)
      setIsSuitMode(false)
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
          <Text style={{ fontSize: '30px' }}>Edit card {selectedCard}</Text>
          <View style={{ flexDirection: 'row' }}>
            {cards.slice(0, 2).map((card, i) => {
              return (
                <View key={card.id} className={styles.playerCard}>
                  <TouchableOpacity
                    className={[
                      styles.playerCard,
                      selectedCard === card.id && styles.selectedCard,
                    ]}
                    onPress={() => onSelectCard(card.id)}
                  >
                    {!!card.suit && (
                      <Image
                        className={styles.cardSuit}
                        style={{ resizeMode: 'contain' }}
                        source={card.suitImage}
                      />
                    )}
                    {!!card.value && (
                      <Text className={styles.cardValue}>{card.value}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {cards.slice(2, 7).map((card, i) => {
              return (
                <View key={card.id} className={styles.playerCard}>
                  <TouchableOpacity
                    className={[
                      styles.playerCard,
                      selectedCard === card.id && styles.selectedCard,
                    ]}
                    onPress={() => onSelectCard(card.id)}
                  >
                    {!!card.suit && (
                      <Image
                        className={styles.cardSuit}
                        style={{ resizeMode: 'contain' }}
                        source={card.suitImage}
                      />
                    )}
                    {!!card.value && (
                      <Text className={styles.cardValue}>{card.value}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )
            })}
          </View>
        </View>
      </View>
      <View className={styles.chooseView}>
        {isSuitMode && <SuiteChoose selectSuit={selectSuit}></SuiteChoose>}
        {!isSuitMode && <ValueChoose selectValue={selectValue}></ValueChoose>}
        <View style={{ paddingTop: 20 }}>
          <Button title="Done" onPress={() => onDone()}></Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
