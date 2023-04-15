import { View, Text } from 'react-native'
import styles from './round-achievements.scss'

export const RoundAchievements = ({ userSummaries }) => {
  const COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853']

  return (
    <View className={styles.achievementsContainer}>
      {userSummaries.map((userSummary, i) => {
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
                <Text style={{ fontWeight: '700', fontSize: '16px' }}>{userSummary.name}</Text>
                <Text style={{ fontSize: '16px' }}> - {userSummary.achievement.title}</Text>
              </Text>
              <Text style={{ fontSize: '12px' }}>{userSummary.achievement.description}</Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}
