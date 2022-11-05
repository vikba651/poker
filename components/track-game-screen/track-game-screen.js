import { View, SafeAreaView, Image, TouchableOpacity, Text, Button } from 'react-native'
import React, { useState } from 'react'
import styles from './track-game-screen.scss'
import SuiteChoose from '../suit-choose/suit-choose'
import ValueChoose from '../value-choose/value-choose'
import { PokerHand } from '../../algorithms/poker-algorithms'

export default function TrackGameScreen({ navigation, route }) {
  const initialCardsList = [
    { id: 0, suit: '', suitImage: null, value: '' },
    { id: 1, suit: '', suitImage: null, value: '' },
    { id: 2, suit: '', suitImage: null, value: '' },
    { id: 3, suit: '', suitImage: null, value: '' },
    { id: 4, suit: '', suitImage: null, value: '' },
    { id: 5, suit: '', suitImage: null, value: '' },
    { id: 6, suit: '', suitImage: null, value: '' },
  ]

  const [statsActive, setStatsActive] = useState(true)

  const [cards, setCards] = useState(initialCardsList)
  const [selectedCard, setSelectedCard] = useState(0) // 0-6
  const [isSuitMode, setIsSuitMode] = useState(true)
  const [currentRound, setCurrentRound] = useState(1)

  const [allRounds, setAllRounds] = useState([])

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
    newCards.find((card) => card.id == selectedCard).suitImage = getSuitImage(suit)
    newCards.find((card) => card.id == selectedCard).suit = suit
    setCards(newCards)

    setIsSuitMode(false)
  }

  function selectValue(value) {
    let newCards = [...cards]
    newCards.find((card) => card.id == selectedCard).value = value
    setCards(newCards)

    if (selectedCard == cards.length - 1) {
      setSelectedCard(0)
    } else {
      setSelectedCard(selectedCard + 1)
    }
    setIsSuitMode(true)
  }

  function onSelectCard(cardNumber) {
    setSelectedCard(cardNumber)
    setIsSuitMode(true)
  }

  function isValidCards() {
    if (cards.slice(0, 2).every((card) => card.value && card.suit)) {
      const tableCards = cards.slice(2)
      const hasInvalidCard = tableCards.some(
        (card) => (card.suit && !card.value) || (!card.suit && card.value)
      )
      if (hasInvalidCard) {
        alert('Fill in both value and suit')
        return false
      }
      const completeCardsCount = tableCards.filter((card) => card.suit && card.value).length
      if (completeCardsCount === 1 || completeCardsCount === 2) {
        alert('You can not have only 1 or 2 cards on the table')
        return false
      }
      return true
    }
    // alert('Fill in your cards')
    return false
  }

  function onNextRound() {
    if (isValidCards()) {
      setAllRounds([...allRounds, { round: currentRound, cards }])
      setCurrentRound(currentRound + 1)
      setCards(initialCardsList)
      setSelectedCard(0)
      setIsSuitMode(true)
      console.log('ALLROUNDS ', allRounds)
    } else {
      console.log('YOU ARE SO BAD')
    }
  }

  function onEndGame() {
    if (cards.every((card) => !card.suit && !card.value)) {
      navigation.navigate('GameBreakdown', { allRounds })
    }
    if (isValidCards()) {
      const newAllRounds = [...allRounds, { round: currentRound, cards }]
      setAllRounds(newAllRounds)
      // console.log('ALLROUNDS ', allRounds)
      navigation.navigate('GameBreakdown', { allRounds })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}
      >
        <View className={styles.cardsView}>
          <View className={styles.myCards}>
            <Text className={styles.titleFont}>My Cards</Text>
            <View className={styles.myCardsRow}>
              {cards.slice(0, 2).map((card, i) => {
                return (
                  <View key={card.id}>
                    <TouchableOpacity
                      className={
                        selectedCard === card.id
                          ? [styles.playerCard, styles.selectedCard]
                          : [styles.playerCard, styles.notSelectedCard]
                      }
                      styles={{
                        backgroundColor: 'transparent',
                        overflow: 'hidden',
                        // shadowColor: 'red',
                        // shadowRadius: 1,
                      }}
                      // styles={selectedCard === card.id ? styles.selectedCard : ''}
                      onPress={() => onSelectCard(card.id)}
                    >
                      {!!card.suit && (
                        <Image
                          className={styles.playerCardSuit}
                          style={{ resizeMode: 'contain' }}
                          source={card.suitImage}
                        />
                      )}
                      {!!card.value && <Text className={styles.cardTopValue}>{card.value}</Text>}
                      {!!card.value && <Text className={styles.cardBottomValue}>{card.value}</Text>}
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          </View>
          <View className={styles.tableCards}>
            <Text className={styles.titleFont}>Cards on table</Text>
            <View className={styles.riverRow}>
              {cards.slice(2, 7).map((card, i) => {
                return (
                  <View key={card.id}>
                    <TouchableOpacity
                      className={
                        selectedCard === card.id
                          ? [styles.tableCard, styles.selectedCard]
                          : [styles.tableCard, styles.notSelectedCard]
                      }
                      onPress={() => onSelectCard(card.id)}
                    >
                      {!!card.suit && (
                        <Image
                          className={styles.tableCardSuit}
                          style={{ resizeMode: 'contain' }}
                          source={card.suitImage}
                        />
                      )}
                      {!!card.value && <Text className={styles.cardTopValue}>{card.value}</Text>}
                      {!!card.value && <Text className={styles.cardBottomValue}>{card.value}</Text>}
                    </TouchableOpacity>
                  </View>
                )
              })}
            </View>
          </View>
        </View>
      </View>
      <View className={styles.boxShadow}>
        <View className={styles.statsView}>
          <Text className={[styles.titleFont, styles.editSelection]}>Stats</Text>
        </View>
      </View>
      <View className={styles.boxShadow}>
        <View className={styles.chooseView}>
          <Text className={[styles.titleFont, styles.editSelection]}>Edit selection</Text>
          {isSuitMode && <SuiteChoose selectSuit={selectSuit}></SuiteChoose>}
          {!isSuitMode && <ValueChoose selectValue={selectValue}></ValueChoose>}
          <View className={styles.nextStepButtons}>
            <View className={styles.restartButton}>
              <TouchableOpacity className={styles.restartButton} onPress={() => onNextRound()}>
                <Text className={styles.buttonFont}>New Deal</Text>
              </TouchableOpacity>
            </View>
            <View className={styles.restartButton}>
              <TouchableOpacity className={styles.restartButton} onPress={() => onEndGame()}>
                <Text className={styles.buttonFont}>End Game</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
