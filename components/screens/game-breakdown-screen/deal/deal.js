import { View, Text } from 'react-native'
import styles from './deal.scss'
import PlayingCard from '../../../custom-components/playing-card/playing-card'
import ComponentCard from '../../../custom-components/component-card/component-card'

export default function Deal({ playerCards, tableCards, title, hand }) {
  return (
    <ComponentCard
      title={title}
      content={
        <>
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
        </>
      }
    ></ComponentCard>
  )
}
