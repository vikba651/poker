import { View, Text, TouchableOpacity, Image } from 'react-native'
import heart from '../../assets/heart.png'
import spade from '../../assets/spade.png'
import diamond from '../../assets/diamond.png'
import club from '../../assets/club.png'
import styles from './edit-selection.scss'
import ComponentCard from '../component-card/component-card'

export default function EditSelection({ onSelectSuit, onSelectRank, onEndGame, onClearCard, onNextDealPressed }) {
  const suits = [
    {
      id: 'heart',
      image: heart,
    },
    {
      id: 'spade',
      image: spade,
    },
    {
      id: 'diamond',
      image: diamond,
    },
    {
      id: 'club',
      image: club,
    },
  ]
  const firstRowRanks = ['A', '2', '3', '4', '5', '6']
  const secondRowRanks = ['7', '8', '9', '10', 'J', 'Q', 'K']
  return (
    <ComponentCard
      title={'Edit selection'}
      centerTitle={true}
      content={
        <View className={styles.editSelectionView}>
          <View style={{ flexDirection: 'row' }}>
            {suits.map((suit) => (
              <TouchableOpacity key={suit.id} className={styles.selectionButton} onPress={() => onSelectSuit(suit.id)}>
                <View className={styles.selectionButtonView}>
                  <Image className={styles.suitImage} style={{ resizeMode: 'contain' }} source={suit.image}></Image>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View className={styles.rankRows}>
            <View style={{ flexDirection: 'row' }}>
              {firstRowRanks.map((rank) => (
                <TouchableOpacity key={rank} className={styles.selectionButton} onPress={() => onSelectRank(rank)}>
                  <View className={styles.selectionButtonView}>
                    <Text className={styles.rankText}>{rank}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row' }}>
              {secondRowRanks.map((rank) => (
                <TouchableOpacity key={rank} className={styles.selectionButton} onPress={() => onSelectRank(rank)}>
                  <View className={styles.selectionButtonView}>
                    <Text className={styles.rankText}>{rank}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className={styles.footerButtonsView}>
            <TouchableOpacity onPress={() => onEndGame()} className={styles.footerButton}>
              <Text className={styles.buttonText}>End game</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onClearCard()} className={styles.footerButton}>
              <Text className={styles.buttonText}>Clear card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onNextDealPressed()
              }}
              className={styles.footerButton}
            >
              <Text className={styles.buttonText}>New deal</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    ></ComponentCard>
  )
}
