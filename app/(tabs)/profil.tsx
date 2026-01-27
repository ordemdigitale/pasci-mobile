import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Settings, LogOut, Shield, Bell, HelpCircle, ChevronRight } from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';

export default function ProfilScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderMenuItem = (Icon: any, title: string, subtitle: string) => (
    <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-50">
      <View className="bg-gray-50 p-3 rounded-2xl mr-4">
        <Icon size={20} color="#4B5563" />
      </View>
      <View className="flex-1">
        <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-gray-900 text-sm">{title}</Text>
        <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px]">{subtitle}</Text>
      </View>
      <ChevronRight size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView 
        className="flex-1 bg-white" 
        edges={['top']}
        style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
      >
        <View className="items-center mt-10">
          <Skeleton width={100} height={100} borderRadius={50} style={{ marginBottom: 16 }} />
          <Skeleton width={150} height={20} style={{ marginBottom: 8 }} />
          <Skeleton width={100} height={12} />
        </View>
        <View className="px-6 mt-12">
          <Skeleton width="100%" height={60} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={60} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={60} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      className="flex-1 bg-white" 
      edges={['top']}
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center mt-10 px-6">
          <View className="w-24 h-24 bg-orange-50 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm">
            <User size={48} color="#E05017" />
          </View>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-xl text-gray-900">Utilisateur Invité</Text>
          <TouchableOpacity className="bg-orange-50 px-4 py-1.5 rounded-full mt-2">
            <Text className="text-brand-orange font-bold text-[10px] uppercase">Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="px-6 mt-12">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[10px] uppercase tracking-widest mb-4">Paramètres du compte</Text>
          
          {renderMenuItem(Shield, 'Sécurité', 'Gérer votre mot de passe')}
          {renderMenuItem(Bell, 'Notifications', 'Alertes et messages')}
          {renderMenuItem(Settings, 'Préférences', 'Langue et affichage')}
          
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[10px] uppercase tracking-widest mt-8 mb-4">Assistance</Text>
          
          {renderMenuItem(HelpCircle, 'Centre d’aide', 'FAQ et support')}
          
          <TouchableOpacity className="flex-row items-center py-6 mt-4">
            <View className="bg-red-50 p-3 rounded-2xl mr-4">
              <LogOut size={20} color="#EF4444" />
            </View>
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-red-500 text-sm">Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}