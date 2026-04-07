import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Bell, Search, Download, ChevronRight, Building2 } from 'lucide-react-native';
import CrascMap from '../../components/CrascMap';
import DirectoryModal from '../../components/DirectoryModal';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import { News, PTF, Documentation } from '../../services/types';

const { width } = Dimensions.get('window');

// Assets
const logo = require('../../assets/logo.png');
const heroImage = require('../../assets/hero-image.png');

// Service Icons
const iconAccompagnement = require('../../assets/icons/icon-accompagnement.png');
const iconAppui = require('../../assets/icons/icon-appui-conseil.png');
const iconFormation = require('../../assets/icons/icon-formation.png');
const iconRedaction = require('../../assets/icons/icon-redaction.png');
const iconAdmin = require('../../assets/icons/icon-soutien-administratif.png');
const iconSuivi = require('../../assets/icons/icon-suivi-evaluation.png');

const SERVICES = [
  { id: '1', title: 'Subventions', icon: iconAccompagnement, color: '#FDF0ED' }, // Rose/Orange très clair
  { id: '2', title: 'Formations', icon: iconFormation, color: '#E7EEF7' },      // Bleu clair
  { id: '3', title: 'Annuaire', icon: iconAppui, color: '#FFF5E6' },            // Jaune/Orange clair
  { id: '4', title: 'Assistance', icon: iconAdmin, color: '#F3E8FF' },          // Violet clair
];

