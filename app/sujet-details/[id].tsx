import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  ChevronLeft,
  Eye,
  MessageSquare,
  Pin,
  Send,
  UserCircle,
} from 'lucide-react-native';
import Skeleton from '../../components/ui/Skeleton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from '../../services/dataService';
import { authService } from '../../services/authService';
import { ForumCommentaire } from '../../services/types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SujetDetailsScreen() {
  const { id, pole } = useLocalSearchParams();
  const router = useRouter();
  const sujetSlug = id as string;
  const poleSlug = pole as string;
  const queryClient = useQueryClient();

  const [comment, setComment] = useState('');

  const { data: sujet, isLoading } = useQuery({
    queryKey: ['sujet', poleSlug, sujetSlug],
    queryFn: () => dataService.getForumSujetDetail(poleSlug, sujetSlug),
    enabled: !!poleSlug && !!sujetSlug,
  });

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getCurrentUser,
    retry: false,
  });

  const isAuthenticated = !!user;

  const commentMutation = useMutation({
    mutationFn: () => dataService.createForumCommentaire(poleSlug, sujetSlug, comment.trim()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sujet', poleSlug, sujetSlug] });
      setComment('');
    },
    onError: (err: any) => {
      Alert.alert('Erreur', err?.response?.data?.detail || 'Impossible d\'envoyer le commentaire.');
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="px-6 py-4 flex-row items-center border-b border-gray-50">
          <Skeleton width={40} height={40} borderRadius={20} />
          <Skeleton width={160} height={18} style={{ marginLeft: 12 }} />
        </View>
        <View className="px-6 mt-4">
          <Skeleton width="100%" height={140} borderRadius={16} style={{ marginBottom: 16 }} />
          <Skeleton width="50%" height={16} style={{ marginBottom: 12 }} />
          {[1, 2, 3].map(i => (
            <Skeleton key={i} width="100%" height={80} borderRadius={16} style={{ marginBottom: 12 }} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (!sujet) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={['top']}>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="px-6 py-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="bg-gray-50 p-2 rounded-full mr-4">
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900">Erreur</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <MessageSquare size={48} color="#D1D5DB" />
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-center mt-4">
            Sujet introuvable.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const commentaires = sujet.commentaires ?? [];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="bg-orange-50 p-2 rounded-full mr-4">
          <ChevronLeft size={24} color="#E05017" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base" numberOfLines={1}>
            Discussion
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-brand-orange text-[10px] uppercase tracking-widest">
            Pôle de Concertation
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

          {/* Post original */}
          <View className="mx-4 mt-4 mb-4 bg-white rounded-[24px] p-5 border border-gray-200 shadow-sm">
            <View className="flex-row items-center mb-3">
              {sujet.is_pinned && (
                <Pin size={14} color="#E05017" style={{ marginRight: 6 }} />
              )}
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-base flex-1">
                {sujet.title}
              </Text>
            </View>

            {/* Meta */}
            <View className="flex-row items-center mb-4 flex-wrap gap-y-1">
              <View className="flex-row items-center mr-3">
                <UserCircle size={14} color="#9CA3AF" />
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-600 text-xs ml-1">
                  {sujet.author_name || 'Anonyme'}
                </Text>
              </View>
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs mr-3">
                {formatDate(sujet.created_at)}
              </Text>
              <View className="flex-row items-center mr-3">
                <Eye size={12} color="#9CA3AF" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs ml-1">{sujet.views_count}</Text>
              </View>
              <View className="flex-row items-center">
                <MessageSquare size={12} color="#9CA3AF" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-xs ml-1">{sujet.comments_count}</Text>
              </View>
            </View>

            <View className="border-t border-gray-100 pt-4">
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-700 text-sm leading-6">
                {sujet.content}
              </Text>
            </View>
          </View>

          {/* Commentaires */}
          <View className="px-4 mb-4">
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-800 text-base mb-3">
              {commentaires.length} réponse{commentaires.length !== 1 ? 's' : ''}
            </Text>

            {commentaires.length === 0 ? (
              <View className="bg-white rounded-[24px] p-8 items-center border border-gray-100">
                <MessageSquare size={36} color="#D1D5DB" />
                <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-sm mt-3 text-center">
                  Aucune réponse pour l'instant. Soyez le premier !
                </Text>
              </View>
            ) : (
              commentaires.map((c: ForumCommentaire) => (
                <View key={c.id} className="bg-white rounded-[20px] p-4 mb-3 border border-gray-100 shadow-sm">
                  <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 bg-orange-50 rounded-full items-center justify-center mr-3">
                      <UserCircle size={18} color="#E05017" />
                    </View>
                    <View>
                      <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-800 text-sm">
                        {c.author_name || 'Anonyme'}
                      </Text>
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-400 text-[10px]">
                        {formatDate(c.created_at)}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-700 text-sm leading-5">
                    {c.content}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* Formulaire réponse */}
          {isAuthenticated ? (
            <View className="mx-4 bg-white border border-gray-200 rounded-[24px] p-4">
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-800 text-sm mb-3">Votre réponse</Text>
              <TextInput
                className="border border-gray-200 rounded-2xl px-4 py-3 text-gray-900 bg-gray-50 min-h-[80px]"
                style={{ fontFamily: 'Karla_400Regular', textAlignVertical: 'top' }}
                placeholder="Écrivez votre réponse..."
                placeholderTextColor="#9ca3af"
                value={comment}
                onChangeText={setComment}
                multiline
              />
              <TouchableOpacity
                className="mt-3 bg-[#E05017] py-3 rounded-2xl items-center flex-row justify-center"
                activeOpacity={0.85}
                disabled={commentMutation.isPending}
                onPress={() => {
                  if (!comment.trim()) return;
                  commentMutation.mutate();
                }}
              >
                {commentMutation.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Send size={15} color="white" />
                    <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white text-sm ml-2">Envoyer</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mx-4 bg-blue-50 border border-blue-100 rounded-[24px] p-5">
              <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-600 text-sm text-center mb-4">
                Connectez-vous pour participer à cette discussion.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/login')}
                className="bg-[#E05017] py-3 rounded-2xl items-center flex-row justify-center"
              >
                <Send size={16} color="white" />
                <Text style={{ fontFamily: 'Poppins_600SemiBold' }} className="text-white text-sm ml-2">
                  Se connecter pour répondre
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
