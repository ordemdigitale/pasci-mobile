import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Audio } from 'expo-av';
import { useQuery } from '@tanstack/react-query';
import { Image as ImageIcon, Mic, Square, X } from 'lucide-react-native';
import { dataService } from '../../services/dataService';
import { FichierLocal, LimitesMedias } from '../../services/types';

// Même rôle que pasci-web/components/forum/SelecteurMedias.tsx : photos et
// vidéos de la galerie, note vocale enregistrée sur le téléphone, avec les
// mêmes contrôles que l'API (format, taille, nombre de fichiers).

const LIMITES_DEFAUT: LimitesMedias = { image: 5, audio: 10, video: 30, fichiers: 4 };
const LIBELLES = { image: 'photo', audio: 'audio', video: 'vidéo' } as const;
const EXTENSION_PAR_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/3gpp': '3gp',
  'audio/mp4': 'm4a',
  'audio/m4a': 'm4a',
};

const taille = (octets?: number) =>
  !octets ? '' : octets >= 1024 * 1024 ? `${(octets / 1024 / 1024).toFixed(1)} Mo` : `${Math.max(1, Math.round(octets / 1024))} Ko`;

export default function SelecteurMedias({
  fichiers,
  onChange,
  disabled,
}: {
  fichiers: FichierLocal[];
  onChange: (fichiers: FichierLocal[]) => void;
  disabled?: boolean;
}) {
  const { data } = useQuery({
    queryKey: ['limites-medias'],
    queryFn: dataService.getLimitesMedias,
    staleTime: 60 * 60 * 1000,
  });
  const limites = { ...LIMITES_DEFAUT, ...(data ?? {}) };
  const enregistrement = useRef<Audio.Recording | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [duree, setDuree] = useState(0);
  const minuteur = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (minuteur.current) clearInterval(minuteur.current);
    enregistrement.current?.stopAndUnloadAsync().catch(() => {});
  }, []);

  function ajouter(nouveaux: FichierLocal[]) {
    const acceptes: FichierLocal[] = [];
    for (const f of nouveaux) {
      if (f.taille && f.taille > limites[f.genre] * 1024 * 1024) {
        Alert.alert('Fichier trop lourd', `« ${f.name} » dépasse ${limites[f.genre]} Mo (taille maximale pour une ${LIBELLES[f.genre]}).`);
        continue;
      }
      acceptes.push(f);
    }
    const total = [...fichiers, ...acceptes];
    if (total.length > limites.fichiers) {
      Alert.alert('Trop de fichiers', `${limites.fichiers} fichiers au maximum par message.`);
    }
    onChange(total.slice(0, limites.fichiers));
  }

  async function choisirGalerie() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Accès refusé', 'Autorisez l’accès à vos photos dans les réglages du téléphone.');
      return;
    }
    const resultat = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      selectionLimit: Math.max(1, limites.fichiers - fichiers.length),
      quality: 0.8,
      // JPEG / H.264 plutôt que HEIC / HEVC (formats acceptés par la plateforme)
      preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
    });
    if (resultat.canceled) return;
    ajouter(
      resultat.assets.map((a, i) => {
        const genre = a.type === 'video' ? 'video' : 'image';
        const mime = a.mimeType || (genre === 'video' ? 'video/mp4' : 'image/jpeg');
        const extension = EXTENSION_PAR_MIME[mime] || (genre === 'video' ? 'mp4' : 'jpg');
        return {
          uri: a.uri,
          name: a.fileName || `${genre === 'video' ? 'video' : 'photo'}-${Date.now()}-${i}.${extension}`,
          type: mime,
          taille: a.fileSize,
          genre,
        };
      }),
    );
  }

  async function demarrerNote() {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Micro refusé', 'Autorisez l’accès au micro dans les réglages du téléphone.');
      return;
    }
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      enregistrement.current = recording;
      setDuree(0);
      setEnCours(true);
      minuteur.current = setInterval(() => setDuree((d) => d + 1), 1000);
    } catch {
      Alert.alert('Erreur', 'Impossible de démarrer l’enregistrement.');
    }
  }

  async function arreterNote() {
    const rec = enregistrement.current;
    enregistrement.current = null;
    if (minuteur.current) clearInterval(minuteur.current);
    setEnCours(false);
    if (!rec) return;
    try {
      await rec.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = rec.getURI();
      if (!uri) return;
      const info = await FileSystem.getInfoAsync(uri);
      ajouter([{
        uri,
        name: `note-vocale-${Date.now()}.m4a`,
        type: 'audio/m4a',
        taille: info.exists ? info.size : undefined,
        genre: 'audio',
      }]);
    } catch {
      Alert.alert('Erreur', 'Impossible d’enregistrer la note vocale.');
    }
  }

  const plein = fichiers.length >= limites.fichiers;
  const bouton = 'flex-row items-center px-3 py-1.5 rounded-full border mr-2 mb-2';

  return (
    <View className="mt-3">
      <View className="flex-row flex-wrap items-center">
        <TouchableOpacity
          onPress={choisirGalerie}
          disabled={disabled || plein || enCours}
          className={`${bouton} border-gray-200 ${disabled || plein || enCours ? 'opacity-40' : ''}`}
        >
          <ImageIcon size={14} color="#4B5563" />
          <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-600 text-xs ml-1.5">Photo / vidéo</Text>
        </TouchableOpacity>
        {enCours ? (
          <TouchableOpacity onPress={arreterNote} className={`${bouton} border-red-300 bg-red-50`}>
            <Square size={14} color="#B91C1C" />
            <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-red-700 text-xs ml-1.5">
              Arrêter ({Math.floor(duree / 60)}:{String(duree % 60).padStart(2, '0')})
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={demarrerNote}
            disabled={disabled || plein}
            className={`${bouton} border-gray-200 ${disabled || plein ? 'opacity-40' : ''}`}
          >
            <Mic size={14} color="#4B5563" />
            <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-600 text-xs ml-1.5">Note vocale</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px]">
        Photo {limites.image} Mo · audio {limites.audio} Mo · vidéo {limites.video} Mo · {limites.fichiers} fichiers max.
      </Text>

      {fichiers.length > 0 && (
        <View className="flex-row flex-wrap mt-2">
          {fichiers.map((f, i) => (
            <View key={`${f.uri}-${i}`} className="flex-row items-center bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-700 text-xs max-w-[150px]" numberOfLines={1}>
                {f.genre === 'audio' ? 'Note vocale' : f.name}
              </Text>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1">{taille(f.taille)}</Text>
              <TouchableOpacity
                onPress={() => onChange(fichiers.filter((_, j) => j !== i))}
                className="ml-1.5"
                accessibilityLabel={`Retirer ${f.name}`}
              >
                <X size={14} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
