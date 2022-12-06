import { View } from 'react-native'
import styles from './deal.scss'
import PlayingCard from '../../playing-card/playing-card'

export default function Deal({ playerCards, tableCards }) {
  return (
    <View className={styles.boxShadow}>
      <View className={styles.cardsView}>
        <View className={styles.playerCardsRow}>
          {playerCards.map((card, i) => {
            return (
              <PlayingCard
                key={i}
                value={card.value}
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
                value={card.value}
                suit={card.suit}
                isSelected={false}
                isActive={true}
                isBigCard={false}
              />
            )
          })}
        </View>
      </View>
    </View>
  )
}
