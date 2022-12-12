import { View, Image, Text } from 'react-native'
import styles from './playing-card.scss'
import heart from '../../../assets/heart.png'
import spade from '../../../assets/spade.png'
import diamond from '../../../assets/diamond.png'
import club from '../../../assets/club.png'

export default function PlayingCard({ value, suit, isSelected, isActive, isBigCard }) {
  function getCardStyles() {
    let cardStyles = [styles.card, isSelected ? styles.selectedCard : styles.notSelectedCard]
    if (isBigCard) {
      cardStyles.push(styles.bigCard)
    }
    return cardStyles
  }

  const suitImages = { heart: heart, spade: spade, diamond: diamond, club: club }

  return (
    <View className={getCardStyles()}>
      <Image
        className={isBigCard ? styles.bigCardSuit : styles.cardSuit}
        style={{ resizeMode: 'contain' }}
        source={suitImages[suit]}
      />

      <Text className={styles.cardTopValue}>{value}</Text>
      <Text className={styles.cardBottomValue}>{value}</Text>
      {!isActive && <View className={[styles.card, styles.disabledCard]}></View>}
    </View>
  )
}
