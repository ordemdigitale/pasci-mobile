import { Stack } from 'expo-router';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Karla_400Regular, Karla_700Bold } from '@expo-google-fonts/karla';
import { View, Platform, StatusBar as RNStatusBar, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Skeleton from '../components/ui/Skeleton';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Karla_400Regular,
    Karla_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 }}>
        {/* Header Skeleton */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton width={50} height={50} borderRadius={12} />
          <View style={{ flexDirection: 'row' }}>
            <Skeleton width={36} height={36} borderRadius={18} style={{ marginRight: 12 }} />
            <Skeleton width={36} height={36} borderRadius={18} />
          </View>
        </View>
        {/* Hero Section Skeleton */}
        <View style={{ paddingHorizontal: 24, marginTop: 20 }}>
          <Skeleton width="80%" height={28} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={200} borderRadius={40} />
        </View>
        {/* Services Section Skeleton */}
        <View style={{ paddingHorizontal: 24, marginTop: 40 }}>
          <Skeleton width="50%" height={24} style={{ marginBottom: 20 }} />
          <View style={{ flexDirection: 'row' }}>
            <Skeleton width={64} height={64} borderRadius={24} style={{ marginRight: 24 }} />
            <Skeleton width={64} height={64} borderRadius={24} style={{ marginRight: 24 }} />
            <Skeleton width={64} height={64} borderRadius={24} style={{ marginRight: 24 }} />
            <Skeleton width={64} height={64} borderRadius={24} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" translucent backgroundColor="transparent" />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="splash" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="services" />
            <Stack.Screen name="faire-un-don" />
            <Stack.Screen name="etre-volontaire" />
          </Stack>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
