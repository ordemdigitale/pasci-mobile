import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ChevronLeft,
  MapPin,
  Users2,
  Building,
  Calendar,
  Phone,
  Mail,
  Globe,
  ChevronRight,
  Newspaper,
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';

export default function OscDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['osc', id],
    queryFn: () => dataService.getPartnerBySlug(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-50">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={120} height={16} />
          <View style={{ width: 40 }} />
        </View>
        <View className="px-6 mt-4">
          <Skeleton width="100%" height={200} borderRadius={0} />
          <Skeleton width="100%" height={140} borderRadius={16} style={{ marginTop: 16 }} />
          <Skeleton width="100%" height={200} borderRadius={16} style={{ marginTop: 16 }} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <View className="px-6 py-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full mr-4">
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900">Erreur</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Users2 size={48} color="#D1D5DB" />
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-center mt-4">
            Impossible de charger les détails de cette organisation.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>

      {/* Header */}
      <View className="px-6 py-4 flex-row items-center bg-white">
        <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full mr-4">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base" numberOfLines={1}>
            {data.name}
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-brand-orange text-[10px] uppercase tracking-widest">
            Détails de l'OSC
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header card — logo + nom + infos de base */}
        <View className="mx-4 bg-white rounded-[24px] border border-gray-200 shadow-sm p-5 mt-4 mb-4 z-10">
          <View className="flex-row gap-4 items-start">
            {/* Logo */}
            {data.thumbnail_url && (
              <View className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                <Image source={{ uri: data.thumbnail_url }} style={{ width: 80, height: 80 }} resizeMode="cover" />
              </View>
            )}

            <View className="flex-1">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-1" numberOfLines={3}>
                {data.name}
              </Text>
              {data.description ? (
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-[11px] leading-4" numberOfLines={3}>
                  {data.description}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Infos de base */}
          <View className="mt-4 pt-4 border-t border-gray-100 gap-y-2">
            {data.type?.name && (
              <View className="flex-row items-center gap-2">
                <Building size={14} color="#E05017" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs">
                  <Text style={{ fontFamily: 'Karla_700Bold' }}>Domaine : </Text>{data.type.name}
                </Text>
              </View>
            )}
            {(data.ville || data.crasc?.name) && (
              <View className="flex-row items-center gap-2">
                <MapPin size={14} color="#E05017" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs">
                  <Text style={{ fontFamily: 'Karla_700Bold' }}>Localisation : </Text>
                  {[data.ville, data.crasc?.name].filter(Boolean).join(', ')}
                </Text>
              </View>
            )}
            {data.created_at && (
              <View className="flex-row items-center gap-2">
                <Calendar size={14} color="#E05017" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs">
                  <Text style={{ fontFamily: 'Karla_700Bold' }}>Création : </Text>
                  {new Date(data.created_at).toLocaleDateString('fr-FR')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Rattaché au CRASC */}
        {data.crasc && (
          <TouchableOpacity
            onPress={() => router.push(`/crasc-details/${data.crasc!.slug}`)}
            className="mx-4 mb-4 bg-white rounded-[24px] p-4 border border-orange-100 shadow-sm flex-row items-center"
          >
            <View className="bg-brand-orange p-3 rounded-2xl mr-4">
              <Users2 size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-[10px] uppercase">Rattaché au CRASC</Text>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm">{data.crasc.name}</Text>
            </View>
            <ChevronRight size={20} color="#D1D5DB" />
          </TouchableOpacity>
        )}

        {/* Informations de contact */}
        <View className="mx-4 mb-8 bg-white rounded-[24px] border border-gray-200 shadow-sm p-5">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-4">
            Informations de Contact
          </Text>

          <View className="gap-y-4">
            {data.address && (
              <View className="flex-row items-start gap-3">
                <MapPin size={18} color="#E05017" style={{ marginTop: 2 }} />
                <View>
                  <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-700 text-sm">Adresse</Text>
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm">{data.address}</Text>
                </View>
              </View>
            )}
            {data.email && (
              <TouchableOpacity onPress={() => Linking.openURL(`mailto:${data.email}`)} className="flex-row items-start gap-3">
                <Mail size={18} color="#E05017" style={{ marginTop: 2 }} />
                <View>
                  <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-700 text-sm">Email</Text>
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-brand-orange text-sm">{data.email}</Text>
                </View>
              </TouchableOpacity>
            )}
            {data.phone && (
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${data.phone}`)} className="flex-row items-start gap-3">
                <Phone size={18} color="#E05017" style={{ marginTop: 2 }} />
                <View>
                  <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-700 text-sm">Téléphone</Text>
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-brand-orange text-sm">{data.phone}</Text>
                </View>
              </TouchableOpacity>
            )}
            {data.website && (
              <TouchableOpacity onPress={() => Linking.openURL(data.website!.startsWith('http') ? data.website! : `https://${data.website}`)} className="flex-row items-start gap-3">
                <Globe size={18} color="#E05017" style={{ marginTop: 2 }} />
                <View>
                  <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-700 text-sm">Site Web</Text>
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-brand-orange text-sm">{data.website}</Text>
                </View>
              </TouchableOpacity>
            )}
            {!data.address && !data.email && !data.phone && !data.website && (
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm text-center py-4">
                Aucune coordonnée disponible.
              </Text>
            )}
          </View>
        </View>

        {/* Actualités liées à l'OSC */}
        <View className="mx-4 mb-8">
          <View className="flex-row items-center mb-4">
            <View className="w-9 h-9 bg-orange-100 rounded-xl items-center justify-center mr-3">
              <Calendar size={18} color="#E05017" />
            </View>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base">Actualités Récentes</Text>
          </View>

          {data.news_items && data.news_items.length > 0 ? (
            data.news_items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push(`/news-details/${item.slug}`)}
                className="bg-white rounded-[24px] mb-4 border border-gray-100 shadow-sm overflow-hidden"
              >
                {item.thumbnail_url && (
                  <Image source={{ uri: item.thumbnail_url }} style={{ width: '100%', height: 120 }} resizeMode="cover" />
                )}
                <View className="p-4">
                  <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm mb-1" numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View className="flex-row items-center">
                    <Calendar size={11} color="#9CA3AF" />
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1">
                      {new Date(item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-white rounded-[24px] p-8 items-center border border-gray-100">
              <Newspaper size={36} color="#D1D5DB" />
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm mt-3 text-center">
                Aucune actualité pour le moment.
              </Text>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
