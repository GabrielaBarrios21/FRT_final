import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    local: Number(localStorage.getItem('userRole')) || 1
  }),
  actions: {
    setRole(roleValue) {
      this.local = roleValue
      localStorage.setItem('userRole', roleValue)
    },
    logout() {
      this.local = 1
      localStorage.removeItem('userRole')
    }
  }
})
