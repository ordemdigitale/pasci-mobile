import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { BookOpenText, Building2, CheckCircle2, ChevronLeft, FileText, Globe2, Landmark, Users } from 'lucide-react-native';

const COLORS = {
  green: '#2a591d',
  blue: '#2F5496',
  orange: '#E05017',
  paleBlue: '#f0f9ff',
  border: '#dbeafe',
  text: '#111827',
  muted: '#6B7280',
};

const PLATFORM_SECTIONS = [
  {
    title: 'Une plateforme pour tous',
    text: "Cette plateforme digitale est née d'un travail collectif. Elle a été construite avec la participation des associations ivoiriennes, de l'État et de partenaires techniques et financiers.",
  },
  {
    title: 'Un projet partagé',
    text: "Les acteurs impliqués ont donné leurs idées et leurs propositions lors de rencontres de préparation. C'est grâce à eux que les services et les outils de la plateforme répondent vraiment aux besoins des utilisateurs.",
  },
  {
    title: 'Un outil pratique et vivant',
    text: "La plateforme s'adresse aux organisations de la société civile et aux Centres Régionaux d'Appui à la Société Civile (CRASC).",
    bullets: [
      'rendre les OSC plus visibles',
      'travailler ensemble plus facilement',
      'partager des expériences et des bonnes pratiques',
    ],
  },
  {
    title: 'Un espace pour la cohésion',
    text: 'Au-delà du numérique, la plateforme veut :',
    bullets: [
      'renforcer le vivre ensemble',
      'aider à préparer le travail en équipe sans conflit',
      'encourager la participation des femmes et des jeunes',
    ],
  },
];

const CRASC_SECTIONS = [
  {
    title: "Histoire des CRASC en Côte d'Ivoire",
    bullets: [
      'En 2010, une étude a montré que les organisations de la société civile avaient beaucoup de difficultés.',
      "Pour aider, l'État et l'Union Européenne ont lancé le programme LIANE afin de renforcer la démocratie, la gouvernance et le partenariat entre l'État et les OSC.",
      'En 2015, grâce au projet LIANE I, les premiers Centres Régionaux d’Appui à la Société Civile ont été créés.',
    ],
  },
  {
    title: 'Pourquoi les CRASC ?',
    bullets: [
      'Les OSC sont nombreuses et réparties partout dans le pays.',
      'Pour mieux les accompagner, cinq CRASC ont été créés : Centre, Est, Nord, Ouest et Sud.',
      'Chaque CRASC sert de relais pour donner conseils, formations et appuis aux associations de sa région.',
    ],
  },
  {
    title: 'Leur rôle',
    bullets: [
      'Regrouper les forces des OSC.',
      'Offrir des services utiles : formations, accompagnements et conseils.',
      'Aider la société civile à être unie, responsable et actrice du développement local.',
    ],
  },
  {
    title: 'Mission des CRASC',
    text: "Les CRASC ont pour mission principale d'aider les organisations de la société civile de leur région à mieux fonctionner. Ils aident les organisations à avoir leurs papiers, à bien s'organiser et leur donnent des méthodes efficaces pour bien travailler.",
  },
  {
    title: 'Objectifs des CRASC',
    bullets: [
      'Accompagner les OSC dans leur création, leur organisation et leur vie quotidienne.',
      'Donner accès aux informations sur les aides techniques et financières.',
      "Former et conseiller les OSC pour qu'elles deviennent des acteurs crédibles et compétents.",
      'Créer un espace d’échanges et de partage de services entre OSC.',
    ],
  },
  {
    title: 'Organisation des CRASC',
    text: 'Les CRASC sont structurés autour de plusieurs organes de gouvernance.',
    bullets: [
      'Assemblée Générale',
      "Conseil d'Administration",
      'Direction exécutive',
      'Délégations régionales',
      'Commissariat aux comptes',
      'Conseil des sages',
    ],
  },
];

const ZONES = [
  {
    title: 'CRASC Centre',
    meta: '5 régions + 1 district',
    text: "Bélier (Toumodi), Gbêkè (Bouaké), Hambol (Katiola), Marahoué (Bouaflé), N'Zi (Dimbokro), District autonome de Yamoussoukro.",
    color: '#F59E0B',
  },
  {
    title: 'CRASC Est',
    meta: '5 régions',
    text: 'Bounkani (Bouna), Gontougo (Bondoukou), Iffou (Daoukro), Moronou (Bongouanou), Indénié-Djuablin (Abengourou).',
    color: '#EC4899',
  },
  {
    title: 'CRASC Nord',
    meta: '7 régions',
    text: 'Bagoué (Boundiali), Béré (Mankono), Folon (Minignan), Kabadougou (Odienné), Poro (Korhogo), Tchologo (Ferkessédougou), Worodougou (Séguéla).',
    color: '#5A7D5A',
  },
  {
    title: 'CRASC Ouest',
    meta: '5 régions',
    text: 'Bafing (Touba), Cavally (Guiglo), Guémon (Duékoué), Haut-Sassandra (Daloa), Tonkpi (Man).',
    color: '#2563EB',
  },
  {
    title: 'CRASC Sud',
    meta: '9 régions + 1 district',
    text: "Agnéby-Tiassa (Agboville), Gbôklè (Sassandra), Gôh (Gagnoa), Mé (Adzopé), San Pedro, Grands-Ponts (Dabou), Loh-Djiboua (Divo), Nawa (Soubré), Sud-Comoé (Aboisso), District autonome d'Abidjan.",
    color: '#06B6D4',
  },
];

