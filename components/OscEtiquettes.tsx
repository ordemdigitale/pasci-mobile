import React from 'react';
import { View, Text } from 'react-native';

// Étiquettes calculées par l'API : OdF, OdJ, OPSH (catégorie) et Faîtière (niveau de regroupement)
const STYLES: Record<string, { bg: string; fg: string }> = {
  OdF: { bg: '#FCE7F3', fg: '#BE185D' },
  OdJ: { bg: '#E0F2FE', fg: '#0369A1' },
  OPSH: { bg: '#EDE9FE', fg: '#6D28D9' },
  'Faîtière': { bg: '#FEF3C7', fg: '#92400E' },
};

export default function OscEtiquettes({ etiquettes }: { etiquettes?: string[] | null }) {
  if (!etiquettes || etiquettes.length === 0) return null;
  return (
    <View className="flex-row flex-wrap">
      {etiquettes.map((e) => (
        <View key={e} style={{ backgroundColor: STYLES[e]?.bg || '#F3F4F6' }} className="px-2 py-0.5 rounded mr-1.5 mb-1">
          <Text style={{ color: STYLES[e]?.fg || '#374151', fontSize: 9, fontWeight: 'bold' }}>{e}</Text>
        </View>
      ))}
    </View>
  );
}
