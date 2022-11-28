import { View, Image, Text, ScrollView } from 'react-native'
import React from 'react'
import styles from './game-breakdown.scss'

export default function AllDeals(props) {
    const deals = props.deals
    return (
        <>
            <Text style={{ fontSize: 40, margin: 20 }}>You played {deals.length} deals</Text>
            <ScrollView className={styles.scrollView}>
                {deals.map((deal) => {
                    return (
                        <View key={deal.deal} className={styles.breakdownView}>
                            <Text style={{ fontSize: 32 }}>{deal.deal}</Text>
                            <View className={styles.cardsView}>
                                <View className={styles.cardsRow}>
                                    {deal.cards.slice(0, 2).map((card, i) => {
                                        return (
                                            <View key={card.id} className={styles.playerCard}>
                                                {!!card.suit && (
                                                    <Image
                                                        className={styles.playerCardSuit}
                                                        style={{ resizeMode: 'contain' }}
                                                        source={card.suitImage}
                                                    />
                                                )}
                                                {!!card.value && <Text className={styles.cardTopValue}>{card.value}</Text>}
                                                {!!card.value && <Text className={styles.cardBottomValue}>{card.value}</Text>}
                                            </View>
                                        )
                                    })}
                                </View>
                                <View className={styles.cardsRow}>
                                    {deal.cards.slice(2, 7).map((card, i) => {
                                        return (
                                            <View key={card.id} className={styles.playerCard}>
                                                {!!card.suit && (
                                                    <Image
                                                        className={styles.playerCardSuit}
                                                        style={{ resizeMode: 'contain' }}
                                                        source={card.suitImage}
                                                    />
                                                )}
                                                {<Text className={styles.cardTopValue}>{card.value}</Text>}
                                                {<Text className={styles.cardBottomValue}>{card.value}</Text>}
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        </>
    )
}