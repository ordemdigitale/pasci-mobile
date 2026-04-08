import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Share, Dimensions, ActivityIndicator, Linking, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  ChevronLeft, 
  Share2, 
  Mail, 
  Phone, 
  ArrowRight,
  MapPin,
  Globe
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';

const { width } = Dimensions.get('window');

export default function CrascDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { data, isLoading } = useQuery({
    queryKey: ['crasc', id],
    queryFn: () => dataService.getCrascBySlug(id as string),
    enabled: !!id,
  });

  const onShare = async () => {
    if (!data) return;
    try {
      await Share.share({
        message: `Découvrez le ${data.name} sur la plateforme PASCI.`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const renderHeader = () => {
    if (!data) return null;
    return (
      <View className="mb-6">
        {/* Main Info Card */}
        <View className="bg-white rounded-[40px] p-6 border border-gray-100 shadow-xl shadow-gray-200 elevation-5">
          <View className="flex-row items-center mb-8">
            <View className="w-20 h-20 bg-orange-50 rounded-3xl items-center justify-center mr-4">
              <Image 
                source={require('../../assets/logo.png')} 
                style={{ width: 45, height: 45 }} 
                resizeMode="contain" 
              />
            </View>
            <View className="flex-1">
              <View className="bg-green-100 self-start px-3 py-1 rounded-lg mb-2">
                <Text className="text-green-600 text-[10px] font-bold">BUREAU ACTIF</Text>
              </View>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl" >Coordination Régionale</Text>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm">
                {data.regions?.length > 0 
                  ? data.regions.map(r => r.name).slice(0, 3).join(', ') + (data.regions.length > 3 ? '...' : '')
                  : 'Chargement des régions...'}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="bg-gray-50 rounded-3xl p-4 w-[48%] items-center">
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] uppercase mb-2">OSC Membres</Text>
              <View className="flex-row items-baseline">
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl">{data.osc_count || 0}</Text>
                <Text className="text-green-500 text-xs font-bold ml-1">orgs</Text>
              </View>
            </View>
            <View className="bg-gray-50 rounded-3xl p-4 w-[48%] items-center">
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] uppercase mb-2">Pôles régionaux</Text>
              <View className="flex-row items-baseline">
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-2xl">{data.regions?.length || 0}</Text>
                <Text className="text-gray-400 text-[10px] ml-1">zones</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Regions Grid Section */}
        {data.regions?.length > 0 && (
            <View className="px-2 mt-8">
                <View className="flex-row justify-between items-center mb-4">
                    <View>
                        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-xs uppercase tracking-widest">Zones de couverture</Text>
                        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs mt-1">{data.regions.length} régions</Text>
                    </View>
                    <View className="bg-orange-50 px-3 py-1 rounded-full">
                        <Text className="text-brand-orange text-[10px] font-bold">{data.regions.length} régions</Text>
                    </View>
                </View>
                <View className="flex-row flex-wrap gap-2">
                    {data.regions.map((region, idx) => (
                        <View key={idx} className="bg-white px-4 py-2.5 rounded-2xl border border-orange-100 shadow-sm flex-row items-center">
                            <MapPin size={12} color="#E05017" />
                            <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-900 text-[10px] ml-1.5">{region.name}</Text>
                        </View>
                    ))}
                </View>
            </View>
        )}

        {/* About Section */}
        <View className="px-2 mt-10">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-xs uppercase tracking-widest mb-4">À propos du pôle</Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-sm">
            {data.description && data.description.trim() 
              ? data.description 
              : `Le ${data.name} coordonne les actions de la société civile et regroupe ${data.osc_count} organisations membres. Il se concentre sur le renforcement des capacités et le soutien aux organisations de base dans ses ${data.regions?.length || 0} zones de couverture pour un impact local durable et inclusif.`}
          </Text>
        </View>

        {/* Contact Buttons */}
        <View className="flex-row justify-between mt-8">
          <TouchableOpacity 
            onPress={() => data.email && Linking.openURL(`mailto:${data.email}`)}
            className="flex-row items-center justify-center bg-white border border-gray-100 shadow-sm py-4 rounded-3xl w-[48%]"
          >
            <Mail size={18} color="#E05017" />
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 ml-2">Email</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => data.phone && Linking.openURL(`tel:${data.phone}`)}
            className="flex-row items-center justify-center bg-white border border-gray-100 shadow-sm py-4 rounded-3xl w-[48%]"
          >
            <Phone size={18} color="#E05017" />
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 ml-2">Téléphone</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mt-10 mb-4 px-2">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-xs uppercase tracking-widest">Liste des OSC Membres</Text>
          <TouchableOpacity>
            <Text className="text-brand-orange font-bold text-xs">Voir tout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderOscItem = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => router.push(`/osc-details/${item.slug || item.id}`)}
      className="bg-white rounded-3xl p-5 mb-4 border border-gray-50 shadow-sm"
    >
      {/* Header avec image et infos principales */}
      <View className="flex-row items-start mb-4">
        <View className="w-16 h-16 bg-gray-50 rounded-2xl items-center justify-center mr-4 overflow-hidden shadow-sm">
          {item.thumbnail_url ? (
              <Image 
                source={{ uri: item.thumbnail_url }} 
                className="w-16 h-16 rounded-2xl" 
                resizeMode="cover" 
              />
          ) : (
              <Text style={{ color: '#4B5563', fontWeight: 'bold', fontSize: 18 }}>
                {item.name.substring(0, 2).toUpperCase()}
              </Text>
          )}
        </View>
        <View className="flex-1">
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm mb-1" numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] mb-2">
            {item.type || 'Organisation membre'}
          </Text>
          {item.ville && (
            <View className="flex-row items-center">
              <MapPin size={12} color="#9CA3AF" />
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[9px] ml-1">
                {item.ville}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Description */}
      {item.description && (
        <View className="mb-4 pb-3 border-b border-gray-50">
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-[11px] leading-4">
            {item.description.substring(0, 100)}{item.description.length > 100 ? '...' : ''}
          </Text>
        </View>
      )}

      {/* Adresse si disponible */}
      {item.address && (
        <View className="flex-row items-center mb-3">
          <MapPin size={14} color="#E05017" />
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-[10px] ml-2 flex-1">
            {item.address}
          </Text>
        </View>
      )}

      {/* Contacts */}
      <View className="flex-row gap-3">
        {item.email && (
          <TouchableOpacity 
            onPress={() => Linking.openURL(`mailto:${item.email}`)}
            className="flex-1 flex-row items-center justify-center bg-orange-50 py-2 px-3 rounded-2xl border border-orange-100"
          >
            <Mail size={14} color="#E05017" />
            <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-orange-600 text-[9px] ml-1 uppercase">Email</Text>
          </TouchableOpacity>
        )}
        {item.phone && (
          <TouchableOpacity 
            onPress={() => Linking.openURL(`tel:${item.phone}`)}
            className="flex-1 flex-row items-center justify-center bg-blue-50 py-2 px-3 rounded-2xl border border-blue-100"
          >
            <Phone size={14} color="#0EA5E9" />
            <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-blue-600 text-[9px] ml-1 uppercase">Tel</Text>
          </TouchableOpacity>
        )}
        <View className="flex-1 flex-row items-center justify-center bg-gray-50 py-2 px-3 rounded-2xl border border-gray-100">
          <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-[9px] uppercase">Profil</Text>
          <ArrowRight size={12} color="#E05017" className="ml-1" />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 py-4 flex-row justify-between items-center border-b border-gray-50">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={120} height={16} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <View className="px-6 mt-6">
          <Skeleton width="100%" height={250} borderRadius={32} />
          <Skeleton width="100%" height={100} style={{ marginTop: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  if (!data) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Fixed */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white z-10">
        <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View className="items-center">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg" numberOfLines={1}>{data.name}</Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-brand-orange text-[10px] font-bold uppercase tracking-widest">Détails du pôle</Text>
        </View>
        <TouchableOpacity onPress={onShare} className="bg-gray-50 p-2 rounded-full">
          <Share2 size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={data.oscs || []}
        renderItem={renderOscItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}