import { TouchableOpacity, Text } from 'react-native'
import styles from './secondary-button.scss'
import { ArrowRightIcon } from 'react-native-heroicons/solid'
import { UserGroupIcon } from 'react-native-heroicons/outline'

export default function SecondaryButton({ title, onPress, icon, color }) {
  return (
    <TouchableOpacity className={styles.button} onPress={onPress} style={{ backgroundColor: color ?? '#22a72f' }}>
      <Text className={styles.buttonText}>{title}</Text>
      {icon && icon}
    </TouchableOpacity>
  )
}
