import { View, Text, TouchableOpacity, Image } from 'react-native'
import styles from './edit-selection.scss'

export default function EditSelection({
  suits,
  onSelectSuit,
  onSelectValue,
  onEndGame,
  onClearCard,
  onNewDealPressed,
}) {
  const firstRowValues = ['A', '2', '3', '4', '5', '6']
  const secondRowValues = ['7', '8', '9', '10', 'J', 'Q', 'K']
  return (
    <View className={styles.boxShadow}>
      <View className={styles.editSelectionView}>
        <Text className={styles.titleFont}>Edit selection</Text>
        <View style={{ flexDirection: 'row' }}>
          {suits.map((suit) => (
            <TouchableOpacity key={suit.id} className={styles.selectionButton} onPress={() => onSelectSuit(suit)}>
              <Image className={styles.suitImage} style={{ resizeMode: 'contain' }} source={suit.image}></Image>
            </TouchableOpacity>
          ))}
        </View>

        <View className={styles.valueRows}>
          <View style={{ flexDirection: 'row' }}>
            {firstRowValues.map((value) => (
              <TouchableOpacity key={value} className={styles.selectionButton} onPress={() => onSelectValue(value)}>
                <Text className={styles.valueText}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flexDirection: 'row' }}>
            {secondRowValues.map((value) => (
              <TouchableOpacity key={value} className={styles.selectionButton} onPress={() => onSelectValue(value)}>
                <Text className={styles.valueText}>{value}</Text>
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
