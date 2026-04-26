import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, ImageBackground, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get('window');

/**
 * Splash Screen / Welcome Screen
 * Une page d'accueil immersive pour introduire l'application
 */
export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          router.replace('/(tabs)');
        }
      } catch (e) {
        console.log('Error checking auth', e);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (checkingAuth) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#E05017" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Fond avec l'image Hero en haut */}
      <View style={{ height: height * 0.55 }} className="w-full relative">
        <Image 
          source={require('../assets/hero-image.png')} 
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {/* Overlay Dégradé via View (ou simplement une vue sombre) */}
        <View className="absolute inset-0 bg-black/30" />
        
        {/* Logo sur l'image */}
        <View className="absolute top-16 left-6 bg-white p-3 rounded-2xl shadow-lg">
          <Image 
            source={require('../assets/logo.png')} 
            style={{ width: 40, height: 44 }} 
            resizeMode="contain" 
          />
        </View>
      </View>

      {/* Contenu textuel en bas */}
      <View 
        style={{ marginTop: -60, paddingBottom: insets.bottom + 32 }} 
        className="flex-1 bg-white rounded-t-[40px] px-8 pt-10 justify-between"
      >
        <View>
          <View className="bg-orange-50 self-start px-3 py-1 rounded-full mb-4">
            <Text className="text-brand-orange text-[10px] font-bold uppercase tracking-widest">Bienvenue sur PDOC</Text>
          </View>
          
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-3xl text-gray-900 leading-[42px] mb-4">
            Accompagner la Société Civile Ivoirienne
          </Text>
          
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-base leading-6 pb-4">
            La plateforme dédiée au renforcement technique et institutionnel des organisations de la société civile.
          </Text>
        </View>

        {/* Bouton d'action */}
        <TouchableOpacity 
          onPress={() => router.push('/login')}
          className="bg-brand-orange flex-row items-center justify-between p-5 rounded-3xl shadow-xl shadow-orange-200"
        >
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-lg ml-2">Commencer</Text>
          <View className="bg-white/20 p-2 rounded-xl">
            <ChevronRight size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
