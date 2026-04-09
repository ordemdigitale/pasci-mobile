import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList, Dimensions, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Download, Building2 } from 'lucide-react-native';
import CrascMap from '../../components/CrascMap';
import DirectoryModal from '../../components/DirectoryModal';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import { News, PTF, Documentation, KeyStats, Formation } from '../../services/types';

const { width } = Dimensions.get('window');

// Assets
const logo = require('../../assets/logo.png');
const heroImage = require('../../assets/hero-image.png');


export default function HomeScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);

  const { data: news } = useQuery({
    queryKey: ['news-spotlight'],
    queryFn: () => dataService.getNews({ limit: 10 }),
  });

  const { data: keyStats } = useQuery({
    queryKey: ['key-stats'],
    queryFn: dataService.getKeyStats,
  });

  const { data: formations } = useQuery({
    queryKey: ['formations-home'],
    queryFn: () => dataService.getFormations({ limit: 6 }),
  });

  const MOCK_STATS: KeyStats[] = [
    { id: 1, name: 'OSC', number: 3201 },
    { id: 2, name: 'CRASC', number: 5 },
    { id: 3, name: 'Régions', number: 33 },
    { id: 4, name: 'Projets', number: 120 },
  ];
  const displayStats = keyStats && keyStats.length > 0 ? keyStats : MOCK_STATS;

  const STAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    osc:     { bg: '#DBEAFE', text: '#1D4ED8', border: '#BFDBFE' },
    crasc:   { bg: '#FFEDD5', text: '#E05017', border: '#FED7AA' },
    OSC:     { bg: '#DBEAFE', text: '#1D4ED8', border: '#BFDBFE' },
    CRASC:   { bg: '#FFEDD5', text: '#E05017', border: '#FED7AA' },
    régions: { bg: '#DCFCE7', text: '#166534', border: '#BBF7D0' },
    projets: { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF' },
    Régions: { bg: '#DCFCE7', text: '#166534', border: '#BBF7D0' },
    Projets: { bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF' },
  };

  const { data: ptfList } = useQuery({
    queryKey: ['ptf'],
    queryFn: dataService.getPtfList,
  });

  const { data: docList } = useQuery({
    queryKey: ['documentation'],
    queryFn: dataService.getDocumentation,
  });

  const featuredDoc = docList?.[0] ?? null;

  const handleMapPress = (region: { name: string }) => {
    console.log("Pressed region:", region.name);
    setSelectedRegion(region.name);
    setModalVisible(true);
  };


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
    >
      {/* Custom Header */}
      <View className="px-6 py-4 bg-white flex-row justify-between items-center shadow-sm">
        <Image source={logo} style={{ width: 50, height: 54 }} resizeMode="contain" />
        <TouchableOpacity onPress={() => router.push('/recherche')} className="p-2 bg-gray-100 rounded-full">
          <Search size={20} color="#4b5563" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <View className="px-4 mt-4">
          {/* Titre principal */}
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-[#2a591d] text-2xl text-center mb-5 leading-8">
            Plateforme digitale des OSC membres du CRASC
          </Text>

          {/* Card CRASC */}
          <View className="bg-white rounded-[32px] overflow-hidden border border-gray-100"
            style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 16, elevation: 4 }}
          >
            {/* Image */}
            <Image
              source={heroImage}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
            {/* Contenu */}
            <View className="px-6 py-5">
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15 }} className="text-gray-900 mb-3">
                Centre Régional d’Appui à la Société Civile (CRASC)
              </Text>
              <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 13, lineHeight: 20 }} className="text-gray-600 mb-5">
                Cette Plateforme digitale est la résultante d’une démarche alliant à la fois, inclusivité, représentativité, accessibilité et pérennité. Multifonctionnelle et dynamique, elle vise à accroître la visibilité des OSC, la synergie d’action, le partage d’expérience et la professionnalisation.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/a-propos')}
                className="self-end px-6 py-3 rounded-xl"
                style={{ backgroundColor: '#E05017' }}
              >
                <Text style={{ fontFamily: 'Poppins_700Bold', color: 'white', fontSize: 13 }}>Voir plus</Text>
              </TouchableOpacity>
            </View>
          </View>
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

        {/* NOS SERVICES */}
        <View className="mt-8 px-4">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900 mb-4">
            Nos Services
          </Text>
          <View
            className="bg-white rounded-[32px] overflow-hidden border border-gray-100"
            style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 16, elevation: 4 }}
          >
            <Image
              source={require('../../assets/images/service-hero.jpg')}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
            <View className="px-6 py-5" style={{ backgroundColor: '#f0f9ff' }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: '#2a591d', lineHeight: 28 }} className="mb-3">
                Des Services Stratégiques{'\n'}pour le Succès de{'\n'}Votre Projet
              </Text>
              <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 13, lineHeight: 20 }} className="text-gray-600 mb-5">
                Au CRASC, nous vous offrons un accompagnement sur mesure, de l'appui-conseil à la rédaction de documents complexes, pour garantir la conformité et l'efficacité de vos initiatives.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/services')}
                className="self-start px-6 py-3 rounded-xl"
                style={{ backgroundColor: '#E05017' }}
              >
                <Text style={{ fontFamily: 'Poppins_700Bold', color: 'white', fontSize: 13 }}>
                  Voir tous les services →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* CHIFFRES CLÉS */}
        <View className="mt-10 px-4">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl text-center mb-1">
            Chiffres clés
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm text-center mb-6">
            Notre impact en quelques chiffres
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {displayStats.map((stat) => {
              const cfg = STAT_COLORS[stat.name] ?? { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
              return (
                <View
                  key={stat.id}
                  className="bg-white rounded-3xl p-5 items-center mb-4"
                  style={{ width: '48%', borderWidth: 2, borderColor: cfg.border, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
                >
                  <View className="w-12 h-12 rounded-2xl items-center justify-center mb-3" style={{ backgroundColor: cfg.bg }}>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, color: cfg.text }}>{ stat.name.substring(0, 3).toUpperCase() }</Text>
                  </View>
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 32, color: '#1F2937' }}>
                    {stat.number.toLocaleString('fr-FR')}
                  </Text>
                  <Text style={{ fontFamily: 'Karla_700Bold', fontSize: 11, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>
                    {stat.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* REJOIGNEZ-NOUS CTA */}
        <View className="mt-6 px-4">
          <View className="bg-brand-green rounded-[32px] p-6 flex-row items-center justify-between shadow-lg overflow-hidden">
            {/* Décoration de fond */}
            <View className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full" />
            
            <View className="flex-1 pr-4">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-lg mb-1">
                Votre OSC n'est pas encore listée ?
              </Text>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-white/80 text-xs mb-4">
                Rejoignez le réseau des OSC pour bénéficier de nos services et accroître votre visibilité.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/rejoindre')}
                className="bg-white px-6 py-3 rounded-xl self-start shadow-sm"
              >
                <Text style={{ fontFamily: 'Poppins_700Bold', color: '#2a591d', fontSize: 13 }}>
                  Rejoignez-nous
                </Text>
              </TouchableOpacity>
            </View>
            <View className="bg-white/20 p-4 rounded-full">
              <Building2 size={32} color="white" />
            </View>
          </View>
        </View>

        {/* NOS FORMATIONS */}
        {formations && formations.length > 0 && (
          <View className="mt-10">
            <View className="px-6 mb-2">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl text-center mb-1">Nos Formations</Text>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm text-center mb-1">Développez vos compétences avec nos programmes de formation</Text>
              <View style={{ height: 3, width: 96, borderRadius: 4, alignSelf: 'center', marginTop: 8, marginBottom: 16, backgroundColor: '#E05017' }} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
              {formations.map((f: Formation) => (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => router.push(`/course-details/${f.slug}` as any)}
                  className="mr-4 w-64 bg-white rounded-[28px] overflow-hidden border border-gray-100"
                  style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}
                >
                  {f.thumbnail_url ? (
                    <Image source={{ uri: f.thumbnail_url }} style={{ width: '100%', height: 140 }} resizeMode="cover" />
                  ) : (
                    <View style={{ width: '100%', height: 140, backgroundColor: '#FFF5F0', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 40 }}>📚</Text>
                    </View>
                  )}
                  {f.type && (
                    <View className="absolute top-3 right-3 px-2 py-1 rounded-full" style={{ backgroundColor: '#E05017' }}>
                      <Text style={{ fontFamily: 'Karla_700Bold', color: 'white', fontSize: 9 }}>{f.type}</Text>
                    </View>
                  )}
                  <View className="p-4">
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13 }} className="text-gray-900 mb-2" numberOfLines={2}>
                      {f.title}
                    </Text>
                    {f.description && (
                      <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 12 }} className="text-gray-500 mb-3" numberOfLines={2}>
                        {f.description}
                      </Text>
                    )}
                    <Text style={{ fontFamily: 'Karla_700Bold', fontSize: 12, color: '#E05017' }}>Découvrir →</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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
