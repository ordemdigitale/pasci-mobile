import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Share, Linking, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  ChevronLeft, 
  Share2, 
  Heart,
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  MessageCircle,
  Map,
  Leaf,
  Library,
  GraduationCap,
  HeartPulse,
  ChevronRight
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';

const { width } = Dimensions.get('window');

const PARTNERS_DETAILS = {
  '1': {
    name: 'AFD - Agence Française de Développement',
    tags: ['FINANCIER', 'DURABLE', 'INTERNATIONAL'],
    description: "L'AFD est l'acteur central de la politique de développement de la France. Elle s'engage dans des projets qui améliorent concrètement le quotidien des populations, dans les pays en développement, émergents et l'Outre-mer. Ses actions portent sur le climat, la biodiversité, la paix, l'éducation, l'urbanisme, la santé et la gouvernance.",
    logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/f/f3/Logo_AFD_2016.svg/1200px-Logo_AFD_2016.svg.png',
    domains: [
      { name: 'Environnement', icon: Leaf, color: '#16a34a', bgColor: '#f0fdf4' },
      { name: 'Gouvernance', icon: Library, color: '#2563eb', bgColor: '#eff6ff' },
      { name: 'Éducation', icon: GraduationCap, color: '#d97706', bgColor: '#fffbeb' },
      { name: 'Santé', icon: HeartPulse, color: '#dc2626', bgColor: '#fef2f2' },
    ],
    projects: [
      { title: 'Projet d’Appui à la Société Civile (PASCI)', description: 'Renforcement des capacités des OSC en Côte d’Ivoire.', budget: '2.5M EUR', color: '#334e68' },
      { title: 'Accès à l’Eau Zone Nord', description: 'Infrastructures hydrauliques villageoises.', budget: '1.2M EUR', color: '#ffffff', textColor: '#000' },
    ],
    info: {
      website: 'www.afd.fr/cote-divoire',
      address: 'Rue des Jardins, Abidjan Cocody, Côte d’Ivoire',
      email: 'contact-abidjan@afd.fr',
      phone: '+225 27 22 40 00 00'
    }
  }
};

export default function PartnerDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const data = PARTNERS_DETAILS[id as string] || PARTNERS_DETAILS['1'];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const onShare = async () => {
    try {
      await Share.share({ message: `Partenaire PASCI : ${data.name}` });
    } catch (error) { console.log(error.message); }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-50">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={100} height={20} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <View className="items-center mt-10">
          <Skeleton width={100} height={100} borderRadius={24} />
          <Skeleton width="80%" height={24} style={{ marginTop: 20 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white">
        <TouchableOpacity onPress={() => router.back()} className="bg-orange-50 p-2 rounded-full">
          <ChevronLeft size={24} color="#E05017" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Détails PTF</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={onShare} className="p-2">
            <Share2 size={24} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} className="p-2">
            <Heart size={24} color={isFavorite ? "#E05017" : "#4B5563"} fill={isFavorite ? "#E05017" : "transparent"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center py-8">
          <View className="w-24 h-24 bg-white rounded-3xl items-center justify-center shadow-lg border border-gray-50 mb-6">
            <Image source={{ uri: data.logo }} style={{ width: 60, height: 60 }} resizeMode="contain" />
          </View>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl text-center px-10 mb-4">{data.name}</Text>
          <View className="flex-row">
            {data.tags.map((tag, i) => (
              <View key={i} className={`px-3 py-1 rounded-md mx-1 ${i===0 ? 'bg-blue-50' : i===1 ? 'bg-green-50' : 'bg-orange-50'}`}>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 10 }} className={`${i===0 ? 'text-blue-600' : i===1 ? 'text-green-600' : 'text-orange-600'}`}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sections Area */}
        <View className="bg-gray-50/50 pt-8 pb-20">
          {/* À propos */}
          <View className="px-8 mb-8">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg mb-4">À propos</Text>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-sm">{data.description}</Text>
          </View>

          {/* Domaines d'intervention */}
          <View className="px-8 mb-10">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg mb-4">Domaines d'intervention</Text>
            <View className="flex-row flex-wrap justify-between">
              {data.domains.map((domain, i) => (
                <View key={i} style={{ width: '48%' }} className="bg-white p-4 rounded-3xl mb-4 flex-row items-center border border-gray-100 shadow-sm">
                  <View style={{ backgroundColor: domain.bgColor }} className="p-2 rounded-xl mr-3">
                    <domain.icon size={18} color={domain.color} />
                  </View>
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11 }} className="text-gray-700 flex-1">{domain.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="px-6 flex-row mb-8">
            <TouchableOpacity className="flex-1 bg-brand-orange h-16 rounded-3xl flex-row items-center justify-center shadow-lg shadow-orange-300 mr-3">
              <MessageCircle size={24} color="white" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-lg ml-3">Contacter</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-16 h-16 bg-gray-100 rounded-3xl items-center justify-center border border-gray-200">
              <Map size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Projets en cours */}
          <View className="mb-10">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-6">
              {data.projects.map((project, i) => (
                <View 
                  key={i} 
                  style={{ backgroundColor: project.color, width: width * 0.65 }} 
                  className={`mr-4 p-6 rounded-[32px] h-48 justify-between border border-gray-100 shadow-sm`}
                >
                  <View>
                    <Text style={{ fontFamily: 'Poppins_700Bold' }} className={`text-sm leading-5 mb-2 ${project.textColor === '#000' ? 'text-gray-900' : 'text-white'}`}>{project.title}</Text>
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className={`text-[10px] leading-4 ${project.textColor === '#000' ? 'text-gray-400' : 'text-white/60'}`}>{project.description}</Text>
                  </View>
                  <Text style={{ fontFamily: 'Poppins_700Bold' }} className={`text-[10px] uppercase ${project.textColor === '#000' ? 'text-red-400' : 'text-white/80'}`}>BUDGET : {project.budget}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Contact & Informations */}
          <View className="px-6">
            <View className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg mb-6">Contact & Informations</Text>
              
              <View className="space-y-6">
                <View className="flex-row items-center mb-6">
                  <View className="bg-orange-50 p-2.5 rounded-xl mr-4"><Globe size={20} color="#E05017" /></View>
                  <View className="flex-1">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase mb-0.5">Site Web</Text>
                    <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-800 text-sm">{data.info.website}</Text>
                  </View>
                </View>

                <View className="flex-row items-center mb-6">
                  <View className="bg-orange-50 p-2.5 rounded-xl mr-4"><MapPin size={20} color="#E05017" /></View>
                  <View className="flex-1">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase mb-0.5">Adresse</Text>
                    <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-800 text-sm leading-5">{data.info.address}</Text>
                  </View>
                </View>

                <View className="flex-row items-center mb-6">
                  <View className="bg-orange-50 p-2.5 rounded-xl mr-4"><Mail size={20} color="#E05017" /></View>
                  <View className="flex-1">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase mb-0.5">Email</Text>
                    <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-800 text-sm">{data.info.email}</Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <View className="bg-orange-50 p-2.5 rounded-xl mr-4"><Phone size={20} color="#E05017" /></View>
                  <View className="flex-1">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase mb-0.5">Téléphone</Text>
                    <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-800 text-sm">{data.info.phone}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}