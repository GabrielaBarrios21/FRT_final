<!-- src/components/NavBar.vue -->
<template>
  <nav class="navbar-container">
    <div class="brand">
      <i class="bi bi-lightning-charge-fill"></i>
      <span class="brand-name">
        <span class="brand-part-1">Fast</span>
        <span class="brand-part-2">Events</span>
      </span>
    </div>

    <button class="menu-toggle" @click="isOpen = !isOpen" aria-label="Toggle menu">
      <i class="bi" :class="isOpen ? 'bi-x-lg' : 'bi-list'"></i>
    </button>

    <div :class="['navbar', { open: isOpen }]">
      <router-link
        v-for="(item, index) in navItems"
        :key="index"
        :to="item.to"
        class="nav-item"
      >
        {{ item.label }}
      </router-link>

      <!-- Solo si no es visitante -->
      <div v-if="showBell" class="notification-bell" @click="showNotifications">
        <i class="bi bi-bell-fill"></i>
        <span class="badge">{{ notificationsCount }}</span>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '/src/stores/user.js'
import Swal from 'sweetalert2'

const isOpen = ref(false)
const notificationsCount = ref(1)
const user = useUserStore()

// Simula rol
user.setRole(1) // Cambia a 1 (visitante), 2 (cliente), 3 (organizador), 4 (admin), etc.

const NAV_CONFIG = {
  1: [ // Visitante
    { to: '/', label: 'Home' },
    { to: '/eventos', label: 'Eventos' },
    { to: '/about', label: 'About' },
    { to: '/contacto', label: 'Contacto' },
    { to: '/login', label: 'Login' }
  ],
  2: [ // Cliente
    { to: '/', label: 'Home' },
    { to: '/eventos', label: 'Eventos' },
    { to: '/perfil-cliente', label: 'Perfil' }
  ],
  3: [ // Organizador
    { to: '/', label: 'Home' },
    { to: '/eventos', label: 'Eventos' },
    { to: '/perfil-organizador', label: 'Perfil' },
    { to: '/crear-evento', label: 'Crear Evento' }
  ],
  4: [ // Admin (ejemplo futuro)
    { to: '/', label: 'Home' },
    { to: '/eventos', label: 'Eventos' },
    { to: '/admin/dashboard', label: 'Dashboard' }
  ]
}

// Items del menú basados en rol
const navItems = computed(() => NAV_CONFIG[user.local] || NAV_CONFIG[1]) // Fallback a visitante

const showBell = computed(() => user.local !== 1)

const showNotifications = () => {
  Swal.fire({
    title: 'Notificaciones',
    html: `
      <div class="text-left">
        <div class="notification-item">
          <strong>Nuevo evento</strong>
          <p>Cancelación: Concierto de Jazz Nocturno</p>
          <small>Hace 2 horas</small>
        </div>
        <hr>
      </div>
    `,
    confirmButtonText: 'Cerrar',
    background: '#1a1a2e',
    color: '#ffffff',
    showCloseButton: true,
    width: '500px'
  })
}
</script>

<style scoped>
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #230134; 
  flex-wrap: wrap;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1000;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  font-weight: 700;
}

.brand i {
  font-size: 2rem;
  color: #f5a623;
}

.brand-part-1 {
  color: #f5a623;
}

.brand-part-2 {
  color: #ffffff;
}

.menu-toggle {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: white;
  display: none;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.menu-toggle:hover {
  transform: scale(1.1);
}

.navbar {
  display: flex;
  gap: 15px;
  align-items: center;
  transition: all 0.3s ease-in-out;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.nav-item:hover,
.nav-item.router-link-exact-active {
  background-color: #f5a623;
  color: #16213e;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(245, 166, 35, 0.3);
}

.notification-bell {
  position: relative;
  font-size: 1.4rem;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.notification-bell:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #e94560;
  color: white;
  border-radius: 50%;
  padding: 3px 6px;
  font-size: 0.7rem;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-container {
    padding: 1rem;
  }
  
  .menu-toggle {
    display: block;
  }

  .navbar {
    display: none;
    flex-direction: column;
    width: 100%;
    background: #230134;
    margin-top: 1rem;
    border-radius: 8px;
    padding: 1rem 0;
    gap: 0.8rem;
  }

  .navbar.open {
    display: flex;
  }

  .nav-item {
    width: 90%;
    text-align: center;
    padding: 0.8rem;
  }

  .notification-bell {
    margin-top: 0.5rem;
  }
}
</style>