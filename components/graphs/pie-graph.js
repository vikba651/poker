import { useEffect, useState } from 'react'
import { Dimensions, View } from 'react-native'
import { VictoryPie, VictoryLabel } from 'victory-native'

export function PieGraph({ data }) {
  const COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853']
  const [endAngle, setEndAngle] = useState(0)
  const [textOpacity, setTextOpacity] = useState(0.1)

  useEffect(() => {
    setTimeout(() => {
      setEndAngle(360)
    }, 100)
  }, [])

  return (
    <VictoryPie
      animate={{
        duration: 300,
        delay: 0,
        onLoad: { duration: 1200 },
        onEnd: () => {
          setTextOpacity(1)
        },
      }}
      style={{
        labels: {
          opacity: textOpacity,
        },
      }}
      padding={{ top: 40, bottom: 40, right: 0, left: 0 }}
      height={170}
      innerRadius={25}
      colorScale={COLORS}
      endAngle={endAngle}
      data={data}
      labels={({ datum }) => datum.x}
      labelComponent={<VictoryLabel />}
    />
  )
}
