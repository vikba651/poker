import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar, LogBox } from 'react-native'

import { AppProvider } from './shared/AppContext'
import StartScreen from './screens/start-screen/start-screen'
import AddPlayersScreen from './screens/add-players-screen/add-players-screen'
import TrackGameScreen from './screens/track-game-screen/track-game-screen'
import SettleUpScreen from './screens/settle-up-screen/settle-up-screen'
import NameScreen from './screens/name-screen/name-screen'
import GameBreakDownScreen from './screens/game-breakdown-screen/game-breakdown-screen'
import JoinGameScreen from './screens/join-game-screen/join-game-screen'
import CreateGameScreen from './screens/create-game-screen/create-game-screen'
import StatsScreen from './screens/stats-screen/stats-screen'

const Stack = createNativeStackNavigator()

LogBox.ignoreLogs(['Warning: ...']) // Ignore log notification by message
LogBox.ignoreAllLogs() //Ignore all log notifications

export default function App() {
  return (
    <AppProvider>
      <StatusBar animated={true} backgroundColor="#61dafb" barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#EEE' } }}>
          <Stack.Screen name="NameScreen" component={NameScreen} options={{ headerShown: false }} />
          <Stack.Screen name="StartScreen" component={StartScreen} options={{ title: 'Home' }} />
          <Stack.Screen name="AddPlayersScreen" component={AddPlayersScreen} options={{ title: 'Add Players' }} />
          <Stack.Screen name="TrackGameScreen" component={TrackGameScreen} options={{ title: 'Track Game' }} />
          <Stack.Screen name="SettleUpScreen" component={SettleUpScreen} options={{ title: 'Settle Up' }} />
          <Stack.Screen name="GameBreakdown" component={GameBreakDownScreen} options={{ title: 'Game Breakdown' }} />
          <Stack.Screen name="CreateGameScreen" component={CreateGameScreen} options={{ title: 'Create Game' }} />
          <Stack.Screen name="StatsScreen" component={StatsScreen} options={{ title: 'Statistics' }} />
          <Stack.Screen name="JoinGameScreen" component={JoinGameScreen} options={{ title: 'Join Game' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  )
}
