import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Menu, X, Briefcase, Heart, Users } from 'lucide-react-native';

export default function HeaderMenu() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    {
      label: 'Services PDOC',
      icon: Briefcase,
      route: '/services',
      color: '#2563EB',
    },
    {
      label: 'Faire un don',
      icon: Heart,
      route: '/faire-un-don',
      color: '#DC2626',
    },
    {
      label: 'Être volontaire',
      icon: Users,
      route: '/etre-volontaire',
      color: '#16A34A',
    },
  ];

  const handleMenuItemPress = (route: string) => {
    setMenuVisible(false);
    router.push(route);
  };

  return (
    <>
      {/* Menu Button */}
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <Menu size={24} color="#4b5563" />
      </TouchableOpacity>

      {/* Modal Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View className="flex-1 bg-black/50">
          {/* Background tap to close */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
            className="flex-1"
          />

          {/* Menu Panel */}
          <View className="bg-white rounded-t-[32px] p-6 shadow-lg">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text
                style={{ fontFamily: 'Poppins_700Bold' }}
                className="text-lg text-gray-900"
              >
                Plus de services
              </Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <View className="space-y-2">
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleMenuItemPress(item.route)}
                  className="bg-gray-50 rounded-[20px] p-4 flex-row items-center border border-gray-100 mb-2"
                >
                  <View
                    style={{ backgroundColor: item.color + '20' }}
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  >
                    <item.icon size={24} color={item.color} />
                  </View>
                  <View className="flex-1">
                    <Text
                      style={{ fontFamily: 'Poppins_600SemiBold' }}
                      className="text-gray-900 text-sm"
                    >
                      {item.label}
                    </Text>
                  </View>
                  <Text className="text-gray-400">›</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setMenuVisible(false)}
              className="bg-gray-100 rounded-[20px] p-4 items-center mt-6"
            >
              <Text
                style={{ fontFamily: 'Poppins_600SemiBold' }}
                className="text-gray-600 text-sm"
              >
                Fermer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
