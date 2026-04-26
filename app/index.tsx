import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        setIsLoggedIn(!!token);
      } catch (e) {
        console.log('Error checking auth', e);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (checkingAuth) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#E05017" />
      </View>
    );
  }

  return <Redirect href={isLoggedIn ? '/(tabs)' : '/login'} />;
}
