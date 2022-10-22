import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import StartScreen from './components/start-screen/start-screen'
import AddPlayersScreen from './components/add-players-screen/add-players-screen'
import TrackGameScreen from './components/track-game-screen/track-game-screen'
import SettleUpScreen from './components/settle-up-screen/settle-up-screen'
import NameScreen from './components/name-screen/name-screen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerStyle: { backgroundColor: 'lightgray' } }}
      >
        <Stack.Screen
          name="NameScreen"
          component={NameScreen}
          options={{ title: 'Name Screen' }}
        />
        <Stack.Screen
          name="StartScreen"
          component={StartScreen}
          options={{ title: 'Start Screen' }}
        />
        <Stack.Screen
          name="AddPlayersScreen"
          component={AddPlayersScreen}
          options={{ title: 'Add Players Screen' }}
        />
        <Stack.Screen
          name="TrackGameScreen"
          component={TrackGameScreen}
          options={{ title: 'Track Game Screen' }}
        />
        <Stack.Screen
          name="SettleUpScreen"
          component={SettleUpScreen}
          options={{ title: 'Settle Up Screen' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
