// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Importa tus componentes/vistas
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import OrganizadorHome from '../views/OrganizadorHome.vue'
import CrearEvento from '../views/CrearEvento.vue'
import EditEvent from '../views/EditEvent.vue'
import EventosLis from '../views/EventosLis.vue'

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
  { path: '/OrgHome', name:'OrganizadorHome',component: OrganizadorHome},
  { path: '/CrearEve', name:'CrearEvento',component: CrearEvento},
  { path: '/EventosLis/EditEvent', name:'EditEvent',component: EditEvent},
  { path: '/EventosLis', name:'EventosLis',component: EventosLis},
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
