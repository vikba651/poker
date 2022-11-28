import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useContext, useState, useEffect, useRef } from 'react'
import styles from './track-game-screen.scss'
import AppContext from '../../context/AppContext'
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

  const stats = [
    { id: 0, title: 'Hand Quality', percentage: 84 },
    { id: 1, title: 'Pair chance', percentage: 64 },
    { id: 2, title: 'Straight chance', percentage: 57 },
    { id: 3, title: 'Triple chance', percentage: 43 },
    { id: 4, title: 'Flush chance', percentage: 27 },
  ]

  const firstRowValues = ['A', '2', '3', '4', '5', '6']
  const secondRowValues = ['7', '8', '9', '10', 'J', 'Q', 'K']

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
          if (tableCardsData[i].value && tableCardsData[i].suit) {
            tableCards[i].value = tableCardsData[i].value
            tableCards[i].suit = tableCardsData[i].suit
            tableCards[i].suitImage = suits.find((suit) => suit.id === tableCardsData[i].suit).image
          }
        }
        const newCards = [cardsRef.current[0], cardsRef.current[1], ...tableCards]
        setCards(newCards)
        findActiveCards(newCards)
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
      if (selectedCard < 6 && valueSelected && !cards[selectedCard + 1].suit && !cards[selectedCard + 1].value) {
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
      updateCardDone(newCards)
    }
  }

  function onSelectValue(value) {
    const newCards = cards.map((card) => {
      return card.id == selectedCard ? { ...card, value } : card
    })
    setCards(newCards)
    setValueSelected(true)

    if (cards[selectedCard].suit) {
      if (selectedCard < 6 && suitSelected && !cards[selectedCard + 1].suit && !cards[selectedCard + 1].value) {
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
      updateCardDone(newCards)
    }
  }

  function onClearCard() {
    let newCards = cards.map((card) =>
      card.id === selectedCard ? { ...card, value: '', suit: '', suitImage: null } : card
    )
    setCards(newCards)
    updateCardDone(newCards)
  }

  function updateCardDone(newCards) {
    findActiveCards(newCards)
  }

  // REFRACTOR
  function findActiveCards(cards) {
    if (
      cards.slice(2, 4).some((card) => card.value && card.suit) ||
      cards.slice(0, 2).every((card) => card.value && card.suit)
    ) {
      // 3 valid
      let newCards = [...cards]
      newCards.find((card) => card.id == 2).isActive = true
      newCards.find((card) => card.id == 3).isActive = true
      newCards.find((card) => card.id == 4).isActive = true
      setCards(newCards)
    }
    if (cards.slice(2, 5).every((card) => card.value && card.suit)) {
      // 4 valid
      let newCards = [...cards]
      newCards.find((card) => card.id == 5).isActive = true
      setCards(newCards)
    }

    if (cards.slice(2, 6).every((card) => card.value && card.suit)) {
      // 5 valid
      let newCards = [...cards]
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
      setAllDeals([...allDealsRef.current, { deal: currentDealRef.current, cards }])
      const cardsData = cards.splice(0, 2).map((card) => {
        return { value: card.value, suit: card.suit }
      })
      socket.emit('endGame', { cards: cardsData, sessionId: session.id, currentDeal })
      navigation.navigate('GameBreakdown', { allDeals })
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
          {session && <Text>In party with {session.players.length} players</Text>}
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
              <TouchableOpacity key={suit.id} className={styles.selectionButton} onPress={() => onSelectSuit(suit)}>
                <Image className={styles.suitImage} style={{ resizeMode: 'contain' }} source={suit.image}></Image>
              </TouchableOpacity>
            ))}
          </View>

          <View className={styles.valueRows}>
            <View style={{ flexDirection: 'row' }}>
              {firstRowValues.map((value) => (
                <TouchableOpacity key={value} className={styles.selectionButton} onPress={() => onSelectValue(value)}>
                  <Text className={styles.valueText}>{value}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row' }}>
              {secondRowValues.map((value) => (
                <TouchableOpacity key={value} className={styles.selectionButton} onPress={() => onSelectValue(value)}>
                  <Text className={styles.valueText}>{value}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className={styles.footerButtonsView}>
            <TouchableOpacity onPress={() => onEndGame()} className={styles.footerButton}>
              <Text className={styles.buttonText}>End game</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onClearCard()} className={styles.footerButton}>
              <Text className={styles.buttonText}>Clear card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onNewDealPressed()
              }}
              className={styles.footerButton}
            >
              <Text className={styles.buttonText}>New deal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
