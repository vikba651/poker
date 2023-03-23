import { useEffect } from 'react'
import { Dimensions, View } from 'react-native'
import { VictoryPie } from 'victory-native'

export function PieGraph({ data }) {
  const COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853']

  return (
    <VictoryPie
      padding={{ top: 40, bottom: 40, right: 0, left: 0 }}
      height={170}
      innerRadius={25}
      colorScale={COLORS}
      data={data}
    />
  )
}
