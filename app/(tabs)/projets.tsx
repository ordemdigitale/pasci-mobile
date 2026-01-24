import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Menu, Calendar, ChevronRight } from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const APPELS = [
  {
    id: '1',
    title: 'Droits des Femmes',
    date: '15 Oct',
    category: 'SOCIAL',
    catColor: '#E05017',
    description: 'Appui aux initiatives locales en zone urbaine.',
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Résilience Climat',
    date: '02 Nov',
    category: 'CLIMAT',
    catColor: '#059669',
    description: 'Zones rurales du nord de la Côte d’Ivoire.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Alpha Digitale',
    date: '20 Nov',
    category: 'ÉDUCATION',
    catColor: '#2563EB',
    description: 'Programme de formation pour les jeunes CSOs.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Santé Maternelle',
    date: '05 Déc',
    category: 'SANTÉ',
    catColor: '#DC2626',
    description: 'Amélioration des soins de proximité.',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=400&auto=format&fit=crop'
  }
];

export default function ProjetsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Appels'); // 'Appels' or 'Formalisation'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const renderAppelItem = ({ item }) => (
    <View style={{ width: CARD_WIDTH }} className="bg-white rounded-[32px] overflow-hidden mb-5 border border-gray-100 shadow-sm">
      <View className="relative">
        <Image source={{ uri: item.image }} className="w-full h-32" resizeMode="cover" />
        <View style={{ backgroundColor: item.catColor }} className="absolute top-3 left-3 px-3 py-1 rounded-lg">
          <Text className="text-white text-[9px] font-bold">{item.category}</Text>
        </View>
      </View>
      <View className="p-4">
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-[13px] mb-1">{item.title}</Text>
        <View className="flex-row items-center mb-2">
          <Calendar size={10} color="#9CA3AF" />
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1">{item.date}</Text>
        </View>
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-[10px] leading-4 mb-4" numberOfLines={2}>
          {item.description}
        </Text>
        <TouchableOpacity 
          onPress={() => router.push(`/projet-details/${item.id}`)}
          className="bg-orange-50 py-2 rounded-xl items-center"
        >
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-brand-orange text-[11px]">Détails</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSkeleton = () => (
    <View style={{ width: CARD_WIDTH }} className="bg-white rounded-[32px] overflow-hidden mb-5 border border-gray-100 shadow-sm">
      <Skeleton width="100%" height={128} />
      <View className="p-4">
        <Skeleton width="80%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="40%" height={10} style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height={24} style={{ marginBottom: 10 }} />
        <Skeleton width="100%" height={32} borderRadius={12} />
      </View>
    </View>
  );

  const renderHeader = () => (
    <View className="px-6 pt-4">
      {/* Top Custom Header */}
      <View className="flex-row justify-between items-center mb-8">
        <Menu size={24} color="#E05017" />
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900">Projets & Formalisation</Text>
        <Bell size={24} color="#1F2937" />
      </View>

      {/* Segment Control */}
      <View className="flex-row bg-gray-100 p-1.5 rounded-[24px] mb-10">
        <TouchableOpacity 
          onPress={() => setActiveTab('Appels')}
          className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'Appels' ? 'bg-white shadow-sm' : ''}`}
        >
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className={`text-xs ${activeTab === 'Appels' ? 'text-brand-orange' : 'text-gray-400'}`}>Appels à Projets</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setActiveTab('Formalisation')}
          className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'Formalisation' ? 'bg-white shadow-sm' : ''}`}
        >
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className={`text-xs ${activeTab === 'Formalisation' ? 'text-brand-orange' : 'text-gray-400'}`}>Formalisation</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Appels' && (
        <View className="flex-row justify-between items-center mb-6">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-2xl text-gray-900">Appels en cours</Text>
          <View className="bg-orange-100 px-3 py-1 rounded-full">
            <Text className="text-brand-orange text-[9px] font-bold">4 NOUVEAUX</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={loading ? [1, 2, 3, 4] : (activeTab === 'Appels' ? APPELS : [])}
        renderItem={loading ? renderSkeleton : renderAppelItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 24 }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading && activeTab === 'Formalisation' ? (
            <View className="px-6 items-center mt-10">
                <Text className="text-gray-400 text-center font-bold">Le processus de formalisation sera affiché ici.</Text>
            </View>
        ) : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}
