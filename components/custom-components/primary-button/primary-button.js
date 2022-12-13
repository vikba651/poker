import { TouchableOpacity, Text } from 'react-native'
import { ArrowRightIcon } from 'react-native-heroicons/solid'
import { UserGroupIcon } from 'react-native-heroicons/outline'
import styles from './primary-button.scss'

export default function PrimaryButton({ title, onPress, icon, color }) {
  return (
    <TouchableOpacity className={styles.button} onPress={onPress} style={{ backgroundColor: color ?? '#F6F6F6' }}>
      <Text className={styles.buttonText}>{title}</Text>
      {icon && icon}
    </TouchableOpacity>
  )
}
