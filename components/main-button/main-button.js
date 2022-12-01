import { TouchableOpacity, Text } from 'react-native'
import { ArrowRightIcon } from 'react-native-heroicons/solid'
import styles from './main-button.scss'

export default function MainButton({ title, onPress }) {
  return (
    <TouchableOpacity className={styles.button} onPress={onPress}>
      <Text className={styles.buttonText}>{title}</Text>
      <ArrowRightIcon className={styles.icon} color="black" size={30} strokeWidth={2} />
    </TouchableOpacity>
  )
}
