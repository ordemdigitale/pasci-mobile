import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Share, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  ChevronLeft, 
  Share2, 
  MapPin, 
  Briefcase, 
  Coins, 
  Calendar,
  CheckCircle2,
  GraduationCap,
  Users,
  Leaf
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';

const { width } = Dimensions.get('window');

const JOB_DETAILS = {
  '1': {
    title: 'Chef de Projet Développement',
    company: 'Solidarité Plus',
    location: 'Abidjan',
    type: 'Temps plein',
    salary: '450k - 600k CFA',
    date: '15 Oct 2023',
    color: '#064E3B',
    description: 'Pilotez nos initiatives de développement social dans les zones urbaines d’Abidjan. Vous assurerez la coordination des équipes locales et le suivi des indicateurs d’impact PASCI.',
    missions: [
      'Coordination technique et financière des activités terrain.',
      'Reporting régulier aux bailleurs et partenaires institutionnels.',
      'Renforcement des capacités des OSC partenaires locales.'
    ],
    profile: [
      { text: 'Master en Sciences Sociales ou Gestion de Projet.', icon: GraduationCap },
      { text: 'Minimum 5 ans d’expérience dans le développement.', icon: Briefcase },
      { text: 'Leadership et gestion d’équipe démontrés.', icon: Users }
    ]
  }
};

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  const data = JOB_DETAILS[id as string] || JOB_DETAILS['1'];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Offre d'emploi PASCI : ${data.title} chez ${data.company}.`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-50">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={120} height={20} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <View className="px-6 mt-8 items-center">
          <Skeleton width={100} height={100} borderRadius={24} />
          <Skeleton width="80%" height={28} style={{ marginTop: 24, marginBottom: 8 }} />
          <Skeleton width="40%" height={20} style={{ marginBottom: 24 }} />
          <View className="flex-row justify-center gap-2 mb-10">
            <Skeleton width={80} height={30} borderRadius={15} />
            <Skeleton width={80} height={30} borderRadius={15} />
          </View>
          <Skeleton width="100%" height={150} borderRadius={32} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Détail de l'Offre</Text>
        <TouchableOpacity onPress={onShare} className="bg-gray-50 p-2 rounded-full">
          <Share2 size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 items-center mt-6">
          {/* Company Logo */}
          <View style={{ backgroundColor: data.color }} className="w-24 h-24 rounded-[28px] items-center justify-center shadow-lg shadow-gray-300 mb-6">
            <Leaf size={40} color="white" />
          </View>

          {/* Job Title & Company */}
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl text-center mb-2 px-4">
            {data.title}
          </Text>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-lg mb-6">
            {data.company}
          </Text>

          {/* Badges Row 1 */}
          <View className="flex-row justify-center mb-3">
            <View className="bg-gray-100 flex-row items-center px-4 py-2 rounded-2xl mr-3">
              <MapPin size={14} color="#6B7280" />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-500 text-xs ml-2">{data.location}</Text>
            </View>
            <View className="bg-blue-50 flex-row items-center px-4 py-2 rounded-2xl">
              <Briefcase size={14} color="#2563EB" />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-blue-600 text-xs ml-2">{data.type}</Text>
            </View>
          </View>

          {/* Badges Row 2 */}
          <View className="flex-row justify-center mb-10">
            <View className="bg-green-50 flex-row items-center px-4 py-2 rounded-2xl mr-3">
              <Coins size={14} color="#10B981" />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-green-600 text-xs ml-2">{data.salary}</Text>
            </View>
            <View className="bg-orange-50 flex-row items-center px-4 py-2 rounded-2xl">
              <Calendar size={14} color="#E05017" />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-xs ml-2">{data.date}</Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View className="px-8">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[11px] uppercase tracking-widest mb-4">Description du poste</Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 leading-6 text-base mb-8">
            {data.description}
          </Text>

          {/* Missions Section */}
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[11px] uppercase tracking-widest mb-4">Missions principales</Text>
          <View className="mb-8">
            {data.missions.map((mission, index) => (
              <View key={index} className="flex-row items-start mb-4">
                <View className="mt-1">
                  <CheckCircle2 size={18} color="#E05017" />
                </View>
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm ml-3 flex-1 leading-5">
                  {mission}
                </Text>
              </View>
            ))}
          </View>

          {/* Profile Section */}
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[11px] uppercase tracking-widest mb-4">Profil recherché</Text>
          <View className="mb-12">
            {data.profile.map((item, index) => (
              <View key={index} className="flex-row items-center mb-5">
                <View className="bg-brand-green/10 p-2.5 rounded-xl mr-4">
                  <item.icon size={18} color="#2a591d" />
                </View>
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm flex-1 leading-5">
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Apply Button */}
      <View className="px-6 pb-10 pt-4 bg-white border-t border-gray-50">
        <TouchableOpacity className="bg-brand-orange py-4 rounded-[24px] items-center shadow-lg shadow-orange-300">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-base">Postuler maintenant</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
