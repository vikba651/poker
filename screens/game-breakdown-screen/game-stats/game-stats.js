import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'

import styles from './game-stats.scss'
import AppContext from '../../../shared/AppContext'
import ComponentCard from '../../../components/component-card/component-card'
import Deal from '../deal/deal'
import { StackedBarGraph } from '../../../components/graphs/stacked-bar-graph'
import { LineGraph } from '../../../components/graphs/stacked-line-graph'
import { StackedAreaGraph } from '../../../components/graphs/stacked-area-graph'
import { GeneralRoundStatistics } from './general-round-stats/general-round-stats'
import { RoundAchievements } from './round-achievements/round-achievements'

export default function GameStats({ navigation, deals, roundSummary, roundId }) {
  const [isLoading, setIsLoading] = useState(true)
  const [rankDistributions, setRankDistributions] = useState()
  const [handResult, setHandResult] = useState()
  const [qualities, setQualities] = useState()
  const [yourBestDealIndex, setYourBestDealIndex] = useState(-1)
  const [roundBestDeal, setRoundBestDeal] = useState(false)
  const [dealsPlayed, setDealsPlayed] = useState(0)
  const [totalDealsCount, setTotalDealsCount] = useState(1)
  const [bestHandPercentages, setBestHandPercentages] = useState([])
  const [toggleBestHandPercentages, setToggleBestHandPercentages] = useState(false)

  const { user } = useContext(AppContext)
  const players = deals.reduce((players, deal) => {
    deal.playerCards.forEach((playerCards) => {
      if (!players.find((player) => player == playerCards.name)) {
        players.push(playerCards.name)
      }
    })
    return players
  }, [])

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
            const rankData = data.find((datum) => datum.x === card.rank)
            if (rankData) {
              rankData.y += 1
            }
          }
        }
      }
    }

    setRankDistributions(sortPlayers(dataSets))
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
        data,
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

  function getYourBestDeal() {
    const yourBestDealIndex = roundSummary.userSummaries.find(
      (userSummary) => userSummary.name === user.name
    ).bestDealIndex
    setYourBestDealIndex(yourBestDealIndex)
  }

  function getRoundBestDeal() {
    let currentMaxScore = 0
    let newRoundBestDeal = false
    roundSummary.deals.forEach((deal, index) => {
      deal.playerCards.forEach((playerCards) => {
        if (playerCards.score && playerCards.score > currentMaxScore) {
          currentMaxScore = playerCards.score
          newRoundBestDeal = { ...playerCards, index }
        }
      })
    })

    setRoundBestDeal(newRoundBestDeal)
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

  function createBestHandDistributions(showBestHandPercentages) {
    const myDealsCount = roundSummary.deals.reduce((count, deal) => {
      if (
        deal.playerCards.find((playerCards) => {
          return playerCards.name == user.name
        })
      ) {
        count++
      }
      return count
    }, 0)
    let bestHandCounts
    if (!showBestHandPercentages) {
      bestHandCounts = roundSummary.userSummaries.map((userSummary) => {
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
    } else {
      bestHandCounts = roundSummary.deals.reduce(
        (bestHandCounts, deal) => {
          if (!deal.playerCards.length) throw 'Players Cards are empty'
          if (
            !deal.playerCards.find((playerCards) => {
              return playerCards.name == user.name
            })
          ) {
            //Don't count rounds the use didn't take part of
            return bestHandCounts
          }
          let bestHand = deal.playerCards.reduce((bestHand, hand) => (bestHand.score > hand.score ? bestHand : hand))
          bestHandCounts[bestHandCounts.findIndex((bestHandCount) => bestHandCount.name == bestHand.name)].count++

          return bestHandCounts
        },
        players.map((player) => {
          return { name: player, count: 0 }
        })
      )
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
      getYourBestDeal()
      getRoundBestDeal()
      createGeneralRoundStats()
      createBestHandDistributions(toggleBestHandPercentages)
      setIsLoading(false)
    }
  }, [roundSummary])

  return (
    <ScrollView className={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
      {isLoading ? (
        <ActivityIndicator style={{ flex: 1, marginTop: '50%' }} />
      ) : (
        <>
          <RoundAchievements userSummaries={sortPlayers(roundSummary.userSummaries)} />
          <TouchableOpacity
            onPress={() => {
              createBestHandDistributions(!toggleBestHandPercentages)
              setToggleBestHandPercentages(!toggleBestHandPercentages)
            }}
            style={{ width: '100%', alignItems: 'center' }}
          >
            <ComponentCard
              title="General round statistics"
              content={
                <GeneralRoundStatistics
                  dealsPlayed={dealsPlayed}
                  totalDealsCount={totalDealsCount}
                  bestHandPercentages={bestHandPercentages}
                  toggleBestHandPercentages={toggleBestHandPercentages}
                />
              }
              infoModalContent="Best hand describes the best 5 card combination"
            ></ComponentCard>
          </TouchableOpacity>
          <ComponentCard
            title="Summary of hands"
            content={<StackedBarGraph dataSets={handResult} longLabels={true} />}
          ></ComponentCard>
          <ComponentCard
            title="Player Card Qualities"
            content={<LineGraph dataSets={qualities} />}
            infoModalContent="Player card qualities describes the probability of the player cards winning against any other player cards and table cards pre-flop in a lobby the same size. This is computed with simulations. If the winners have the same hand, the win is divided by the amount of winners. For each combination of player cards more than 20K simulated games has been computed."
          ></ComponentCard>
          {yourBestDealIndex > -1 && (
            <Deal
              navigation={navigation}
              title={`Your Best Hand - Deal ${yourBestDealIndex + 1}`}
              dealSummary={roundSummary.deals[yourBestDealIndex]}
              roundId={roundId}
              dealNumber={yourBestDealIndex}
            />
          )}
          <ComponentCard
            title="Rank Distributions"
            content={<StackedBarGraph dataSets={rankDistributions} />}
            infoModalContent="Rank distribution describes the amount of player cards of each rank the players in the lobby has been dealt."
          ></ComponentCard>
          {roundBestDeal && (
            <Deal
              navigation={navigation}
              title={`Rounds Best Hand - ${roundBestDeal.name} Deal ${roundBestDeal.index + 1}`}
              dealSummary={roundSummary.deals[roundBestDeal.index]}
              roundId={roundId}
              dealNumber={roundBestDeal.index + 1}
              player={roundBestDeal.name}
            />
          )}
          <View style={{ height: 80 }}>{/* This adds to height to make space for footerbutton */}</View>
        </>
      )}
    </ScrollView>
  )
}
