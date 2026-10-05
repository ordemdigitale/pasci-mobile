import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ChevronLeft,
  MessageSquare,
  Eye,
  Pin,
  Plus,
  Users,
  X,
  Send,
  CalendarDays,
  MapPin,
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import { authService } from '../../services/authService';
import { ForumSujet, PoleAgendaItem, PoleAgendaStatut, PoleMembre } from '../../services/types';

// Mêmes règles d'affichage que la page pôle du site web
const MEMBRES_PAR_PAGE = 10;

const AGENDA_STATUS_META: Record<PoleAgendaStatut, { label: string; bg: string; text: string }> = {
  realise: { label: 'Réalisé', bg: 'bg-green-100', text: 'text-green-700' },
  en_cours: { label: 'En cours', bg: 'bg-blue-100', text: 'text-blue-700' },
  non_realise: { label: 'Non réalisé', bg: 'bg-red-100', text: 'text-red-700' },
};

const MEMBER_TYPE_FILTERS = [
  { label: 'Tous', value: 'all' },
  { label: 'Association', value: 'Association' },
  { label: 'ONG', value: 'ONG' },
  { label: 'Fondation', value: 'Fondation' },
  { label: 'Organisation cultuelle', value: 'Organisation cultuelle' },
];

// Comparaison sans accents ni casse : "ONG" doit trouver "Organisation Non Gouvernementale (ONG)"
function normaliser(value?: string | null) {
  return (value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
}

function correspondAuType(membre: PoleMembre, filtre: string) {
  const attendu = normaliser(filtre);
  return [membre.type_name, membre.categorie].some((value) => {
    const v = normaliser(value);
    return v === attendu || v.split(/[^a-z0-9]+/).includes(attendu) || (attendu.includes(' ') && v.includes(attendu));
  });
}

function parseAgenda(raw?: string | null): PoleAgendaItem[] {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        date: typeof item.date === 'string' ? item.date : '',
        titre: typeof item.titre === 'string' ? item.titre : '',
        description: typeof item.description === 'string' ? item.description : '',
        statut: ['realise', 'en_cours', 'non_realise'].includes(item.statut) ? item.statut : 'en_cours',
      }))
      .filter((item) => item.date || item.titre || item.description);
  } catch {
    return [];
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function PoleDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const slug = id as string;
  const queryClient = useQueryClient();

  const [newSujetModal, setNewSujetModal] = useState(false);
  const [sujetTitle, setSujetTitle] = useState('');
  const [sujetContent, setSujetContent] = useState('');
  const [memberTypeFilter, setMemberTypeFilter] = useState('all');
  const [membresPage, setMembresPage] = useState(1);
  const [regionOuverte, setRegionOuverte] = useState<string | null>(null);

  const { data: membres = [] } = useQuery({
    queryKey: ['pole-membres', slug],
    queryFn: () => dataService.getForumPoleMembres(slug),
    enabled: !!slug,
  });

  const { data: pole, isLoading: poleLoading } = useQuery({
    queryKey: ['pole', slug],
    queryFn: () => dataService.getForumPoleBySlug(slug),
    enabled: !!slug,
  });

  const { data: sujets, isLoading: sujetsLoading } = useQuery({
    queryKey: ['sujets', slug],
    queryFn: () => dataService.getForumSujets(slug),
    enabled: !!slug,
  });

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getCurrentUser,
    retry: false,
  });

  const isAuthenticated = !!user;

  const createSujetMutation = useMutation({
    mutationFn: () => dataService.createForumSujet(slug, { title: sujetTitle.trim(), content: sujetContent.trim() }),
    onSuccess: (newSujet) => {
      queryClient.invalidateQueries({ queryKey: ['sujets', slug] });
      setNewSujetModal(false);
      setSujetTitle('');
      setSujetContent('');
      router.push(`/sujet-details/${newSujet.slug}?pole=${slug}`);
    },
    onError: (err: any) => {
      Alert.alert('Erreur', err?.response?.data?.detail || 'Impossible de créer le sujet.');
    },
  });

  const handleNewSujet = () => {
    if (isAuthenticated) {
      setNewSujetModal(true);
    } else {
      router.push('/login');
    }
  };

  const isLoading = poleLoading || sujetsLoading;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="px-6 py-4 flex-row items-center border-b border-gray-50">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={140} height={18} style={{ marginLeft: 12 }} />
        </View>
        <View className="px-6 mt-4">
          <Skeleton width="100%" height={100} borderRadius={16} style={{ marginBottom: 16 }} />
          <Skeleton width="60%" height={18} style={{ marginBottom: 12 }} />
          {[1, 2, 3].map(i => (
            <Skeleton key={i} width="100%" height={72} borderRadius={16} style={{ marginBottom: 12 }} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (!pole) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="px-6 py-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full mr-4">
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900">Erreur</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Users size={48} color="#D1D5DB" />
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-center mt-4">
            Pôle de concertation introuvable.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const agendaItems = parseAgenda(pole.agenda);
  const filteredMembres = membres.filter(
    (membre) => memberTypeFilter === 'all' || correspondAuType(membre, memberTypeFilter)
  );
  const nbPagesMembres = Math.max(1, Math.ceil(filteredMembres.length / MEMBRES_PAR_PAGE));
  const pageMembres = Math.min(membresPage, nbPagesMembres);
  const membresAffiches = filteredMembres.slice(
    (pageMembres - 1) * MEMBRES_PAR_PAGE,
    pageMembres * MEMBRES_PAR_PAGE
  );

  // Régions : de la plus représentée à la moins représentée, avec le nombre d'OSC
  const regionsMap = new Map<string, { nom: string; oscs: PoleMembre[] }>();
  for (const membre of membres) {
    const nom = (membre.region_nom || '').trim();
    if (!nom) continue;
    const cle = normaliser(nom);
    const entree = regionsMap.get(cle) ?? { nom, oscs: [] };
    entree.oscs.push(membre);
    regionsMap.set(cle, entree);
  }
  const regions = [...regionsMap.values()].sort(
    (a, b) => b.oscs.length - a.oscs.length || a.nom.localeCompare(b.nom, 'fr')
  );
  const oscsRegionOuverte = regions.find((r) => r.nom === regionOuverte)?.oscs ?? [];

  const ouvrirOsc = (membre: PoleMembre) => {
    if (membre.slug) router.push(`/osc-details/${membre.slug}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="bg-orange-50 p-2 rounded-full mr-4">
          <ChevronLeft size={24} color="#E05017" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base" numberOfLines={1}>
            {pole.name}
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-brand-orange text-[10px] uppercase tracking-widest">
            Pôle de Concertation
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Pole header card */}
        <View className="mx-4 mt-4 mb-4 bg-blue-50 rounded-[24px] p-5 border border-blue-100">
          {pole.category && (
            <View className="bg-brand-orange self-start px-3 py-1 rounded-full mb-3">
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-white text-[10px] uppercase">
                {pole.category}
              </Text>
            </View>
          )}
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-green-800 text-lg mb-2">
            {pole.name}
          </Text>
          {pole.description && (
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm leading-5">
              {pole.description}
            </Text>
          )}
        </View>

        {/* Agenda : affiché avant les membres */}
        {agendaItems.length > 0 && (
          <View className="mx-4 mb-4 bg-white rounded-[24px] p-5 border border-gray-100">
            <View className="flex-row items-center mb-3">
              <CalendarDays size={18} color="#E05017" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-800 text-base ml-2">Agenda</Text>
            </View>
            {agendaItems.map((item, i) => {
              const status = AGENDA_STATUS_META[item.statut];
              const date = item.date ? new Date(item.date) : null;
              return (
                <View key={i} className="flex-row bg-gray-50 rounded-xl p-3 mb-2 border border-gray-100">
                  {date && !isNaN(date.getTime()) && (
                    <View className="bg-brand-orange rounded-lg px-2 py-2 mr-3 items-center min-w-[56px]">
                      <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-white text-[11px]">
                        {date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </Text>
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-white text-[10px]">
                        {date.getFullYear()}
                      </Text>
                    </View>
                  )}
                  <View className="flex-1">
                    <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-800 text-sm">{item.titre}</Text>
                    <View className={`self-start px-2 py-0.5 rounded-full mt-1 ${status.bg}`}>
                      <Text style={{ fontFamily: 'Karla_700Bold' }} className={`text-[10px] ${status.text}`}>{status.label}</Text>
                    </View>
                    {!!item.description && (
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs mt-1">{item.description}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Membres du pôle */}
        <View className="mx-4 mb-4 bg-white rounded-[24px] p-5 border border-gray-100">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Users size={18} color="#E05017" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-800 text-base ml-2">Membres du pôle</Text>
            </View>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs">
              {filteredMembres.length} / {membres.length}
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            {MEMBER_TYPE_FILTERS.map((filter) => {
              const active = memberTypeFilter === filter.value;
              return (
                <TouchableOpacity
                  key={filter.value}
                  onPress={() => { setMemberTypeFilter(filter.value); setMembresPage(1); }}
                  className={`px-3 py-1.5 rounded-full border mr-2 ${active ? 'bg-brand-orange border-brand-orange' : 'bg-white border-gray-200'}`}
                >
                  <Text style={{ fontFamily: 'Karla_700Bold' }} className={`text-xs ${active ? 'text-white' : 'text-gray-600'}`}>
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {filteredMembres.length === 0 ? (
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm py-2">
              Aucun membre trouvé pour ce filtre.
            </Text>
          ) : (
            membresAffiches.map((membre) => (
              <TouchableOpacity
                key={membre.id}
                onPress={() => ouvrirOsc(membre)}
                className="flex-row items-center bg-gray-50 rounded-xl p-3 mb-2 border border-gray-100"
              >
                <View className="w-9 h-9 rounded-full bg-green-100 items-center justify-center mr-3">
                  <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-green-800">
                    {(membre.sigle || membre.name || '?').slice(0, 1).toUpperCase()}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm" numberOfLines={1}>
                    {membre.name}
                  </Text>
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs" numberOfLines={1}>
                    {membre.type_name || membre.categorie || 'Type non renseigné'}
                    {membre.region_nom ? ` · ${membre.region_nom}` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}

          {nbPagesMembres > 1 && (
            <View className="flex-row items-center justify-center mt-2">
              <TouchableOpacity
                onPress={() => setMembresPage(pageMembres - 1)}
                disabled={pageMembres <= 1}
                className={`px-3 py-1.5 rounded-full border border-gray-200 ${pageMembres <= 1 ? 'opacity-40' : ''}`}
              >
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs">← Précédent</Text>
              </TouchableOpacity>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs mx-3">
                Page {pageMembres} / {nbPagesMembres}
              </Text>
              <TouchableOpacity
                onPress={() => setMembresPage(pageMembres + 1)}
                disabled={pageMembres >= nbPagesMembres}
                className={`px-3 py-1.5 rounded-full border border-gray-200 ${pageMembres >= nbPagesMembres ? 'opacity-40' : ''}`}
              >
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs">Suivant →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Régions d'influence */}
        {regions.length > 0 && (
          <View className="mx-4 mb-4 bg-white rounded-[24px] p-5 border border-gray-100">
            <View className="flex-row items-center mb-1">
              <MapPin size={18} color="#E05017" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-800 text-base ml-2">Régions d'influence</Text>
            </View>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs mb-3">
              Touchez une région pour voir ses OSC membres.
            </Text>
            <View className="flex-row flex-wrap">
              {regions.map((region) => {
                const active = regionOuverte === region.nom;
                return (
                  <TouchableOpacity
                    key={region.nom}
                    onPress={() => setRegionOuverte(active ? null : region.nom)}
                    className={`px-3 py-1 rounded-full mr-2 mb-2 ${active ? 'bg-green-800' : 'bg-green-50'}`}
                  >
                    <Text style={{ fontFamily: 'Karla_700Bold' }} className={`text-xs ${active ? 'text-white' : 'text-green-800'}`}>
                      {region.nom} ({region.oscs.length})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {regionOuverte && oscsRegionOuverte.map((membre) => (
              <TouchableOpacity
                key={membre.id}
                onPress={() => ouvrirOsc(membre)}
                className="bg-gray-50 rounded-xl px-3 py-2 mt-2 border border-gray-100"
              >
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-800 text-sm">{membre.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Sujets header */}
        <View className="px-4 mb-3 flex-row items-center justify-between">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-800 text-base">
            {sujets?.length ?? 0} discussion{(sujets?.length ?? 0) !== 1 ? 's' : ''}
          </Text>
          <TouchableOpacity
            onPress={handleNewSujet}
            className="flex-row items-center bg-brand-orange px-4 py-2 rounded-full"
          >
            <Plus size={14} color="white" />
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white text-xs ml-1">
              Nouveau sujet
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sujets list */}
        {!sujets || sujets.length === 0 ? (
          <View className="mx-4 bg-white rounded-[24px] p-10 items-center border border-gray-100">
            <MessageSquare size={40} color="#D1D5DB" />
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm mt-3 text-center">
              Aucune discussion pour l'instant.
            </Text>
            <TouchableOpacity
              onPress={handleNewSujet}
              className="mt-4 bg-orange-50 px-6 py-2 rounded-full"
            >
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-brand-orange text-sm">
                Lancer une discussion
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="px-4">
            {sujets.map((sujet: ForumSujet) => (
              <TouchableOpacity
                key={sujet.id}
                onPress={() => router.push(`/sujet-details/${sujet.slug}?pole=${slug}`)}
                className="bg-white rounded-[20px] p-4 mb-3 border border-gray-100 shadow-sm"
              >
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 mr-4">
                    <View className="flex-row items-center mb-1">
                      {sujet.is_pinned && (
                        <Pin size={12} color="#E05017" style={{ marginRight: 4 }} />
                      )}
                      <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm flex-1" numberOfLines={2}>
                        {sujet.title}
                      </Text>
                    </View>
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[11px]">
                      Par <Text style={{ fontFamily: 'Karla_700Bold' }}>{sujet.author_name || 'Anonyme'}</Text>
                      {' · '}{formatDate(sujet.created_at)}
                    </Text>
                  </View>
                  <View className="items-end gap-y-1">
                    <View className="flex-row items-center">
                      <MessageSquare size={12} color="#9CA3AF" />
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[11px] ml-1">{sujet.comments_count}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Eye size={12} color="#9CA3AF" />
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[11px] ml-1">{sujet.views_count}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal Nouveau Sujet */}
      <Modal visible={newSujetModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white rounded-t-3xl px-5 pt-5 pb-10">
            <View className="flex-row items-center justify-between mb-5">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base">Nouveau sujet</Text>
              <TouchableOpacity onPress={() => setNewSujetModal(false)}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs mb-1">Titre <Text className="text-red-500">*</Text></Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 mb-4"
              style={{ fontFamily: 'Karla_400Regular' }}
              placeholder="Titre de votre discussion..."
              placeholderTextColor="#9ca3af"
              value={sujetTitle}
              onChangeText={setSujetTitle}
            />

            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-xs mb-1">Message <Text className="text-red-500">*</Text></Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50 mb-5"
              style={{ fontFamily: 'Karla_400Regular', textAlignVertical: 'top' }}
              placeholder="Décrivez votre sujet..."
              placeholderTextColor="#9ca3af"
              value={sujetContent}
              onChangeText={setSujetContent}
              multiline
              numberOfLines={5}
            />

            <TouchableOpacity
              className="bg-[#E05017] rounded-xl py-4 items-center flex-row justify-center"
              onPress={() => {
                if (!sujetTitle.trim() || !sujetContent.trim()) {
                  Alert.alert('Champs requis', 'Veuillez remplir le titre et le message.');
                  return;
                }
                createSujetMutation.mutate();
              }}
              disabled={createSujetMutation.isPending}
              activeOpacity={0.85}
            >
              {createSujetMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Send size={15} color="#fff" />
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-white font-bold text-sm ml-2">Publier le sujet</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
