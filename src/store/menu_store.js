import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { menu_admin, menu_funcionario } from '@/services/menu_services';

export const useMenuStore = defineStore('menu', {
    state: () => ({
        menu: {},
        rota_principal: ''
    }),
    actions: {
        getMenu() {
            const idPerfil = useAuthStore().getIdPerfil();
            // 4 - Funcionario
            if (idPerfil && idPerfil === 4) {
                console.log("useMenuStore.4", idPerfil)
                this.menu = menu_funcionario
            }
            // 1 - Admin
            else if (idPerfil && idPerfil === 1) {
                console.log("useMenuStore.1", idPerfil)
                this.menu = menu_admin
            }
            return this.menu;
        },
    },
    persist: true,
})
