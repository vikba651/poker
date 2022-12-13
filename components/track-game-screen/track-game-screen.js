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
import PlayingCard from '../playing-card/playing-card'

export default function TrackGameScreen({ navigation, route }) {
  const initialCardsList = [
    { id: 0, suit: '', suitImage: null, rank: '', isActive: true },
    { id: 1, suit: '', suitImage: null, rank: '', isActive: true },
    { id: 2, suit: '', suitImage: null, rank: '', isActive: false },
    { id: 3, suit: '', suitImage: null, rank: '', isActive: false },
    { id: 4, suit: '', suitImage: null, rank: '', isActive: false },
    { id: 5, suit: '', suitImage: null, rank: '', isActive: false },
    { id: 6, suit: '', suitImage: null, rank: '', isActive: false },
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
  const [rankSelected, setRankSelected] = useState(false)
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
    setRankSelected(false)
  }, [selectedCard])

  useEffect(() => {
    socket.on('tableCardsUpdated', (tableCardsData, deal) => {
      if (deal === currentDealRef.current) {
        let tableCards = [...cardsRef.current.slice(2)]
        for (let i = 0; i < tableCardsData.length; i++) {
          tableCards[i].rank = tableCardsData[i].rank
          tableCards[i].suit = tableCardsData[i].suit
          const suitImageIndex = suits.findIndex((suit) => suit.id === tableCardsData[i].suit)
          tableCards[i].suitImage = suitImageIndex >= 0 ? suits[suitImageIndex].image : null
        }
        let newCards = [cardsRef.current[0], cardsRef.current[1], ...tableCards]
        newCards = setActiveCards(newCards)
        setCards(newCards)
      }
    })
  }, [socket])

  function onSelectSuit(suit) {
    let newCards = cards.map((card) => {
      return card.id == selectedCard ? { ...card, suit: suit.id, suitImage: suit.image } : card
    })
    newCards = setActiveCards(newCards)
    setCards(newCards)
    setSuitSelected(true)

    if (cards[selectedCard].rank) {
      if (
        selectedCard < 6 &&
        rankSelected &&
        newCards[selectedCard + 1].isActive &&
        !cards[selectedCard + 1].suit &&
        !cards[selectedCard + 1].rank
      ) {
        setSelectedCard(selectedCard + 1)
      }
      if (session && selectedCard >= 2 && newCards !== cards) {
        const tableCards = newCards.slice(2).map((card) => {
          return { rank: card.rank, suit: card.suit }
        })
        socket.emit('updateTableCards', {
          cards: tableCards,
          sessionId: session.id,
          deal: currentDealRef.current,
        })
      }
    }
  }

  function onSelectRank(rank) {
    let newCards = cards.map((card) => {
      return card.id == selectedCard ? { ...card, rank } : card
    })
    newCards = setActiveCards(newCards)
    setCards(newCards)
    setRankSelected(true)

    if (cards[selectedCard].suit) {
      if (
        selectedCard < 6 &&
        suitSelected &&
        newCards[selectedCard + 1].isActive &&
        !cards[selectedCard + 1].suit &&
        !cards[selectedCard + 1].rank
      ) {
        setSelectedCard(selectedCard + 1)
      }
      if (session && selectedCard >= 2 && newCards !== cards) {
        const tableCards = newCards.slice(2).map((card) => {
          return { rank: card.rank, suit: card.suit }
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
      card.id === selectedCard ? { ...card, rank: '', suit: '', suitImage: null } : card
    )
    newCards = setActiveCards(newCards)
    setCards(newCards)
    if (selectedCard > 1) {
      socket.emit('updateTableCards', {
        cards: newCards.slice(2),
        sessionId: session.id,
        deal: currentDeal,
      })
    }
  }

  // REFRACTOR
  function setActiveCards(cards) {
    let newCards = []
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]
      if (i >= 2) {
        cards[i].isActive = false
      }
      newCards.push(card)
    }
    if (
      cards.slice(2, 4).some((card) => card.rank && card.suit) ||
      cards.slice(0, 2).every((card) => card.rank && card.suit)
    ) {
      // 3 valid
      newCards.find((card) => card.id == 2).isActive = true
      newCards.find((card) => card.id == 3).isActive = true
      newCards.find((card) => card.id == 4).isActive = true
    }
    if (cards.slice(2, 5).every((card) => card.rank && card.suit)) {
      // 4 valid
      newCards.find((card) => card.id == 5).isActive = true
    }

    if (cards.slice(2, 6).every((card) => card.rank && card.suit)) {
      // 5 valid
      newCards.find((card) => card.id == 6).isActive = true
    }
    return newCards
  }

  function onSelectCard(cardNumber) {
    setSelectedCard(cardNumber)
  }

  function isValidCards() {
    if (cards.slice(0, 2).every((card) => card.rank && card.suit)) {
      const tableCards = cards.slice(2)
      const hasInvalidCard = tableCards.some((card) => (card.suit && !card.rank) || (!card.suit && card.rank))
      if (hasInvalidCard) {
        alert('Fill in both rank and suit')
        return false
      }
      const completeCardsCount = tableCards.filter((card) => card.suit && card.rank).length
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
        return { rank: card.rank, suit: card.suit }
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
    if (cards.every((card) => !card.suit && !card.rank)) {
      socket.emit('endGame', { sessionId: session.id, currentDeal }, (round) => {
        navigation.navigate('GameBreakdown', { round })
      })
    }
    if (isValidCards()) {
      const newAllDeals = [...allDeals, { deal: currentDeal, cards }]
      setAllDeals(newAllDeals)
      const cardsData = cards.splice(0, 2).map((card) => {
        return { rank: card.rank, suit: card.suit }
      })
      socket.emit('endGame', { cards: cardsData, sessionId: session.id, currentDeal }, (round) => {
        navigation.navigate('GameBreakdown', { round })
      })
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

        <View style={{ alignItems: 'center', marginBottom: statsActive ? 0 : 40 }}>
          <Text style={{ fontWeight: '800' }}>Deal #{currentDeal}</Text>
          {session.players.length > 1 && <Text>In party with {session.players.length} players</Text>}
        </View>

        <View className={styles.myCards}>
          <Text className={styles.titleFont}>My Cards</Text>
          <View className={styles.myCardsRow} style={{ opacity: hideCards ? 0 : 1 }}>
            {cards.slice(0, 2).map((card) => {
              return (
                <TouchableOpacity key={card.id} onPress={() => onSelectCard(card.id)}>
                  <PlayingCard
                    rank={card.rank}
                    suit={card.suit}
                    isSelected={selectedCard === card.id}
                    isActive={card.isActive}
                    isBigCard={!statsActive}
                  />
                </TouchableOpacity>
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
                <TouchableOpacity key={card.id} onPress={() => onSelectCard(card.id)} disabled={!card.isActive}>
                  <PlayingCard
                    rank={card.rank}
                    suit={card.suit}
                    isSelected={selectedCard === card.id}
                    isActive={card.isActive}
                    isBigCard={false}
                  />
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </View>
      {statsActive && <InGameStatistics />}
      <EditSelection
        suits={suits}
        onSelectSuit={onSelectSuit}
        onSelectRank={onSelectRank}
        onEndGame={onEndGame}
        onClearCard={onClearCard}
        onNewDealPressed={onNewDealPressed}
      />
    </SafeAreaView>
  )
}
