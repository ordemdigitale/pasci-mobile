import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Bell } from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';

const heroImage = require('../../assets/hero-image.png');

const ALL_NEWS = [
  {
    id: '1',
    title: 'Renforcement des Capacités de la Société Civile : Un Nouveau Jalon',
    date: '12 Octobre 2023',
    category: 'SOCIÉTÉ CIVILE',
    image: heroImage,
  },
  {
    id: '2',
    title: 'Lancement du nouveau programme de formation pour les OSC',
    date: '24 Oct 2023',
    category: 'CRASC SUD',
    image: heroImage,
  },
  {
    id: '3',
    title: 'Atelier sur la transparence budgétaire à Yamoussoukro',
    date: '15 Nov 2023',
    category: 'CRASC CENTRE',
    image: heroImage,
  },
];

export default function ActualitesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/news-details/${item.id}`)}
      className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 mb-6"
    >
      <Image source={item.image} className="w-full h-48" resizeMode="cover" />
      <View className="p-5">
        <View className="bg-orange-50 self-start px-3 py-1 rounded-lg mb-3">
            <Text className="text-brand-orange text-[10px] font-bold">{item.category}</Text>
        </View>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base leading-6 mb-2">
          {item.title}
        </Text>
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs">📅 {item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSkeleton = () => (
    <View className="bg-white rounded-[32px] overflow-hidden mb-6 border border-gray-100 shadow-sm">
      <Skeleton width="100%" height={192} />
      <View className="p-5">
        <Skeleton width={80} height={20} borderRadius={8} style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height={24} style={{ marginBottom: 8 }} />
        <Skeleton width="80%" height={24} style={{ marginBottom: 12 }} />
        <Skeleton width={100} height={12} />
      </View>
    </View>
  );

  return (
    <SafeAreaView 
      className="flex-1 bg-gray-50" 
      edges={['top']}
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      <View className="px-6 py-4 bg-white flex-row justify-between items-center border-b border-gray-50">
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-xl text-gray-900">Actualités</Text>
        <View className="flex-row gap-3">
          <TouchableOpacity className="p-2 bg-gray-100 rounded-full">
            <Search size={20} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/inbox')}
            className="p-2 bg-gray-100 rounded-full"
          >
            <Bell size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={loading ? [1, 2, 3] : ALL_NEWS}
        renderItem={loading ? renderSkeleton : renderNewsItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
