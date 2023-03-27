import { useContext, useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import PlayingCard from '../../../components/playing-card/playing-card'
import AppContext from '../../../shared/AppContext'
import { getDealWinProbabilities } from '../../../shared/api'
import styles from './deal-breakdown.scss'
import ComponentCard from '../../../components/component-card/component-card'
import { StackedAreaGraph } from '../../../components/graphs/stacked-area-graph'

export default function DealBreakdown({ route }) {
  const { user } = useContext(AppContext)
  const [dealWinProbabilities, setDealWinProbabilities] = useState(null)

  const title = route.params.title
  const dealSummary = route.params.dealSummary
  let playerSummaries = dealSummary.playerCards.sort((a, b) => {
    return b.score - a.score
  })

  const [markedPlayerSummary, setMarkedPlayerSummary] = useState(playerSummaries[0])

  function isMarked(suit, rank) {
    return markedPlayerSummary.bestCards.find((card) => {
      return card.suit == suit && card.rank == rank
    })
  }

  function getStringPosition(n) {
    if (n == 0) return '1st'
    if (n == 1) return '2nd'
    if (n == 3) return '3rd'
    //Can't be more than 20 players so 21st is impossible ;)
    return `${n + 1}th`
  }

  let position = 0
  for (let i = 0; i < playerSummaries.length; i++) {
    playerSummaries[i].position = getStringPosition(position)
    if (playerSummaries[i + 1]) {
      if (playerSummaries[i + 1].score !== playerSummaries[i].score) position++
    }
  }
  const tableCards = dealSummary.tableCards
  for (let i = 0; i < 5 - tableCards.length; i++) {
    tableCards.push({ rank: '', suit: '' })
  }
  const roundId = route.params.roundId
  const dealNumber = route.params.dealNumber

  const fetchDealWinProbabilities = async (id, dealNumber) => {
    let dealWinProbabilities = await getDealWinProbabilities(id, dealNumber)
    dealWinProbabilities = dealWinProbabilities.map((winProbabilities) => {
      const name = winProbabilities.name
      const data = [{ x: 'Pre-Flop', y: winProbabilities.probabilities[0] * 100 }]
      const phases = ['Flop', 'Turn', 'River']
      phases.forEach((phase, i) => {
        data.push({
          x: phase,
          y: winProbabilities.probabilities.length > i + 1 ? winProbabilities.probabilities[i + 1] * 100 : data[i].y,
        })
      })
      return { name, data }
    })
    setDealWinProbabilities(dealWinProbabilities)
  }

  useEffect(() => {
    fetchDealWinProbabilities(roundId, dealNumber)
  }, [])

  return (
    <View className={styles.container}>
      <ScrollView className={styles.playersView}>
        <Text className={styles.title}>{title}</Text>
        <ComponentCard
          title="Win Chances"
          content={<StackedAreaGraph dataSets={dealWinProbabilities} />}
        ></ComponentCard>
        <ComponentCard
          content={
            <>
              <Text className={styles.cardTitle}>Cards on Table</Text>
              <View className={styles.cardRow}>
                {tableCards.map((tableCard, i) => (
                  <PlayingCard
                    rank={tableCard.rank}
                    suit={tableCard.suit}
                    isActive={true}
                    key={i}
                    isSelected={isMarked(tableCard.suit, tableCard.rank)}
                  />
                ))}
              </View>
              {playerSummaries.map((playerSummary, i) => (
                <View
                  className={
                    (styles.playerView, markedPlayerSummary.name == playerSummary.name ? styles.markedPlayerView : null)
                  }
                  key={i}
                >
                  <View className={styles.playerCardsView}>
                    <Text className={styles.playerPosition}>{playerSummary.position}</Text>
                    <Text className={styles.playerName}> - {playerSummary.name}</Text>
                  </View>
                  <TouchableOpacity
                    className={styles.cardRow}
                    onPress={() => {
                      setMarkedPlayerSummary(playerSummary)
                    }}
                  >
                    {playerSummary.cards.map((playerCard, j) => (
                      <PlayingCard
                        rank={playerCard.rank}
                        suit={playerCard.suit}
                        isActive={true}
                        key={j}
                        isSelected={isMarked(playerCard.suit, playerCard.rank)}
                      />
                    ))}
                    <View className={styles.summaryView}>
                      <Text className={styles.handText}>{playerSummary.hand}</Text>
                      <Text>{(playerSummary.winRate * 100).toFixed(0)}% win rate</Text>
                      <Text>Top {playerSummary.percentile}% of hands</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
              <View style={{ height: 40 }}></View>
            </>
          }
        ></ComponentCard>
      </ScrollView>
    </View>
  )
}
