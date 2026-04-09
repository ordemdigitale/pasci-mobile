import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Linking, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Download, FileText, BarChart3, File } from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import { Documentation } from '../../services/types';
import { downloadAndOpenDocument } from '../../helpers/fileHelper';
import DownloadProgressModal from '../../components/ui/DownloadProgressModal';

function getFileIcon(type?: string) {
  const t = (type || '').toUpperCase();
  if (t.includes('PDF')) return { icon: FileText, color: '#DC2626', bg: '#FEF2F2' };
  if (t.includes('XLS') || t.includes('EXCEL')) return { icon: BarChart3, color: '#16A34A', bg: '#F0FDF4' };
  return { icon: File, color: '#E05017', bg: '#FFF7ED' };
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function RessourcesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Documentation');
  const [downloadState, setDownloadState] = useState({ 
    visible: false, 
    progress: 0, 
    fileName: '' 
  });

  const { data: docs, isLoading } = useQuery({
    queryKey: ['documentation'],
    queryFn: dataService.getDocumentation,
  });

  const filtered = docs?.filter(doc => {
    const matchesTab =
      activeTab === 'Documentation'
        ? !doc.type || doc.type === 'documentation'
        : doc.type === 'fiche';
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDownload = async (doc: Documentation) => {
    const targetUrl = doc.download_url || doc.file_url;
    if (targetUrl) {
      const rawTitle = doc.title || 'document';
      const safeTitle = rawTitle
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/[^a-z0-9]/gi, '_') 
        .toLowerCase();
      
      const fileName = `${safeTitle}.pdf`;
      
      setDownloadState({ visible: true, progress: 0, fileName: doc.title });
      
      try {
        await downloadAndOpenDocument(targetUrl, fileName, (progress) => {
          setDownloadState(prev => ({ ...prev, progress }));
        });
      } finally {
        setDownloadState(prev => ({ ...prev, visible: false }));
      }
    }
  };

  const renderResourceItem = ({ item }: { item: Documentation }) => {
    const { icon: IconComp, color, bg } = getFileIcon(item.file_type);
    return (
      <TouchableOpacity
        onPress={() => handleDownload(item)}
        className="bg-white rounded-[24px] p-4 mb-4 border border-gray-50 shadow-sm flex-row items-center"
      >
        <View style={{ backgroundColor: bg }} className="w-12 h-12 rounded-2xl items-center justify-center mr-4">
          <IconComp size={20} color={color} />
        </View>
        <View className="flex-1">
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm mb-1" numberOfLines={1}>
            {item.title}
          </Text>
          <View className="flex-row items-center flex-wrap">
            {item.file_type && (
              <View className="bg-gray-100 px-1.5 py-0.5 rounded mr-2">
                <Text className="text-gray-400 text-[8px] font-bold">{item.file_type.toUpperCase()}</Text>
              </View>
            )}
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px]">
              {[
                item.file_size ? formatFileSize(item.file_size) : null,
                new Date(item.created_at).toLocaleDateString('fr-FR'),
              ].filter(Boolean).join(' • ')}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleDownload(item)} className="p-2">
          <Download size={20} color="#E05017" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

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
          value={searchQuery}
          onChangeText={setSearchQuery}
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
              className={activeTab === tab ? 'text-brand-orange text-sm' : 'text-gray-400 text-sm'}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[10px] uppercase tracking-widest">
          {searchQuery ? `Résultats pour "${searchQuery}"` : 'RESSOURCES DISPONIBLES'}
        </Text>
        {!isLoading && (
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px]">
            {(filtered?.length || 0)} document{(filtered?.length || 0) !== 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={['top']}
    >
      <FlatList
        data={isLoading ? [1, 2, 3] : (filtered || [])}
        renderItem={({ item }) => isLoading ? renderSkeleton() : renderResourceItem({ item: item as Documentation })}
        keyExtractor={(item, index) => (typeof item === 'number' ? `skeleton-${item}` : `${(item as Documentation).id}-${index}`)}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !isLoading ? (
            <View className="px-8 py-12 items-center">
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-center">
                Aucune ressource disponible pour le moment.
              </Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#FAFAFA' }}
      />
      
      <DownloadProgressModal 
        visible={downloadState.visible} 
        progress={downloadState.progress} 
        fileName={downloadState.fileName}
      />
    </SafeAreaView>
  );
}
