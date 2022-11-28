import { View, SafeAreaView, Image, TouchableOpacity, Text, ScrollView } from 'react-native'
import React from 'react'
import styles from './game-breakdown.scss'

export default function GeneralStats({ navigation, deals }) {

    return (
        <SafeAreaView>
            <Text style={{ fontSize: 40, margin: 20 }}>This is general stats</Text>

            <View className={styles.boxShadow}>
                <View className={styles.statsView}>
                    <Text>This will be replaced with some random ass good statz knawimean</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}