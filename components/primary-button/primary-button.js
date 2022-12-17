import { TouchableOpacity, Text } from 'react-native'
import styles from './primary-button.scss'

export default function PrimaryButton({ title, onPress, icon }) {
  return (
    <TouchableOpacity className={styles.button} onPress={onPress}>
      <Text className={styles.buttonText}>{title}</Text>
      {icon && icon}
    </TouchableOpacity>
  )
}
