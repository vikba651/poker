import { View, Image, Text } from 'react-native'
import styles from './playing-card.scss'
import heart from '../../assets/heart.png'
import spade from '../../assets/spade.png'
import diamond from '../../assets/diamond.png'
import club from '../../assets/club.png'

export default function PlayingCard({ rank, suit, isSelected, isActive, isBigCard }) {
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
      {isActive ? (
        <>
          <Image
            key={suitImages[suit]}
            className={isBigCard ? styles.bigCardSuit : styles.cardSuit}
            style={{ resizeMode: 'contain' }}
            source={suitImages[suit]}
          />
          <Text className={isBigCard ? styles.bigCardTopRank : styles.cardTopRank}>{rank}</Text>
          <Text className={isBigCard ? styles.bigCardBottomRank : styles.cardBottomRank}>{rank}</Text>
        </>
      ) : (
        <View className={[styles.card, styles.disabledCard]}></View>
      )}
      {/* {!isActive && <View className={[styles.card, styles.disabledCard]}></View>} */}
    </View>
  )
}
