import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, TextInput, Dimensions, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, SlidersHorizontal, Bell, UserCircle, MapPin, ChevronRight } from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';

const { width } = Dimensions.get('window');

const CATEGORIES = ['Tous', 'Technique', 'Financier', 'Éducation'];

const RECOMMENDED = [
  {
    id: '1',
    name: 'AFD - Agence Française de Développement',
    tags: ['FINANCIER', 'DURABLE'],
    description: 'Soutien aux projets de développement durable et à la...',
    location: 'Abidjan, Côte d’Ivoire',
    color: '#F0FDF4',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/f/f3/Logo_AFD_2016.svg/1200px-Logo_AFD_2016.svg.png'
  },
  {
    id: '2',
    name: 'USAID Côte d’Ivoire',
    tags: ['TECHNIQUE', 'SANTÉ'],
    description: 'Assistance technique pour le renforcement du système de santé ...',
    location: 'National scope',
    color: '#FEF2F2',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/USAID-Identity.svg/1200px-USAID-Identity.svg.png'
  },
  {
    id: '3',
    name: 'Union Européenne (Délégation CI)',
    tags: ['MULTI-SECTORIEL', 'GOUVERNANCE'],
    description: 'Programmes de coopération pour la paix, la sécurité et le développement...',
    location: 'Plateau, Abidjan',
    color: '#EFF6FF',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/1200px-Flag_of_Europe.svg.png'
  }
];

const ONGOING_PROJECTS = [
  { id: '1', title: 'Projet d’Appui à la Société Civile', tag: 'FONDS DE RÉSILIENCE', donor: 'Financé par AFD', period: '2023 - 2026', colors: ['#C2410C', '#1E293B'] },
  { id: '2', title: 'Accélérateur Innovation', tag: 'INNOVATION', donor: 'Financé par PNUD', period: '2024 - 2025', colors: ['#065F46', '#1E293B'] },
];

export default function AnnuairePartenairesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('Tous');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const renderPartnerCard = ({ item }) => (
    <View className="bg-white rounded-[32px] p-6 mb-6 mx-6 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between mb-4">
        <View className="flex-row">
          {item.tags.map((tag, i) => (
            <View key={i} className={`${i === 0 ? 'bg-blue-50' : 'bg-green-50'} px-2 py-1 rounded mr-2`}>
              <Text className={`${i === 0 ? 'text-blue-600' : 'text-green-600'} text-[8px] font-bold`}>{tag}</Text>
            </View>
          ))}
        </View>
        <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center border border-gray-100">
          <Image source={{ uri: item.logo }} style={{ width: 30, height: 30 }} resizeMode="contain" />
        </View>
      </View>

      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-2 leading-6">{item.name}</Text>
      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs mb-6 leading-5">{item.description}</Text>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <MapPin size={12} color="#9CA3AF" />
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1">{item.location}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push(`/annuaire-partenaires/${item.id}`)}
          className="bg-orange-50 px-4 py-2 rounded-full flex-row items-center"
        >
          <Text className="text-brand-orange font-bold text-xs mr-1">Détails</Text>
          <ChevronRight size={14} color="#E05017" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity 
      style={{ backgroundColor: item.colors[0], width: width * 0.75 }}
      className="mr-4 p-6 rounded-[32px] h-44 justify-between"
    >
      <View>
        <Text className="text-white/60 text-[9px] font-bold uppercase mb-2">{item.tag}</Text>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-lg leading-6">{item.title}</Text>
      </View>
      <View className="flex-row justify-between items-end">
        <Text className="text-white/80 text-[10px] font-bold">{item.donor}</Text>
        <View className="bg-white/20 px-2 py-1 rounded">
          <Text className="text-white text-[9px] font-bold">{item.period}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      {/* Search & Tabs */}
      <View className="px-6 pt-4">
        <View className="bg-white flex-row items-center px-4 py-3 rounded-2xl border border-gray-100 mb-6 shadow-sm">
          <Search size={20} color="#9CA3AF" />
          <TextInput placeholder="Rechercher un partenaire..." className="flex-1 ml-3 font-bold text-gray-700" />
          <SlidersHorizontal size={20} color="#E05017" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8 -mx-2">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity 
              key={cat}
              onPress={() => setSelectedCat(cat)}
              className={`px-6 py-2.5 rounded-full border mx-2 ${selectedCat === cat ? 'bg-brand-orange border-brand-orange' : 'bg-white border-gray-200'}`}
            >
              <Text className={`text-xs font-bold ${selectedCat === cat ? 'text-white' : 'text-gray-500'}`}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="flex-row justify-between items-center mb-6">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Recommandés</Text>
          <TouchableOpacity><Text className="text-brand-orange font-bold text-xs uppercase">Voir tout</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View className="mt-4 mb-10">
      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg px-6 mb-6">Projets en cours</Text>
      <FlatList
        data={ONGOING_PROJECTS}
        renderItem={renderProjectItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Top Nav */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ChevronLeft size={24} color="#E05017" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Partenaires</Text>
        </View>
        <View className="flex-row gap-4">
          <Bell size={22} color="#E05017" />
          <UserCircle size={22} color="#E05017" />
        </View>
      </View>

      <FlatList
        data={loading ? [1, 2] : RECOMMENDED}
        renderItem={loading ? () => <View className="mx-6 mb-6"><Skeleton width="100%" height={180} borderRadius={32} /></View> : renderPartnerCard}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={loading ? null : renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}