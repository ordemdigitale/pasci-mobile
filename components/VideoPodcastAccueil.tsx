import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { Audio, ResizeMode, Video as ExpoVideo } from 'expo-av';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Headphones, Pause, Play, Radio, Video } from 'lucide-react-native';
import { dataService } from '../services/dataService';

const { width } = Dimensions.get('window');

// Mêmes clés et règles que le site (pasci-web/lib/medias-accueil.ts)
const EXT_VIDEO = /\.(mp4|webm|mov)(\?|$)/i;
const EXT_AUDIO = /\.(mp3|m4a|aac|ogg|oga|wav)(\?|$)/i;

function lecteurVideo(url: string) {
  const u = url.trim();
  if (!u) return null;
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|live\/|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { type: 'iframe' as const, src: `https://www.youtube.com/embed/${yt[1]}?playsinline=1` };
  const vimeo = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { type: 'iframe' as const, src: `https://player.vimeo.com/video/${vimeo[1]}` };
  if (/facebook\.com|fb\.watch/.test(u)) {
    return { type: 'iframe' as const, src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&show_text=false` };
  }
  if (EXT_VIDEO.test(u) || u.includes('/static/accueil-medias/')) return { type: 'fichier' as const, src: u };
  return { type: 'lien' as const, src: u };
}

function estAudioFichier(url: string) {
  return EXT_AUDIO.test(url) || url.includes('/static/accueil-medias/');
}

function LecteurAudio({ src }: { src: string }) {
  const son = useRef<Audio.Sound | null>(null);
  const [lecture, setLecture] = useState(false);
  const [chargement, setChargement] = useState(false);

  useEffect(() => () => {
    son.current?.unloadAsync();
  }, []);

  const basculer = async () => {
    try {
      if (!son.current) {
        setChargement(true);
        const { sound } = await Audio.Sound.createAsync({ uri: src }, { shouldPlay: true });
        sound.setOnPlaybackStatusUpdate((st) => {
          if (st.isLoaded) {
            setLecture(st.isPlaying);
            if (st.didJustFinish) sound.setPositionAsync(0);
          }
        });
        son.current = sound;
        setChargement(false);
        return;
      }
      const st = await son.current.getStatusAsync();
      if (st.isLoaded && st.isPlaying) await son.current.pauseAsync();
      else await son.current.playAsync();
    } catch {
      setChargement(false);
      Linking.openURL(src);
    }
  };

  return (
    <TouchableOpacity onPress={basculer} className="flex-row items-center self-start bg-brand-orange px-5 py-3 rounded-2xl">
      {lecture ? <Pause size={16} color="#fff" /> : <Play size={16} color="#fff" fill="#fff" />}
      <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white text-xs ml-2">
        {chargement ? 'Chargement…' : lecture ? 'Pause' : 'Écouter'}
      </Text>
    </TouchableOpacity>
  );
}

/**
 * Lucarnes de l'accueil réglées dans l'admin du site : une vidéo (Live possible)
 * et un podcast avec son titre. Masquées tant qu'aucun média n'est renseigné.
 */
export default function VideoPodcastAccueil() {
  const { data: cfg } = useQuery({
    queryKey: ['site-config'],
    queryFn: dataService.getSiteConfig,
    staleTime: 5 * 60 * 1000,
  });
  if (!cfg) return null;
  const v = (cle: string) => (cfg[cle] || '').trim();
  const video = lecteurVideo(v('accueil_video_url'));
  const podcastUrl = v('accueil_podcast_url');
  if (!video && !podcastUrl) return null;
  const enDirect = v('accueil_video_direct') === 'true';
  const largeur = width - 32;

  return (
    <View className="px-4 mt-8">
      {video && (
        <View className="bg-white rounded-[24px] overflow-hidden border border-gray-100 mb-4">
          <View className="p-4 flex-row items-start">
            <View className="w-9 h-9 rounded-xl bg-[#2A591D] items-center justify-center mr-3">
              {enDirect ? <Radio size={18} color="#fff" /> : <Video size={18} color="#fff" />}
            </View>
            <View className="flex-1">
              <View className="flex-row items-center mb-0.5">
                <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-[10px] uppercase">{enDirect ? 'Live' : 'Vidéo'}</Text>
                {enDirect && (
                  <View className="bg-red-600 px-2 py-0.5 rounded-full ml-2">
                    <Text className="text-white text-[9px] font-bold">EN DIRECT</Text>
                  </View>
                )}
              </View>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base">{v('accueil_video_titre') || 'Vidéo de la PdoC'}</Text>
              {!!v('accueil_video_description') && (
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs mt-0.5">{v('accueil_video_description')}</Text>
              )}
            </View>
          </View>
          <View style={{ width: largeur, height: (largeur * 9) / 16, backgroundColor: '#000' }}>
            {video.type === 'iframe' ? (
              <WebView
                source={{ uri: video.src }}
                allowsFullscreenVideo
                allowsInlineMediaPlayback
                javaScriptEnabled
                style={{ flex: 1, backgroundColor: '#000' }}
              />
            ) : video.type === 'fichier' ? (
              <ExpoVideo source={{ uri: video.src }} useNativeControls resizeMode={ResizeMode.CONTAIN} style={{ flex: 1 }} />
            ) : (
              <TouchableOpacity onPress={() => Linking.openURL(video.src)} className="flex-1 items-center justify-center flex-row">
                <ExternalLink size={18} color="#fff" />
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white ml-2">Regarder la vidéo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {!!podcastUrl && (
        <View className="bg-white rounded-[24px] border border-gray-100 p-4">
          <View className="flex-row items-start mb-3">
            <View className="w-9 h-9 rounded-xl bg-brand-orange items-center justify-center mr-3">
              <Headphones size={18} color="#fff" />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-[10px] uppercase mb-0.5">Podcast</Text>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base">{v('accueil_podcast_titre') || 'Podcast de la PdoC'}</Text>
              {!!v('accueil_podcast_description') && (
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs mt-0.5">{v('accueil_podcast_description')}</Text>
              )}
            </View>
          </View>
          {estAudioFichier(podcastUrl) ? (
            <LecteurAudio src={podcastUrl} />
          ) : (
            <TouchableOpacity onPress={() => Linking.openURL(podcastUrl)} className="flex-row items-center self-start bg-brand-orange px-5 py-3 rounded-2xl">
              <Headphones size={16} color="#fff" />
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white text-xs ml-2">Écouter le podcast</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
