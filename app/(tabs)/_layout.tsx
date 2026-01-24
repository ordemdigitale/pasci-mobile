import { Tabs } from 'expo-router';
import { Home, Newspaper, Folder, Users, Briefcase } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E05017',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontFamily: 'Poppins_600SemiBold',
          textTransform: 'uppercase',
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ACCUEIL',
          tabBarIcon: ({ color, focused }) => (
            <Home size={20} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="projets"
        options={{
          title: 'PROJETS',
          tabBarIcon: ({ color, focused }) => (
            <Briefcase size={20} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="espace-collab"
        options={{
          title: 'COLLAB',
          tabBarIcon: ({ color, focused }) => (
            <Users size={20} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="ressources"
        options={{
          title: 'DOCS',
          tabBarIcon: ({ color, focused }) => (
            <Folder size={20} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="actualites"
        options={{
          title: 'ACTUS',
          tabBarIcon: ({ color, focused }) => (
            <Newspaper size={20} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      {/* Profil est maintenant accessible via le header des pages principales */}
      <Tabs.Screen
        name="profil"
        options={{
          href: null, // Cache l'onglet Profil de la barre du bas
        }}
      />
    </Tabs>
  );
}