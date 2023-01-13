import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins"
import * as SplashScreen from "expo-splash-screen"
import { useCallback } from "react"
import { View } from "react-native"
import { ThemeProvider } from "styled-components"
import theme from "./src/global/styles/theme"
import Dashboard from "./src/pages/Dashboard"

SplashScreen.preventAutoHideAsync()

export default function App() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_500Medium, Poppins_700Bold })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
      <ThemeProvider theme={theme}>
        <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Dashboard />
        </View>
      </ThemeProvider>
  );
}
