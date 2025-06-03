<template>
  <div class="navbar-container">
    <div class="brand">
      <i class="bi bi-lightning-charge-fill"></i>
      <span style="color: #f5a623;">Fast</span><span style="color: white;">Events</span>
    </div>
    <div class="navbar">
      <router-link to="/OrgHome" class="nav-item">Home</router-link>
      <router-link to="/CrearEve" class="nav-item" v-if="isOrganizer">
        <i class="bi bi-plus-circle"></i> Crear Evento
      </router-link>
      <router-link to="/EventosLis" class="nav-item">Eventos</router-link>
      <button @click="logout" class="nav-item logout-btn">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </div>
  </div>

  <!-- Contenido principal -->
  <div class="dashboard-content">
    <h1 class="dashboard-title">
      <i class="bi bi-speedometer2"></i> Panel de Control
    </h1>

    <!-- Panel de control con 4 opciones fijas -->
    <div class="control-panel">
      <router-link to="/CrearEve" class="panel-option">
        <i class="bi bi-plus-circle"></i>
        <span>Crear Evento</span>
      </router-link>
      <router-link to="/EventosLis" class="panel-option">
        <i class="bi bi-calendar-check"></i>
        <span>Mis Eventos</span>
      </router-link>
      <button class="panel-option" @click="exportData">
        <i class="bi bi-download"></i>
        <span>Exportar</span>
      </button>
    </div>

    <!-- Eventos próximos -->
    <div class="upcoming-events">
      <h2><i class="bi bi-calendar-event"></i> Próximos Eventos</h2>
      <div class="event-grid">
        <div v-for="event in upcomingEvents" :key="event.id" class="event-card">
          <div class="event-date">
            <span class="day">{{ formatDay(event.date) }}</span>
            <span class="month">{{ formatMonth(event.date) }}</span>
          </div>
          <div class="event-details">
            <h3>{{ event.title }}</h3>
            <p><i class="bi bi-geo-alt"></i> {{ event.location }}</p>
            <div class="event-stats">
              <span><i class="bi bi-ticket-perforated"></i> {{ event.sold }}/{{ event.capacity }}</span>
              <span><i class="bi bi-cash-stack"></i> ${{ event.revenue }}</span>
            </div>
          </div>
          <button class="event-action" @click="viewEvent(event.id)">
            <i class="bi bi-arrow-right-circle"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Swal from 'sweetalert2';

export default {
  name: 'DashboardOrganizador',
  setup() {
    const summaryCards = ref([
      { title: 'Eventos Activos', value: '5', icon: 'bi bi-calendar-check', color: 'card-purple' },
      { title: 'Entradas Vendidas', value: '124', icon: 'bi bi-ticket-perforated', color: 'card-orange' },
      { title: 'Ingresos Totales', value: '$2,850', icon: 'bi bi-cash-stack', color: 'card-pink' },
      { title: 'Porcentaje Ocupación', value: '78%', icon: 'bi bi-graph-up', color: 'card-blue' }
    ]);

    const upcomingEvents = ref([
      { id: 1, title: 'Concierto de Jazz', location: 'Teatro Principal', date: '2025-07-15', capacity: 200, sold: 150, revenue: '3,750' },
      { id: 2, title: 'Charla de Tecnología', location: 'Centro de Convenciones', date: '2025-07-20', capacity: 100, sold: 80, revenue: '1,200' },
      { id: 3, title: 'Obra de Teatro', location: 'Auditorio Municipal', date: '2025-07-25', capacity: 150, sold: 120, revenue: '2,400' }
    ]);

    const formatDay = (dateString) => new Date(dateString).getDate();
    const formatMonth = (dateString) => new Date(dateString).toLocaleString('es-ES', { month: 'short' }).toUpperCase();

    const logout = () => {
      Swal.fire({
        title: '¿Cerrar sesión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#f5a623',
        cancelButtonColor: '#ff416c',
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirigir a login
        }
      });
    };

    const viewEvent = (id) => {
      console.log('Ver evento:', id);
    };

    const exportData = () => {
      Swal.fire({
        title: 'Exportar datos',
        text: 'Se descargará un archivo CSV con todos tus eventos.',
        icon: 'info',
        confirmButtonColor: '#f5a623'
      });
    };

    const sendNotifications = () => {
      Swal.fire({
        title: 'Enviar notificaciones',
        input: 'textarea',
        inputLabel: 'Mensaje personalizado',
        inputPlaceholder: 'Escribe aquí el mensaje...',
        showCancelButton: true,
        confirmButtonColor: '#f5a623'
      });
    };

    return {
      summaryCards,
      upcomingEvents,
      formatDay,
      formatMonth,
      logout,
      viewEvent,
      exportData,
      sendNotifications,
      isOrganizer: true // Ajusta según tu lógica real
    };
  }
};
</script>

<style scoped>
.navbar-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 100px;
  background: transparent;
}
.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 2rem;
  font-weight: 700;
  position: absolute;
  left: 80px;
}
.brand i {
  font-size: 2rem;
  color: #f5a623;
}
.navbar {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-left: auto;
  padding-left: 50px;
}
.nav-item {
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 30px;
  background-color: #ffffff33;
  transition: background-color 0.3s ease;
}
.nav-item:hover,
.nav-item.router-link-exact-active {
  background-color: #f5a623;
  color: black;
}
.logout-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}

.dashboard-content {
  padding: 2rem 5%;
}
.dashboard-title {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #f5a623;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}
.summary-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  backdrop-filter: blur(5px);
  transition: transform 0.3s ease;
}
.summary-card:hover {
  transform: translateY(-5px);
}
.card-icon i {
  font-size: 2.5rem;
}
.card-info h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}
.card-info p {
  font-size: 1.8rem;
  font-weight: bold;
}
.card-purple { border-left: 5px solid #AD8BFF; }
.card-orange { border-left: 5px solid #f5a623; }
.card-pink { border-left: 5px solid #ff416c; }
.card-blue { border-left: 5px solid #4fc3f7; }

.control-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}
.panel-option {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 15px;
  padding: 1.2rem;
  text-align: center;
  color: white;
  text-decoration: none;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease, transform 0.2s ease;
  cursor: pointer;
}
.panel-option i {
  font-size: 1.5rem;
  color: #f5a623;
}
.panel-option:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
}

.upcoming-events {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  backdrop-filter: blur(5px);
}
.upcoming-events h2 {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.event-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1rem;
  transition: all 0.3s ease;
}
.event-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}
.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-right: 1rem;
}
.event-date .day {
  font-size: 1.8rem;
  font-weight: bold;
}
.event-date .month {
  font-size: 0.8rem;
  opacity: 0.8;
}
.event-details {
  flex: 1;
}
.event-details h3 {
  margin-bottom: 0.5rem;
}
.event-details p {
  opacity: 0.8;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.event-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
}
.event-stats span {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.event-action {
  background: transparent;
  border: none;
  color: #f5a623;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.event-action:hover {
  transform: scale(1.2);
}

/* Responsive */
@media (max-width: 992px) {
  .navbar-container {
    padding: 20px;
  }
  .brand {
    left: 20px;
  }
}
</style>
