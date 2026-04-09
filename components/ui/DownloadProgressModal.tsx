import React from 'react';
import { View, Text, Modal, ActivityIndicator } from 'react-native';

interface DownloadProgressModalProps {
  visible: boolean;
  progress: number; // 0 to 1
  fileName?: string;
}

export default function DownloadProgressModal({ visible, progress, fileName }: DownloadProgressModalProps) {
  const percentage = Math.round(progress * 100);
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/50 items-center justify-center px-8">
        <View className="bg-white rounded-[32px] p-8 w-full items-center shadow-xl">
          <View className="w-16 h-16 bg-orange-50 rounded-full items-center justify-center mb-4">
            <ActivityIndicator color="#E05017" size="large" />
          </View>
          
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg text-center mb-2">
            Téléchargement en cours
          </Text>
          
          {fileName && (
            <Text 
              style={{ fontFamily: 'Karla_400Regular' }} 
              className="text-gray-500 text-sm text-center mb-6"
              numberOfLines={1}
            >
              {fileName}
            </Text>
          )}
          
          {/* Progress Bar Container */}
          <View className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <View 
              style={{ width: `${percentage}%` }} 
              className="h-full bg-brand-orange" 
            />
          </View>
          
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-brand-orange text-xl">
            {percentage}%
          </Text>
        </View>
      </View>
    </Modal>
  );
}
