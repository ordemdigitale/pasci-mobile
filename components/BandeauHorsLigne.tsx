import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onlineManager } from '@tanstack/react-query';
import { WifiOff } from 'lucide-react-native';
import { dateDerniereSauvegarde } from '../services/horsLigne';

/**
 * Bandeau affiché sans connexion (en surimpression, au-dessus de la barre d'onglets) :
 * les données présentées sont celles enregistrées sur l'appareil.
 */
export default function BandeauHorsLigne() {
  const [enLigne, setEnLigne] = useState(onlineManager.isOnline());
  const insets = useSafeAreaInsets();

  useEffect(() => onlineManager.subscribe(setEnLigne), []);

  if (enLigne) return null;
  const date = dateDerniereSauvegarde();
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', left: 12, right: 12, bottom: insets.bottom + 72 }}
      className="bg-gray-900/95 rounded-2xl px-4 py-2.5 flex-row items-center"
    >
      <WifiOff size={14} color="#FBBF24" />
      <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-white text-[11px] ml-2 flex-1">
        Hors ligne — données enregistrées
        {date ? ` le ${new Date(date).toLocaleDateString('fr-FR')} à ${new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : ''}.
        Actualisation automatique au retour du réseau.
      </Text>
    </View>
  );
}
