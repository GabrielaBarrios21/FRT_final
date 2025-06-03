// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Importa tus componentes/vistas
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Eventos from '../views/Eventos.vue'
import ComprarTicket from '../views/ComprarTicket.vue'

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
  { path: '/Eventos', name: 'Eventos', component: Eventos},
  { path: '/ComprarTicket/:id', name: 'ComprarTicket', component: ComprarTicket }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
