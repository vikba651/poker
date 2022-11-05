import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import StartScreen from './components/start-screen/start-screen'
import AddPlayersScreen from './components/add-players-screen/add-players-screen'
import TrackGameScreen from './components/track-game-screen/track-game-screen'
import SettleUpScreen from './components/settle-up-screen/settle-up-screen'
import NameScreen from './components/name-screen/name-screen'
import GameBreakDown from './components/game-breakdown/game-breakdown'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#bbb' } }}>
        <Stack.Screen name="NameScreen" component={NameScreen} options={{ title: '' }} />
        <Stack.Screen name="StartScreen" component={StartScreen} options={{ title: 'Home' }} />
        <Stack.Screen
          name="AddPlayersScreen"
          component={AddPlayersScreen}
          options={{ title: 'Add Players' }}
        />
        <Stack.Screen
          name="TrackGameScreen"
          component={TrackGameScreen}
          options={{ title: 'Track Game' }}
        />
        <Stack.Screen
          name="SettleUpScreen"
          component={SettleUpScreen}
          options={{ title: 'Settle Up' }}
        />
        <Stack.Screen
          name="GameBreakdown"
          component={GameBreakDown}
          options={{ title: 'Game Breakdown' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
