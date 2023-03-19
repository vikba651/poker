import { View, Text, Button, TouchableOpacity } from 'react-native'
import styles from './deal.scss'
import PlayingCard from '../../../components/playing-card/playing-card'
import ComponentCard from '../../../components/component-card/component-card'
import { ArrowRightCircleIcon } from 'react-native-heroicons/outline'

export default function Deal({ playerCards, tableCards, title, hand }) {
  return (
    <ComponentCard
      title={title}
      content={
        <View style={{ alignItems: 'center' }}>
          {hand && <Text className={styles.dealTitle}>{hand}</Text>}
          <View className={styles.playerCardsRow}>
            {playerCards.map((card, i) => {
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
          <View className={styles.tableCardsRow}>
            {tableCards.map((card, i) => {
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
          <TouchableOpacity className={styles.goToDealView}>
            <Text className={styles.goToDealText}>Go to deal</Text>
            <ArrowRightCircleIcon stroke="black" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      }
    ></ComponentCard>
  )
}
