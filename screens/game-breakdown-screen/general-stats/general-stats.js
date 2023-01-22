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

    const dataSets = []
    for (const deal of deals) {
      for (const playerCards of deal.playerCards) {
        // console.log(playerCards.name, playerCards.cards)
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

    setCardDistributions(sortPlayers(dataSets))
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
