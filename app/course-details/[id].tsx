import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Share, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Video,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Users,
  GraduationCap,
  DollarSign
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery, useMutation } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const slug = id as string;

  const [modalVisible, setModalVisible] = useState(false);
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [inscrit, setInscrit] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['formation', slug],
    queryFn: () => dataService.getFormationBySlug(slug),
    enabled: !!slug,
  });

  const inscriptionMutation = useMutation({
    mutationFn: () => {
      if (!participantName.trim() || !participantEmail.trim()) {
        throw new Error('Veuillez remplir tous les champs.');
      }
      // Appel API inscription
      return fetch(`https://api.plateforme-osci.org/api/v1/formations/${slug}/inscrire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participant_name: participantName, participant_email: participantEmail }),
      }).then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || "Erreur lors de l'inscription.");
        }
        return res.json();
      });
    },
    onSuccess: () => {
      setModalVisible(false);
      setInscrit(true);
      Alert.alert('Inscription confirmée', `Vous êtes inscrit(e) à "${data?.title}". Vous recevrez une confirmation par email.`);
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error.message || "L'inscription a échoué.");
    },
  });

  const onShare = async () => {
    if (!data) return;
    try {
      await Share.share({ message: `Formation PASCI : ${data.title}` });
    } catch (error) { console.log(error); }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />
        <View className="px-6 py-4 flex-row justify-between items-center">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={120} height={20} />
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
        <Skeleton width="100%" height={280} />
        <View className="px-6 mt-6">
          <Skeleton width="100%" height={100} borderRadius={24} style={{ marginBottom: 16 }} />
          <Skeleton width="100%" height={150} borderRadius={24} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !data) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <GraduationCap size={60} color="#D1D5DB" />
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-center px-8 mt-4">
          Formation introuvable ou indisponible.
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-brand-orange px-8 py-3 rounded-2xl">
          <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white">Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isFull = data.is_full || (data.max_participants !== null && data.current_participants >= (data.max_participants || 0));
  const isCompleted = data.is_completed;
  const canRegister = !inscrit && !isFull && !isCompleted && !data.is_expired;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-white z-10">
        <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full">
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Formation</Text>
        <TouchableOpacity onPress={onShare} className="p-2">
          <Share2 size={22} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Hero Image */}
        <View className="relative">
          {data.thumbnail_url ? (
            <Image source={{ uri: data.thumbnail_url }} className="w-full h-72" resizeMode="cover" />
          ) : (
            <View className="w-full h-72 bg-orange-50 items-center justify-center">
              <GraduationCap size={64} color="#E05017" />
            </View>
          )}
          <View className="absolute bottom-0 left-0 right-0 p-8 bg-black/40">
            <View className="flex-row flex-wrap mb-3 gap-2">
              {data.rubrique && (
                <View className="bg-brand-orange px-3 py-1 rounded-lg">
                  <Text className="text-white text-[10px] font-bold uppercase">{data.rubrique.name}</Text>
                </View>
              )}
              {data.type && (
                <View className="bg-white/20 px-3 py-1 rounded-lg">
                  <Text className="text-white text-[10px] font-bold uppercase">{data.type}</Text>
                </View>
              )}
            </View>
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-xl leading-7">
              {data.title}
            </Text>
          </View>
        </View>

        {/* Info Cards Bar */}
        <View className="px-6" style={{ marginTop: -32 }}>
          <View className="bg-white rounded-3xl p-5 flex-row justify-between shadow-xl shadow-gray-200 border border-gray-50">
            {data.start_date && (
              <View className="items-center flex-1">
                <Calendar size={18} color="#E05017" />
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 10 }} className="text-gray-900 mt-2">
                  {new Date(data.start_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </Text>
                <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 8 }} className="text-gray-400 uppercase mt-0.5">Début</Text>
              </View>
            )}
            {data.start_date && data.location && <View className="w-[1px] h-8 bg-gray-100 self-center" />}
            {data.location && (
              <View className="items-center flex-1">
                <MapPin size={18} color="#E05017" />
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 10 }} className="text-gray-900 mt-2" numberOfLines={1}>
                  {data.location}
                </Text>
                <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 8 }} className="text-gray-400 uppercase mt-0.5">Lieu</Text>
              </View>
            )}
            {data.location && <View className="w-[1px] h-8 bg-gray-100 self-center" />}
            {data.max_participants !== null && (
              <View className="items-center flex-1">
                <Users size={18} color="#E05017" />
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 10 }} className="text-gray-900 mt-2">
                  {data.current_participants}/{data.max_participants || '∞'}
                </Text>
                <Text style={{ fontFamily: 'Karla_400Regular', fontSize: 8 }} className="text-gray-400 uppercase mt-0.5">Places</Text>
              </View>
            )}
          </View>
        </View>

        <View className="px-8 mt-8">
          {/* Formateur */}
          {data.trainer && (
            <View className="flex-row items-center mb-8 bg-gray-50 px-5 py-4 rounded-3xl border border-gray-100">
              <GraduationCap size={20} color="#E05017" />
              <View className="ml-4">
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] uppercase">Formateur</Text>
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm">{data.trainer}</Text>
              </View>
            </View>
          )}

          {/* CRASC ou OSC organisateur */}
          {(data.crasc || data.osc) && (
            <View className="flex-row items-center mb-8 bg-orange-50 px-5 py-4 rounded-3xl border border-orange-100">
              <Users size={20} color="#E05017" />
              <View className="ml-4">
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] uppercase">Organisé par</Text>
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm">
                  {data.crasc?.name || data.osc?.name}
                </Text>
              </View>
            </View>
          )}

          {/* Description */}
          {data.description && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">À propos</Text>
              </View>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 leading-6 text-base">
                {data.description}
              </Text>
            </View>
          )}

          {/* Date de fin */}
          {data.end_date && (
            <View className="flex-row items-center mb-6 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
              <Clock size={16} color="#9CA3AF" />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-600 ml-2 text-sm">
                Fin : {new Date(data.end_date).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          )}

          {/* Date limite d'inscription */}
          {data.registration_deadline && (
            <View className="flex-row items-center mb-8 bg-red-50 px-4 py-3 rounded-2xl border border-red-100">
              <Calendar size={16} color="#DC2626" />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-red-600 ml-2 text-sm">
                Inscription avant le {new Date(data.registration_deadline).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          )}

          {/* Statut places */}
          {isFull && (
            <View className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 items-center">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-red-600">Complet — plus de places disponibles</Text>
            </View>
          )}
          {isCompleted && (
            <View className="bg-gray-100 border border-gray-200 rounded-2xl p-4 mb-6 items-center">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-500">Cette formation est terminée</Text>
            </View>
          )}
          {inscrit && (
            <View className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex-row items-center">
              <CheckCircle2 size={20} color="#16A34A" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-green-700 ml-3">Vous êtes inscrit(e) à cette formation</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pb-10 pt-4 border-t border-gray-50"
        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10 }}
      >
        <View className="flex-row items-center">
          <View className="mr-6">
            <Text style={{ fontFamily: 'Karla_700Bold', fontSize: 10 }} className="text-gray-400 uppercase tracking-widest">Frais</Text>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18 }} className="text-brand-orange">
              {data.price !== null && data.price !== undefined
                ? data.price === 0 ? 'GRATUIT' : `${data.price.toLocaleString('fr-FR')} FCFA`
                : 'GRATUIT'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => canRegister ? setModalVisible(true) : null}
            disabled={!canRegister}
            className={`flex-1 h-14 rounded-2xl items-center justify-center shadow-lg ${canRegister ? 'bg-brand-orange shadow-orange-300' : 'bg-gray-200'}`}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className={`text-base ${canRegister ? 'text-white' : 'text-gray-400'}`}>
              {inscrit ? 'Inscrit(e)' : isFull ? 'Complet' : isCompleted ? 'Terminée' : "S'inscrire"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal d'inscription */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-[40px] p-8">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-xl mb-2">S'inscrire</Text>
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm mb-6">{data.title}</Text>

            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-700 text-xs uppercase tracking-widest mb-2">Nom complet</Text>
            <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100 mb-5">
              <TextInput
                placeholder="Votre nom et prénom"
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-gray-700"
                value={participantName}
                onChangeText={setParticipantName}
              />
            </View>

            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-700 text-xs uppercase tracking-widest mb-2">Email</Text>
            <View className="bg-gray-50 flex-row items-center px-4 py-4 rounded-2xl border border-gray-100 mb-8">
              <TextInput
                placeholder="votre@email.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 text-gray-700"
                value={participantEmail}
                onChangeText={setParticipantEmail}
              />
            </View>

            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 h-14 rounded-2xl items-center justify-center bg-gray-100"
              >
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-500">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => inscriptionMutation.mutate()}
                disabled={inscriptionMutation.isPending}
                className={`flex-1 h-14 rounded-2xl items-center justify-center bg-brand-orange shadow-lg shadow-orange-300 ${inscriptionMutation.isPending ? 'opacity-70' : ''}`}
              >
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white">
                  {inscriptionMutation.isPending ? 'En cours...' : 'Confirmer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
