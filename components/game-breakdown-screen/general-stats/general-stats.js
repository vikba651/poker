import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'

import styles from './general-stats.scss'
import AppContext from '../../../shared/AppContext'
import { BarGraph } from '../../charts/bar-chart/bar-chart'

export default function GeneralStats({ deals, roundSummary }) {
  const [cardDistributions, setCardDistributions] = useState({ labels: [], data: [] })
  const [handResult, setHandResult] = useState({ labels: [], data: [] })

  const { user } = useContext(AppContext)

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

  function createHandResultsData(name) {
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
    console.log('roundSummary', roundSummary)
    const userHandSummary = roundSummary.userSummaries.find((summary) => summary.name === name)?.handSummary
    let data = []
    let labels = []
    for (const handType in userHandSummary) {
      labels.push(handTypeToString[handType])
      data.push(userHandSummary[handType])
    }
    setHandResult({ data, labels })
    console.log({ data, labels })
  }

  useEffect(() => {
    let myCards = deals
      .map((deal) => deal.playerCards.find((cards) => cards.name === user.name)?.cards)
      .filter((cardPairs) => !!cardPairs)
    createCardDistributions(myCards)
    if (roundSummary) {
      createHandResultsData(user.name)
    }
  }, [roundSummary])

  return (
    <SafeAreaView className={styles.container}>
      <Text style={{ fontSize: 32, marginTop: 20 }}>General stats</Text>

      <View className={styles.boxShadow}>
        <View className={styles.card}>
          <Text className={styles.statsTitle}>Card distributions</Text>
          <BarGraph data={cardDistributions.data} labels={cardDistributions.labels} />
        </View>
      </View>
      <View className={styles.boxShadow}>
        <View className={styles.card}>
          <Text className={styles.statsTitle}>Summary of hands</Text>
          <BarGraph data={handResult.data} labels={handResult.labels} bigLabel={true} />
        </View>
      </View>

      {/* <LineChart
        style={{ height: 200, width: '100%' }}
        data={cardDistributions.data.map((data) => data - 1)}
        svg={{ stroke: 'rgb(134, 65, 244)', strokeWidth: 3 }}
        contentInset={{ top: 20, bottom: 20 }}
      ></LineChart> */}
    </SafeAreaView>
  )
}
