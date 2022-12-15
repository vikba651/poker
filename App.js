import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar, LogBox } from 'react-native'

import { AppProvider } from './shared/AppContext'
import StartScreen from './components/start-screen/start-screen'
import AddPlayersScreen from './components/add-players-screen/add-players-screen'
import TrackGameScreen from './components/track-game-screen/track-game-screen'
import SettleUpScreen from './components/settle-up-screen/settle-up-screen'
import NameScreen from './components/name-screen/name-screen'
import GameBreakDownScreen from './components/game-breakdown-screen/game-breakdown-screen'
import TestScreen from './components/test-screen/test-screen'
import CreateGameScreen from './components/create-game-screen/create-game-screen'
import StatsScreen from './components/stats-screen/stats-screen'

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
          <Stack.Screen name="TestScreen" component={TestScreen} options={{ title: 'Test screen' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  )
}
