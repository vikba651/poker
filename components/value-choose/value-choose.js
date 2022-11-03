import { View, SafeAreaView, Image, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import styles from './value-choose.scss'

export default function ValueChoose({ selectValue }) {
  const firstRowValues = ['A', '2', '3', '4', '5']
  const secondRowValues = ['6', '7', '8', '9', '10']
  const thirdRowValues = ['J', 'Q', 'K']

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {firstRowValues.map((value) => (
          <TouchableOpacity key={value} className={styles.value} onPress={() => selectValue(value)}>
            <Text>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {secondRowValues.map((value) => (
          <TouchableOpacity key={value} className={styles.value} onPress={() => selectValue(value)}>
            <Text>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {thirdRowValues.map((value) => (
          <TouchableOpacity key={value} className={styles.value} onPress={() => selectValue(value)}>
            <Text>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
