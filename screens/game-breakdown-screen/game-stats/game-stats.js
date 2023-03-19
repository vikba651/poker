import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'

import styles from './game-stats.scss'
import AppContext from '../../../shared/AppContext'
import ComponentCard from '../../../components/component-card/component-card'
import Deal from '../deal/deal'
import { StackedBarGraph } from '../../../components/graphs/stacked-bar-graph'
import { StackedAreaGraph } from '../../../components/graphs/stacked-area-graph'
import { GeneralRoundStatistics } from './general-round-stats/general-round-stats'

export default function GameStats({ deals, roundSummary }) {
  const [rankDistributions, setRankDistributions] = useState()
  const [handResult, setHandResult] = useState()
  const [qualities, setQualities] = useState()
  const [bestDeal, setBestDeal] = useState([])
  const [bestDealType, setBestDealType] = useState('')
  const [dealsPlayed, setDealsPlayed] = useState(0)
  const [totalDealsCount, setTotalDealsCount] = useState(0)
  const [bestHandPercentages, setBestHandPercentages] = useState([])

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

  function createRankDistributions() {
    const cardRanks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

    const dataSets = []
    for (const deal of deals) {
      for (const playerCards of deal.playerCards) {
        const index = dataSets.findIndex((dataSet) => dataSet.name === playerCards.name)
        if (index === -1) {
          // New name found
          // Init cardRank map
          const data = cardRanks.map((cardRank) => {
            return {
              x: cardRank,
              y: 0,
            }
          })
          // Increment rank value
          for (const card of playerCards.cards) {
            data.find((datum) => datum.x === card.rank).y += 1
          }
          dataSets.push({
            name: playerCards.name,
            data: data,
          })
        } else {
          let data = dataSets.find((dataSet) => dataSet.name === playerCards.name).data

          // Increment rank value
          for (const card of playerCards.cards) {
            data.find((datum) => datum.x === card.rank).y += 1
          }
        }
      }
    }

    setRankDistributions(dataSets)
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
      dataSets.push({
        name: userSummary.name,
        data: data,
      })
    }
    setHandResult(sortPlayers(dataSets))
  }

  function createQualities() {
    const dataSets = []
    for (const userSummary of roundSummary.userSummaries) {
      const data = []
      for (let i = 0; i < userSummary.qualities.length; i++) {
        data.push({
          x: i + 1,
          y: userSummary.qualities[i],
        })
      }
      dataSets.push({
        name: userSummary.name,
        data: data,
      })
    }
    setQualities(sortPlayers(dataSets))
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

  function createGeneralRoundStats() {
    let dealsPlayed = 0
    for (const deal of deals) {
      if (deal.playerCards.find((playerCards) => playerCards.name === user.name)) {
        dealsPlayed++
      }
    }
    setDealsPlayed(dealsPlayed)
    setTotalDealsCount(deals.length)
  }

  function createBestHandDistributions() {
    // In this case best hand means highest quality. In the future we may want hand to mean full house, pair etc.
    const myDealsCount = roundSummary.userSummaries.find((userSummary) => userSummary.name === user.name).qualities
      .length
    const bestHandCounts = roundSummary.userSummaries.map((userSummary) => {
      return {
        name: userSummary.name,
        count: 0,
      }
    })
    for (let i = 0; i < myDealsCount; i++) {
      let bestHand = {
        name: '',
        quality: 0,
      }
      for (const userSummary of roundSummary.userSummaries) {
        const userQuality = userSummary.qualities.at(i)
        if (userQuality && userQuality > bestHand.quality) {
          bestHand = { name: userSummary.name, quality: userQuality }
        }
      }
      bestHandCounts.find((obj) => obj.name === bestHand.name).count++
    }
    const dataSets = bestHandCounts.map((bestHandCount) => {
      return {
        name: bestHandCount.name,
        data: (bestHandCount.count * 100) / myDealsCount,
      }
    })
    setBestHandPercentages(sortPlayers(dataSets))
  }

  /**
   * Current user first, then alphabetic order
   */
  function sortPlayers(dataSets) {
    const userDatasetIndex = dataSets.findIndex((dataset) => dataset.name === user.name)
    const userDataset = dataSets.splice(userDatasetIndex, 1)

    dataSets.sort(function (a, b) {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })
    return [...userDataset, ...dataSets]
  }

  useEffect(() => {
    let myCards = deals
      .map((deal) => deal.playerCards.find((cards) => cards.name === user.name)?.cards)
      .filter((cardPairs) => !!cardPairs)
    createRankDistributions()
    if (roundSummary) {
      createHandResultsData()
      createQualities()
      getBestDeal()
      createGeneralRoundStats()
      createBestHandDistributions()
    }
  }, [roundSummary])

  return (
    <ScrollView className={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
      <ComponentCard
        title="General round statistics"
        content={
          <GeneralRoundStatistics
            dealsPlayed={dealsPlayed}
            totalDealsCount={totalDealsCount}
            bestHandPercentages={bestHandPercentages}
          />
        }
      ></ComponentCard>
      <ComponentCard
        title="Summary of hands"
        content={<StackedBarGraph dataSets={handResult} longLabels={true} />}
      ></ComponentCard>
      <ComponentCard title="Player Card Qualities" content={<StackedAreaGraph dataSets={qualities} />}></ComponentCard>
      <ComponentCard
        title="Rank Distributions"
        content={<StackedBarGraph dataSets={rankDistributions} />}
      ></ComponentCard>
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
