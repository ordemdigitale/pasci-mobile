import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, Settings, LogOut, Shield, Bell, HelpCircle, ChevronRight, Mail } from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/authService';

export default function ProfilScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getCurrentUser,
    retry: false,
  });

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            queryClient.clear();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const renderMenuItem = (Icon: any, title: string, subtitle: string, onPress?: () => void) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-center py-4 border-b border-gray-50">
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

  if (isLoading) {
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

  const displayName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || user.email
    : null;

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={['top']}
      style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center mt-10 px-6">
          <View className="w-24 h-24 bg-orange-50 rounded-full items-center justify-center mb-4 border-4 border-white shadow-sm overflow-hidden">
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={{ width: 96, height: 96 }} resizeMode="cover" />
            ) : (
              <User size={48} color="#E05017" />
            )}
          </View>

          {user ? (
            <>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-xl text-gray-900 text-center">
                {displayName}
              </Text>
              {user.email && (
                <View className="flex-row items-center mt-1">
                  <Mail size={12} color="#9CA3AF" />
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs ml-1">
                    {user.email}
                  </Text>
                </View>
              )}
              {user.is_staff && (
                <View className="bg-orange-50 px-3 py-1 rounded-full mt-2">
                  <Text className="text-brand-orange font-bold text-[10px] uppercase">Administrateur</Text>
                </View>
              )}
            </>
          ) : (
            <>
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-xl text-gray-900">Utilisateur Invité</Text>
              <TouchableOpacity
                onPress={() => router.push('/login')}
                className="bg-brand-orange px-6 py-2 rounded-full mt-3"
              >
                <Text className="text-white font-bold text-xs">Se connecter</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Bio */}
        {user?.bio && (
          <View className="mx-6 mt-6 bg-gray-50 rounded-3xl p-5 border border-gray-100">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm leading-5 text-center">
              {user.bio}
            </Text>
          </View>
        )}

        {/* Menu Items */}
        <View className="px-6 mt-10">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[10px] uppercase tracking-widest mb-4">
            Paramètres du compte
          </Text>

          {renderMenuItem(Shield, 'Sécurité', 'Gérer votre mot de passe')}
          {renderMenuItem(Bell, 'Notifications', 'Alertes et messages')}
          {renderMenuItem(Settings, 'Préférences', 'Langue et affichage')}

          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-400 text-[10px] uppercase tracking-widest mt-8 mb-4">
            Assistance
          </Text>

          {renderMenuItem(HelpCircle, 'Centre d\'aide', 'FAQ et support')}

          {user && (
            <TouchableOpacity onPress={handleLogout} className="flex-row items-center py-6 mt-4">
              <View className="bg-red-50 p-3 rounded-2xl mr-4">
                <LogOut size={20} color="#EF4444" />
              </View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-red-500 text-sm">Déconnexion</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
