import { View } from 'react-native'

export function ProgressBar({ progress }) {
  return (
    <View style={{ width: '100%' }}>
      <View
        style={{
          height: 10,
          width: '100%',
          backgroundColor: 'white',
          borderRadius: 10,
        }}
      ></View>
      <View
        style={{
          width: `${progress}%`,
          height: 10,
          backgroundColor: '#4285F4',
          borderRadius: 10,
          position: 'absolute',
        }}
      ></View>
    </View>
  )
}
