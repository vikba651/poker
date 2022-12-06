import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import styles from './in-game-statistics.scss'

export default function InGameStatistics() {
  const stats = [
    { id: 0, title: 'Hand Quality', percentage: 84 },
    { id: 1, title: 'Pair chance', percentage: 64 },
    { id: 2, title: 'Straight chance', percentage: 57 },
    { id: 3, title: 'Triple chance', percentage: 43 },
    { id: 4, title: 'Flush chance', percentage: 27 },
  ]
  return (
    <View className={styles.boxShadow}>
      <View className={styles.statsView}>
        <Text className={styles.titleFont}>Stats</Text>

        <ScrollView horizontal>
          <View className={styles.statsRow}>
            {stats.map((stat) => (
              <TouchableOpacity key={stat.id}>
                <View className={styles.statistic}>
                  <Text className={styles.statisticTitle}>{stat.title}</Text>
                  <Text className={styles.statisticResult}>{stat.percentage}%</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
