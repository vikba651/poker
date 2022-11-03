import { View, SafeAreaView, Image, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import styles from './value-choose.scss'

export default function CardChoose({ selectValue }) {
  const spadeRowValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  const clubRowValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  const diamondRowValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
  const heartRowValues = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {spadeRowValues.map((value) => (
          <TouchableOpacity key={value} className={styles.value} onPress={() => selectValue(value)}>
            <Text>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {clubRowValues.map((value) => (
          <TouchableOpacity key={value} className={styles.value} onPress={() => selectValue(value)}>
            <Text>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {diamondRowValues.map((value) => (
          <TouchableOpacity key={value} className={styles.value} onPress={() => selectValue(value)}>
            <Text>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        {heartRowValues.map((value) => (
          <TouchableOpacity key={value} className={styles.value} onPress={() => selectValue(value)}>
            <Text>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}
