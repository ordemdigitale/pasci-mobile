import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Dimensions, ScrollView, Image, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Search,
  Users,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  Bookmark,
  ChevronRight
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import { PoleConcertation, Job } from '../../services/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 2;

const POLE_COLORS = [
  { bg: '#DCFCE7', icon: '#166534' },
  { bg: '#EFF6FF', icon: '#1E40AF' },
  { bg: '#FFF7ED', icon: '#9A3412' },
  { bg: '#F5F3FF', icon: '#5B21B6' },
  { bg: '#FFF1F2', icon: '#9F1239' },
  { bg: '#FEF9C3', icon: '#854D0E' },
  { bg: '#FDF2F8', icon: '#9D174D' },
  { bg: '#ECFEFF', icon: '#0E7490' },
];

export default function EspaceCollabScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Pôles' | 'Offres'>('Pôles');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: poles, isLoading: polesLoading } = useQuery({
    queryKey: ['forum-poles'],
    queryFn: dataService.getForumPoles,
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: dataService.getJobs,
  });

  const isLoading = activeTab === 'Pôles' ? polesLoading : jobsLoading;

  const filteredJobs = jobs?.filter(job =>
    !searchQuery ||
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.employer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPoles = poles?.filter(pole =>
    !searchQuery ||
    pole.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (pole.category?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getJobTypeStyle = (type: string) => {
    if (type === 'CDI') return { bg: '#F0FDF4', text: '#16A34A', color: '#16A34A' };
    if (type === 'CDD') return { bg: '#EFF6FF', text: '#2563EB', color: '#2563EB' };
    return { bg: '#F5F3FF', text: '#7C3AED', color: '#7C3AED' };
  };

  const renderPoleItem = ({ item, index }: { item: PoleConcertation; index: number }) => {
    const colorSet = POLE_COLORS[index % POLE_COLORS.length];
    return (
      <TouchableOpacity
        style={{ width: CARD_WIDTH }}
        className="bg-white rounded-[32px] p-5 mb-5 items-center border border-gray-100 shadow-sm shadow-gray-200"
        onPress={() => router.push(`/pole-details/${item.slug}`)}
      >
        <View style={{ backgroundColor: colorSet.bg }} className="w-16 h-16 rounded-3xl items-center justify-center mb-4">
          <Users size={28} color={colorSet.icon} />
        </View>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-[13px] text-center mb-1" numberOfLines={2}>
          {item.name}
        </Text>
        {item.category && (
          <View className="bg-orange-50 px-2 py-0.5 rounded-full mb-2">
            <Text className="text-brand-orange text-[8px] font-bold uppercase">{item.category}</Text>
          </View>
        )}
        <View className="flex-row items-center mb-5">
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[9px]">
            {item.sujets_count} sujet{item.sujets_count !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity className="w-full py-2.5 rounded-2xl items-center bg-orange-50">
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-brand-orange text-[11px]">
            Rejoindre
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderJobItem = ({ item }: { item: Job }) => {
    const typeStyle = getJobTypeStyle(item.type);
    const pubDate = item.publication_date || item.created_at;
    const daysAgo = pubDate
      ? Math.floor((Date.now() - new Date(pubDate).getTime()) / 86400000)
      : null;
    const timeLabel = daysAgo === 0 ? "Aujourd'hui" : daysAgo === 1 ? 'Hier' : daysAgo !== null ? `Il y a ${daysAgo}j` : '';
    const deadlineLabel = item.expiration_date
      ? new Date(item.expiration_date).toLocaleDateString('fr-FR')
      : null;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/job-details/${item.slug}`)}
        className="bg-white rounded-[32px] p-6 mb-4 mx-6 border border-gray-100 shadow-sm relative"
      >
        <View className="flex-row items-start mb-4">
          <View className="bg-brand-orange/10 w-14 h-14 rounded-2xl items-center justify-center mr-4">
            <Briefcase size={24} color="#E05017" />
          </View>
          <View className="flex-1 pr-2">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm leading-5 mb-1" numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-xs">
              {item.employer}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mb-3 flex-wrap gap-2">
          <View className="bg-gray-100 flex-row items-center px-3 py-1.5 rounded-xl">
            <MapPin size={12} color="#4B5563" />
            <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-600 text-[10px] ml-1.5">{item.location}</Text>
          </View>
          <View style={{ backgroundColor: typeStyle.bg }} className="flex-row items-center px-3 py-1.5 rounded-xl">
            <Briefcase size={12} color={typeStyle.color} />
            <Text style={{ fontFamily: 'Karla_700Bold', color: typeStyle.text }} className="text-[10px] ml-1.5">{item.type}</Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {timeLabel ? (
            <View className="flex-row items-center bg-gray-50 self-start px-3 py-1 rounded-lg">
              <Clock size={12} color="#9CA3AF" />
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1.5">{timeLabel}</Text>
            </View>
          ) : null}
          {deadlineLabel ? (
            <View className="flex-row items-center bg-red-50 self-start px-3 py-1 rounded-lg">
              <Calendar size={12} color="#DC2626" />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-red-600 text-[10px] ml-1.5">
                Jusqu'au {deadlineLabel}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderPoleSkeleton = () => (
    <View style={{ width: CARD_WIDTH }} className="bg-white rounded-[32px] p-5 mb-5 items-center border border-gray-100 shadow-sm">
      <Skeleton width={64} height={64} borderRadius={24} style={{ marginBottom: 16 }} />
      <Skeleton width="80%" height={14} style={{ marginBottom: 8 }} />
      <Skeleton width="50%" height={10} style={{ marginBottom: 20 }} />
      <Skeleton width="100%" height={32} borderRadius={12} />
    </View>
  );

  const renderJobSkeleton = () => (
    <View className="bg-white rounded-[32px] p-6 mb-4 mx-6 border border-gray-100 shadow-sm">
      <View className="flex-row items-center mb-4">
        <Skeleton width={56} height={56} borderRadius={16} style={{ marginRight: 16 }} />
        <View className="flex-1">
          <Skeleton width="90%" height={16} style={{ marginBottom: 8 }} />
          <Skeleton width="60%" height={12} />
        </View>
      </View>
      <View className="flex-row mb-3">
        <Skeleton width={80} height={24} borderRadius={12} style={{ marginRight: 12 }} />
        <Skeleton width={80} height={24} borderRadius={12} />
      </View>
      <Skeleton width={60} height={16} borderRadius={8} />
    </View>
  );

  const renderEmpty = () => (
    <View className="items-center py-16 px-8">
      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-center text-sm">
        {activeTab === 'Pôles'
          ? 'Aucun pôle CRASC disponible pour le moment.'
          : 'Aucune offre d\'emploi disponible pour le moment.'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View className="px-6 pt-4">
      {/* Tab Switcher */}
      <View className="flex-row bg-gray-100 p-1.5 rounded-[24px] mb-6">
        <TouchableOpacity
          onPress={() => { setActiveTab('Pôles'); setSearchQuery(''); }}
          className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'Pôles' ? 'bg-white shadow-sm' : ''}`}
        >
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className={`text-xs ${activeTab === 'Pôles' ? 'text-gray-900' : 'text-gray-400'}`}>
            Pôles de concertation
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { setActiveTab('Offres'); setSearchQuery(''); }}
          className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'Offres' ? 'bg-white shadow-sm' : ''}`}
        >
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className={`text-xs ${activeTab === 'Offres' ? 'text-gray-900' : 'text-gray-400'}`}>
            Offres d'emploi
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View className="bg-white flex-row items-center px-4 py-3 rounded-2xl border border-gray-100 mb-6 shadow-sm">
        <Search size={20} color="#9CA3AF" />
        <TextInput
          placeholder={activeTab === 'Pôles' ? "Rechercher un pôle..." : "Poste, employeur ou ville..."}
          className="flex-1 ml-3 font-bold text-gray-700"
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {activeTab === 'Offres' && !isLoading && (
        <View className="flex-row justify-between items-center mb-6">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[10px] uppercase tracking-widest">
            {filteredJobs?.length || 0} offre{(filteredJobs?.length || 0) !== 1 ? 's' : ''} disponible{(filteredJobs?.length || 0) !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {activeTab === 'Pôles' && !isLoading && (
        <View className="flex-row justify-between items-center mb-6">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[10px] uppercase tracking-widest">
            {filteredPoles?.length || 0} pôle{(filteredPoles?.length || 0) !== 1 ? 's' : ''} actif{(filteredPoles?.length || 0) !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );

  const listData = isLoading
    ? [1, 2, 3, 4]
    : activeTab === 'Pôles'
      ? (filteredPoles || [])
      : (filteredJobs || []);

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={['top']}
    >
      <FlatList<any>
        data={listData}
        renderItem={({ item, index }) => {
          if (isLoading) return activeTab === 'Pôles' ? renderPoleSkeleton() : renderJobSkeleton();
          if (activeTab === 'Pôles') return renderPoleItem({ item: item as PoleConcertation, index });
          return renderJobItem({ item: item as Job });
        }}
        keyExtractor={(item, index) => (typeof item === 'number' ? `skeleton-${item}` : `${(item as any).id}-${index}`)}
        numColumns={activeTab === 'Pôles' ? 2 : 1}
        key={activeTab}
        columnWrapperStyle={activeTab === 'Pôles' ? { justifyContent: 'space-between', paddingHorizontal: 24 } : undefined}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isLoading ? renderEmpty : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
}
