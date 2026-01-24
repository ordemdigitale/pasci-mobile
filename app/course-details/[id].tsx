import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Share, Animated } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  ChevronLeft, 
  Share2, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  FileEdit,
  BarChart,
  Video,
  BarChart3,
  Lock,
  PlayCircle,
  CheckCircle2,
  ChevronRight,
  Heart
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';

const { width } = Dimensions.get('window');

const COURSE_DATA = {
  '1': {
    title: 'Renforcement des capacités en plaidoyer',
    tags: [
      { text: 'DÉBUTANT', color: '#16a34a' },
      { text: 'PASCI', color: '#E05017' }
    ],
    date: '12 Oct. 2023',
    duration: '3 Jours',
    location: 'Abidjan',
    format: 'En ligne',
    level: 'Débutant',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
    about: 'Cette formation intensive vise à outiller les acteurs de la société civile ivoirienne pour mener des actions de plaidoyer efficaces. Apprenez à influencer les politiques publiques et à défendre les droits des citoyens avec des méthodes modernes et adaptées au contexte local.',
    skills: [
      { name: 'Rédaction de plaidoyer', icon: FileEdit, bgColor: '#f0fdf4', iconColor: '#16a34a' },
      { name: 'Analyse politique', icon: BarChart, bgColor: '#eff6ff', iconColor: '#2563eb' }
    ],
    program: [
      { id: 1, title: 'Fondamentaux du Plaidoyer', content: 'Définitions, enjeux du plaidoyer en Côte d’Ivoire et identification des cibles institutionnelles.', locked: false },
      { id: 2, title: 'Stratégies & Outils', content: 'Élaboration d’un plan d’action et utilisation des outils numériques.', locked: false },
      { id: 3, title: 'Mise en pratique', content: 'Ateliers de simulation et cas pratiques.', locked: true },
    ],
    instructors: [
      { name: 'Dr. Jean-Baptiste Koffi', title: 'Expert en Politiques Publiques', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { name: 'Mme. Sarah Traoré', title: 'Spécialiste Plaidoyer', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    ],
    price: 'GRATUIT',
    progress: 0.35
  }
};

export default function CourseDetailsScreen() {
  const { id, subscribed } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(subscribed === 'true');
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const data = COURSE_DATA[id as string] || COURSE_DATA['1'];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const onShare = async () => {
    try {
      await Share.share({ message: `Formation PASCI : ${data.title}` });
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white z-10">
        <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">
          {isSubscribed ? 'Ma Formation' : 'Détails de la Formation'}
        </Text>
        <View className="flex-row">
          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} className="p-2 mr-2">
            <Heart size={24} color={isFavorite ? "#E05017" : "#1F2937"} fill={isFavorite ? "#E05017" : "transparent"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare} className="p-2">
            <Share2 size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Hero Image Section */}
        <View className="relative">
          <Image source={{ uri: data.image }} className="w-full h-80" resizeMode="cover" />
          <View className="absolute bottom-0 left-0 right-0 p-8 bg-black/40">
             <View className="flex-row mb-4">
               {data.tags.map((tag, i) => (
                 <View key={i} style={{ backgroundColor: tag.color }} className="px-3 py-1 rounded-lg mr-2">
                   <Text className="text-white text-[10px] font-bold">{tag.text}</Text>
                 </View>
               ))}
             </View>
             <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-2xl leading-8">
               {data.title}
             </Text>
          </View>
        </View>

        {/* Info Cards Bar - Dynamic content based on status */}
        <View className="px-6" style={{ marginTop: -40 }}>
          <View className="bg-white rounded-3xl p-6 flex-row justify-between shadow-xl shadow-gray-200 border border-gray-50">
            {isSubscribed ? (
              <>
                <View className="items-center flex-1">
                  <Clock size={20} color="#E05017" />
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 11 }} className="text-gray-900 mt-2">{data.duration}</Text>
                  <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 9 }} className="text-gray-400 uppercase mt-0.5">Durée</Text>
                </View>
                <View className="w-[1px] h-8 bg-gray-100 self-center" />
                <View className="items-center flex-1">
                  <Video size={20} color="#E05017" />
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 11 }} className="text-gray-900 mt-2">{data.format}</Text>
                  <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 9 }} className="text-gray-400 uppercase mt-0.5">Format</Text>
                </View>
                <View className="w-[1px] h-8 bg-gray-100 self-center" />
                <View className="items-center flex-1">
                  <BarChart3 size={20} color="#E05017" />
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 11 }} className="text-gray-900 mt-2">{data.level}</Text>
                  <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 9 }} className="text-gray-400 uppercase mt-0.5">Niveau</Text>
                </View>
              </>
            ) : (
              <>
                <View className="items-center flex-1">
                  <Calendar size={20} color="#E05017" />
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 11 }} className="text-gray-900 mt-2">{data.date}</Text>
                  <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 9 }} className="text-gray-400 uppercase mt-0.5">Date</Text>
                </View>
                <View className="w-[1px] h-8 bg-gray-100 self-center" />
                <View className="items-center flex-1">
                  <Clock size={20} color="#E05017" />
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 11 }} className="text-gray-900 mt-2">{data.duration}</Text>
                  <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 9 }} className="text-gray-400 uppercase mt-0.5">Durée</Text>
                </View>
                <View className="w-[1px] h-8 bg-gray-100 self-center" />
                <View className="items-center flex-1">
                  <MapPin size={20} color="#E05017" />
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 11 }} className="text-gray-900 mt-2">{data.location}</Text>
                  <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 9 }} className="text-gray-400 uppercase mt-0.5">Lieu</Text>
                </View>
              </>
            )}
          </View>
        </View>

        <View className="px-8 mt-10">
          {/* Section: À propos */}
          <View className="mb-10">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">À propos de cette formation</Text>
            </View>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-base">{data.about}</Text>
          </View>

          {/* Section: Compétences (Only in Discovery mode) */}
          {!isSubscribed && (
            <View className="mb-10">
              <View className="flex-row items-center mb-4">
                <View className="w-1 h-5 bg-brand-green rounded-full mr-3" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Compétences acquises</Text>
              </View>
              <View className="flex-row justify-between">
                {data.skills.map((skill, i) => (
                  <View key={i} style={{ width: '48%' }} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <View style={{ backgroundColor: skill.bgColor }} className="w-10 h-10 rounded-xl items-center justify-center mb-3">
                      <skill.icon size={20} color={skill.iconColor} />
                    </View>
                    <Text style={{ fontFamily: 'Karla_700Bold', fontSize: 12 }} className="text-gray-700 leading-5">{skill.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Section: Programme / Progression */}
          <View className="mb-10">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <View className={`w-1 h-5 ${isSubscribed ? 'bg-brand-green' : 'bg-brand-orange'} rounded-full mr-3`} />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">
                  {isSubscribed ? 'Ma progression' : 'Programme détaillé'}
                </Text>
              </View>
              {isSubscribed && <Text className="text-brand-orange font-bold text-xs">{Math.round(data.progress * 100)}% complété</Text>}
            </View>

            {data.program.map((module) => (
              <TouchableOpacity 
                key={module.id} 
                onPress={() => !isSubscribed && setExpandedModule(expandedModule === module.id ? null : module.id)}
                className={`bg-white rounded-2xl mb-3 border border-gray-100 overflow-hidden ${module.locked && isSubscribed ? 'opacity-50' : 'shadow-sm'}`}
                disabled={module.locked && isSubscribed}
              >
                <View className="flex-row items-center p-5">
                  <View className={`w-8 h-8 rounded-full ${module.locked && isSubscribed ? 'bg-gray-100' : 'bg-brand-orange'} items-center justify-center mr-4`}>
                    {module.locked && isSubscribed ? <Lock size={14} color="#9CA3AF" /> : <Text className="text-white font-bold text-xs">{module.id}</Text>}
                  </View>
                  <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm flex-1">{module.title}</Text>
                  {!isSubscribed ? (
                    expandedModule === module.id ? <ChevronUp size={20} color="#9CA3AF" /> : <ChevronDown size={20} color="#9CA3AF" />
                  ) : (
                    module.locked ? null : <PlayCircle size={20} color="#E05017" />
                  )}
                </View>
                {!isSubscribed && expandedModule === module.id && (
                  <View className="px-5 pb-5 pt-0">
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm leading-6">{module.content}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Section: Formateurs */}
          <View className="mb-10">
            <View className="flex-row items-center mb-6">
              <View className="w-1 h-5 bg-brand-green rounded-full mr-3" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Formateurs</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
              {data.instructors.map((inst, i) => (
                <View key={i} className="bg-gray-50 flex-row items-center p-3 rounded-3xl border border-gray-100 mr-4">
                  <Image source={{ uri: inst.image }} className="w-12 h-12 rounded-full mr-3" />
                  <View>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 12 }} className="text-gray-900">{inst.name}</Text>
                    <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 10 }} className="text-gray-400">{inst.title}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Floating Sticky Footer - Conditional based on Subscription status */}
      <View 
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 24, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10 }}
      >
        {!isSubscribed ? (
          <View className="flex-row items-center">
            <View className="mr-6">
               <Text style={{ fontFamily: 'Karla_700Bold', fontSize: 10 }} className="text-gray-400 uppercase tracking-widest">FRAIS</Text>
               <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18 }} className="text-brand-orange">{data.price}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setIsSubscribed(true)}
              className="bg-brand-orange flex-1 h-14 rounded-2xl items-center justify-center shadow-lg shadow-orange-300"
            >
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-base">S'inscrire à la formation</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-6">
              <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <View style={{ width: `${data.progress * 100}%` }} className="h-full bg-brand-orange" />
              </View>
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-400 text-[10px] mt-2">En cours : Module 02</Text>
            </View>
            <TouchableOpacity 
              className="bg-brand-orange flex-row items-center px-6 py-4 rounded-2xl shadow-lg shadow-orange-300"
            >
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white mr-2">Continuer</Text>
              <ChevronRight size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
