import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Search, Bell, UserCircle, MapPin, ChevronRight, Building2 } from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import { Partner, PTF } from '../../services/types';
import OscEvaluationBadge from '../../components/OscEvaluationBadge';
import OscEtiquettes from '../../components/OscEtiquettes';
import { useDomainesPrioritaires } from '../../constants/oscDomaines';
import { useActualisation } from '../../hooks/useActualisation';

// Étiquettes filtrables : catégorie (OdF, OdJ, OPSH) ou faîtière
const ETIQUETTES = [
  { cle: 'organisation_femme', label: 'OdF' },
  { cle: 'organisation_jeune', label: 'OdJ' },
  { cle: 'organisation_handicap', label: 'OPSH' },
  { cle: 'faitiere', label: 'Faîtières' },
];

export default function AnnuairePartenairesScreen() {
  // Tirer pour actualiser (les données restent affichées hors ligne)
  const actualisation = useActualisation();
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const initialTab: 'OSC' | 'PTF' = params.tab?.toUpperCase() === 'PTF' ? 'PTF' : 'OSC';
  const [activeTab, setActiveTab] = useState<'OSC' | 'PTF'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Tous');
  const [selectedDomaine, setSelectedDomaine] = useState('');
  const [selectedEtiquette, setSelectedEtiquette] = useState('');
  // PTF : classification par types (Institutions multilatérales, Agences spécialisées…)
  const [selectedTypePtf, setSelectedTypePtf] = useState('');
  const domaines = useDomainesPrioritaires();

  useEffect(() => {
    if (params.tab?.toUpperCase() === 'PTF') {
      setActiveTab('PTF');
      return;
    }
    if (params.tab?.toUpperCase() === 'OSC') {
      setActiveTab('OSC');
    }
  }, [params.tab]);

  // Données OSC
  const { data: regions = [] } = useQuery({
    queryKey: ['regions'],
    queryFn: () => dataService.getRegions(),
  });

  // Recherche faite par l'API (insensible aux accents, sur le nom, les thématiques, la ville…)
  const { data: partners, isLoading: partnersLoading } = useQuery({
    queryKey: ['osc-annuaire', searchQuery.trim(), selectedRegion, selectedDomaine, selectedEtiquette],
    queryFn: () =>
      dataService.getOscAnnuaire({
        search: searchQuery.trim() || undefined,
        region_nom: selectedRegion === 'Tous' ? undefined : selectedRegion,
        domaine_activite: selectedDomaine || undefined,
        categorie: selectedEtiquette && selectedEtiquette !== 'faitiere' ? selectedEtiquette : undefined,
        faitiere: selectedEtiquette === 'faitiere' ? true : undefined,
      }),
    enabled: activeTab === 'OSC',
  });

  // Données PTF
  const { data: ptfList, isLoading: ptfLoading } = useQuery({
    queryKey: ['ptf-list'],
    queryFn: dataService.getPtfList,
  });

  const { data: typesPtf = [] } = useQuery({
    queryKey: ['ptf-types'],
    queryFn: dataService.getTypesPtf,
    staleTime: 10 * 60 * 1000,
  });

  const { data: taskForces = [] } = useQuery({
    queryKey: ['task-forces'],
    queryFn: dataService.getTaskForces,
    staleTime: 10 * 60 * 1000,
  });

  const isLoading = activeTab === 'OSC' ? partnersLoading : ptfLoading;

  const regionCategories = ['Tous', ...regions.map((r: any) => r.name || r.slug)];

  const typeDuPtf = (ptf: PTF) => ptf.categorie || 'Autres';
  const typesPtfAffiches = typesPtf.filter((t) => (ptfList || []).some((p: PTF) => typeDuPtf(p) === t.nom));
  // Ordre de la classification, puis nom
  const rangType = (nom: string) => {
    const i = typesPtf.findIndex((t) => t.nom === nom);
    return i === -1 ? 999 : i;
  };
  const filteredPtf = ptfList?.filter((ptf: PTF) =>
    (!selectedTypePtf || typeDuPtf(ptf) === selectedTypePtf) && (
      !searchQuery ||
      ptf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ptf.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).sort((a: PTF, b: PTF) => rangType(typeDuPtf(a)) - rangType(typeDuPtf(b)) || a.name.localeCompare(b.name, 'fr'));

  const renderOscCard = ({ item }: { item: Partner }) => (
    <View className="bg-white rounded-[32px] p-6 mb-6 mx-6 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between mb-4">
        <View className="flex-1 mr-3">
          {item.etiquettes?.length ? (
            <OscEtiquettes etiquettes={item.etiquettes} />
          ) : (
            <View className="bg-gray-50 px-2 py-1 rounded self-start">
              <Text className="text-gray-400 text-[8px] font-bold">OSC</Text>
            </View>
          )}
          {!!item.domaine_prioritaire && (
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-brand-orange text-[10px] mt-1" numberOfLines={1}>
              {item.domaine_prioritaire}
            </Text>
          )}
        </View>
        <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center border border-gray-100 shrink-0">
          {item.thumbnail_url ? (
            <Image source={{ uri: item.thumbnail_url }} style={{ width: 30, height: 30 }} resizeMode="contain" />
          ) : (
            <UserCircle size={24} color="#9CA3AF" />
          )}
        </View>
      </View>
      <View className="mb-3">
        <OscEvaluationBadge score={item.score_autoevaluation} color={item.couleur_autoevaluation} hex={item.couleur_autoevaluation_hex} />
      </View>
      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-2 leading-6">{item.name}</Text>
      <Text numberOfLines={2} style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs mb-6 leading-5">
        {item.description || 'Aucune description disponible'}
      </Text>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <MapPin size={12} color="#9CA3AF" />
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1">
            {item.ville || 'Localisation non spécifiée'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/osc-details/${item.slug}`)}
          className="bg-orange-50 px-4 py-2 rounded-full flex-row items-center"
        >
          <Text className="text-brand-orange font-bold text-xs mr-1">Détails</Text>
          <ChevronRight size={14} color="#E05017" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPtfCard = ({ item }: { item: PTF }) => (
    <View className="bg-white rounded-[32px] p-6 mb-6 mx-6 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between mb-4">
        <View className="flex-row flex-wrap flex-1 mr-3">
          {!!item.categorie && (
            <View className="bg-green-50 px-2 py-1 rounded mr-2 mb-1">
              <Text className="text-[#2a591d] text-[8px] font-bold">{item.categorie}</Text>
            </View>
          )}
          {item.domaines_list?.slice(0, 2).map((d, i) => (
            <View key={i} className="bg-orange-50 px-2 py-1 rounded mr-2 mb-1">
              <Text className="text-brand-orange text-[8px] font-bold">{d}</Text>
            </View>
          )) || (
            <View className="bg-gray-50 px-2 py-1 rounded">
              <Text className="text-gray-400 text-[8px] font-bold">PTF</Text>
            </View>
          )}
        </View>
        <View className="w-12 h-12 bg-gray-50 rounded-xl items-center justify-center border border-gray-100 shrink-0">
          {item.thumbnail_url ? (
            <Image source={{ uri: item.thumbnail_url }} style={{ width: 30, height: 30 }} resizeMode="contain" />
          ) : (
            <Building2 size={20} color="#9CA3AF" />
          )}
        </View>
      </View>
      <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base mb-2 leading-6">{item.name}</Text>
      <Text numberOfLines={2} style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs mb-6 leading-5">
        {item.description || 'Aucune description disponible'}
      </Text>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <MapPin size={12} color="#9CA3AF" />
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1">
            {item.pays || 'International'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/annuaire-partenaires/${item.slug}`)}
          className="bg-orange-50 px-4 py-2 rounded-full flex-row items-center"
        >
          <Text className="text-brand-orange font-bold text-xs mr-1">Détails</Text>
          <ChevronRight size={14} color="#E05017" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSkeleton = () => (
    <View className="bg-white rounded-[32px] p-6 mb-6 mx-6 border border-gray-100 shadow-sm">
      <View className="flex-row justify-between mb-4">
        <Skeleton width={60} height={16} borderRadius={4} />
        <Skeleton width={48} height={48} borderRadius={12} />
      </View>
      <Skeleton width="80%" height={20} style={{ marginBottom: 12 }} />
      <Skeleton width="100%" height={12} style={{ marginBottom: 6 }} />
      <Skeleton width="90%" height={12} style={{ marginBottom: 24 }} />
      <View className="flex-row justify-between items-center">
        <Skeleton width={100} height={12} />
        <Skeleton width={80} height={32} borderRadius={16} />
      </View>
    </View>
  );

  const listData = isLoading
    ? [1, 2, 3]
    : activeTab === 'OSC'
    ? (partners || [])
    : (filteredPtf || []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <TouchableOpacity onPress={() => router.back()} className="bg-gray-100 p-2 rounded-full">
          <ChevronLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Annuaire</Text>
        <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
          <Bell size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <FlatList<any>
        refreshControl={<RefreshControl refreshing={actualisation.refreshing} onRefresh={actualisation.onRefresh} colors={['#E05017']} tintColor="#E05017" />}
        ListHeaderComponent={
          <>
            {/* Onglets OSC / PTF */}
            <View className="mx-6 mt-2 flex-row bg-gray-100 p-1.5 rounded-[24px] mb-5">
              <TouchableOpacity
                onPress={() => { setActiveTab('OSC'); setSearchQuery(''); }}
                className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'OSC' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className={`text-xs ${activeTab === 'OSC' ? 'text-gray-900' : 'text-gray-400'}`}>
                  OSC
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setActiveTab('PTF'); setSearchQuery(''); setSelectedRegion('Tous'); }}
                className={`flex-1 py-3 rounded-[20px] items-center ${activeTab === 'PTF' ? 'bg-white shadow-sm' : ''}`}
              >
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className={`text-xs ${activeTab === 'PTF' ? 'text-gray-900' : 'text-gray-400'}`}>
                  Partenaires Techniques
                </Text>
              </TouchableOpacity>
            </View>

            {/* Barre de Recherche */}
            <View className="px-6 mb-5">
              <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-3xl border border-gray-100">
                <Search size={20} color="#9CA3AF" />
                <TextInput
                  placeholder={activeTab === 'OSC' ? 'Nom, thématique, ville, OdF, OPSH…' : 'Rechercher un partenaire...'}
                  className="flex-1 ml-3 text-gray-700"
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            {/* Filtres régions (OSC seulement) */}
            {activeTab === 'OSC' && (
              <View className="mb-5">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
                  {regionCategories.map((region) => (
                    <TouchableOpacity
                      key={region}
                      onPress={() => setSelectedRegion(region)}
                      className={`mr-3 px-5 py-3 rounded-2xl border ${selectedRegion === region ? 'bg-brand-orange border-brand-orange shadow-lg shadow-orange-200' : 'bg-white border-gray-100'}`}
                    >
                      <Text
                        style={{ fontFamily: selectedRegion === region ? 'Poppins_600SemiBold' : 'Poppins_400Regular' }}
                        className={`${selectedRegion === region ? 'text-white' : 'text-gray-500'} text-xs`}
                      >
                        {region}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Thématiques (domaines prioritaires = pôles) */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3" contentContainerStyle={{ paddingHorizontal: 24 }}>
                  {[{ value: '', label: 'Toutes thématiques' }, ...domaines].map((d) => (
                    <TouchableOpacity
                      key={d.value || 'toutes'}
                      onPress={() => setSelectedDomaine(d.value)}
                      className={`mr-2 px-4 py-2 rounded-full ${selectedDomaine === d.value ? 'bg-gray-900' : 'bg-gray-100'}`}
                    >
                      <Text style={{ fontFamily: 'Karla_700Bold' }} className={`text-[11px] ${selectedDomaine === d.value ? 'text-white' : 'text-gray-600'}`}>
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Étiquettes : OdF, OdJ, OPSH, faîtières */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3" contentContainerStyle={{ paddingHorizontal: 24 }}>
                  {ETIQUETTES.map((e) => {
                    const actif = selectedEtiquette === e.cle;
                    return (
                      <TouchableOpacity
                        key={e.cle}
                        onPress={() => setSelectedEtiquette(actif ? '' : e.cle)}
                        className={`mr-2 px-4 py-2 rounded-full border ${actif ? 'bg-brand-orange border-brand-orange' : 'bg-white border-gray-200'}`}
                      >
                        <Text style={{ fontFamily: 'Karla_700Bold' }} className={`text-[11px] ${actif ? 'text-white' : 'text-gray-600'}`}>
                          {e.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Types de PTF */}
            {activeTab === 'PTF' && typesPtfAffiches.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5" contentContainerStyle={{ paddingHorizontal: 24 }}>
                {[{ nom: '', label: 'Tous' }, ...typesPtfAffiches.map((t) => ({ nom: t.nom, label: t.nom }))].map((t) => (
                  <TouchableOpacity
                    key={t.nom || 'tous'}
                    onPress={() => setSelectedTypePtf(t.nom)}
                    className={`mr-2 px-4 py-2 rounded-full ${selectedTypePtf === t.nom ? 'bg-[#2a591d]' : 'bg-gray-100'}`}
                  >
                    <Text style={{ fontFamily: 'Karla_700Bold' }} className={`text-[11px] ${selectedTypePtf === t.nom ? 'text-white' : 'text-gray-600'}`}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View className="px-8 mb-6">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl">
                {activeTab === 'OSC' ? 'Organisations (OSC)' : 'Partenaires Techniques & Financiers'}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                {searchQuery
                  ? `Résultats pour "${searchQuery}"`
                  : activeTab === 'OSC' && selectedRegion !== 'Tous'
                  ? `OSC de ${selectedRegion}`
                  : activeTab === 'OSC'
                  ? 'Toutes les organisations membres'
                  : 'Institutions partenaires du projet PASCI'}
              </Text>
            </View>
          </>
        }
        data={listData}
        renderItem={({ item }) => {
          if (isLoading) return renderSkeleton();
          if (activeTab === 'OSC') return renderOscCard({ item: item as Partner });
          return renderPtfCard({ item: item as PTF });
        }}
        keyExtractor={(item, index) => (typeof item === 'number' ? `skeleton-${item}` : `${(item as any).id}-${index}`)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListFooterComponent={
          activeTab === 'PTF' && !isLoading && taskForces.length > 0 ? (
            <View className="px-6 pb-10">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl mb-1 px-2">Task forces thématiques</Text>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs mb-4 px-2">
                Partenaires qui coordonnent leurs appuis sur une même thématique
              </Text>
              {taskForces.map((tf) => (
                <View key={tf.id} className="bg-white rounded-[24px] p-5 mb-4 border border-gray-100">
                  <View className="bg-orange-50 self-start px-2 py-0.5 rounded-full mb-2">
                    <Text className="text-brand-orange text-[9px] font-bold">{tf.thematique}</Text>
                  </View>
                  <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-sm mb-1">{tf.nom}</Text>
                  {!!tf.description && (
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs mb-3" numberOfLines={3}>{tf.description}</Text>
                  )}
                  <View className="flex-row flex-wrap">
                    {tf.membres.map((m) => (
                      <TouchableOpacity
                        key={m.id}
                        disabled={!m.slug}
                        onPress={() => m.slug && router.push(`/annuaire-partenaires/${m.slug}`)}
                        className={`px-2.5 py-1 rounded-lg mr-2 mb-2 border ${m.chef_de_file ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}
                      >
                        <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-700 text-[10px]">
                          {m.name}{m.chef_de_file ? ' · chef de file' : ''}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="px-8 py-12 items-center">
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-center">
                Aucun résultat trouvé
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
