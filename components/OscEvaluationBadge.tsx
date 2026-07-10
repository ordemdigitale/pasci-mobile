import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  score?: number | null;
  color?: string | null;
  hex?: string | null;
  compact?: boolean;
};

export default function OscEvaluationBadge({ score = 0, hex = '#6B7280' }: Props) {
  return (
    <View
      className="self-start flex-row items-center rounded-full bg-white"
      style={{ borderWidth: 1, borderColor: hex || '#6B7280', paddingHorizontal: 10, paddingVertical: 5 }}
    >
      <View className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: hex || '#6B7280' }} />
      <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 10, color: '#1F2937' }}>{score ?? 0}/20</Text>
    </View>
  );
}
