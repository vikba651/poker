import { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './deal.scss'
import PlayingCard from '../../../components/playing-card/playing-card'
import ComponentCard from '../../../components/component-card/component-card'
import { ArrowRightCircleIcon } from 'react-native-heroicons/outline'
import AppContext from '../../../shared/AppContext'

export default function Deal({ navigation, title, dealSummary }) {
  const { user } = useContext(AppContext)
  const [tableCards, setTableCards] = useState([])
  const [playerSummary, setPlayerSummary] = useState()
  useEffect(() => {
    setPlayerSummary(dealSummary.playerCards.find((cards) => cards.name === user.name))
    const tableCardsCount = dealSummary.tableCards.length
    const tableCardsToAdd = []
    for (let i = 0; i < 5 - tableCardsCount; i++) {
      tableCardsToAdd.push({ rank: '', suit: '' })
    }
    setTableCards([...dealSummary.tableCards, ...tableCardsToAdd])
  }, [dealSummary])

  return (
    <ComponentCard
      title={title}
      content={
        <View className={styles.container}>
          {playerSummary && (
            <View className={styles.playerCardsRow}>
              {playerSummary.cards.map((card, i) => {
                return (
                  <PlayingCard
                    key={i}
                    rank={card.rank}
                    suit={card.suit}
                    isSelected={false}
                    isActive={true}
                    isBigCard={false}
                  />
                )
              })}
              <View className={styles.summaryView}>
                <Text className={styles.handText}>{playerSummary.hand}</Text>
                <Text>{(playerSummary.winRate * 100).toFixed(0)}% win rate</Text>
                <Text>Top {playerSummary.percentile}% of hands</Text>
              </View>
            </View>
          )}
          <View className={styles.tableCardsRow}>
            {tableCards &&
              tableCards.map((card, i) => {
                return (
                  <PlayingCard
                    key={i}
                    rank={card.rank}
                    suit={card.suit}
                    isSelected={false}
                    isActive={true}
                    isBigCard={false}
                  />
                )
              })}
          </View>
          {navigation && (
            <TouchableOpacity
              className={styles.goToDealView}
              onPress={() => navigation.navigate('DealBreakdown', { dealSummary, title })}
            >
              <Text className={styles.goToDealText}>Go to deal</Text>
              <ArrowRightCircleIcon stroke="black" strokeWidth={1.5} />
            </TouchableOpacity>
          )}
        </View>
      }
    ></ComponentCard>
  )
}
