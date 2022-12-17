import { TouchableOpacity, Text } from 'react-native'
import styles from './secondary-button.scss'

export default function SecondaryButton({ title, onPress, icon, color }) {
  return (
    <TouchableOpacity className={styles.button} onPress={onPress} style={{ backgroundColor: color ?? '#22a72f' }}>
      <Text className={styles.buttonText}>{title}</Text>
      {icon && icon}
    </TouchableOpacity>
  )
}
