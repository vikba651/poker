import { View, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import styles from './all-deals.scss'
import AppContext from '../../../shared/AppContext'
import Deal from '../deal/deal'

export default function AllDeals({ navigation, route }) {
  const { user } = useContext(AppContext)
  const roundSummary = route.params.roundSummary
  const roundId = route.params.roundId

  function renderDeals() {
    return roundSummary.deals.map((dealSummary, i) => (
      <Deal
        navigation={navigation}
        key={i}
        title={`Deal ${i + 1}`}
        dealSummary={dealSummary}
        roundId={roundId}
        dealNumber={i}
      />
    ))
  }

  return (
    <View className={styles.container}>
      <ScrollView className={styles.scrollView} contentContainerStyle={{ alignItems: 'center' }}>
        {renderDeals(user.name)}
        <View style={{ height: 80 }}>{/* This adds to height to make space for footerbutton */}</View>
      </ScrollView>
    </View>
  )
}
