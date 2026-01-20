import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "pBold": require("../assets/fonts/Poppins-Bold.ttf"),
    "pMedium": require("../assets/fonts/Poppins-Medium.ttf"),
    "pRegular": require("../assets/fonts/Poppins-Regular.ttf"),
    "pLight": require("../assets/fonts/Poppins-Light.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded && error) return null

  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    />
  );
}
