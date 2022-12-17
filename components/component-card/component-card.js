import { View, Text } from 'react-native'
import styles from './component-card.scss'

export default function ComponentCard({ title, content }) {
  return (
    <View className={styles.boxShadow}>
      <View className={styles.cardView}>
        {title && <Text className={styles.cardTitle}>{title}</Text>}
        {content}
      </View>
    </View>
  )
}
