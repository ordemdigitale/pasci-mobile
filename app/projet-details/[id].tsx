import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Share, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  ChevronLeft, 
  Share2, 
  Calendar, 
  Coins, 
  CheckCircle2, 
  FileText, 
  Building2, 
  ShieldCheck, 
  FileDown,
  Clock,
  MapPin
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';

const { width } = Dimensions.get('window');

const PROJET_DETAILS = {
  '1': {
    title: 'Soutien aux Droits des Femmes et Égalité des Genres',
    category: 'SOCIAL',
    catColor: '#E05017',
    deadline: '15 Octobre 2024',
    budget: 'Jusqu’à 15M FCFA',
    image: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=800&auto=format&fit=crop',
    objectifs: 'Cet appel à projets vise à renforcer les capacités opérationnelles des OSC locales travaillant pour la protection des droits des femmes, la lutte contre les violences basées sur le genre (VBG) et l’autonomisation économique des femmes en zone urbaine et périurbaine.',
    criteres: [
      'Être une association légalement constituée en Côte d’Ivoire (récépissé).',
      'Avoir au moins 2 ans d’existence prouvée.',
      'Disposer d’une gouvernance transparente et inclusive.'
    ],
    zones: ['Abidjan (Toutes communes)', 'Bouaké', 'San Pedro', 'Korhogo'],
    documents: [
      { name: 'Note conceptuelle du projet', icon: FileText },
      { name: 'Budget détaillé (Format Excel)', icon: Building2 },
      { name: 'Copie du Journal Officiel ou Récépissé', icon: ShieldCheck }
    ]
  }
};

export default function ProjetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const data = PROJET_DETAILS[id as string] || PROJET_DETAILS['1'];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const onShare = async () => {
    try {
      await Share.share({ message: `Appel à projets PASCI : ${data.title}` });
    } catch (error) { console.log(error.message); }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 py-4 flex-row justify-between items-center">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={120} height={20} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <Skeleton width="100%" height={250} />
        <View className="px-8 mt-6">
          <Skeleton width="90%" height={28} style={{ marginBottom: 10 }} />
          <Skeleton width="60%" height={28} style={{ marginBottom: 20 }} />
          <View className="flex-row justify-between mb-8">
            <Skeleton width="48%" height={80} borderRadius={20} />
            <Skeleton width="48%" height={80} borderRadius={20} />
          </View>
          <Skeleton width="100%" height={150} borderRadius={20} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white z-10">
        <TouchableOpacity onPress={() => router.back()} className="bg-orange-50 p-2 rounded-full">
          <ChevronLeft size={24} color="#E05017" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Détails de l'Appel</Text>
        <TouchableOpacity onPress={onShare} className="bg-gray-50 p-2 rounded-full">
          <Share2 size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero Image */}
        <View className="relative">
          <Image source={{ uri: data.image }} className="w-full h-64" resizeMode="cover" />
          <View style={{ backgroundColor: data.catColor }} className="absolute bottom-6 left-6 px-4 py-1.5 rounded-xl">
            <Text className="text-white text-xs font-bold">{data.category}</Text>
          </View>
        </View>

        {/* Content Card */}
        <View className="bg-white -mt-10 rounded-t-[40px] px-8 pt-10">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl leading-9 mb-8">
            {data.title}
          </Text>

          {/* Key Info Cards */}
          <View className="flex-row justify-between mb-10">
            <View className="bg-orange-50/50 border border-orange-100 p-4 rounded-[24px] w-[48%]">
              <View className="flex-row items-center mb-2">
                <Clock size={14} color="#E05017" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-[9px] uppercase ml-2 tracking-widest">Date Limite</Text>
              </View>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm">{data.deadline}</Text>
            </View>

            <View className="bg-green-50/50 border border-green-100 p-4 rounded-[24px] w-[48%]">
              <View className="flex-row items-center mb-2">
                <Coins size={14} color="#10B981" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-green-600 text-[9px] uppercase ml-2 tracking-widest">Budget</Text>
              </View>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm">{data.budget}</Text>
            </View>
          </View>

          {/* Objectifs Section */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Objectifs de l'appel</Text>
            </View>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-base">
              {data.objectifs}
            </Text>
          </View>

          {/* Critères Section */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Critères d'éligibilité</Text>
            </View>
            {data.criteres.map((item, index) => (
              <View key={index} className="flex-row items-start mb-4">
                <View className="mt-1">
                  <CheckCircle2 size={18} color="#E05017" />
                </View>
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm ml-3 flex-1 leading-5">
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Action Button - Postuler */}
          <TouchableOpacity className="bg-brand-orange py-5 rounded-[24px] items-center shadow-lg shadow-orange-300 mb-10">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-lg">Soumettre ma candidature</Text>
          </TouchableOpacity>

          {/* Zones Section */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Zones géographiques</Text>
            </View>
            <View className="flex-row flex-wrap">
              {data.zones.map((zone, index) => (
                <View key={index} className="bg-gray-50 px-4 py-2 rounded-xl mr-2 mb-2 border border-gray-100">
                  <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-500 text-xs">{zone}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Documents Section */}
          <View className="mb-10">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Documents requis</Text>
            </View>
            {data.documents.map((doc, index) => (
              <View key={index} className="bg-gray-50 p-4 rounded-2xl flex-row items-center mb-3 border border-gray-100">
                <View className="bg-white p-2 rounded-xl mr-4 shadow-sm">
                    <doc.icon size={20} color="#9CA3AF" />
                </View>
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-600 text-sm flex-1">{doc.name}</Text>
              </View>
            ))}
          </View>

          {/* Download TDR Button */}
          <TouchableOpacity className="border-2 border-brand-orange py-4 rounded-[24px] flex-row items-center justify-center mb-10">
            <FileDown size={20} color="#E05017" />
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-base ml-3">Télécharger les TDR (PDF)</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
