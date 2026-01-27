import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Dimensions, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Download, FileText, BarChart3, Megaphone, FileDigit } from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';

const { width } = Dimensions.get('window');

const RECENT_RESOURCES = [
  { id: '1', title: 'Guide de gestion...', type: 'PDF', size: '2.4 MB', date: '12 Oct 2023', icon: <FileText size={20} color="#E05017" />, bgColor: '#FEF2F2' },
  { id: '2', title: 'Rapport annuel PASCI...', type: 'PDF', size: '5.1 MB', date: '05 Jan 2024', icon: <BarChart3 size={20} color="#E05017" />, bgColor: '#FFF7ED' },
  { id: '3', title: 'Manuel de plaidoyer', type: 'PDF', size: '1.8 MB', date: '22 Nov 2023', icon: <Megaphone size={20} color="#E05017" />, bgColor: '#FFF1F2' },
];

const ARCHIVES = [
  { id: '4', title: 'Statuts types pour...', type: 'DOCX', size: '0.4 MB', date: '15 Sep 2023', icon: <FileDigit size={20} color="#E05017" />, bgColor: '#FDF2F0' },
];

export default function RessourcesScreen() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Documentation');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderResourceItem = ({ item }) => (
    <TouchableOpacity className="bg-white rounded-[24px] p-4 mb-4 border border-gray-50 shadow-sm flex-row items-center">
      <View style={{ backgroundColor: item.bgColor }} className="w-12 h-12 rounded-2xl items-center justify-center mr-4">
        {item.icon}
      </View>
      <View className="flex-1">
        <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm mb-1" numberOfLines={1}>
          {item.title}
        </Text>
        <View className="flex-row items-center">
          <View className="bg-gray-100 px-1.5 py-0.5 rounded mr-2">
            <Text className="text-gray-400 text-[8px] font-bold">{item.type}</Text>
          </View>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px]">
            •  {item.size}  •  {item.date}
          </Text>
        </View>
      </View>
      <TouchableOpacity className="p-2">
        <Download size={20} color="#E05017" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSkeleton = () => (
    <View className="bg-white rounded-[24px] p-4 mb-4 border border-gray-50 shadow-sm flex-row items-center">
      <Skeleton width={48} height={48} borderRadius={16} style={{ marginRight: 16 }} />
      <View className="flex-1">
        <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />
        <Skeleton width="40%" height={10} />
      </View>
      <Skeleton width={24} height={24} borderRadius={12} />
    </View>
  );

  const renderHeader = () => (
    <View className="px-6 pt-4">
      {/* Search bar */}
      <View className="bg-white flex-row items-center px-4 py-3 rounded-full border border-gray-100 mb-6 shadow-sm">
        <Search size={20} color="#9CA3AF" />
        <TextInput
          placeholder="Rechercher une ressource..."
          className="flex-1 ml-3 font-bold text-gray-700"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Tabs */}
      <View className="flex-row mb-8 border-b border-gray-100">
        {['Documentation', 'Fiches Informatives'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            className={`flex-1 pb-4 items-center ${activeTab === tab ? 'border-b-2 border-brand-orange' : ''}`}
          >
            <Text 
              style={{ fontFamily: activeTab === tab ? 'Poppins_700Bold' : 'Karla_400Regular' }}
              className={activeTab === tab ? "text-brand-orange text-sm" : "text-gray-400 text-sm"}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[10px] uppercase tracking-widest">RESSOURCES RÉCENTES</Text>
        <TouchableOpacity>
          <Text className="text-brand-orange font-bold text-[10px]">Tout voir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View className="px-6 mt-4 pb-10">
      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[10px] uppercase tracking-widest mb-4">ARCHIVES 2023</Text>
      <FlatList
        data={loading ? [1] : ARCHIVES}
        renderItem={loading ? renderSkeleton : renderResourceItem}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <SafeAreaView 
      className="flex-1 bg-white" 
      edges={['top']}
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      <FlatList
        data={loading ? [1, 2, 3] : RECENT_RESOURCES}
        renderItem={loading ? renderSkeleton : renderResourceItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#FAFAFA' }}
      />
    </SafeAreaView>
  );
}
