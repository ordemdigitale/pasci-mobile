import apiClient from './apiClient';
import { AuthResponse } from './types';
import * as SecureStore from 'expo-secure-store';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Note: L'API attend souvent un format x-www-form-urlencoded pour le login (OAuth2 standard en FastAPI)
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await apiClient.post<AuthResponse>('/auth/login', params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    
    if (response.data.access_token) {
      await SecureStore.setItemAsync('userToken', response.data.access_token);
    }
    
    return response.data;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('userToken');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  register: async (data: { email: string; password: string; first_name?: string; last_name?: string; username?: string }) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  updateProfile: async (data: { first_name?: string | null; last_name?: string | null; username?: string | null; bio?: string | null }) => {
    const response = await apiClient.put('/users/me', data);
    return response.data;
  },
};
