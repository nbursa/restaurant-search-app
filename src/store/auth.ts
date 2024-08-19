import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwtToken: '',
    loading: false,
    error: '',
  }),

  actions: {
    async loginAnonymously(): Promise<void> {
      try {
        this.loading = true;
        this.error = '';

        // Perform an anonymous login to get a JWT token
        const response = await axios.post(`${API_BASE_URL}/loginAnonymously`);
        this.jwtToken = response.data.jwt_token;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          this.error = `Login failed: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
        } else {
          this.error = 'An unexpected error occurred while logging in.';
          console.error('Unhandled login error:', error);
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearToken(): void {
      this.jwtToken = '';
    },
  },
});
