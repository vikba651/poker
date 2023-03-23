import { useContext, useEffect } from 'react'
import { View, Text, ScrollView } from 'react-native'
import PlayingCard from '../../../components/playing-card/playing-card'
import AppContext from '../../../shared/AppContext'
import Deal from '../deal/deal'
import styles from './deal-breakdown.scss'

export default function DealBreakdown({ route }) {
  const { user } = useContext(AppContext)
  const title = route.params.title
  const dealSummary = route.params.dealSummary
  const otherUsersPlayerSummaries = dealSummary.playerCards.filter((playerCards) => playerCards.name !== user.name)

  useEffect(() => {}, [])
  return (
    <View className={styles.container}>
      <Text className={styles.title}>{title}</Text>
      <Deal title={user.name} dealSummary={dealSummary} />
      <ScrollView className={styles.otherPlayersView}>
        {otherUsersPlayerSummaries.map((playerSummary, i) => (
          <View className={styles.playerView} key={i}>
            <Text className={styles.playerName}>{playerSummary.name}</Text>
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
      </ScrollView>
    </View>
  )
}
