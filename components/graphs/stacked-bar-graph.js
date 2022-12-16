import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Grid, XAxis, StackedBarChart } from 'react-native-svg-charts'
import * as scale from 'd3-scale'

/**
 * @param data format: { "userName1": {"label1": value1, "label2": value2}, "userName2": {"label1": value1, "label2": value2}}
 * @param labelToStringMap format: {"label1": "label1string", "label2": "label2string"}
 */
export function StackedBarGraph({ data, labelToStringMap, bigLabels }) {
  const [formattedData, setFormattedData] = useState()
  const [names, setNames] = useState()
  const [labels, setLabels] = useState()
  const [maxValue, setMaxValue] = useState(0)

  useEffect(() => {
    const formattedData = []
    let barHeightsPerLabel = {}
    const labelsSet = new Set()
    for (const name in data) {
      for (const label in data[name]) {
        labelsSet.add(label)
        if (barHeightsPerLabel[label] == undefined) {
          barHeightsPerLabel[label] = 0
        }
        barHeightsPerLabel[label] += data[name][label]
        const entry = formattedData.find((elem) => elem.label === label)
        if (entry) {
          entry[name] = data[name][label]
        } else {
          formattedData.push({
            label: label,
            [name]: data[name][label],
          })
        }
      }
    }
    let maxValue = 0
    for (const label in barHeightsPerLabel) {
      if (barHeightsPerLabel[label] > maxValue) maxValue = barHeightsPerLabel[label]
    }
    setMaxValue(maxValue)
    setFormattedData(formattedData)
    setLabels(Array.from(labelsSet))
    setNames(Object.keys(data))
  }, [data])

  function getAxisWidth() {
    const relativeWidth = 100 / labels.length
    return relativeWidth + '%'
  }

  const colors = ['#639AFF', '#9B63FF', '#FF6666', '#FFf666', '#FF66FF', '#66FF6F']

  function renderYAxis() {
    const rows = []
    for (let i = maxValue; i >= 0; i--) {
      rows.push(
        <Text key={i} style={{ fontSize: 10, color: 'gray' }}>
          {i}
        </Text>
      )
    }
    return rows
  }

  return (
    formattedData && (
      <View style={{ width: '100%', marginLeft: -10 }}>
        <View style={{ height: 200, width: '100%', flexDirection: 'row' }}>
          <View
            style={{
              width: '10%',
              height: '100%',
              alignItems: 'center',
              marginTop: '8%',
              paddingBottom: '13%',
              justifyContent: 'space-between',
            }}
          >
            {renderYAxis()}
          </View>
          <StackedBarChart
            style={{ width: '90%' }}
            data={formattedData}
            keys={names}
            colors={colors}
            svg={{ fill: '#49E' }}
            contentInset={{ top: 30, bottom: 20 }}
            numberOfTicks={maxValue}
          >
            <Grid />
          </StackedBarChart>
        </View>
        <View style={{ width: '90%', marginHorizontal: '10%' }}>
          {!bigLabels && (
            <XAxis
              style={{ marginTop: -10 }}
              data={formattedData}
              formatLabel={(_, index) => labelToStringMap[labels[index]] ?? labels[index]}
              contentInset={{ left: 15, right: 10 }}
              svg={{ fontSize: 12, fill: 'black' }}
            />
          )}
          <View style={{ flexDirection: 'row', width: '100%' }}>
            {bigLabels &&
              labels.map((label, id) => (
                <View key={id} style={{ flexShrink: 1, width: getAxisWidth(), marginTop: -7, marginBottom: 30 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 10,
                      position: 'absolute',
                      width: 120,
                      transform: [{ rotate: '45deg' }, { translateY: 30 }, { translateX: 20 }],
                    }}
                  >
                    {labelToStringMap[label] ?? label}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </View>
    )
  )
}
