import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useState } from 'react'
import styles from './track-game-screen.scss'

import heart from '../../assets/heart.png'
import spade from '../../assets/spade.png'
import diamond from '../../assets/diamond.png'
import club from '../../assets/club.png'

export default function TrackGameScreen({ navigation, route }) {
  const initialCardsList = [
    { id: 0, suit: '', suitImage: null, value: '', isActive: true },
    { id: 1, suit: '', suitImage: null, value: '', isActive: true },
    { id: 2, suit: '', suitImage: null, value: '', isActive: false },
    { id: 3, suit: '', suitImage: null, value: '', isActive: false },
    { id: 4, suit: '', suitImage: null, value: '', isActive: false },
    { id: 5, suit: '', suitImage: null, value: '', isActive: false },
    { id: 6, suit: '', suitImage: null, value: '', isActive: false },
  ]

  const suits = [
    {
      id: 'heart',
      image: heart,
    },
    {
      id: 'spade',
      image: spade,
    },
    {
      id: 'club',
      image: club,
    },
    {
      id: 'diamond',
      image: diamond,
    },
  ]

  const firstRowValues = ['A', '2', '3', '4', '5', '6']
  const secondRowValues = ['7', '8', '9', '10', 'J', 'Q', 'K']

  const stats = [
    { id: 0, title: 'Hand Quality', percentage: 84 },
    { id: 1, title: 'Pair chance', percentage: 64 },
    { id: 2, title: 'Straight chance', percentage: 57 },
    { id: 3, title: 'Triple chance', percentage: 43 },
    { id: 4, title: 'Flush chance', percentage: 27 },
  ]

  const [statsActive, setStatsActive] = useState(true)
  const [hideCards, setHideCards] = useState(false)

  const [cards, setCards] = useState(initialCardsList)
  const [selectedCard, setSelectedCard] = useState(0) // 0-6
  const [firstClick, setFirstClick] = useState(true)

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
    const newCards = cards.map((card) => {
      return card.id == selectedCard ? { ...card, suit: suit, suitImage: getSuitImage(suit) } : card
    })
    setCards(newCards)
    if (cards[selectedCard].value && !firstClick) {
      setFirstClick(true)
      findActiveCards(newCards)
      const activeCardsCount = cards.filter((card) => card.isActive).length
      setSelectedCard(Math.min(selectedCard + 1, activeCardsCount))
    } else {
      setFirstClick(false)
    }
  }

  function selectValue(value) {
    const newCards = cards.map((card) => {
      return card.id == selectedCard ? { ...card, value } : card
    })
    setCards(newCards)

    if (cards[selectedCard].suit && !firstClick) {
      setFirstClick(true)
      findActiveCards(newCards)
      const activeCardsCount = cards.filter((card) => card.isActive).length
      setSelectedCard(Math.min(selectedCard + 1, activeCardsCount))
    } else {
      setFirstClick(false)
    }
  }

  function findActiveCards(cards) {
    if (cards.slice(0, 6).every((card) => card.value && card.suit)) {
      let newCards = [...cards]
      newCards.find((card) => card.id == 6).isActive = true
      setCards(newCards)
    }

    if (cards.slice(0, 5).every((card) => card.value && card.suit)) {
      let newCards = [...cards]
      newCards.find((card) => card.id == 5).isActive = true
      setCards(newCards)
    }
    if (cards.slice(0, 2).every((card) => card.value && card.suit)) {
      let newCards = [...cards]
      newCards.find((card) => card.id == 2).isActive = true
      newCards.find((card) => card.id == 3).isActive = true
      newCards.find((card) => card.id == 4).isActive = true
      setCards(newCards)
    }
  }

  function onSelectCard(cardNumber) {
    setSelectedCard(cardNumber)
    setFirstClick(true)
  }

  function isValidCards() {
    if (cards.slice(0, 2).every((card) => card.value && card.suit)) {
      let newCards = [...cards]
      newCards.find((card) => card.id == 2).isActive = true
      newCards.find((card) => card.id == 3).isActive = true
      newCards.find((card) => card.id == 4).isActive = true
      setCards(newCards)

      const tableCards = cards.slice(2)
      const hasInvalidCard = tableCards.some((card) => (card.suit && !card.value) || (!card.suit && card.value))
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
      console.log('ALLROUNDS ', allRounds)
    } else {
    }
  }

  function onClearCard() {
    let newCards = cards.map((card) =>
      card.id === selectedCard ? { ...card, value: '', suit: '', suitImage: null } : card
    )
    setCards(newCards)
  }

  function onEndGame() {
    if (cards.every((card) => !card.suit && !card.value)) {
      navigation.navigate('GameBreakdown', { allRounds })
    }
    if (isValidCards()) {
      const newAllRounds = [...allRounds, { round: currentRound, cards }]
      setAllRounds(newAllRounds)
      // console.log('ALLROUNDS ', allRounds)
      navigation.navigate('GameBreakdown', { allRounds: newAllRounds })
    }
  }

  function onStatsChange() {
    setStatsActive(!statsActive)
  }

  function getCardStyles(cardId) {
    let cardStyles = [styles.card, selectedCard === cardId ? styles.selectedCard : styles.notSelectedCard]
    if (!statsActive) {
      cardStyles.push(styles.bigCard)
    }
    return cardStyles
  }

  return (
    <SafeAreaView style={styles.container}>
      <View className={styles.cardsView}>
        {/* <TouchableOpacity className={styles.restartButton} onPress={() => onStatsChange()}>
            <Text className={styles.buttonFont}>Change Stats</Text>
          </TouchableOpacity> */}
        <View className={styles.myCards}>
          <Text className={styles.titleFont}>My Cards</Text>
          <View className={styles.myCardsRow} style={{ opacity: hideCards ? 0 : 1 }}>
            {cards.slice(0, 2).map((card) => {
              return (
                <View key={card.id}>
                  <TouchableOpacity className={getCardStyles(card.id)} onPress={() => onSelectCard(card.id)}>
                    {!!card.suit && (
                      <Image
                        className={statsActive ? styles.cardSuit : styles.bigCardSuit}
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
          <TouchableOpacity className={styles.hideButton} onPress={() => setHideCards(!hideCards)}>
            <Text>{hideCards ? 'show' : 'hide'}</Text>
          </TouchableOpacity>
        </View>
        <View className={styles.tableCards}>
          <Text className={styles.titleFont}>Cards on table</Text>
          <View className={styles.tableCardsRow}>
            {cards.slice(2, 7).map((card, i) => {
              return (
                <View key={card.id}>
                  {card.isActive && (
                    <TouchableOpacity
                      className={selectedCard === card.id ? [styles.card, styles.selectedCard] : styles.card}
                      onPress={() => onSelectCard(card.id)}
                    >
                      {!!card.suit && (
                        <Image className={styles.cardSuit} style={{ resizeMode: 'contain' }} source={card.suitImage} />
                      )}
                      {!!card.value && <Text className={styles.cardTopValue}>{card.value}</Text>}
                      {!!card.value && <Text className={styles.cardBottomValue}>{card.value}</Text>}
                    </TouchableOpacity>
                  )}
                  {!card.isActive && <View className={[styles.card, styles.disabledCard]}></View>}
                </View>
              )
            })}
          </View>
        </View>
      </View>
      {statsActive && (
        <View className={styles.boxShadow}>
          <View className={styles.statsView}>
            <Text className={styles.titleFont}>Stats</Text>

            <ScrollView horizontal>
              <View className={styles.statsRow}>
                {stats.map((stat) => (
                  <TouchableOpacity key={stat.id}>
                    <View className={styles.statistic}>
                      <Text className={styles.statisticTitle}>{stat.title}</Text>
                      <Text className={styles.statisticResult}>{stat.percentage}%</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      )}
      <View className={styles.boxShadow}>
        <View className={styles.editSelectionView}>
          <Text className={[styles.titleFont, styles.editSelection]}>Edit selection</Text>
          <View style={{ flexDirection: 'row' }}>
            {suits.map((suit) => (
              <TouchableOpacity key={suit.id} className={styles.selectionButton} onPress={() => selectSuit(suit.id)}>
                <Image className={styles.suitImage} style={{ resizeMode: 'contain' }} source={suit.image}></Image>
              </TouchableOpacity>
            ))}
          </View>

          <View className={styles.valueRows}>
            <View style={{ flexDirection: 'row' }}>
              {firstRowValues.map((value) => (
                <TouchableOpacity key={value} className={styles.selectionButton} onPress={() => selectValue(value)}>
                  <Text className={styles.valueText}>{value}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row' }}>
              {secondRowValues.map((value) => (
                <TouchableOpacity key={value} className={styles.selectionButton} onPress={() => selectValue(value)}>
                  <Text className={styles.valueText}>{value}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className={styles.nextStepButtons}>
            <TouchableOpacity onPress={() => onEndGame()}>
              <Text className={styles.buttonText}>End game</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onClearCard()}>
              <Text className={styles.buttonText}>Clear card</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNextRound()}>
              <Text className={styles.buttonText}>Next round</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
