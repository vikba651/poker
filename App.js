import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import StartScreen from './components/start-screen/start-screen'
import AddPlayersScreen from './components/add-players-screen/add-players-screen'
import TrackGameScreen from './components/track-game-screen/track-game-screen'
import SettleUpScreen from './components/settle-up-screen/settle-up-screen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="StartScreens" component={StartScreen} />
        <Stack.Screen name="AddPlayersScreen" component={AddPlayersScreen} />
        <Stack.Screen name="TrackGameScreen" component={TrackGameScreen} />
        <Stack.Screen name="SettleUpScreen" component={SettleUpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
