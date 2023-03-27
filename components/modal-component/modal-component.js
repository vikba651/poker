import { View, Text, Modal, Alert, Pressable, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import styles from './modal.scss'
import { QuestionMarkCircleIcon } from 'react-native-heroicons/outline'
import DropShadow from 'react-native-drop-shadow'

export default function ModalComponent({ content }) {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <View className={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
          setModalVisible(!modalVisible)
        }}
      >
        <TouchableOpacity
          transparent={true}
          activeOpacity={1}
          className={styles.modalContainer}
          onPressOut={() => {
            setModalVisible(!modalVisible)
          }}
        >
          <View className={styles.centeredModalView}>
            <TouchableWithoutFeedback>
              <View className={styles.modalView}>
                <Text className={styles.modalText}>{content}</Text>
                <TouchableOpacity
                  className={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text className={styles.textStyle}>Hide Modal</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {<QuestionMarkCircleIcon color="black" size={25} />}
      </TouchableOpacity>
    </View>
  )
}
