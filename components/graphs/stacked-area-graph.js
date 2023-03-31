import { ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { VictoryArea, VictoryChart, VictoryStack, VictoryAxis, VictoryLegend } from 'victory-native'

/**
 *
 * @param dataSets: [{name: "dude", data: [{x: label1, y: value1}, {x: label2,  y: value2}]}]
 * @returns
 */
export function StackedAreaGraph({ dataSets }) {
  const COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853']
  const MIN_WIDTH = 340

  const [legend, setLegend] = useState([])
  const [width, setWidth] = useState(MIN_WIDTH)
  const [labels, setLabels] = useState([])

  useEffect(() => {
    if (dataSets) {
      let maxX = 0
      for (const dataSet of dataSets) {
        if (dataSet.data.length > maxX) maxX = dataSet.data.length
      }
      setLabels(Array.from({ length: maxX }, (_, i) => i + 1))
      setLegend(
        dataSets.map((dataSet) => {
          return {
            name: dataSet.name,
          }
        })
      )
      let xCount = dataSets[0].data.length
      setWidth(Math.max(MIN_WIDTH, xCount * 22))
    }
  }, [dataSets])

  return (
    <ScrollView horizontal scrollEnabled={width !== MIN_WIDTH}>
      {dataSets && (
        <VictoryChart height={250} width={width} padding={{ top: 40, left: 45, right: 20, bottom: 40 }}>
          <VictoryLegend x={55} y={0} orientation="horizontal" gutter={20} colorScale={COLORS} data={legend} />
          <VictoryStack colorScale={COLORS} animate={{ duration: 1200, onLoad: { duration: 10 }, easing: 'expInOut' }}>
            {dataSets.map((dataset, i) => (
              <VictoryArea key={i} data={dataset.data} />
            ))}
          </VictoryStack>
          <VictoryAxis
            dependentAxis
            tickFormat={(tick) => `${tick}`}
            style={{
              grid: {
                fill: 'white',
                stroke: 'gray',
                pointerEvents: 'painted',
                strokeWidth: 0.2,
              },
            }}
          />
          <VictoryAxis tickValues={labels} tickFormat={(tick) => `${tick}`} />
        </VictoryChart>
      )}
    </ScrollView>
  )
}
