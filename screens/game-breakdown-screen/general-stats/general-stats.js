import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'

import styles from './general-stats.scss'
import AppContext from '../../../shared/AppContext'
import { BarGraph } from '../../../components/graphs/bar-graph'
import { StackedBarGraph } from '../../../components/graphs/stacked-bar-graph'
import ComponentCard from '../../../components/component-card/component-card'
import { Grid, StackedBarChart } from 'react-native-svg-charts'
import Deal from '../deal/deal'

export default function GeneralStats({ deals, roundSummary }) {
  const [cardDistributions, setCardDistributions] = useState({ labels: [], data: [] })
  const [handResult, setHandResult] = useState({ data: [] })
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
    const newCardDistributions = { labels: cardRanks, data: cardRanks.map((_) => 0) }
    for (const cardPairs of cards) {
      for (const card of cardPairs) {
        if (card.rank) {
          const index = newCardDistributions.labels.indexOf(card.rank)
          newCardDistributions.data[index] += 1
        }
      }
    }
    setCardDistributions(newCardDistributions)
  }

  function createHandResultsData() {
    const data = {}
    for (const userSummary of roundSummary.userSummaries) {
      data[userSummary.name] = userSummary.handSummary
    }
    setHandResult({ data: data })
  }

  function getBestDeal() {
    // This function currently returns the best hand of the game of all players
    // It should return the best hand of the player holding the gittamn phone
    const data = {}
    for (const userSummary of roundSummary.userSummaries) {
      data[userSummary.name] = userSummary.bestDeal.dealtCards
      setBestDeal(userSummary.bestDeal.dealtCards)
      setBestDealType(userSummary.bestDeal.hand)
    }
  }

  useEffect(() => {
    let myCards = deals
      .map((deal) => deal.playerCards.find((cards) => cards.name === user.name)?.cards)
      .filter((cardPairs) => !!cardPairs)
    createCardDistributions(myCards)
    if (roundSummary) {
      createHandResultsData()
      getBestDeal()
    }
  }, [roundSummary])

  return (
    <ScrollView className={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 32, marginTop: 20 }}>General stats</Text>

      <ComponentCard
        title="Card Distributions"
        content={<BarGraph data={cardDistributions.data} labels={cardDistributions.labels} />}
      ></ComponentCard>
      <ComponentCard
        title="Summary of hands"
        content={<StackedBarGraph data={handResult.data} labelToStringMap={handTypeToString} bigLabels={true} />}
      ></ComponentCard>

      <Deal
        title="Best hand"
        hand={bestDealType}
        playerCards={bestDeal.slice(0, 2)}
        tableCards={bestDeal.slice(2, 7)}
      />

      {/* <LineChart
        style={{ height: 200, width: '100%' }}
        data={cardDistributions.data.map((data) => data - 1)}
        svg={{ stroke: 'rgb(134, 65, 244)', strokeWidth: 3 }}
        contentInset={{ top: 20, bottom: 20 }}
      ></LineChart> */}
    </ScrollView>
  )
}
