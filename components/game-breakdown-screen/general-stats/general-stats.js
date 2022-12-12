import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { Dimensions } from 'react-native'
import { BarChart, LineChart } from 'react-native-chart-kit'
import styles from './general-stats.scss'
import AppContext from '../../../shared/AppContext'

export default function GeneralStats({ deals }) {
  const [cardDistributions, setCardDistributions] = useState({
    labels: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  })

  const { user } = useContext(AppContext)

  useEffect(() => {
    let myCards = deals.map((deal) => deal.playerCards.find((cards) => cards.name === user.name)?.cards)
    const newCardDistributions = { ...cardDistributions }
    for (const cards of myCards) {
      for (const card of cards) {
        if (card.value) {
          const index = cardDistributions.labels.indexOf(card.value)
          newData.datasets[0].data[index] += 1
        }
      }
    }
    setCardDistributions(newCardDistributions)
  }, [deals])
  return (
    <SafeAreaView>
      <Text style={{ fontSize: 40, margin: 20 }}>This is general stats</Text>
      <Text>Card distributions</Text>
      <BarChart
        data={cardDistributions}
        width={Dimensions.get('window').width}
        height={200}
        fromZero={true}
        chartConfig={{
          decimalPlaces: 0,
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          barPercentage: 0.2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
      />
      <Text>Card distributions</Text>
      <LineChart
        data={cardDistributions}
        width={Dimensions.get('window').width}
        height={200}
        fromZero={true}
        chartConfig={{
          decimalPlaces: 0,
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          barPercentage: 0.2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
      />
    </SafeAreaView>
  )
}
