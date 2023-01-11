import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'

import styles from './general-stats.scss'
import AppContext from '../../../shared/AppContext'
import ComponentCard from '../../../components/component-card/component-card'
import Deal from '../deal/deal'
import { StackedBarGraph } from '../../../components/graphs/stacked-bar-graph'

export default function GeneralStats({ deals, roundSummary }) {
  const [cardDistributions, setCardDistributions] = useState()
  const [handResult, setHandResult] = useState()
  const [myQualities, setMyQualities] = useState()
  const [bestDeal, setBestDeal] = useState([])
  const [bestDealType, setBestDealType] = useState('')

  const { user } = useContext(AppContext)

  const handTypeToString = {
    straightFlushes: 'Straight flush',
    quads: 'Quad',
    fullHouses: 'Full house',
    flushes: 'Flush',
    straights: 'Straight',
    triples: 'Triple',
    twoPairs: 'Two pair',
    pairs: 'Pair',
    highCards: 'High card',
  }

  function createCardDistributions(cards) {
    const cardRanks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    const data = cardRanks.map((cardRank) => {
      return {
        x: cardRank,
        y: 0,
      }
    })
    for (const cardPairs of cards) {
      for (const card of cardPairs) {
        data.find((datum) => datum.x === card.rank).y += 1
      }
    }
    setCardDistributions([{ name: user.name, data: data }])
  }

  function createHandResultsData() {
    const dataSets = []
    for (const userSummary of roundSummary.userSummaries) {
      let data = []
      for (const key in userSummary.handSummary) {
        data.push({
          x: handTypeToString[key],
          y: userSummary.handSummary[key],
        })
      }
      if (userSummary.name === user.name) {
        // Make sure my hand results comes first
        dataSets.unshift({
          name: userSummary.name,
          data: data,
        })
      } else {
        dataSets.push({
          name: userSummary.name,
          data: data,
        })
      }
    }
    setHandResult(dataSets)
  }

  function createMyQualities() {
    const newMyQualities = roundSummary.userSummaries.find((summary) => summary.name === user.name)?.qualities
    let data = []
    for (let i = 0; i < newMyQualities.length; i++) {
      data.push({
        x: i + 1,
        y: newMyQualities[i],
      })
    }
    setMyQualities([{ name: user.name, data: data }])
  }

  function getBestDeal() {
    // This function currently returns the best hand of the game of all players
    // It should return the best hand of the player holding the gittamn phone
    const data = {}
    for (const userSummary of roundSummary.userSummaries) {
      if (userSummary.name == user.name) {
        data[userSummary.name] = userSummary.bestDeal.dealtCards
        setBestDeal(userSummary.bestDeal.dealtCards)
        setBestDealType(userSummary.bestDeal.hand)
      }
    }
  }

  useEffect(() => {
    let myCards = deals
      .map((deal) => deal.playerCards.find((cards) => cards.name === user.name)?.cards)
      .filter((cardPairs) => !!cardPairs)
    createCardDistributions(myCards)
    if (roundSummary) {
      createHandResultsData()
      createMyQualities()
      getBestDeal()
    }
  }, [roundSummary])

  return (
    <ScrollView className={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
      <ComponentCard
        title="Summary of hands"
        content={<StackedBarGraph dataSets={handResult} longLabels={true} />}
      ></ComponentCard>
      <ComponentCard
        title="Card Distributions"
        content={<StackedBarGraph dataSets={cardDistributions} />}
      ></ComponentCard>
      <ComponentCard title="My Hand Qualities" content={<StackedBarGraph dataSets={myQualities} />}></ComponentCard>
      <Deal
        title="Best hand"
        hand={bestDealType}
        playerCards={bestDeal.slice(0, 2)}
        tableCards={bestDeal.slice(2, 7)}
      />
      <View style={{ height: 80 }}>{/* This adds to height to make space for footerbutton */}</View>
    </ScrollView>
  )
}
