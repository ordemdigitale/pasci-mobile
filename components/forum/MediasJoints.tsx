import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Audio, Video, ResizeMode } from 'expo-av';
import { Pause, Play, X } from 'lucide-react-native';
import { PieceJointe } from '../../services/types';

// Même rôle que pasci-web/components/forum/MediasJoints.tsx :
// photos (agrandissables), lecteurs audio et vidéo d'un sujet ou d'un message.

function LecteurAudio({ piece }: { piece: PieceJointe }) {
  const son = useRef<Audio.Sound | null>(null);
  const [lecture, setLecture] = useState(false);
  const [chargement, setChargement] = useState(false);

  useEffect(() => () => {
    son.current?.unloadAsync();
  }, []);

  async function basculer() {
    try {
      if (!son.current) {
        setChargement(true);
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync({ uri: piece.url }, { shouldPlay: true });
        sound.setOnPlaybackStatusUpdate((s) => {
          if (s.isLoaded) {
            setLecture(s.isPlaying);
            if (s.didJustFinish) sound.setPositionAsync(0);
          }
        });
        son.current = sound;
        setChargement(false);
        return;
      }
      const statut = await son.current.getStatusAsync();
      if (statut.isLoaded && statut.isPlaying) await son.current.pauseAsync();
      else await son.current.playAsync();
    } catch {
      setChargement(false);
    }
  }

  return (
    <TouchableOpacity
      onPress={basculer}
      className="flex-row items-center bg-orange-50 rounded-full px-3 py-2 mt-2 self-start"
      accessibilityLabel={lecture ? "Mettre l'audio en pause" : "Écouter l'audio"}
    >
      {chargement ? (
        <ActivityIndicator size="small" color="#E05017" />
      ) : lecture ? (
        <Pause size={16} color="#E05017" />
      ) : (
        <Play size={16} color="#E05017" />
      )}
      <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-brand-orange text-xs ml-2" numberOfLines={1}>
        {piece.nom?.startsWith('note-vocale') ? 'Note vocale' : piece.nom || 'Audio'}
      </Text>
    </TouchableOpacity>
  );
}

export default function MediasJoints({ pieces }: { pieces?: PieceJointe[] }) {
  const [agrandie, setAgrandie] = useState<string | null>(null);
  if (!pieces || pieces.length === 0) return null;
  const images = pieces.filter((p) => p.type === 'image');

  return (
    <View className="mt-2">
      {images.length > 0 && (
        <View className="flex-row flex-wrap">
          {images.map((p) => (
            <TouchableOpacity key={p.id} onPress={() => setAgrandie(p.url)} className="mr-2 mb-2">
              <Image source={{ uri: p.url }} style={{ width: 96, height: 96, borderRadius: 12 }} />
            </TouchableOpacity>
          ))}
        </View>
      )}
      {pieces
        .filter((p) => p.type === 'audio')
        .map((p) => (
          <LecteurAudio key={p.id} piece={p} />
        ))}
      {pieces
        .filter((p) => p.type === 'video')
        .map((p) => (
          <Video
            key={p.id}
            source={{ uri: p.url }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            style={{ width: '100%', height: 200, borderRadius: 12, backgroundColor: '#000', marginTop: 8 }}
          />
        ))}

      <Modal visible={!!agrandie} transparent animationType="fade" onRequestClose={() => setAgrandie(null)}>
        <View className="flex-1 bg-black/90 items-center justify-center">
          <TouchableOpacity onPress={() => setAgrandie(null)} className="absolute top-12 right-6 z-10 p-2">
            <X size={28} color="white" />
          </TouchableOpacity>
          {agrandie && (
            <Image source={{ uri: agrandie }} style={{ width: '100%', height: '80%' }} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </View>
  );
}