const ACHIEVEMENTS = [
  {
    title: 'Renforcement des capacités de 5 409 OSC',
    bullets: [
      '3 553 OSC formées aux critères de soumission aux appels à projet.',
      '1 056 organisations formées aux thématiques : gestion de projets, communication digitale, égalité de genre, prévention et gestion des conflits.',
      '780 organisations appuyées à la création et à la formalisation.',
      '20 organisations accompagnées techniquement et institutionnellement par semaine.',
    ],
  },
  {
    title: 'Appui à la gouvernance et à la participation citoyenne',
    bullets: [
      "Réalisation d'enquêtes de satisfaction citoyenne sur les services publics.",
      'Organisation de cafés citoyens et panels de dialogue avec les autorités et les candidats aux élections.',
      'Contribution à la définition des politiques de développement local.',
      'Élaboration d’une feuille de route pour les CRASC.',
    ],
  },
  {
    title: 'Partenariats et projets structurants',
    bullets: [
      'Participation au projet de cartographie sectorielle des OSC et redynamisation des CRASC.',
      'Mise en œuvre du programme LIANE 2 pour le renforcement des capacités et le suivi des micro-initiatives.',
      "Exécution du projet ECOTER : création d'un centre de services pour les OSC du Gontougo.",
    ],
  },
];

const DGAT_SECTIONS = [
  {
    title: 'Rôle principal de la DGAT',
    bullets: [
      "Vulgarisation et formation autour de l'ordonnance n° 2024-368.",
      'Accompagnement juridique et administratif des OSC.',
      'Mise en conformité des statuts, procédures et modes de fonctionnement.',
      'Renforcement de la gouvernance financière, comptable et humaine.',
      'Coordination nationale entre OSC, CRASC et partenaires.',
    ],
  },
  {
    title: 'Impact concret pour les OSC',
    bullets: [
      'Clarté des règles pour être reconnues légalement.',
      'Crédibilité renforcée auprès des citoyens et des bailleurs.',
      'Protection contre les dérives et les structures fictives.',
      'Structuration durable en réseaux et plateformes.',
    ],
  },
  {
    title: "Articles clés de l'ordonnance n° 2024-368",
    bullets: [
      'Article 5 : déclaration auprès de la préfecture ou sous-préfecture.',
      'Article 15 : droit de recevoir des dons, posséder des biens et ouvrir un compte bancaire.',
      'Article 28 : comptabilité claire, transparence et obligations fiscales.',
      "Article 42 : information de l'administration en cas de changement important.",
      'Articles 64 à 69 : lutte contre le blanchiment et le financement du terrorisme.',
      'Article 75 : dissolution possible si l’objet est illégal ou contraire à l’ordre public.',
    ],
  },
];

