import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { dataService } from '../services/dataService';

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  actualite: { label: 'Actualité', color: '#1D4ED8', bg: '#DBEAFE' },
  osc: { label: 'OSC', color: '#166534', bg: '#DCFCE7' },
  crasc: { label: 'CRASC', color: '#6B21A8', bg: '#F3E8FF' },
  formation: { label: 'Formation', color: '#92400E', bg: '#FEF3C7' },
  emploi: { label: 'Emploi', color: '#9F1239', bg: '#FFE4E6' },
};

function getLinkForResult(item: any): string | null {
  switch (item.type) {
    case 'actualite': return `/news-details/${item.slug || item.id}`;
    case 'osc': return `/osc-details/${item.slug || item.id}`;
    case 'crasc': return `/crasc-details/${item.slug || item.id}`;
    case 'formation': return `/course-details/${item.slug || item.id}`;
    case 'emploi': return `/job-details/${item.slug || item.id}`;
    default: return null;
  }
}

export default function RechercheScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');

  const { data: results = [], isLoading, isError } = useQuery({
    queryKey: ['search', submitted],
    queryFn: () => dataService.searchGlobal(submitted),
    enabled: submitted.length > 1,
  });

  function handleSearch() {
    if (query.trim().length > 1) setSubmitted(query.trim());
  }

  function handleClear() {
    setQuery('');
    setSubmitted('');
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-6 pt-4 pb-3">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2">
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20 }} className="text-gray-900">Recherche</Text>
        </View>

        {/* Barre de recherche */}
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
          <Search size={18} color="#9CA3AF" />
          <TextInput
            placeholder="OSC, formations, actualités..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 mx-3 text-gray-800"
            style={{ fontFamily: 'Karla_400Regular', fontSize: 15 }}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <X size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Corps */}
      {!submitted ? (
        <View className="flex-1 items-center justify-center px-8">
          <Search size={56} color="#E5E7EB" />
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16 }} className="text-gray-700 mt-4 mb-2">
            Chercher sur la plateforme
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 14, lineHeight: 22 }} className="text-gray-400 text-center">
            Tapez un mot-clé pour rechercher parmi les OSC, CRASC, formations, actualités et offres d'emploi.
          </Text>
        </View>
      ) : isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#E05017" size="large" />
          <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 13 }} className="text-gray-400 mt-3">
            Recherche en cours...
          </Text>
        </View>
      ) : isError ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16 }} className="text-gray-700 mb-2">Erreur</Text>
          <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 14 }} className="text-gray-400 text-center">
            Une erreur est survenue. Vérifiez votre connexion.
          </Text>
        </View>
      ) : results.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 18 }} className="text-gray-700 mb-2">Aucun résultat</Text>
          <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 14 }} className="text-gray-400 text-center">
            Aucun résultat pour « {submitted} ». Essayez d'autres mots-clés.
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item: any, idx) => `${item.id ?? idx}`}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 40 }}
          ListHeaderComponent={
            <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 13 }} className="text-gray-400 mb-3 px-1">
              {results.length} résultat{results.length > 1 ? 's' : ''} pour « {submitted} »
            </Text>
          }
          renderItem={({ item }: { item: any }) => {
            const cfg = TYPE_CONFIG[item.type] ?? { label: item.type, color: '#4B5563', bg: '#F3F4F6' };
            const link = getLinkForResult(item);
            return (
              <TouchableOpacity
                onPress={() => link && router.push(link as any)}
                disabled={!link}
                className="flex-row items-center bg-white border border-gray-100 rounded-2xl px-4 py-4 mb-3"
                style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
              >
                <View className="flex-1 mr-3">
                  {/* Badge type + date */}
                  <View className="flex-row items-center mb-2">
                    <View className="px-2 py-1 rounded-lg mr-2" style={{ backgroundColor: cfg.bg }}>
                      <Text style={{ fontFamily: 'Karla_700Bold', fontSize: 10, color: cfg.color }}>
                        {cfg.label}
                      </Text>
                    </View>
                    {item.date && (
                      <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 11 }} className="text-gray-400">
                        {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </Text>
                    )}
                    {item.location && (
                      <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 11 }} className="text-gray-400 ml-2">
                        · {item.location}
                      </Text>
                    )}
                  </View>
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14 }} className="text-gray-900" numberOfLines={2}>
                    {item.title}
                  </Text>
                  {item.description && (
                    <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 12 }} className="text-gray-500 mt-1" numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                </View>
                {link && <ChevronRight size={16} color="#D1D5DB" />}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
