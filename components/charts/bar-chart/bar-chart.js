import { View, Text } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Grid, BarChart, XAxis, YAxis } from 'react-native-svg-charts'
import * as scale from 'd3-scale'

export function BarGraph({ data, labels, bigLabel }) {
  function getAxisWidth() {
    const relativeWidth = 100 / data.length
    return relativeWidth + '%'
  }

  return (
    <View style={{ width: '100%', marginLeft: -10 }}>
      <View style={{ height: 200, width: '100%', flexDirection: 'row' }}>
        <YAxis
          style={{ width: '10%' }}
          data={data}
          contentInset={{ top: 30, bottom: 20 }}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          formatLabel={(value) => `${value}`}
          numberOfTicks={Math.max(...data)}
        />
        <BarChart
          style={{ width: '90%' }}
          data={data}
          svg={{ fill: '#49E' }}
          contentInset={{ top: 30, bottom: 20 }}
          numberOfTicks={Math.max(...data)}
        >
          <Grid />
        </BarChart>
      </View>
      <View style={{ width: '90%', marginHorizontal: '10%' }}>
        {!bigLabel && (
          <XAxis
            style={{ marginTop: -10 }}
            data={data}
            formatLabel={(_, index) => labels[index]}
            contentInset={{ left: 15, right: 10 }}
            svg={{ fontSize: 12, fill: 'black' }}
          />
        )}
        <View style={{ flexDirection: 'row', width: '100%' }}>
          {bigLabel &&
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
                  {label}
                </Text>
              </View>
            ))}
        </View>
      </View>
    </View>
  )
}
