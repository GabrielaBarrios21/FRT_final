// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Importa tus componentes/vistas
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Pagos from '../views/Pagos.vue'

import Registro from '../views/Registro.vue'
import Contactos from '../views/Contactos.vue'
import PerfilCliente from '../views/PerfilCliente.vue'
import PerfilOrganizador from '../views/PerfilOrganizador.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/pagos', // Añade esta ruta para Pagos.vue
    name: 'Pagos',
    component: Pagos
  },

  
  { path: '/registro', name: 'Registro', component: Registro },
  { path: '/contacto', name: 'Contactos', component: Contactos},
  { path: '/perfil-cliente', name: 'PerfilCliente', component: PerfilCliente},
  { path: '/perfil-organizador', name: 'PerfilOrganizador', component: PerfilOrganizador}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router