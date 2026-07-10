import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Newspaper, Bell } from 'lucide-react-native';
import Skeleton from '../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/dataService';
import { News } from '../services/types';

export default function InboxScreen() {
  const router = useRouter();

  const { data: news, isLoading } = useQuery({
    queryKey: ['news-inbox'],
    queryFn: () => dataService.getNews({ limit: 20 }),
  });

  const renderItem = ({ item }: { item: News }) => {
    const daysAgo = item.created_at
      ? Math.floor((Date.now() - new Date(item.created_at).getTime()) / 86400000)
      : null;
    const timeLabel =
      daysAgo === 0 ? "Aujourd'hui" :
        daysAgo === 1 ? 'Hier' :
          daysAgo !== null ? `Il y a ${daysAgo}j` : '';

    return (
      <TouchableOpacity
        onPress={() => router.push(`/news-details/${item.slug}`)}
        className="bg-white p-5 mb-4 rounded-3xl border border-gray-100 flex-row items-center"
      >
        <View className="bg-orange-50 p-3 rounded-2xl mr-4 shrink-0">
          <Newspaper size={20} color="#E05017" />
        </View>
        <View className="flex-1">
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm" numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs mt-1" numberOfLines={1}>
            {item.crasc?.name || item.osc?.name || 'PASCI Info'}
          </Text>
        </View>
        {timeLabel ? (
          <Text className="text-[10px] text-gray-300 font-bold ml-2 shrink-0">{timeLabel}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  const renderSkeleton = () => (
    <View className="bg-white p-5 mb-4 rounded-3xl border border-gray-100 flex-row items-center">
      <Skeleton width={44} height={44} borderRadius={16} style={{ marginRight: 16 }} />
      <View className="flex-1">
        <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="40%" height={10} />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="bg-orange-50 p-2 rounded-full mr-4">
          <ChevronLeft size={24} color="#E05017" />
        </TouchableOpacity>
        <Bell size={20} color="#1F2937" />
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900 ml-3">Actualités récentes</Text>
      </View>

      <FlatList<any>
        data={isLoading ? [1, 2, 3, 4, 5] : (news || [])}
        renderItem={({ item }) => isLoading ? renderSkeleton() : renderItem({ item: item as News })}
        keyExtractor={(item, index) => (typeof item === 'number' ? `sk-${item}` : `${(item as News).id}-${index}`)}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center py-12">
              <Bell size={40} color="#D1D5DB" />
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-center mt-4">
                Aucune actualité disponible
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
