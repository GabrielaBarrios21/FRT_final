// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // importa el router
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'sweetalert2'

import './style.css'

import { createPinia } from 'pinia'

const app = createApp(App)

app.use(createPinia())
app.use(router) // agrega el router a la app
app.mount('#app')
