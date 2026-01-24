import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Bell, Info } from 'lucide-react-native';
import Skeleton from '../components/ui/Skeleton';

const NOTIFICATIONS = [
  { id: '1', title: 'Nouvelle formation disponible', message: 'Le module sur la Transparence Financière est ouvert.', time: 'Il y a 2h' },
  { id: '2', title: 'Mise à jour CRASC', message: 'Votre pôle régional a mis à jour ses informations.', time: 'Hier' },
];

export default function InboxScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const renderItem = ({ item }) => (
    <View className="bg-white p-5 mb-4 rounded-3xl border border-gray-100 flex-row items-center">
      <View className="bg-orange-50 p-3 rounded-2xl mr-4">
        <Bell size={20} color="#E05017" />
      </View>
      <View className="flex-1">
        <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm">{item.title}</Text>
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs mt-1">{item.message}</Text>
      </View>
      <Text className="text-[10px] text-gray-300 font-bold">{item.time}</Text>
    </View>
  );

  const renderSkeleton = () => (
    <View className="bg-white p-5 mb-4 rounded-3xl border border-gray-100 flex-row items-center">
      <Skeleton width={44} height={44} borderRadius={16} style={{ marginRight: 16 }} />
      <View className="flex-1">
        <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="90%" height={10} />
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
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-lg text-gray-900">Notifications</Text>
      </View>

      <FlatList
        data={loading ? [1, 2, 3, 4] : NOTIFICATIONS}
        renderItem={loading ? renderSkeleton : renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24 }}
      />
    </SafeAreaView>
  );
}
