import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import StartScreen from "./components/start-screen";
import SettleUpScreen from "./components/settle-up-screen";
import TrackGameScreen from "./components/track-game-screen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="StartScreens" component={StartScreen} />
        <Stack.Screen name="SettleUpScreen" component={SettleUpScreen} />
        <Stack.Screen name="TrackGameScreen" component={TrackGameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
