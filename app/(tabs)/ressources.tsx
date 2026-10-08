import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
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
  // 'all' ou slug d'un type de la typologie ; '' = toutes les catégories
  const [activeType, setActiveType] = useState('all');
  const [activeCategorie, setActiveCategorie] = useState('');
  const [downloadState, setDownloadState] = useState({
    visible: false,
    progress: 0,
    fileName: ''
  });

  const { data: docs, isLoading } = useQuery({
    queryKey: ['documentation'],
    queryFn: dataService.getDocumentation,
  });

  const { data: types = [] } = useQuery({
    queryKey: ['ressource-types'],
    queryFn: dataService.getRessourceTypes,
    staleTime: 10 * 60 * 1000,
  });

  const { data: categoriesTypologie = [] } = useQuery({
    queryKey: ['ressource-categories'],
    queryFn: dataService.getRessourceCategories,
    staleTime: 10 * 60 * 1000,
  });

  // Ancien serveur sans champ type : tout est de la documentation
  const typeDe = (doc: Documentation) => doc.type || 'documentation';
  const libelleType = (slug: string) =>
    types.find((t) => t.slug === slug)?.nom || (slug === 'fiche' ? 'Fiches et modules PdoC' : slug === 'documentation' ? 'Documentation' : slug);

  // Onglets : types ayant au moins une ressource, dans l'ordre de la typologie
  const typesDisponibles = useMemo(() => {
    const presents = new Set((docs || []).map(typeDe));
    const ordre = [...types.map((t) => t.slug), ...Array.from(presents)];
    return Array.from(new Set(ordre)).filter((slug) => presents.has(slug));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docs, types]);

  const docsDuType = (docs || []).filter((doc) => activeType === 'all' || typeDe(doc) === activeType);

  // Catégories proposées : celles de la typologie présentes dans les ressources du type
  const categoriesDisponibles = useMemo(() => {
    const presentes = new Set(docsDuType.map((d) => d.category).filter(Boolean) as string[]);
    const ordre = [
      ...categoriesTypologie.filter((c) => activeType !== 'all' && c.type_slug === activeType).map((c) => c.nom),
      ...categoriesTypologie.filter((c) => c.type_slug === null || activeType === 'all').map((c) => c.nom),
      ...Array.from(presentes),
    ];
    return Array.from(new Set(ordre)).filter((nom) => presentes.has(nom));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docs, activeType, categoriesTypologie]);

  const filtered = docsDuType.filter(doc => {
    const matchesCategorie = !activeCategorie || doc.category === activeCategorie;
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategorie && matchesSearch;
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
            {activeType === 'all' && (
              <View className="bg-orange-50 px-1.5 py-0.5 rounded mr-2">
                <Text className="text-brand-orange text-[8px] font-bold">{libelleType(typeDe(item))}</Text>
              </View>
            )}
            {!!item.category && (
              <View className="bg-blue-50 px-1.5 py-0.5 rounded mr-2">
                <Text className="text-blue-700 text-[8px] font-bold">{item.category}</Text>
              </View>
            )}
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

      {/* Types (gérés dans l'admin) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 -mx-1">
        {['all', ...typesDisponibles].map((slug) => {
          const actif = activeType === slug;
          return (
            <TouchableOpacity
              key={slug}
              onPress={() => {
                setActiveType(slug);
                setActiveCategorie('');
              }}
              className={`px-4 py-2 rounded-full border mx-1 ${actif ? 'bg-brand-orange border-brand-orange' : 'bg-white border-gray-200'}`}
            >
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className={`text-xs ${actif ? 'text-white' : 'text-gray-600'}`}>
                {slug === 'all' ? 'Tout' : libelleType(slug)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Catégories du type choisi */}
      {categoriesDisponibles.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-1">
          {['', ...categoriesDisponibles].map((nom) => {
            const actif = activeCategorie === nom;
            return (
              <TouchableOpacity
                key={nom || 'toutes'}
                onPress={() => setActiveCategorie(nom)}
                className={`px-3 py-1.5 rounded-full mx-1 ${actif ? 'bg-gray-900' : 'bg-gray-100'}`}
              >
                <Text style={{ fontFamily: 'Karla_700Bold' }} className={`text-[11px] ${actif ? 'text-white' : 'text-gray-600'}`}>
                  {nom || 'Toutes catégories'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

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
      <FlatList<any>
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
