import { View, Text, TouchableOpacity, Image } from 'react-native'
import styles from './edit-selection.scss'

export default function EditSelection({ suits, onSelectSuit, onSelectRank, onEndGame, onClearCard, onNewDealPressed }) {
  const firstRowRanks = ['A', '2', '3', '4', '5', '6']
  const secondRowRanks = ['7', '8', '9', '10', 'J', 'Q', 'K']
  return (
    <View className={styles.boxShadow}>
      <View className={styles.editSelectionView}>
        <Text className={styles.titleFont}>Edit selection</Text>
        <View style={{ flexDirection: 'row' }}>
          {suits.map((suit) => (
            <TouchableOpacity key={suit.id} className={styles.selectionButton} onPress={() => onSelectSuit(suit)}>
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
              onNewDealPressed()
            }}
            className={styles.footerButton}
          >
            <Text className={styles.buttonText}>New deal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
