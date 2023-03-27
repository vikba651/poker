import { useContext, useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
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
  const roundId = route.params.roundId
  const dealNumber = route.params.dealNumber

  const fetchDealWinProbabilities = async (id, dealNumber) => {
    let dealWinProbabilities = await getDealWinProbabilities(id, dealNumber)
    console.log(JSON.stringify(dealWinProbabilities))
    dealWinProbabilities = dealWinProbabilities.map((winProbabilities) => {
      const name = winProbabilities.name
      const data = [{ x: 'Pre-Flop', y: winProbabilities.probabilities[0] * 100 }]
      const phases = ['Flop', 'Turn', 'River']
      phases.forEach((phase, i) => {
        data.push({
          x: phase,
          y: winProbabilities.probabilities[i + 1] ? winProbabilities.probabilities[i + 1] * 100 : data[i].y,
        })
      })
      return { name, data }
    })
    console.log(JSON.stringify(dealWinProbabilities))
    setDealWinProbabilities(dealWinProbabilities)
  }

  useEffect(() => {
    fetchDealWinProbabilities(roundId, dealNumber)
  }, [])

  useEffect(() => {}, [])
  return (
    <View className={styles.container}>
      <ScrollView className={styles.playersView}>
        <Text className={styles.title}>{title}</Text>
        <ComponentCard
          title="Player Card Qualities"
          content={<StackedAreaGraph dataSets={dealWinProbabilities} />}
        ></ComponentCard>
        <ComponentCard
          content={
            <>
              <Text className={styles.cardTitle}>Cards on Table</Text>
              <View className={styles.cardRow}>
                {dealSummary.tableCards.map((tableCard, i) => (
                  <PlayingCard rank={tableCard.rank} suit={tableCard.suit} isActive={true} key={i} />
                ))}
              </View>
              {playerSummaries.map((playerSummary, i) => (
                <View className={styles.playerView} key={i}>
                  <View className={styles.playerCardsView}>
                    <Text className={styles.playerPosition}>{playerSummary.position}</Text>
                    <Text className={styles.playerName}> - {playerSummary.name}</Text>
                  </View>
                  <View className={styles.cardRow}>
                    {playerSummary.cards.map((playerCard, j) => (
                      <PlayingCard rank={playerCard.rank} suit={playerCard.suit} isActive={true} key={j} />
                    ))}
                    <View className={styles.summaryView}>
                      <Text className={styles.handText}>{playerSummary.hand}</Text>
                      <Text>{(playerSummary.winRate * 100).toFixed(0)}% win rate</Text>
                      <Text>Top {playerSummary.percentile}% of hands</Text>
                    </View>
                  </View>
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
