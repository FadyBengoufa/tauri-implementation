import {defineStore} from 'pinia'
import {getUser} from "src/api/auth";

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || {}
  }),

  getters: {
    getUser(state) {
      return state.user
    }
  },

  actions: {
    async setUser(logout = false) {
      if(logout) {
        this.user = {};
        localStorage.removeItem('user');
        return;
      }
      this.user = await getUser();
      localStorage.setItem('user', JSON.stringify(this.user));
    }
  }
})
