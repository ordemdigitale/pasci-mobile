import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  ChevronLeft, 
  Bookmark, 
  ArrowUp,
  Clock,
  Calendar,
  User
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';

const { width, height } = Dimensions.get('window');

// Mock data based on the news maquette
const NEWS_DETAILS = {
  '1': {
    title: 'Renforcement des Capacités de la Société Civile : Un Nouveau Jalon',
    category: 'SOCIÉTÉ CIVILE',
    tag: 'NOUVEAU',
    author: "l'Équipe PASCI",
    date: '12 Octobre 2023',
    readTime: '2 min de lecture',
    image: require('../../assets/hero-image.png'), // Using existing asset
    content: [
      "Le PASCI a franchi une étape clé à Yamoussoukro, où 50 organisations locales ont été formées à la transparence budgétaire et au plaidoyer politique pour renforcer la gouvernance locale en Côte d'Ivoire.",
      "L'initiative mise désormais sur le déploiement d'outils numériques pour le suivi citoyen, avec une priorité accordée aux zones rurales afin de garantir un accès équitable à l'information publique et aux processus de décision.",
      "Ce programme s'inscrit dans une vision de long terme visant à professionnaliser les acteurs de la société civile ivoirienne et à créer des ponts durables avec les institutions publiques."
    ]
  }
};

export default function NewsDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const scrollRef = useRef<ScrollView>(null);
  
  const data = NEWS_DETAILS[id as string] || NEWS_DETAILS['1'];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-50">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={80} height={20} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <Skeleton width="100%" height={250} />
        <View className="px-6 mt-6">
          <View className="flex-row gap-2 mb-4">
            <Skeleton width={100} height={24} borderRadius={12} />
            <Skeleton width={80} height={24} borderRadius={12} />
          </View>
          <Skeleton width="100%" height={30} style={{ marginBottom: 8 }} />
          <Skeleton width="80%" height={30} style={{ marginBottom: 20 }} />
          <Skeleton width="100%" height={150} borderRadius={16} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Top Header Navigation */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white z-10">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
          <ChevronLeft size={24} color="#1F2937" />
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg ml-4">Détails</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Bookmark size={24} color="#1F2937" fill="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        ref={scrollRef}
        className="flex-1" 
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Image */}
        <Image 
          source={data.image} 
          style={{ width: width, height: 280 }} 
          resizeMode="cover" 
        />

        {/* Content Container with overlap feel */}
        <View 
          style={{ marginTop: -30 }}
          className="bg-white rounded-t-[40px] px-6 pt-8 pb-20"
        >
          {/* Tags */}
          <View className="flex-row items-center mb-6">
            <View className="bg-brand-orange px-4 py-1.5 rounded-full mr-3">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-[10px] uppercase">{data.category}</Text>
            </View>
            <View className="bg-green-50 px-4 py-1.5 rounded-full flex-row items-center border border-green-100">
              <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-green-600 text-[10px] uppercase">{data.tag}</Text>
            </View>
          </View>

          {/* Title */}
          <Text 
            style={{ fontFamily: 'Poppins_700Bold' }} 
            className="text-gray-900 text-2xl leading-9 mb-6"
          >
            {data.title}
          </Text>

          {/* Author & Info Line */}
          <View className="flex-row justify-between items-center mb-8 border-b border-gray-50 pb-6">
            <View className="flex-1 mr-4">
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-500 text-sm mb-1">
                Par <Text className="text-gray-900">{data.author}</Text>
              </Text>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs">
                {data.date} • {data.readTime}
              </Text>
            </View>
            
            {/* Font Size Adjuster */}
            <View className="bg-gray-50 flex-row p-1 rounded-xl">
              <TouchableOpacity 
                onPress={() => setFontSize(prev => Math.max(12, prev - 2))}
                className="bg-white px-3 py-1.5 rounded-lg shadow-sm mr-1"
              >
                <Text className="text-gray-400 font-bold text-xs">A-</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setFontSize(prev => Math.min(24, prev + 2))}
                className="bg-white px-3 py-1.5 rounded-lg shadow-sm"
              >
                <Text className="text-brand-orange font-bold text-xs">A+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Body Content */}
          <View>
            {data.content.map((para, index) => (
              <Text 
                key={index} 
                style={{ 
                  fontFamily: 'Karla_400Regular', 
                  fontSize: fontSize,
                  lineHeight: fontSize * 1.6
                }} 
                className="text-gray-600 mb-6"
              >
                {para}
              </Text>
            ))}
          </View>

          {/* Back to top button */}
          <TouchableOpacity 
            onPress={scrollToTop}
            className="mt-10 self-center flex-row items-center border border-gray-100 py-3 px-6 rounded-full shadow-sm bg-white"
          >
            <ArrowUp size={18} color="#4B5563" />
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-500 ml-2 text-sm">Haut de page</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
