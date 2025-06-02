// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // importa el router
import 'bootstrap-icons/font/bootstrap-icons.css';

import './style.css'

const app = createApp(App)

app.use(router) // agrega el router a la app
app.mount('#app')
