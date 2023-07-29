import React, { useEffect, useState, useContext, memo } from 'react'
import { Image, SafeAreaView, Text, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native'
import { getRounds, deleteRound, getPlayer } from '../../shared/api'
import AppContext from '../../shared/AppContext'
import { SparklesIcon, TrashIcon } from 'react-native-heroicons/outline'
import Modal from 'react-native-modal'
import EmojiSelector from 'react-native-emoji-selector'
import emojiData from 'emoji-datasource'
import Svg, { Path } from 'react-native-svg'
import Potrace from 'potrace'

import styles from './stats-screen.scss'
import ComponentCard from '../../components/component-card/component-card'

export default function StatsScreen({ navigation, route }) {
  const { user } = useContext(AppContext)
  const [rounds, setRounds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false)
  const [currentRound, setCurrentRound] = useState(null)
  const [emojiMap, setEmojiMap] = useState({})
  const MemoizedEmojiSelector = memo(EmojiSelector)

  useEffect(() => {
    fetchRounds()
  }, [])
  async function fetchRounds() {
    const rounds = await getRounds(user.name)
    if (rounds) {
      setRounds(rounds.sort((a, b) => b.startTime - a.startTime))
    }
    setIsLoading(false)
  }

  async function onClickDelete(roundId, playerName) {
    await deleteRound(roundId, playerName)
    fetchRounds()
  }

  function showEmojiPicker(round) {
    setCurrentRound(round)
    setIsEmojiPickerVisible(true)
  }

  async function getEmojiImage(emoji) {
    const emojiItem = emojiData.find((item) => item.unified === emoji.replace(/-/g, ''))

    if (emojiItem) {
      const base64Image = emojiItem.image.replace(/^.*;base64,/, '')
      const buffer = Buffer.from(base64Image, 'base64')

      return new Promise((resolve, reject) => {
        Potrace.trace(buffer, (err, svg) => {
          if (err) {
            reject(err)
          } else {
            resolve(svg)
          }
        })
      })
    }

    return null
  }

  async function handleEmojiSelect(emoji) {
    console.log('Selected emoji:', emoji)

    const emojiImage = await getEmojiImage(emoji)
    if (emojiImage) {
      setEmojiMap({ ...emojiMap, [currentRound._id]: emojiImage })
    }

    setIsEmojiPickerVisible(false)
  }

  function formatTime(dateTimeString) {
    const monthNames = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const date = new Date(dateTimeString)
    const dateString =
      date.getDate() +
      ' ' +
      monthNames[date.getMonth()] +
      ' ' +
      date.getFullYear() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes()
    return dateString
  }

  function onClickRound(round) {
    navigation.navigate('GameBreakdown', { round })
  }

  return (
    <SafeAreaView className={styles.container}>
      <ComponentCard
        title="Overview"
        content={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.overviewText}>
              You have played {rounds.length} {rounds.length === 1 ? 'game' : 'games'}.
            </Text>
          )
        }
      ></ComponentCard>
      <ComponentCard
        title="Your games"
        content={
          <>
            <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
              {isLoading && <ActivityIndicator />}
              {!isLoading && rounds.length === 0 && <Text>You have no rounds.</Text>}
              {!isLoading &&
                rounds.length > 0 &&
                rounds.map((round, i) => (
                  <View key={i} className={styles.roundContent}>
                    <TouchableOpacity className={styles.roundButton} onPress={() => onClickRound(round)}>
                      <TouchableOpacity className={styles.emojiSide} onPress={() => showEmojiPicker(round)}>
                        {emojiMap[round._id] ? (
                          <Svg className={styles.chooseEmoji}>
                            <Path d={emojiMap[round._id]} />
                          </Svg>
                        ) : (
                          <Image
                            className={styles.chooseEmoji}
                            style={{ resizeMode: 'contain' }}
                            source={require('../../assets/choose-emoji.png')}
                          />
                        )}
                      </TouchableOpacity>

                      <Text style={{ fontWeight: 'bold' }}>{formatTime(round.startTime)} </Text>
                      <Text>{round.deals.length + ' deals'}</Text>
                      <TouchableOpacity className={styles.binSide} onPress={() => onClickDelete(round._id, user.name)}>
                        <TrashIcon color="red" style={{ marginRight: '5%' }}></TrashIcon>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
          </>
        }
      ></ComponentCard>
      <Modal isVisible={isEmojiPickerVisible} onBackdropPress={() => setIsEmojiPickerVisible(false)}>
        <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, width: '90%', height: '60%' }}>
          <MemoizedEmojiSelector onEmojiSelected={handleEmojiSelect} />
        </View>
      </Modal>
    </SafeAreaView>
  )
}
