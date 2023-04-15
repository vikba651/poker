import { View, Text } from 'react-native'
import styles from './round-achievements.scss'

export const RoundAchievements = ({ achievements }) => {
  const COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853']

  return (
    <View className={styles.achievementsContainer}>
      {achievements.map((achievement, i) => {
        return (
          <View className={styles.achievementContainer} key={i}>
            <View
              className={styles.achievementColor}
              style={{
                backgroundColor: COLORS[i],
              }}
            ></View>
            <View className={styles.achievementText}>
              <Text>
                <Text style={{ fontWeight: '700', fontSize: 16 }}>{achievement.name}</Text>
                <Text style={{ fontSize: 16 }}> - {achievement.title}</Text>
              </Text>
              <Text style={{ fontSize: 12 }}>{achievement.description}</Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}
