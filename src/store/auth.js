import { defineStore } from 'pinia'
import {user_login} from '@/services/user_services'
import { jwtDecode } from 'jwt-decode'
import { useMenuStore } from './menu_store'



export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: {},
    exp: '',
    per: '',
    user_name: '',
    per_rota: '',
    access_token: '',
    rota_principal: ''
  }),
  actions: {
      async login(email, password) {
          await user_login(email, password)
          .then( (resp) => {
              this.isAuthenticated = true
              this.access_token = resp.access_token
              const secretKey = import.meta.env.VITE_APP_SECRET_KEY;
              if (typeof secretKey !== 'string') {
                  throw new TypeError('Chave secreta deve ser uma string');
              }
              const decoded = jwtDecode(resp.access_token)   
              if (decoded) {
                  const jsonStr = decoded.sub.replace(/'/g, '"').replace(/None/g, 'null');
                  const userObj = JSON.parse(jsonStr);
                  this.user = userObj
                  this.exp = decoded.exp;
                  this.per = decoded.sub?.per_nome
                  this.user_name = decoded.sub?.usu_nome;
              }
              else {
                  this.logout();
              }
          })
      },
      logout() {
            this.isAuthenticated = false
            this.access_token = ''
            this.user = {}
            this.exp = ''
            this.per = ''
            this.user_name = ''
            this.per_rota = ''
            this.rota_principal = ''
      },
      isLogged: (s) => !!this.accessToken,
      isTokenExpired() {
          const now = Math.floor(Date.now() / 1000)
          return this.exp && this.exp < now
      },
      getRotaPrincipal() {
        console.log('getRotaPrincipal', this.user.per_rota)
        return this.user.per_rota || ''
      },
      getNome() {
        // console.log('getNome', this.user.nome)
        return this.user.nome || ''
      },
      getEmpId() {
        return this.user.emp_id || ''
      },
      getUserId() {
        return this.user.usu_id || ''
      },
      getNomePerfil() {
        return this.user.per_nome || ''
      },
      getIdPerfil() {
        return this.user.per_id || ''
      },
      ensureSession() {
        if (!this.isLogged) return false
        if (this.isTokenExpired) {
          try { this.logout() } catch { return false }
        }
        return true
      },
  },
  persist: true,
})
