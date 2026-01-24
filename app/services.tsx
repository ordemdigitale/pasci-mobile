import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, ChevronLeft } from 'lucide-react-native';
import Skeleton from '../components/ui/Skeleton';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

// Service Icons
const iconAppui = require('../assets/icons/icon-appui-conseil.png');
const iconAccompagnement = require('../assets/icons/icon-accompagnement.png');
const iconAdmin = require('../assets/icons/icon-soutien-administratif.png');
const iconRedaction = require('../assets/icons/icon-redaction.png');
const iconFormation = require('../assets/icons/icon-formation.png');
const iconSuivi = require('../assets/icons/icon-suivi-evaluation.png');

const SERVICES_DATA = [
  { 
    id: '1', 
    title: 'Appui-conseil', 
    description: 'Expertise stratégique pour votre organisation.',
    icon: iconAppui, 
    color: '#E0EEFF' 
  },
  { 
    id: '2', 
    title: 'Accompagnement', 
    description: 'Suivi personnalisé de vos initiatives terrain.',
    icon: iconAccompagnement, 
    color: '#E0FBEA' 
  },
  { 
    id: '3', 
    title: 'Soutien administratif', 
    description: 'Gestion rigoureuse et conformité légale.',
    icon: iconAdmin, 
    color: '#FFF4E0' 
  },
  { 
    id: '4', 
    title: 'Rédaction', 
    description: 'Documents, statuts, projets et manuels.',
    icon: iconRedaction, 
    color: '#FFF0F0' 
  },
  { 
    id: '5', 
    title: 'Formation', 
    description: 'Renforcement des capacités opérationnelles.',
    icon: iconFormation, 
    color: '#F3E8FF' 
  },
  { 
    id: '6', 
    title: 'Suivi-évaluation', 
    description: 'Mesure d’impact et pilotage par les résultats.',
    icon: iconSuivi, 
    color: '#E0F7F7' 
  },
];

export default function ServicesScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity 
      style={{ width: COLUMN_WIDTH }}
      className="bg-white rounded-[32px] p-5 mb-5 border border-gray-50 shadow-sm shadow-gray-200 elevation-2"
    >
      <View style={{ backgroundColor: item.color }} className="w-14 h-14 rounded-2xl items-center justify-center mb-4">
        <Image source={item.icon} style={{ width: 30, height: 30 }} resizeMode="contain" />
      </View>
      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-2 leading-5">
        {item.title}
      </Text>
      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] leading-4">
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  const renderSkeleton = () => (
    <View style={{ width: COLUMN_WIDTH }} className="bg-white rounded-[32px] p-5 mb-5 border border-gray-50 shadow-sm shadow-gray-200">
      <Skeleton width={56} height={56} borderRadius={16} style={{ marginBottom: 16 }} />
      <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
      <Skeleton width="100%" height={10} style={{ marginBottom: 4 }} />
      <Skeleton width="60%" height={10} />
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* Search bar */}
      <View className="bg-white flex-row items-center px-4 py-3 rounded-2xl border border-gray-100 mb-8 shadow-sm">
        <Search size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Rechercher un service..."
          className="flex-1 ml-3 font-bold text-gray-700"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Titles */}
      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-[10px] uppercase tracking-[2px] mb-2">
        ACCOMPAGNEMENT DES OSC
      </Text>
      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-3xl mb-8 leading-9">
        Catalogue de Soutien
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Custom Bar Header */}
      <View className="px-6 py-4 flex-row items-center bg-white">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900 mr-6">Nos Services</Text>
        </View>
      </View>

      <FlatList
        data={loading ? [1, 2, 3, 4, 5, 6] : SERVICES_DATA}
        renderItem={loading ? renderSkeleton : renderServiceItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
      />
    </SafeAreaView>
  );
}
