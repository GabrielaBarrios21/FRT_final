<!-- src/components/NavBar.vue -->
<template>
  <nav class="navbar-container">
    <div class="brand">
      <i class="bi bi-lightning-charge-fill"></i>
      <span class="brand-name"><span class="brand-part-1">Fast</span><span class="brand-part-2">Events</span></span>
    </div>

    <button class="menu-toggle" @click="isOpen = !isOpen" aria-label="Toggle menu">
      <i class="bi" :class="isOpen ? 'bi-x-lg' : 'bi-list'"></i>
    </button>

    <div :class="['navbar', { open: isOpen }]">
      <!-- Rutas comunes a todos -->
      <router-link to="/" class="nav-item">Home</router-link>
      <router-link to="/eventos" class="nav-item">Eventos</router-link>

      <!-- Solo visitante (local = 1) -->
      <template v-if="user.local === 1">
        <router-link to="/about" class="nav-item">About</router-link>
        <router-link to="/contacto" class="nav-item">Contacto</router-link>
        <router-link to="/login" class="nav-item">Login</router-link>
      </template>

      <!-- Cliente o organizador -->
      <template v-else>
        <!-- <router-link to="/perfil-cliente" class="nav-item">Perfil</router-link> -->
        <router-link to="/perfil-organizador" class="nav-item">Perfil</router-link> 

        <!-- Solo organizador -->
        <router-link v-if="user.local === 3" to="/crear-evento" class="nav-item">Crear Evento</router-link>

        <!-- Campanita de notificaciones -->
        <div class="notification-bell" @click="showNotifications">
          <i class="bi bi-bell-fill"></i>
          <span class="badge">{{ notificationsCount }}</span>
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '/src/stores/user.js'
import Swal from 'sweetalert2'

const isOpen = ref(false)
const notificationsCount = ref(1) // Puedes cambiar esto por un valor dinámico
const user = useUserStore()

//BORRAR ESTO DESPUES
// Simulación de cambio de rol para pruebas
user.setRole(2)

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