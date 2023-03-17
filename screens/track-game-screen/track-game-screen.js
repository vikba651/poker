import { View, SafeAreaView, Button, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useContext, useState, useEffect, useRef } from 'react'
import Swiper from 'react-native-swiper'
import styles from './track-game-screen.scss'
import AppContext from '../../shared/AppContext'
import EditSelection from '../../components/edit-selection/edit-selection'
import InGameStatistics from '../../components/in-game-statistics/in-game-statistics'
import Cards from './cards'

export default function TrackGameScreen({ navigation, route }) {
  const initialCardsList = [
    { id: 0, suit: '', rank: '', isActive: true },
    { id: 1, suit: '', rank: '', isActive: true },
    { id: 2, suit: '', rank: '', isActive: false },
    { id: 3, suit: '', rank: '', isActive: false },
    { id: 4, suit: '', rank: '', isActive: false },
    { id: 5, suit: '', rank: '', isActive: false },
    { id: 6, suit: '', rank: '', isActive: false },
  ]

  const [statsActive, setStatsActive] = useState(false)

  const [selectedCard, setSelectedCard] = useState(0) // 0-6
  const [rankSelected, setRankSelected] = useState(false)
  const [suitSelected, setSuitSelected] = useState(false)

  const { socket, session, sessionRef, deals, setDeals } = useContext(AppContext)
  const dealsRef = useRef([])
  dealsRef.current = deals

  const [currentDeal, setCurrentDeal] = useState(0)
  const currentDealRef = useRef(0) // This kinda shit is needed to read state in ws event listeners
  currentDealRef.current = currentDeal

  const swiper = useRef(null)

  useEffect(() => {
    if (deals.length == 0) {
      setDeals([
        initialCardsList.map((card) => {
          return { ...card }
        }),
        initialCardsList.map((card) => {
          return { ...card }
        }),
      ])
    }
  }, [])

  useEffect(() => {
    setSuitSelected(false)
    setRankSelected(false)
  }, [selectedCard])

  useEffect(() => {
    socket.on('tableCardsUpdated', (tableCardsData, dealNumber) => {
      const newTableCards = tableCardsData.map((card, i) => {
        return {
          id: i + 2,
          ...card,
        }
      })
      let newDeals = [...dealsRef.current]
      if (newDeals.length <= dealNumber) {
        const dealsToCreate = dealNumber - newDeals.length + 2
        newDeals = pushNewDeals(newDeals, dealsToCreate)
      }
      let newDeal = [...newDeals[dealNumber].slice(0, 2), ...newTableCards]
      newDeal = setActiveCards(newDeal)
      newDeals[dealNumber] = newDeal
      setDeals(newDeals)
    })
  }, [socket])

  useEffect(() => {
    socket.on('connect', () => {
      if (!sessionRef.current) {
        // First connection, not reconnection
        return
      }
      socket.emit('updateTableCardsOnRejoin', { sessionId: session.id }, (dealsTableCards) => {
        const newDealsTableCards = dealsTableCards.map((deal) => {
          return deal.map((card, i) => {
            return {
              id: i + 2,
              ...card,
            }
          })
        })
        let newDeals = [...dealsRef.current]
        const dealsToCreate = Math.max(newDealsTableCards.length - newDeals.length, 0)
        if (dealsToCreate) {
          newDeals = pushNewDeals(newDeals, dealsToCreate)
        }
        newDeals = newDeals.map((deal, i) => {
          let newDeal = [...deal]
          if (newDealsTableCards[i]) {
            newDeal = [...deal.slice(0, 2), ...newDealsTableCards[i]]
          }
          newDeal = setActiveCards(newDeal)
          return newDeal
        })
        setDeals(newDeals)
      })
    })
  }, [socket])

  function pushNewDeals(deals, count) {
    for (let i = 0; i < count; i++) {
      deals.push([
        ...initialCardsList.map((card) => {
          return { ...card }
        }),
      ])
    }
    return [...deals]
  }

  function changeOneDeal(cards, dealNumber) {
    let newDeals = [...dealsRef.current]
    newDeals[dealNumber] = cards
    setDeals(newDeals)
  }

  function onSelectSuit(suit) {
    let newCards = [...deals[currentDeal]]
    newCards[selectedCard].suit = suit
    newCards = setActiveCards(newCards)
    changeOneDeal(newCards, currentDeal)
    setSuitSelected(true)

    if (newCards[selectedCard].rank) {
      if (
        selectedCard < 6 &&
        rankSelected &&
        newCards[selectedCard + 1].isActive &&
        !newCards[selectedCard + 1].suit &&
        !newCards[selectedCard + 1].rank
      ) {
        setSelectedCard(selectedCard + 1)
      }
      if (session && selectedCard >= 2 && newCards !== deals[currentDeal]) {
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
    let newCards = [...deals[currentDeal]]
    newCards[selectedCard].rank = rank
    newCards = setActiveCards(newCards)
    changeOneDeal(newCards, currentDeal)
    setRankSelected(true)

    if (newCards[selectedCard].suit) {
      if (
        selectedCard < 6 &&
        suitSelected &&
        newCards[selectedCard + 1].isActive &&
        !newCards[selectedCard + 1].suit &&
        !newCards[selectedCard + 1].rank
      ) {
        setSelectedCard(selectedCard + 1)
      }
      if (session && selectedCard >= 2 && newCards !== deals[currentDeal]) {
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
    let newCards = [...deals[currentDeal]]
    newCards[selectedCard].rank = ''
    newCards[selectedCard].suit = ''
    newCards = setActiveCards(newCards)
    changeOneDeal(newCards, currentDeal)
    if (selectedCard > 1) {
      socket.emit('updateTableCards', {
        cards: newCards.slice(2),
        sessionId: session.id,
        deal: currentDeal,
      })
    }
  }

  function setActiveCards(cards) {
    let newCards = [
      ...cards.slice(0, 2),
      ...cards.slice(2).map((card) => {
        return { ...card, isActive: false }
      }),
    ]

    if (
      cards.slice(2, 4).some((card) => card.rank && card.suit) ||
      cards.slice(0, 2).every((card) => card.rank && card.suit)
    ) {
      // 3 valid
      newCards[2].isActive = true
      newCards[3].isActive = true
      newCards[4].isActive = true
    }
    if (cards.slice(2, 5).every((card) => card.rank && card.suit)) {
      // 4 valid
      newCards[5].isActive = true
    }

    if (cards.slice(2, 6).every((card) => card.rank && card.suit)) {
      // 5 valid
      newCards[6].isActive = true
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

  function onNextDealPressed() {
    swiper.current.scrollBy(1, true)
  }

  function onIndexChanged(index) {
    setCurrentDeal(index)
    setSelectedToFirstNonFilled(index)
    if (index === deals.length - 1) {
      newDeal()
    }
  }

  function newDeal() {
    // Disabled check valid cards for now
    if (true /* isValidCards() */) {
      setSelectedCard(0)
      setDeals((prevDeals) => [
        ...prevDeals,
        initialCardsList.map((card) => {
          return { ...card }
        }),
      ])
    }
  }

  function setSelectedToFirstNonFilled(index) {
    let newSelected // Set to last card if all cards are filled in
    for (let i = 0; i < 7; i++) {
      newSelected = i
      if (!deals[index][newSelected].rank || !deals[index][newSelected].suit) {
        break
      }
    }
    setSelectedCard(newSelected)
  }

  function onEndGame() {
    // if (deal.every((card) => !card.suit && !card.rank)) {
    //   socket.emit('endGame', { sessionId: session.id, currentDeal }, (round) => {
    //     navigation.navigate('GameBreakdown', { round })
    //   })
    // }
    // if (isValidCards()) {
    //   socket.emit('endGame', { deals: deals, sessionId: session.id, currentDeal }, (round) => {
    //     navigation.navigate('GameBreakdown', { round })
    //   })
    // }
    const dealsData = deals.map((deal) =>
      deal.map((card) => {
        return {
          rank: card.rank,
          suit: card.suit,
        }
      })
    )
    socket.emit('endGame', { deals: dealsData, sessionId: session.id, currentDeal: currentDeal }, (round) => {
      navigation.navigate('GameBreakdown', { round })
    })
  }

  function toggleStats() {
    setStatsActive(!statsActive)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Swiper
        // key={currentDeal}
        ref={(s) => (swiper.current = s)}
        showsPagination={false}
        loop={false}
        onIndexChanged={onIndexChanged}
      >
        {deals.map((cards, i) => (
          <Cards
            key={i}
            cards={cards}
            currentDeal={i}
            selectedCard={selectedCard}
            onSelectCard={onSelectCard}
            statsActive={statsActive}
          ></Cards>
        ))}
      </Swiper>
      {statsActive && <InGameStatistics />}
      <EditSelection
        onSelectSuit={onSelectSuit}
        onSelectRank={onSelectRank}
        onEndGame={onEndGame}
        onClearCard={onClearCard}
        onNextDealPressed={onNextDealPressed}
      />
    </SafeAreaView>
  )
}
