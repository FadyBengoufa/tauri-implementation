import {defineStore} from 'pinia'
import {login, refreshToken as apiRefreshToken} from "src/api/auth";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
  }),

  getters: {
    isAuthenticated: state => !!state.token,
  },

  actions: {
    async login(credentials) {
      const response = await login(credentials)
      if (!response.status) return response;
      const {token} = response.data;
      localStorage.setItem('token', token);
      this.token = token;
      return response;
    },
    logout() {
      localStorage.removeItem('token');
      this.token = '';
    },
  }
})

window.addEventListener('storage', (event) => {
  if (event.key === 'token') {
    useAuthStore().token = event.newValue;
    // refresh page
    window.location.reload();
  }
})
