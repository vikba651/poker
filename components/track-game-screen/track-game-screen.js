import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useContext, useState, useEffect, useRef } from 'react'
import styles from './track-game-screen.scss'
import AppContext from '../../shared/AppContext'
import heart from '../../assets/heart.png'
import spade from '../../assets/spade.png'
import diamond from '../../assets/diamond.png'
import club from '../../assets/club.png'
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline'
import EditSelection from '../edit-selection/edit-selection'
import InGameStatistics from '../in-game-statistics/in-game-statistics'

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
      id: 'diamond',
      image: diamond,
    },
    {
      id: 'club',
      image: club,
    },
  ]
  const [statsActive, setStatsActive] = useState(false)
  const [hideCards, onHideCards] = useState(false)

  const [selectedCard, setSelectedCard] = useState(0) // 0-6
  const [valueSelected, setValueSelected] = useState(false)
  const [suitSelected, setSuitSelected] = useState(false)
  const [cards, setCards] = useState(
    initialCardsList.map((card) => {
      // Deep copy
      return { ...card }
    })
  )
  const cardsRef = useRef([])
  cardsRef.current = cards

  const [currentDeal, setCurrentDeal] = useState(1)
  const currentDealRef = useRef(1) // This kinda shit is needed to read state in ws event listeners
  currentDealRef.current = currentDeal

  const [allDeals, setAllDeals] = useState([]) // Used when playing solo
  const allDealsRef = useRef([])
  allDealsRef.current = allDeals

  const { socket, session } = useContext(AppContext)

  useEffect(() => {
    setSuitSelected(false)
    setValueSelected(false)
  }, [selectedCard])

  useEffect(() => {
    socket.on('tableCardsUpdated', (tableCardsData, deal) => {
      if (deal === currentDealRef.current) {
        let tableCards = [...cardsRef.current.slice(2)]
        for (let i = 0; i < tableCardsData.length; i++) {
          tableCards[i].value = tableCardsData[i].value
          tableCards[i].suit = tableCardsData[i].suit
          const suitImageIndex = suits.findIndex((suit) => suit.id === tableCardsData[i].suit)
          tableCards[i].suitImage = suitImageIndex >= 0 ? suits[suitImageIndex].image : null
        }
        const newCards = [cardsRef.current[0], cardsRef.current[1], ...tableCards]
        setCards(newCards)
        setActiveCards(newCards)
      }
    })
  }, [socket])

  function onSelectSuit(suit) {
    const newCards = cards.map((card) => {
      return card.id == selectedCard ? { ...card, suit: suit.id, suitImage: suit.image } : card
    })
    setCards(newCards)
    setSuitSelected(true)

    if (cards[selectedCard].value) {
      setActiveCards(newCards)
      if (
        selectedCard < 6 &&
        valueSelected &&
        cards[selectedCard + 1].isActive &&
        !cards[selectedCard + 1].suit &&
        !cards[selectedCard + 1].value
      ) {
        setSelectedCard(selectedCard + 1)
      }
      if (session && selectedCard >= 2 && newCards !== cards) {
        const tableCards = newCards.slice(2).map((card) => {
          return { value: card.value, suit: card.suit }
        })
        socket.emit('updateTableCards', {
          cards: tableCards,
          sessionId: session.id,
          deal: currentDealRef.current,
        })
      }
    }
  }

  function onSelectValue(value) {
    const newCards = cards.map((card) => {
      return card.id == selectedCard ? { ...card, value } : card
    })
    setCards(newCards)
    setValueSelected(true)

    if (cards[selectedCard].suit) {
      setActiveCards(newCards)
      if (
        selectedCard < 6 &&
        suitSelected &&
        cards[selectedCard + 1].isActive &&
        !cards[selectedCard + 1].suit &&
        !cards[selectedCard + 1].value
      ) {
        setSelectedCard(selectedCard + 1)
      }
      if (session && selectedCard >= 2 && newCards !== cards) {
        const tableCards = newCards.slice(2).map((card) => {
          return { value: card.value, suit: card.suit }
        })
        socket.emit('updateTableCards', {
          cards: tableCards,
          sessionId: session.id,
          deal: currentDealRef.current,
        })
      }
    }
  }

  function onClearCard() {
    let newCards = cards.map((card) =>
      card.id === selectedCard ? { ...card, value: '', suit: '', suitImage: null } : card
    )
    setCards(newCards)
    if (selectedCard > 1) {
      socket.emit('updateTableCards', {
        cards: newCards.slice(2),
        sessionId: session.id,
        deal: currentDeal,
      })
    }
    setActiveCards(newCards)
  }

  // REFRACTOR
  function setActiveCards(cards) {
    let newCards = [
      ...cards.map((card) => {
        return { ...card, isActive: false }
      }),
    ]
    if (
      cards.slice(2, 4).some((card) => card.value && card.suit) ||
      cards.slice(0, 2).every((card) => card.value && card.suit)
    ) {
      // 3 valid
      newCards.find((card) => card.id == 2).isActive = true
      newCards.find((card) => card.id == 3).isActive = true
      newCards.find((card) => card.id == 4).isActive = true
      setCards(newCards)
    }
    if (cards.slice(2, 5).every((card) => card.value && card.suit)) {
      // 4 valid
      newCards.find((card) => card.id == 5).isActive = true
      setCards(newCards)
    }

    if (cards.slice(2, 6).every((card) => card.value && card.suit)) {
      // 5 valid
      newCards.find((card) => card.id == 6).isActive = true
      setCards(newCards)
    }
  }

  function onSelectCard(cardNumber) {
    setSelectedCard(cardNumber)
  }

  function isValidCards() {
    if (cards.slice(0, 2).every((card) => card.value && card.suit)) {
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

  function onNewDealPressed() {
    if (session) {
      const cardData = cardsRef.current.slice(0, 2).map((card) => {
        return { value: card.value, suit: card.suit }
      })
      socket.emit('newDeal', {
        sessionId: session.id,
        cards: cardData,
        deal: currentDealRef.current,
      })
    }
    newDeal()
  }

  function newDeal() {
    if (true /* isValidCards() */) {
      // Disabled check valid cards for now
      setAllDeals([...allDealsRef.current, { deal: currentDealRef.current, cards: cardsRef.current }])
      setCurrentDeal(currentDealRef.current + 1)
      setCards(
        initialCardsList.map((card) => {
          return { ...card }
        })
      )
      setSelectedCard(0)
    }
  }

  function onEndGame() {
    if (cards.every((card) => !card.suit && !card.value)) {
      socket.emit('endGame', { sessionId: session.id, currentDeal })
      navigation.navigate('GameBreakdown', { allDeals })
    }
    if (isValidCards()) {
      const newAllDeals = [...allDeals, { deal: currentDeal, cards }]
      setAllDeals(newAllDeals)
      const cardsData = cards.splice(0, 2).map((card) => {
        return { value: card.value, suit: card.suit }
      })
      socket.emit('endGame', { cards: cardsData, sessionId: session.id, currentDeal })
      navigation.navigate('GameBreakdown', { allDeals: newAllDeals })
    }
  }

  function toggleStats() {
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
        {/* <TouchableOpacity className={styles.restartButton} onPress={() => toggleStats()}>
            <Text className={styles.buttonFont}>Change Stats</Text>
          </TouchableOpacity> */}

        <View style={{ marginBottom: 40, alignItems: 'center' }}>
          <Text style={{ fontWeight: '800' }}>Deal #{currentDeal}</Text>
          {session.players.length > 1 && <Text>In party with {session.players.length} players</Text>}
        </View>

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
          <TouchableOpacity className={styles.hideButton} onPress={() => onHideCards(!hideCards)}>
            {hideCards ? <EyeIcon color="black" /> : <EyeSlashIcon color="black" />}
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
      {statsActive && <InGameStatistics />}
      <EditSelection
        suits={suits}
        onSelectSuit={onSelectSuit}
        onSelectValue={onSelectValue}
        onEndGame={onEndGame}
        onClearCard={onClearCard}
        onNewDealPressed={onNewDealPressed}
      />
    </SafeAreaView>
  )
}
