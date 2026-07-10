import React from 'react';
import { Alert, Linking, View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle2,
  Building2,
  Clock,
  ExternalLink
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const slug = id as string;

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ['job', slug],
    queryFn: () => dataService.getJobBySlug(slug),
    enabled: !!slug,
  });

  const onShare = async () => {
    if (!job) return;
    try {
      await Share.share({
        message: `Offre d'emploi : ${job.title} — PdoC${job.offre_url ? `\n${job.offre_url}` : ''}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openOfferLink = async () => {
    if (!job?.offre_url) return;

    try {
      await Linking.openURL(job.offre_url);
    } catch {
      Alert.alert("Lien indisponible", "Impossible d'ouvrir le lien de cette offre pour le moment.");
    }
  };

  const getTypeStyle = (type: string) => {
    if (type === 'CDI') return { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' };
    if (type === 'CDD') return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
    return { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' };
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />
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

  if (isError || !job) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-center px-8">
          Offre d'emploi introuvable ou indisponible.
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-brand-orange px-8 py-3 rounded-2xl">
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white">Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const typeStyle = getTypeStyle(job.type);
  const pubDate = job.publication_date || job.created_at;
  const expirationDate = job.expiration_date;

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
          {/* Employer Logo Placeholder */}
          <View className="bg-brand-orange/10 w-24 h-24 rounded-[28px] items-center justify-center shadow-lg shadow-orange-100 mb-6">
            <Building2 size={40} color="#E05017" />
          </View>

          {/* Job Title & Employer */}
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl text-center mb-2 px-4">
            {job.title}
          </Text>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-lg mb-6">
            {job.employer}
          </Text>

          {/* Badges Row 1 */}
          <View className="flex-row justify-center flex-wrap gap-2 mb-3">
            <View className="bg-gray-100 flex-row items-center px-4 py-2 rounded-2xl">
              <MapPin size={14} color="#6B7280" />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-500 text-xs ml-2">{job.location}</Text>
            </View>
            <View style={{ backgroundColor: typeStyle.bg }} className="flex-row items-center px-4 py-2 rounded-2xl">
              <Briefcase size={14} color={typeStyle.text} />
              <Text style={{ fontFamily: 'Karla_700Bold', color: typeStyle.text }} className="text-xs ml-2">{job.type}</Text>
            </View>
          </View>

          {/* Badges Row 2 */}
          <View className="flex-row justify-center flex-wrap gap-2 mb-10">
            {pubDate && (
              <View className="bg-orange-50 flex-row items-center px-4 py-2 rounded-2xl">
                <Calendar size={14} color="#E05017" />
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-xs ml-2">
                  Publié le {new Date(pubDate).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            )}
            {expirationDate && (
              <View className="bg-red-50 flex-row items-center px-4 py-2 rounded-2xl">
                <Clock size={14} color="#DC2626" />
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-red-600 text-xs ml-2">
                  Candidature jusqu'au {new Date(expirationDate).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View className="px-8">
          {/* Description */}
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[11px] uppercase tracking-widest mb-4">
            Description du poste
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 leading-6 text-base mb-8">
            {job.description}
          </Text>

          {job.offre_url && (
            <TouchableOpacity
              onPress={openOfferLink}
              className="bg-brand-orange rounded-2xl py-4 px-5 mb-8 flex-row items-center justify-center"
              activeOpacity={0.85}
            >
              <ExternalLink size={18} color="#fff" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-sm ml-2">
                Plus d'informations
              </Text>
            </TouchableOpacity>
          )}

          {/* Missions */}
          {job.missions_list && job.missions_list.length > 0 && (
            <>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[11px] uppercase tracking-widest mb-4">
                Missions principales
              </Text>
              <View className="mb-8">
                {job.missions_list.map((mission, index) => (
                  <View key={index} className="flex-row items-start mb-4">
                    <View className="mt-1">
                      <CheckCircle2 size={18} color="#E05017" />
                    </View>
                    <View className="flex-1 ml-3">
                      {mission.title && (
                        <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-800 text-sm mb-1">
                          {mission.title}
                        </Text>
                      )}
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm leading-5">
                        {mission.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Missions texte brut si pas de liste */}
          {job.missions && !job.missions_list?.length && (
            <>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[11px] uppercase tracking-widest mb-4">
                Missions principales
              </Text>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 leading-6 text-base mb-8">
                {job.missions}
              </Text>
            </>
          )}

          {/* Requirements */}
          {job.requirements_list && job.requirements_list.length > 0 && (
            <>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[11px] uppercase tracking-widest mb-4">
                Profil recherché
              </Text>
              <View className="mb-8">
                {job.requirements_list.map((req, index) => (
                  <View key={index} className="flex-row items-start mb-4">
                    <View className="bg-brand-green/10 p-2 rounded-xl mr-4 mt-0.5">
                      <Briefcase size={16} color="#2a591d" />
                    </View>
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm flex-1 leading-5">
                      {req}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {job.requirements && !job.requirements_list?.length && (
            <>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[11px] uppercase tracking-widest mb-4">
                Profil recherché
              </Text>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 leading-6 text-base mb-8">
                {job.requirements}
              </Text>
            </>
          )}

          <View className="mb-12" />
        </View>
      </ScrollView>


    </SafeAreaView>
  );
}
