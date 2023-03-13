import { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { PieGraph } from '../../../../components/graphs/pie-graph'
import { ProgressBar } from '../../../../components/graphs/progress-bar'

export function GeneralRoundStatistics({ dealsPlayed, totalDealsCount, bestHandPercentages }) {
  const HORIZONTAL_PADDING = 30
  const [pieData, setPieData] = useState([])

  useEffect(() => {
    setPieData(
      bestHandPercentages.map((bestHandPercentage) => {
        return {
          x: `${bestHandPercentage.name}: ${bestHandPercentage.data.toFixed(1)}%`,
          y: bestHandPercentage.data,
        }
      })
    )
  }, [bestHandPercentages])
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: HORIZONTAL_PADDING }}>
      <Text style={{ paddingBottom: 13 }}>
        <Text>You played</Text>
        <Text style={{ fontWeight: '700' }}> {dealsPlayed} </Text>
        <Text>out of</Text>
        <Text style={{ fontWeight: '700' }}> {totalDealsCount} </Text>
        <Text>deals</Text>
      </Text>
      <ProgressBar progress={dealsPlayed} total={totalDealsCount} />
      {bestHandPercentages.length ? (
        <>
          <Text style={{ marginTop: 20 }}>
            <Text>You had the best hand in </Text>
            <Text style={{ fontWeight: '700' }}>{bestHandPercentages.at(0).data.toFixed(1)}%</Text>
            <Text> of the deals</Text>
          </Text>
          <PieGraph data={pieData} />
        </>
      ) : null}
    </View>
  )
}
