import { ScrollView, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { VictoryBar, VictoryChart, VictoryStack, VictoryAxis, VictoryLegend } from 'victory-native'

/**
 *
 * @param dataSets: [{name: "dude", data: [{x: label1, y: value1}, {x: label2,  y: value2}]}]
 * @returns
 */
export function StackedBarGraph({ dataSets, longLabels }) {
  const COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853']
  const MIN_WIDTH = Dimensions.get('window').width * 0.85

  const [legend, setLegend] = useState([])
  const [longestLabel, setLongestLabel] = useState(0)
  const [width, setWidth] = useState(MIN_WIDTH)

  useEffect(() => {
    if (dataSets) {
      setLegend(
        dataSets.map((dataSet) => {
          return {
            name: dataSet.name,
          }
        })
      )
      setLongestLabel(findLongestLabel(dataSets))

      let xCount = dataSets.reduce((maxLength, dataset) => {
        if (maxLength < dataset.data.length) {
          return dataset.data.length
        }
        return maxLength
      }, 0)
      setWidth(Math.max(MIN_WIDTH, xCount * 22))
    }
  }, [dataSets])

  function findLongestLabel(dataSets) {
    let longestLabel = 0
    for (const data of dataSets[0].data) {
      if (data.x.length > longestLabel) longestLabel = data.x.length
    }
    return longestLabel
  }

  function addSpacesToLabel(tick) {
    if (longLabels && longestLabel) {
      const spacesToAdd = longestLabel - tick.length
      return tick + ' '.repeat(spacesToAdd)
    }
    return tick
  }

  return (
    <ScrollView horizontal scrollEnabled={width !== MIN_WIDTH}>
      {dataSets && (
        <VictoryChart
          height={250}
          width={width}
          domainPadding={15}
          padding={{ top: 40, left: 45, right: 20, bottom: longLabels ? 70 : 40 }}
        >
          <VictoryLegend x={55} y={0} orientation="horizontal" gutter={20} colorScale={COLORS} data={legend} />
          <VictoryStack colorScale={COLORS} animate={{ duration: 2000, onLoad: { duration: 10 } }}>
            {dataSets.map((dataset, i) => (
              <VictoryBar key={i} data={dataset.data} x="x" y="y" barRatio={0.8} />
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
          <VictoryAxis
            style={{ tickLabels: longLabels ? { angle: 45, transform: 'translate(17,5)' } : {} }}
            tickFormat={addSpacesToLabel}
            tickCount={dataSets[0].data.length}
          />
        </VictoryChart>
      )}
    </ScrollView>
  )
}
