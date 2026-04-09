import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Share, Alert, TextInput, Modal, Linking, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  Calendar,
  Clock,
  MapPin,
  Play,
  FileText,
  Lock,
  CheckCircle2,
  Users,
  GraduationCap,
  Award,
} from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import { authService } from '../../services/authService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Lecon = {
  id: number;
  module_id: number;
  title: string;
  type: 'video' | 'pdf' | 'text';
  content: string | null;
  file_url: string | null;
  duration_minutes: number | null;
  is_preview: boolean;
  order: number;
};

function extractYoutubeId(url: string): string | null {
  // Nettoyer les paramètres tracking (si=, feature=, etc.) avant d'extraire l'ID
  const cleaned = url.split('?')[0].split('&')[0];
  const match = cleaned.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) return match[1];
  // Fallback sur l'URL originale (v= peut être avant si=)
  const fallback = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return fallback ? fallback[1] : null;
}

function getEmbedHtml(url: string): string {
  const videoId = extractYoutubeId(url);
  if (videoId) {
    // YouTube IFrame Player API — détecte les erreurs (dont 153) et poste un message à React Native
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
            #player { width: 100%; height: 100%; }
          </style>
        </head>
        <body>
          <div id="player"></div>
          <script>
            var tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(tag);
            function onYouTubeIframeAPIReady() {
              new YT.Player('player', {
                videoId: '${videoId}',
                playerVars: {
                  playsinline: 1,
                  rel: 0,
                  modestbranding: 1,
                  origin: 'https://api.plateforme-osci.org'
                },
                events: {
                  onError: function(e) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', code: e.data }));
                  }
                }
              });
            }
          </script>
        </body>
      </html>
    `;
  }
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; } html, body { width: 100%; height: 100%; background: #000; }
            iframe { width: 100%; height: 100%; border: none; }
          </style>
        </head>
        <body>
          <iframe src="https://player.vimeo.com/video/${videoId}?autoplay=1&playsinline=1" allowfullscreen></iframe>
        </body>
      </html>
    `;
  }
  // URL directe (mp4, etc.)
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>* { margin:0; padding:0; } html,body { width:100%; height:100%; background:#000; } video { width:100%; height:100%; }</style>
      </head>
      <body>
        <video src="${url}" controls autoplay playsinline></video>
      </body>
    </html>
  `;
}

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const slug = id as string;
  const scrollRef = useRef<ScrollView>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [pdfModal, setPdfModal] = useState<{ visible: boolean; url: string; title: string }>({ visible: false, url: '', title: '' });
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [inscrit, setInscrit] = useState(false);

  const [activeLecon, setActiveLecon] = useState<Lecon | null>(null);
  const [leconsVues, setLeconsVues] = useState<number[]>([]);
  const [progression, setProgression] = useState(0);
  const [totalLecons, setTotalLecons] = useState(0);
  const [certEmis, setCertEmis] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getCurrentUser,
    retry: false,
  });

  // Remplir automatiquement les champs si l'utilisateur est connecté
  React.useEffect(() => {
    if (user) {
      setParticipantName(user.name || '');
      setParticipantEmail(user.email || '');
    }
  }, [user]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['formation', slug],
    queryFn: () => dataService.getFormationBySlug(slug),
    enabled: !!slug,
  });

  const { data: modules = [] } = useQuery({
    queryKey: ['formation-modules', slug],
    queryFn: () => dataService.getFormationModules(slug),
    enabled: !!slug,
    onSuccess: (mods) => {
      const firstPreview = mods.flatMap((m) => m.lecons).find((l) => l.is_preview);
      if (firstPreview && !activeLecon) setActiveLecon(firstPreview);
    },
  } as any);

  // Vérifier si déjà inscrit au chargement (persiste après navigation)
  const checkInscriptionQuery = useQuery({
    queryKey: ['check-inscription', slug, user?.email],
    queryFn: () => dataService.checkInscription(slug, user!.email),
    enabled: !!slug && !!user?.email,
    staleTime: 5000, // Rafraîchir toutes les 5 secondes si on revient sur la page
  });

  const enrollmentData = checkInscriptionQuery.data;

  React.useEffect(() => {
    if (enrollmentData?.registered) {
      setInscrit(true);
      // L'API ne retourne pas de tableau lecons_vues — tracking 100% local
      if (enrollmentData.certificat_code) setCertEmis(enrollmentData.certificat_code);
    } else if (enrollmentData) {
      setInscrit(false);
    }
  }, [enrollmentData]);

  // totalLecons calculé depuis les modules (inclut vidéos + PDFs + textes)
  React.useEffect(() => {
    if ((modules as any[]).length > 0) {
      const total = (modules as any[]).reduce((sum: number, m: any) => sum + m.lecons.length, 0);
      setTotalLecons(total);
    }
  }, [modules]);

  const handleSelectLecon = async (lecon: Lecon) => {
    // 1. Vérifier si l'utilisateur est connecté (requis pour le suivi et les leçons non-preview)
    if (!user) {
      Alert.alert(
        'Connexion requise', 
        "Vous devez être connecté pour accéder aux leçons de cette formation.",
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => router.push('/login') }
        ]
      );
      return;
    }

    const canAccess = lecon.is_preview || inscrit;
    if (!canAccess) {
      Alert.alert(
        'Inscription requise', 
        "Veuillez vous inscrire à cette formation pour accéder à l'intégralité du contenu et lire les vidéos.",
        [
          { text: 'Plus tard', style: 'cancel' },
          { text: "M'inscrire", onPress: () => {
            if (data && data.price > 0) {
              setModalVisible(true);
            } else {
              setModalVisible(true);
            }
          }}
        ]
      );
      return;
    }
    
    if (lecon.type === 'pdf') {
      const pdfUrl = lecon.file_url || lecon.content || '';
      if (pdfUrl) {
        setPdfModal({ visible: true, url: pdfUrl, title: lecon.title });
        if (inscrit) {
          try {
            const result = await dataService.marquerLeconVue(lecon.id);
            setLeconsVues((prev) => prev.includes(lecon.id) ? prev : [...prev, lecon.id]);
            if (result?.progression !== undefined) setProgression(result.progression);
            if (result?.total_lecons !== undefined) setTotalLecons(result.total_lecons);
            if (result?.certificat_code) setCertEmis(result.certificat_code);
          } catch (err) {
            console.error('Erreur marquage leçon PDF vue:', err);
          }
        }
        return;
      }
    }

    setActiveLecon(lecon);
    setVideoError(false);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    if (inscrit) {
      try {
        const result = await dataService.marquerLeconVue(lecon.id);
        setLeconsVues((prev) => prev.includes(lecon.id) ? prev : [...prev, lecon.id]);
        if (result?.progression !== undefined) setProgression(result.progression);
        if (result?.total_lecons !== undefined) setTotalLecons(result.total_lecons);
        if (result?.certificat_code) setCertEmis(result.certificat_code);
      } catch (err) {
        console.error("Erreur marquage leçon vue:", err);
      }
    }
  };

  const handleInscriptionClick = () => {
    // 1. Vérifier si l'utilisateur est connecté pour l'inscription
    if (!user) {
      Alert.alert(
        'Connexion requise', 
        "Vous devez être connecté pour vous inscrire à une formation.",
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Se connecter', onPress: () => router.push('/login') }
        ]
      );
      return;
    }
    setModalVisible(true);
  };

  const inscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!participantName.trim() || !participantEmail.trim()) {
        throw new Error('Veuillez remplir tous les champs.');
      }
      const isPaid = data && data.price !== null && data.price !== undefined && data.price > 0;
      if (isPaid) {
        return { paid: true, ...(await dataService.initierPaiementFormation(slug, participantName, participantEmail)) };
      }
      console.log(`🚀 [DEBUG] Registering for FREE formation: ${slug} with payload:`, { participant_name: participantName, participant_email: participantEmail });
      return fetch(`https://api.plateforme-osci.org/api/v1/formations/${slug}/inscrire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participant_name: participantName, participant_email: participantEmail }),
      }).then(async (res) => {
        console.log(`📥 [DEBUG] Registration Response status: ${res.status}`);
        const result = await res.json().catch(() => ({}));
        console.log(`📥 [DEBUG] Registration Response body:`, result);
        if (!res.ok) {
          throw new Error(result.detail || "Erreur lors de l'inscription.");
        }
        return { paid: false };
      });
    },
    onSuccess: (result: any) => {
      setModalVisible(false);
      // Invalider le cache pour forcer checkInscription à se relancer
      queryClient.invalidateQueries({ queryKey: ['check-inscription', slug] });
      
      if (result.paid) {
        if (result.cinetpay_configured) {
          Linking.openURL(result.payment_url);
        } else {
          router.push(`/paiement-simulation?tid=${result.transaction_id}&amount=${result.amount}&slug=${slug}&iid=${result.inscription_id}`);
        }
      } else {
        setInscrit(true);
        Alert.alert('Inscription confirmée', `Vous êtes inscrit(e) à "${data?.title}". Vous recevrez une confirmation par email.`);
      }
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
  const hasModules = (modules as any[]).length > 0;

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

      <ScrollView ref={scrollRef} className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

        {/* Video Player */}
        {activeLecon?.type === 'video' && activeLecon.content ? (
          <View style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH * 9 / 16, backgroundColor: '#000' }}>
            {videoError ? (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', gap: 12 }}>
                <Text style={{ color: '#9CA3AF', fontFamily: 'Karla_400Regular', fontSize: 13, textAlign: 'center', paddingHorizontal: 24 }}>
                  Impossible de lire la vidéo dans l'application.
                </Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(activeLecon.content!)}
                  style={{ backgroundColor: '#E05017', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Play size={16} color="#fff" fill="#fff" />
                  <Text style={{ color: '#fff', fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>Ouvrir dans YouTube</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <WebView
                source={{
                  html: getEmbedHtml(activeLecon.content),
                  headers: { Referer: 'https://api.plateforme-osci.org' },
                }}
                allowsFullscreenVideo
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled
                originWhitelist={['*']}
                userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
                style={{ flex: 1, backgroundColor: '#000' }}
                onError={() => setVideoError(true)}
                onHttpError={(e) => { if (e.nativeEvent.statusCode >= 400) setVideoError(true); }}
                onMessage={(e) => {
                  try {
                    const msg = JSON.parse(e.nativeEvent.data);
                    if (msg.type === 'error') setVideoError(true);
                  } catch {}
                }}
              />
            )}
          </View>

        /* Hero Image (aucune leçon active ou leçon PDF) */
        ) : (
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
        )}

        {/* Info bar leçon active (vidéo ou PDF) */}
        {activeLecon?.type === 'video' && (
          <View className="px-6 py-4 bg-gray-900 flex-row items-center">
            <View className="flex-1">
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white text-sm" numberOfLines={2}>
                {activeLecon.title}
              </Text>
              {activeLecon.duration_minutes && (
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs mt-1">
                  {activeLecon.duration_minutes} min
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Info Cards Bar */}
        <View className="px-6" style={{ marginTop: activeLecon?.type === 'video' ? 16 : -32 }}>
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

          {/* Dates */}
          {data.end_date && (
            <View className="flex-row items-center mb-6 bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100">
              <Clock size={16} color="#9CA3AF" />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-600 ml-2 text-sm">
                Fin : {new Date(data.end_date).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          )}
          {data.registration_deadline && !inscrit && (
            <View className="flex-row items-center mb-8 bg-red-50 px-4 py-3 rounded-2xl border border-red-100">
              <Calendar size={16} color="#DC2626" />
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-red-600 ml-2 text-sm">
                Inscription avant le {new Date(data.registration_deadline).toLocaleDateString('fr-FR')}
              </Text>
            </View>
          )}

          {/* MA PROGRESSION */}
          {inscrit && totalLecons > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Ma Progression</Text>
              </View>
              {certEmis && progression >= 100 ? (
                <TouchableOpacity
                  onPress={() => router.push(`/certificat/${certEmis}`)}
                  className="flex-row items-center justify-center bg-amber-500 rounded-2xl py-4"
                >
                  <Award size={18} color="#fff" />
                  <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white ml-2">Voir mon certificat</Text>
                </TouchableOpacity>
              ) : (
                <View className="bg-orange-50 border border-orange-100 rounded-3xl p-5">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm">
                      {leconsVues.length} / {totalLecons} leçons vues
                    </Text>
                    <Text style={{ fontFamily: 'Poppins_700Bold', color: '#E05017', fontSize: 18 }}>
                      {progression}%
                    </Text>
                  </View>
                  <View className="w-full h-3 bg-orange-100 rounded-full overflow-hidden">
                    <View className="h-3 bg-brand-orange rounded-full" style={{ width: `${progression}%` }} />
                  </View>
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs text-center mt-3">
                    {progression < 100
                      ? `Continuez ! Il vous reste ${totalLecons - leconsVues.length} leçon${totalLecons - leconsVues.length > 1 ? 's' : ''}`
                      : 'Formation terminée — certificat disponible'}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Programme / Curriculum */}
          {hasModules && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg">Programme</Text>
              </View>
              {(modules as any[]).map((module: any) => (
                <View key={module.id} className="mb-5">
                  <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-700 text-xs uppercase tracking-widest mb-3 px-1">
                    {module.title}
                  </Text>
                  {module.lecons.map((lecon: Lecon) => {
                    const canAccess = lecon.is_preview || inscrit;
                    const isActive = activeLecon?.id === lecon.id;
                    const isVue = leconsVues.includes(lecon.id);
                    return (
                      <TouchableOpacity
                        key={lecon.id}
                        onPress={() => handleSelectLecon(lecon)}
                        className={`flex-row items-center px-4 py-3 rounded-2xl mb-2 border ${
                          isActive ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-100'
                        }`}
                      >
                        <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                          isActive ? 'bg-brand-orange' : isVue ? 'bg-green-100' : canAccess ? 'bg-white border border-gray-200' : 'bg-gray-100'
                        }`}>
                          {isVue ? (
                            <CheckCircle2 size={16} color="#16A34A" />
                          ) : !canAccess ? (
                            <Lock size={14} color="#9CA3AF" />
                          ) : lecon.type === 'video' ? (
                            <Play size={14} color={isActive ? '#fff' : '#E05017'} fill={isActive ? '#fff' : '#E05017'} />
                          ) : (
                            <FileText size={14} color={isActive ? '#E05017' : '#6B7280'} />
                          )}
                        </View>
                        <View className="flex-1">
                          <Text style={{ fontFamily: 'Karla_700Bold' }} className={`text-sm ${isActive ? 'text-brand-orange' : 'text-gray-800'}`} numberOfLines={1}>
                            {lecon.title}
                          </Text>
                          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px]">
                            {!canAccess
                              ? 'Inscription requise'
                              : `${lecon.type === 'video' ? 'Vidéo' : lecon.type === 'pdf' ? 'PDF' : 'Lecture'}${lecon.duration_minutes ? ` • ${lecon.duration_minutes} min` : ''}`}
                          </Text>
                        </View>
                        {lecon.is_preview && !inscrit && (
                          <View className="bg-green-100 px-2 py-0.5 rounded-full">
                            <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-green-700 text-[9px]">Aperçu</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          )}

          {/* Statuts */}
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
        style={{ 
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: -4 }, 
          shadowOpacity: 0.05, 
          shadowRadius: 10, 
          elevation: 10,
          display: inscrit ? 'none' : 'flex' 
        }}
      >
        {/* Progression bar (quand inscrit) */}
        {inscrit && totalLecons > 0 && (
          certEmis && progression >= 100 ? (
            <TouchableOpacity
              onPress={() => router.push(`/certificat/${certEmis}`)}
              className="flex-row items-center justify-center bg-amber-500 rounded-2xl h-12 mb-3"
            >
              <Award size={18} color="#fff" />
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white ml-2">Voir mon certificat</Text>
            </TouchableOpacity>
          ) : (
            <View className="mb-3">
              <View className="flex-row justify-between mb-1">
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs">Progression</Text>
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-xs">{progression}% • {leconsVues.length}/{totalLecons} leçons</Text>
              </View>
              <View className="w-full h-1.5 bg-gray-100 rounded-full">
                <View className="h-1.5 bg-brand-orange rounded-full" style={{ width: `${progression}%` }} />
              </View>
            </View>
          )
        )}
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
            onPress={handleInscriptionClick}
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

      {/* Modal PDF viewer */}
      <Modal visible={pdfModal.visible} animationType="slide" onRequestClose={() => setPdfModal({ ...pdfModal, visible: false })}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#1F2937' }}>
            <TouchableOpacity onPress={() => setPdfModal({ ...pdfModal, visible: false })} style={{ marginRight: 12 }}>
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', color: 'white', flex: 1, fontSize: 14 }} numberOfLines={1}>
              {pdfModal.title}
            </Text>
          </View>
          <WebView
            source={{ uri: `https://docs.google.com/viewer?url=${encodeURIComponent(pdfModal.url)}&embedded=true` }}
            javaScriptEnabled
            style={{ flex: 1, backgroundColor: '#fff' }}
            startInLoadingState
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

