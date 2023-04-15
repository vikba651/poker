import { Text } from 'react-native'

export function BottomText({ toggleBestHandPercentages, bestHandPercentages }) {
  return (
    <Text style={{ marginTop: 20 }}>
      <Text>You had the best {toggleBestHandPercentages ? 'player cards' : 'hand'} in </Text>
      <Text style={{ fontWeight: '700' }}>{bestHandPercentages.at(0).data.toFixed(1)}%</Text>
      <Text> of the deals</Text>
    </Text>
  )
}
