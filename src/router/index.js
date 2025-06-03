// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Importa tus componentes/vistas
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Pagos from '../views/Pagos.vue' // Añade esta línea para importar Pagos.vue

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router