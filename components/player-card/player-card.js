import { View, TextInput, Text, TouchableOpacity } from 'react-native'
import styles from './player-card.scss'

export default function PlayerCard({
  player,
  onChangeName,
  onChangeBuyIn,
  onChangeChipsLeft,
  onDeletePlayer,
}) {
  return (
    <View key={player.id} className={styles.playerCard}>
      <View className={styles.topRow}>
        <TextInput
          key={'name' + player.id}
          onChangeText={(text) => onChangeName(text, player.id)}
          value={player.name}
          placeholder="Player name"
          maxLength={25}
          className={styles.textInput}
          style={{ flexGrow: 2 }}
        />
        <TouchableOpacity onPress={() => onDeletePlayer(player.id)}>
          <Text className={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
      <View className={styles.bottomRow}>
        <TextInput
          key={'buyIn' + player.id}
          keyboardType="numeric"
          onChangeText={(text) => onChangeBuyIn(text, player.id)}
          value={player.buyIn}
          placeholder="Buy in"
          maxLength={10}
          className={[styles.textInput, styles.bottomRowInput]}
          style={{ marginRight: 10 }}
        />
        <TextInput
          key={'chipsLeft' + player.id}
          keyboardType="numeric"
          onChangeText={(text) => onChangeChipsLeft(text, player.id)}
          value={player.chipsLeft}
          placeholder="Chips left"
          maxLength={10}
          className={[styles.textInput, styles.bottomRowInput]}
        />
      </View>
    </View>
  )
}