function BulletList({ items }: { items: string[] }) {
  return (
    <View className="mt-3 gap-2">
      {items.map((item) => (
        <View key={item} className="flex-row items-start">
          <View className="w-1.5 h-1.5 rounded-full mt-2 mr-3" style={{ backgroundColor: COLORS.orange }} />
          <Text style={{ fontFamily: 'Karla_400Regular', color: COLORS.muted }} className="flex-1 text-sm leading-5">
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

function InfoSection({ title, text, bullets }: { title: string; text?: string; bullets?: string[] }) {
  return (
    <View className="mb-5">
      <Text style={{ fontFamily: 'Poppins_700Bold', color: COLORS.blue }} className="text-base mb-2">
        {title}
      </Text>
      {text ? (
        <Text style={{ fontFamily: 'Karla_400Regular', color: COLORS.muted }} className="text-sm leading-6">
          {text}
        </Text>
      ) : null}
      {bullets ? <BulletList items={bullets} /> : null}
    </View>
  );
}

function ContentCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  children: React.ReactNode;
}) {
  return (
    <View className="rounded-3xl border p-5 mb-6" style={{ backgroundColor: COLORS.paleBlue, borderColor: COLORS.border }}>
      <View className="flex-row items-center mb-5">
        <View className="w-10 h-10 rounded-2xl items-center justify-center mr-3" style={{ backgroundColor: '#FFFFFF' }}>
          <Icon size={22} color={COLORS.orange} />
        </View>
        <Text style={{ fontFamily: 'Poppins_700Bold', color: COLORS.green }} className="flex-1 text-xl leading-7">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

export default function AproposScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="px-6 py-4 flex-row items-center bg-white border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft size={24} color={COLORS.orange} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Poppins_700Bold', color: COLORS.text }} className="text-lg flex-1 text-center pr-8">
          À Propos de PdoC
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1" contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <View className="mb-6">
          <Text style={{ fontFamily: 'Poppins_700Bold', color: COLORS.orange }} className="text-xs uppercase tracking-widest mb-3">
            Présentation
          </Text>
          <Text style={{ fontFamily: 'Poppins_700Bold', color: COLORS.text }} className="text-3xl leading-10">
            Plateforme digitale des organisations de la société civile
          </Text>
          <Text style={{ fontFamily: 'Karla_400Regular', color: COLORS.muted }} className="text-base leading-7 mt-4">
            PdoC met en relation les OSC, les CRASC, l’État et les partenaires afin de faciliter l’information, la visibilité et l’accompagnement de la société civile ivoirienne.
          </Text>
        </View>

        <ContentCard title="Présentation de la plateforme (PdoC)" icon={Globe2}>
          {PLATFORM_SECTIONS.map((section) => (
            <InfoSection key={section.title} {...section} />
          ))}
        </ContentCard>

        <ContentCard title="Présentation générale de la société civile en CI" icon={Users}>
          <Text style={{ fontFamily: 'Poppins_700Bold', color: COLORS.green }} className="text-lg mb-4">
            Présentation du CRASC
          </Text>
          {CRASC_SECTIONS.map((section) => (
            <InfoSection key={section.title} {...section} />
          ))}
        </ContentCard>

        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <Building2 size={22} color={COLORS.orange} />
            <Text style={{ fontFamily: 'Poppins_700Bold', color: COLORS.text }} className="text-xl ml-3">
              Les zones couvertes par les CRASC
            </Text>
          </View>

          {ZONES.map((zone) => (
            <View key={zone.title} className="bg-white border border-gray-100 rounded-3xl p-5 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <View className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: zone.color }} />
                  <Text style={{ fontFamily: 'Poppins_700Bold', color: COLORS.text }} className="text-base">
                    {zone.title}
                  </Text>
                </View>
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text style={{ fontFamily: 'Karla_700Bold' }} className="text-gray-500 text-[10px]">
                    {zone.meta}
                  </Text>
                </View>
              </View>
              <Text style={{ fontFamily: 'Karla_400Regular', color: COLORS.muted }} className="text-sm leading-6">
                {zone.text}
              </Text>
            </View>
          ))}
        </View>

        <ContentCard title="Réalisations des CRASC" icon={CheckCircle2}>
          {ACHIEVEMENTS.map((section) => (
            <InfoSection key={section.title} {...section} />
          ))}
        </ContentCard>

        <ContentCard title="Le rôle de la DGAT" icon={Landmark}>
          <Text style={{ fontFamily: 'Karla_400Regular', color: COLORS.muted }} className="text-sm leading-6 mb-5">
            La DGAT joue un rôle clé dans l’application de l’ordonnance sur les OSC : elle vulgarise le texte, accompagne les organisations dans leur mise en conformité et renforce leur gouvernance.
          </Text>
          {DGAT_SECTIONS.map((section) => (
            <InfoSection key={section.title} {...section} />
          ))}
        </ContentCard>

        <View className="bg-white border border-gray-100 rounded-3xl p-5 mb-8">
          <View className="flex-row items-center mb-3">
            <FileText size={22} color={COLORS.orange} />
            <Text style={{ fontFamily: 'Poppins_700Bold', color: COLORS.text }} className="text-lg ml-3">
              Synthèse de l’ordonnance
            </Text>
          </View>
          <BulletList
            items={[
              'Encadre la création des associations et organisations cultuelles.',
              'Donne des droits : recevoir des dons, posséder des biens, agir légalement.',
              'Impose des obligations : transparence, fiscalité et gouvernance.',
              'Prévoit des sanctions en cas de dérive.',
            ]}
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push('/services')}
          className="rounded-3xl py-5 px-5 flex-row items-center justify-center"
          style={{ backgroundColor: COLORS.orange }}
        >
          <BookOpenText size={20} color="#FFFFFF" />
          <Text style={{ fontFamily: 'Poppins_700Bold' }} className="text-white text-base ml-3">
            Découvrir les services PdoC
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
