import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Award, CheckCircle2, CheckSquare, Circle, ClipboardCheck, Square, XCircle } from 'lucide-react-native';
import { dataService, ResultatEvaluation } from '../../services/dataService';

/**
 * Évaluation finale (QCM) : à réussir après toutes les leçons pour obtenir le
 * certificat. `leconsVues` fait partie de la clé de cache : une leçon de plus
 * peut débloquer l'évaluation.
 */
export default function EvaluationFinale({
  slug,
  leconsVues,
  onCertificat,
}: {
  slug: string;
  leconsVues: number;
  onCertificat: (code: string) => void;
}) {
  const queryClient = useQueryClient();
  const [ouverte, setOuverte] = useState(false);
  const [reponses, setReponses] = useState<Record<number, number[]>>({});
  const [resultat, setResultat] = useState<ResultatEvaluation | null>(null);

  const { data: evaluation } = useQuery({
    queryKey: ['formation-evaluation', slug, leconsVues],
    queryFn: () => dataService.getEvaluationFormation(slug),
    enabled: !!slug,
    retry: false,
  });

  const envoi = useMutation({
    mutationFn: () => dataService.soumettreEvaluationFormation(slug, reponses),
    onSuccess: (res) => {
      setResultat(res);
      if (res.reussi) {
        setOuverte(false);
        if (res.certificat_code) onCertificat(res.certificat_code);
      }
      queryClient.invalidateQueries({ queryKey: ['formation-evaluation', slug] });
    },
    onError: (error: any) => {
      Alert.alert('Erreur', error?.response?.data?.detail || error.message || "Envoi de l'évaluation impossible.");
    },
  });

  if (!evaluation || evaluation.questions.length === 0) return null;

  const cocher = (qid: number, index: number, plusieurs: boolean) => {
    setReponses((prev) => {
      const actuelles = prev[qid] || [];
      if (!plusieurs) return { ...prev, [qid]: [index] };
      return { ...prev, [qid]: actuelles.includes(index) ? actuelles.filter((i) => i !== index) : [...actuelles, index] };
    });
  };

  const valider = () => {
    const sansReponse = evaluation.questions.filter((q) => !(reponses[q.id] || []).length).length;
    if (sansReponse) {
      Alert.alert('Questions sans réponse', `${sansReponse} question(s) sans réponse. Valider quand même ?`, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Valider', onPress: () => envoi.mutate() },
      ]);
      return;
    }
    envoi.mutate();
  };

  const meilleur = evaluation.tentatives.reduce((m, t) => Math.max(m, t.score), 0);

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-2">
        <View className="w-1 h-5 bg-brand-orange rounded-full mr-3" />
        <ClipboardCheck size={18} color="#E05017" />
        <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-gray-900 text-lg ml-2">Évaluation finale</Text>
      </View>
      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm mb-4">
        {evaluation.questions.length} question(s) · note minimale {evaluation.note_minimale} % pour obtenir le certificat.
        {evaluation.tentatives.length > 0 ? ` Meilleur score : ${meilleur} %.` : ''}
      </Text>

      {evaluation.reussie ? (
        <View className="flex-row items-center bg-green-50 border border-green-200 rounded-2xl p-4">
          <Award size={18} color="#16A34A" />
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-green-700 ml-2">Évaluation réussie</Text>
        </View>
      ) : !evaluation.lecons_terminees ? (
        <View className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
          <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-sm">
            Disponible après avoir suivi toutes les leçons.
          </Text>
        </View>
      ) : !ouverte ? (
        <TouchableOpacity
          onPress={() => {
            setOuverte(true);
            setResultat(null);
            setReponses({});
          }}
          className="bg-brand-orange rounded-2xl py-4 items-center"
        >
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white">
            {evaluation.tentatives.length ? "Repasser l'évaluation" : "Passer l'évaluation"}
          </Text>
        </TouchableOpacity>
      ) : null}

      {resultat && (
        <View className={`mt-4 rounded-2xl border p-4 ${resultat.reussi ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
          <View className="flex-row items-center">
            {resultat.reussi ? <CheckCircle2 size={16} color="#16A34A" /> : <XCircle size={16} color="#B45309" />}
            <Text style={{ fontFamily: 'Poppins_700Bold' }} className={`ml-2 ${resultat.reussi ? 'text-green-800' : 'text-amber-900'}`}>
              Score : {resultat.score} % ({resultat.bonnes}/{resultat.total})
            </Text>
          </View>
          <Text style={{ fontFamily: 'Karla_400Regular' }} className={`text-sm mt-1 ${resultat.reussi ? 'text-green-800' : 'text-amber-900'}`}>
            {resultat.reussi
              ? 'Félicitations, votre certificat est disponible.'
              : `Il faut au moins ${resultat.note_minimale} %. Revoyez les leçons puis réessayez : les questions à revoir sont signalées.`}
          </Text>
        </View>
      )}

      {ouverte && (
        <View className="mt-4">
          {evaluation.questions.map((q, n) => {
            const aRevoir = resultat?.questions_a_revoir.includes(q.id);
            return (
              <View key={q.id} className={`rounded-2xl border p-4 mb-3 ${aRevoir ? 'border-amber-300 bg-amber-50' : 'border-gray-100 bg-gray-50'}`}>
                <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-900 text-sm mb-1">
                  {n + 1}. {q.enonce}
                </Text>
                {q.plusieurs_reponses && (
                  <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500 text-xs mb-2">Plusieurs réponses possibles.</Text>
                )}
                {q.choix.map((c, i) => {
                  const coche = (reponses[q.id] || []).includes(i);
                  const Icone = q.plusieurs_reponses ? (coche ? CheckSquare : Square) : coche ? CheckCircle2 : Circle;
                  return (
                    <TouchableOpacity key={i} onPress={() => cocher(q.id, i, q.plusieurs_reponses)} className="flex-row items-center py-2">
                      <Icone size={18} color={coche ? '#E05017' : '#9CA3AF'} />
                      <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-800 text-sm ml-2 flex-1">{c}</Text>
                    </TouchableOpacity>
                  );
                })}
                {aRevoir && <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-amber-800 text-xs mt-1">À revoir.</Text>}
              </View>
            );
          })}
          <TouchableOpacity
            onPress={valider}
            disabled={envoi.isPending}
            className="bg-[#2a591d] rounded-2xl py-4 items-center flex-row justify-center"
          >
            {envoi.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white">Valider mes réponses</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOuverte(false)} className="py-3 items-center">
            <Text style={{ fontFamily: 'Karla_400Regular' }} className="text-gray-500">Annuler</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
