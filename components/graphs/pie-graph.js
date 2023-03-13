import { useEffect } from 'react'
import { Dimensions, View } from 'react-native'
import { VictoryPie } from 'victory-native'

export function PieGraph({ data }) {
  const COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853']
  const PADDING = 80
  const chartWidth = Dimensions.get('window').width - PADDING
  useEffect(() => {
    console.log(data)
  }, [])

  return (
    <VictoryPie
      padding={{ top: 30, bottom: 35, right: 0, left: 0 }}
      height={150}
      innerRadius={25}
      colorScale={COLORS}
      data={data}
    />
  )
}
