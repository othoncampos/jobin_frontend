/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { useAuthStore } from '@/store/auth' 
import { createRouter, createWebHistory } from 'vue-router/auto'

// Comentado para facilitar a declaracao das rodas com a propriedade requiresAuth
// import { routes } from 'vue-router/auto-routes'

import Home from '@/pages/index.vue'
import Login from '@/pages/login.vue'
import Uf from '@/pages/uf/index.vue'
import new_uf from '@/pages/uf/new.vue'
import edit_uf from '@/pages/uf/edit.vue'
import view_uf from '@/pages/uf/view.vue'
import Campi from '@/pages/campi/index.vue'
import new_campi from '@/pages/campi/new.vue'
import ViewCampi from '@/pages/campi/view.vue'
import EditCampi from '@/pages/campi/edit.vue'
import Cidades from '@/pages/cidade/index.vue'
import NewCidade from '@/pages/cidade/new.vue'
import ViewCidade from '@/pages/cidade/view.vue'
import EditCidade from '@/pages/cidade/edit.vue'
import AdminDash from '@/pages/dashadmin/index.vue'
import Func_Index from '@/pages/funcionario/index.vue'
import ArquivoIndex from '@/pages/arquivo/index.vue'
import ArquivoNovo from '@/pages/arquivo/novo.vue'
import Banco_Index from '@/pages/financeiro/banco/index.vue'
import Banco_Novo from '@/pages/financeiro/banco/new.vue'
import Banco_Edit from '@/pages/financeiro/banco/edit.vue'
import Lancamento_Index from '@/pages/financeiro/lancamento/index.vue'
import Lancamento_Novo from '@/pages/financeiro/lancamento/new.vue'
import Lancamento_Edit from '@/pages/financeiro/lancamento/edit.vue'
import Dash_Funcionario from '@/pages/dashfuncionario/index.vue'
import CCH_Funcionario from '@/pages/cchfuncionario/index.vue'
import CCH_Admin from '@/pages/funcionario/contracheque.vue'
import Simulacao from '@/pages/simulacao/index.vue'


const routes = [
  { path: '/login', component: Login },
  { path: '/', component: Home },
  { path: '/uf', component: Uf },
  { path: '/newuf', component: new_uf, meta: { requiresAuth: true } },
  { path: '/edituf/:id', component: edit_uf, meta: { requiresAuth: true } },
  { path: '/viewuf/:id', component: view_uf, meta: { requiresAuth: true } },
  { path: '/campi', component: Campi },
  { path: '/newcampi', component: new_campi, meta: { requiresAuth: true } },
  { path: '/viewcampi/:id', component: ViewCampi, meta: { requiresAuth: true } },
  { path: '/editcampi/:id', component: EditCampi, meta: { requiresAuth: true } },
  { path: '/cidade', component: Cidades, meta: { requiresAuth: true } },
  { path: '/newcid', component: NewCidade, meta: { requiresAuth: true } },
  { path: '/viewcid/:id', component: ViewCidade, meta: { requiresAuth: true } },
  { path: '/editcid/:id', component: EditCidade, meta: { requiresAuth: true } },
  { path: '/dashadmin', component: AdminDash, meta: { requiresAuth: true } },
  { path: '/func', component: Func_Index, meta: { requiresAuth: true } },
  { path: '/arquivo', component: ArquivoIndex, meta: { requiresAuth: true } },
  { 
    path: '/arquivo/novo/:class_id?', 
    component: ArquivoNovo,
    name: 'ArquivoNovo',
    props: route => ({ class_id: Number(route.params.class_id ?? 0) }),
    meta: { requiresAuth: true } 
  },
  { path: '/banco', component: Banco_Index, meta: { requiresAuth: true } },
  { path: '/banconovo', component: Banco_Novo, meta: { requiresAuth: true } },
  { path: '/banco_edit', component: Banco_Edit, meta: { requiresAuth: true } },
  { path: '/lancamento', component: Lancamento_Index, meta: { requiresAuth: true } },
  { path: '/lancamento_novo', component: Lancamento_Novo, meta: { requiresAuth: true } },
  { path: '/lancamento_edit/:id', component: Lancamento_Edit, meta: { requiresAuth: true } },
  { path: '/dashfuncionario', component: Dash_Funcionario, meta: { requiresAuth: true } },
  { path: '/cchfuncionario', component: CCH_Funcionario, meta: { requiresAuth: true } },
  { path: '/cch', component: CCH_Admin, meta: { requiresAuth: true } },
  { 
    path: '/simulacao', 
    component: Simulacao,
    name: 'Simulacao',
    props: route => ({ 
      nr_prestacao: Number(route.query.nr_prestacao),
      vl_prestacao: Number(route.query.vl_prestacao),
    }),
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// PROTEÇÃO DAS ROTAS
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  console.log('auth', auth)
  console.log('to', to, to.meta.requiresAuth)
  console.log('isAuthenticated', auth.isAuthenticated)

  // Força logout se o token expirou
  if (auth.isAuthenticated && auth.isTokenExpired()) {
      auth.logout()
      return next('/login')
  }

  // As rotas que precisam de login devem ter o meta: { requiresAuth: true }
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/') // Redireciona para Home ou para página de login
  } else {
    next()
  }
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
