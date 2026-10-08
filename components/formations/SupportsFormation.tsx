import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Download, ExternalLink, FolderOpen, Lock } from 'lucide-react-native';
import { dataService } from '../../services/dataService';

const taille = (o: number) =>
  !o ? '' : o >= 1024 * 1024 ? `${(o / 1024 / 1024).toFixed(1)} Mo` : `${Math.max(1, Math.round(o / 1024))} Ko`;

/**
 * « Lucarne » des supports de formation (documents et liens du formateur).
 * Les supports réservés restent verrouillés tant que l'accès n'est pas ouvert ;
 * `acces` fait partie de la clé de cache pour recharger les liens au déblocage.
 */
export default function SupportsFormation({ slug, acces }: { slug: string; acces: boolean }) {
  const { data: supports = [] } = useQuery({
    queryKey: ['formation-supports', slug, acces],
    queryFn: () => dataService.getSupportsFormation(slug),
    enabled: !!slug,
  });

  if (supports.length === 0) return null;

  const ouvrir = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Ouverture impossible', "Impossible d'ouvrir ce support sur cet appareil.");
    }
  };

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-4">
        <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
        <FolderOpen size={18} color="#E05017" />
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg ml-2">Supports de formation</Text>
      </View>
      {supports.map((s) => {
        const verrouille = s.verrouille || !s.url;
        return (
          <TouchableOpacity
            key={s.id}
            disabled={verrouille}
            onPress={() => s.url && ouvrir(s.url)}
            className="flex-row items-center px-4 py-3 rounded-2xl mb-2 border bg-gray-50 border-gray-100"
          >
            <View className="flex-1 mr-3">
              <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-sm text-gray-800" numberOfLines={2}>
                {s.titre}
              </Text>
              {!!s.description && (
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs" numberOfLines={2}>
                  {s.description}
                </Text>
              )}
              {s.type === 'fichier' && (!!s.nom || s.taille > 0) && (
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px]">
                  {[s.nom, taille(s.taille)].filter(Boolean).join(' · ')}
                </Text>
              )}
            </View>
            {verrouille ? (
              <View className="flex-row items-center">
                <Lock size={14} color="#9CA3AF" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px] ml-1">Réservé aux inscrits</Text>
              </View>
            ) : s.type === 'lien' ? (
              <ExternalLink size={18} color="#E05017" />
            ) : (
              <Download size={18} color="#E05017" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
