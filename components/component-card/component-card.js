import { View, Text } from 'react-native'
import DropShadow from 'react-native-drop-shadow'
import styles from './component-card.scss'
import ModalComponent from '../modal/modal'

export default function ComponentCard({ title, content, centerTitle, showInfoModal, infoModalContent }) {
  return (
    <DropShadow
      className={styles.boxShadow}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 1,
          height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
    >
      <View
        style={{ alignItems: centerTitle ? 'center' : 'baseline', marginLeft: centerTitle ? 0 : 20 }}
        className={styles.titleRow}
      >
        {title && <Text className={styles.cardTitle}>{title}</Text>}
        {showInfoModal && <ModalComponent content={infoModalContent}></ModalComponent>}
      </View>
      {content}
    </DropShadow>
  )
}