export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);

  const { data: news, isLoading: newsLoading } = useQuery({
    queryKey: ['news'],
    queryFn: () => dataService.getNews(),
  });

  const { data: ptfList } = useQuery({
    queryKey: ['ptf'],
    queryFn: dataService.getPtfList,
  });

  const { data: docList } = useQuery({
    queryKey: ['documentation'],
    queryFn: dataService.getDocumentation,
  });

  const featuredDoc = docList?.[0] ?? null;

  const handleMapPress = (region) => {
    console.log("Pressed region:", region.name);
    setSelectedRegion(region.name);
    setModalVisible(true);
  };

  const handleServicePress = (item) => {
    if (item.title === 'Annuaire') {
      setModalVisible(true);
    } else if (item.title === 'Formations') {
      router.push('/formations');
    } else {
      router.push('/ressources');
    }
  };

  const renderServiceItem = ({ item }) => (
    <View className="items-center mr-6 w-20">
      <TouchableOpacity 
        onPress={() => handleServicePress(item)}
        style={{ backgroundColor: item.color }}
        className="w-16 h-16 rounded-3xl items-center justify-center mb-2 shadow-sm"
      >
        <Image source={item.icon} style={{ width: 32, height: 32 }} resizeMode="contain" />
      </TouchableOpacity>
      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-[10px] text-center font-bold text-gray-700" numberOfLines={2}>
        {item.title}
      </Text>
    </View>
  );

  const renderNewsItem = ({ item }: { item: News }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/news-details/${item.slug}`)}
      className="mr-4 w-72 bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100"
    >
      <Image 
        source={item.thumbnail_url ? { uri: item.thumbnail_url } : heroImage} 
        className="w-full h-40" 
        resizeMode="cover" 
      />
      <View className="p-4">
        <View className="bg-orange-50 self-start px-2 py-1 rounded-lg mb-2">
            <Text className="text-brand-orange text-[10px] font-bold">
              {item.crasc_id ? `CRASC ${item.crasc_id}` : 'INFO'}
            </Text>
        </View>
        <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm leading-5 mb-2" numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px]">
          📅 {new Date(item.created_at).toLocaleDateString('fr-FR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView 
      className="flex-1 bg-gray-50" 
      edges={['top']}
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      {/* Custom Header */}
      <View className="px-6 py-4 bg-white flex-row justify-between items-center shadow-sm">
        <Image source={logo} style={{ width: 50, height: 54 }} resizeMode="contain" />
        <View className="flex-row gap-4">
          <TouchableOpacity className="p-2 bg-gray-100 rounded-full">
            <Search size={20} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/inbox')}
            className="p-2 bg-gray-100 rounded-full"
          >
            <Bell size={20} color="#4b5563" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* IMPACT SECTION */}
        <View className="p-4 mt-2">
            <View className="bg-brand-orange rounded-[40px] p-8 relative overflow-hidden">
                <View className="bg-white/20 px-3 py-1 rounded-full self-start mb-4">
                    <Text className="text-white text-[10px] font-bold uppercase tracking-widest">Impact 2024</Text>
                </View>
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-2xl mb-3 leading-8">
                    Renforcer la société civile en Côte d’Ivoire
                </Text>
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-white/80 text-sm mb-6 leading-5">
                    Nous œuvrons pour un développement durable via l’appui technique et le plaidoyer citoyen.
                </Text>
                            <TouchableOpacity 
                                onPress={() => router.push('/a-propos')}
                                className="bg-brand-orange px-8 py-4 rounded-2xl shadow-lg shadow-orange-300"
                            >
                                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-base">En savoir plus</Text>
                            </TouchableOpacity>
            </View>
        </View>

        {/* SERVICES PRIORITAIRES (FlatList) */}
        <View className="mt-6">
            <View className="flex-row justify-between items-center px-6 mb-4">
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900">Services prioritaires</Text>
                <TouchableOpacity 
                    onPress={() => router.push('/services')}
                    className="flex-row items-center"
                >
                    <Text className="text-brand-orange font-bold mr-1">Tout voir</Text>
                    <ChevronRight size={16} color="#E05017" />
                </TouchableOpacity>
            </View>
            <FlatList
              data={SERVICES}
              renderItem={renderServiceItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
            />
        </View>

        {/* MAP SECTION */}
        <View className="mt-10 px-4">
            <View className="flex-row justify-between items-center mb-4 px-2">
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900">Carte des CRASC</Text>
                <View className="bg-brand-green/10 px-3 py-1 rounded-full">
                    <Text className="text-[10px] font-bold text-brand-green">Régional</Text>
                </View>
            </View>
            <View className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100">
                <View className="bg-gray-50 rounded-3xl p-2 items-center justify-center">
                    <CrascMap onRegionPress={handleMapPress} />
                </View>
                <View className="flex-row flex-wrap justify-between mt-6 px-2">
                    <View className="flex-row items-center w-1/3 mb-3">
                        <View className="w-2 h-2 rounded-full bg-[#F59E42] mr-2" />
                        <Text className="text-[10px] text-gray-600 font-bold">Nord</Text>
                    </View>
                    <View className="flex-row items-center w-1/3 mb-3">
                        <View className="w-2 h-2 rounded-full bg-[#FF6B8A] mr-2" />
                        <Text className="text-[10px] text-gray-600 font-bold">Est</Text>
                    </View>
                    <View className="flex-row items-center w-1/3 mb-3">
                        <View className="w-2 h-2 rounded-full bg-[#5A7D5A] mr-2" />
                        <Text className="text-[10px] text-gray-600 font-bold">Centre</Text>
                    </View>
                    <View className="flex-row items-center w-1/3">
                        <View className="w-2 h-2 rounded-full bg-[#4FC3DC] mr-2" />
                        <Text className="text-[10px] text-gray-600 font-bold">Ouest</Text>
                    </View>
                    <View className="flex-row items-center w-1/3">
                        <View className="w-2 h-2 rounded-full bg-[#2E86C1] mr-2" />
                        <Text className="text-[10px] text-gray-600 font-bold">Sud</Text>
                    </View>
                </View>
            </View>
        </View>

        {/* PARTNERS SECTION — PTF depuis l'API */}
        {ptfList && ptfList.length > 0 && (
          <View className="mt-10">
            <View className="flex-row justify-between items-center px-6 mb-4">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900">Partenaires Techniques</Text>
              <TouchableOpacity onPress={() => router.push('/annuaire-partenaires')}>
                <Text className="text-brand-orange font-bold">Tout voir</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6">
              {ptfList.slice(0, 8).map((ptf: PTF) => (
                <TouchableOpacity
                  key={ptf.id}
                  className="mr-4 bg-white p-4 rounded-3xl border border-gray-100 items-center justify-center w-24 h-24 shadow-sm"
                >
                  {ptf.thumbnail_url ? (
                    <Image source={{ uri: ptf.thumbnail_url }} style={{ width: 48, height: 48 }} resizeMode="contain" />
                  ) : (
                    <View className="items-center">
                      <Building2 size={24} color="#E05017" />
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-[8px] text-center mt-1" numberOfLines={2}>
                        {ptf.name}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ACTUALITÉS (FlatList) */}
        <View className="mt-10">
            <View className="flex-row justify-between items-center px-6 mb-4">
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900">Dernières Actualités</Text>
                <TouchableOpacity><Text className="text-brand-orange font-bold">Voir tout</Text></TouchableOpacity>
            </View>
            <FlatList
              data={news}
              renderItem={renderNewsItem}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
            />
        </View>

        {/* RESSOURCE SECTION */}
        {featuredDoc && (
          <View className="mt-10 px-6 mb-12">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900 mb-4">Ressource en vedette</Text>
            <TouchableOpacity
              onPress={() => featuredDoc.file_url && router.push('/ressources')}
              className="flex-row items-center bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm"
            >
              <View className="bg-red-100 w-12 h-12 rounded-2xl items-center justify-center mr-4">
                <Text className="text-red-600 font-bold text-xs">PDF</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm" numberOfLines={2}>
                  {featuredDoc.title}
                </Text>
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] mt-1">
                  {featuredDoc.file_type ? `Document ${featuredDoc.file_type.toUpperCase()}` : 'Document PDF'}
                </Text>
              </View>
              <View className="bg-orange-50 p-2 rounded-full">
                <Download size={18} color="#E05017" />
              </View>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* MODAL ANNUAIRE */}
      <DirectoryModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        selectedRegion={selectedRegion}
      />
    </SafeAreaView>
  );
}
