<template>
  <div class="organizer-page">
    <!-- Contenido principal -->
    <main class="organizer-container">
      <!-- Panel de bienvenida -->
      <section class="welcome-panel">
        <div class="welcome-card">
          <div class="organizer-avatar">
            <i class="bi bi-person-badge"></i>
          </div>
          <div class="organizer-info">
            <h1>Bienvenido, <span>CodeCapibara</span></h1>
            <p class="organizer-email">
              <i class="bi bi-envelope"></i> gabriela.barrios@ucb.edu.bo
            </p>
            <p class="organizer-role">
              <i class="bi bi-shield-check"></i> Cuenta de Organizador Verificada
            </p>
          </div>
        </div>
      </section>

      <!-- Métricas rápidas -->
      <section class="metrics-section">
        <h2><i class="bi bi-speedometer2"></i> Métricas Rápidas</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon total-events">
              <i class="bi bi-calendar-event"></i>
            </div>
            <div class="metric-info">
              <h3>Eventos Creados</h3>
              <p>{{ metrics.totalEvents }}</p>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon tickets-sold">
              <i class="bi bi-ticket-perforated"></i>
            </div>
            <div class="metric-info">
              <h3>Entradas Vendidas</h3>
              <p>{{ metrics.ticketsSold }}</p>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon total-revenue">
              <i class="bi bi-currency-dollar"></i>
            </div>
            <div class="metric-info">
              <h3>Ingresos Totales</h3>
              <p>{{ formatCurrency(metrics.totalRevenue) }}</p>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon upcoming-events">
              <i class="bi bi-alarm"></i>
            </div>
            <div class="metric-info">
              <h3>Próximos Eventos</h3>
              <p>{{ metrics.upcomingEvents }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Listado de eventos -->
      <section class="events-section">
        <div class="section-header">
          <h2><i class="bi bi-calendar2-event"></i> Mis Eventos</h2>
          <router-link to="/nuevo-evento" class="btn-new-event">
            <i class="bi bi-plus-lg"></i> Nuevo Evento
          </router-link>
        </div>

        <div v-if="events.length > 0" class="events-table">
          <div class="table-header">
            <div class="header-cell">Evento</div>
            <div class="header-cell">Fecha</div>
            <div class="header-cell">Ubicación</div>
            <div class="header-cell">Entradas</div>
            <div class="header-cell">Estado</div>
            <div class="header-cell">Acciones</div>
          </div>

          <div v-for="event in events" :key="event.id" class="table-row">
            <div class="table-cell event-name">
              <img :src="event.image" :alt="event.title" class="event-thumbnail">
              <span>{{ event.title }}</span>
            </div>
            <div class="table-cell">{{ event.date }}</div>
            <div class="table-cell">{{ event.location }}</div>
            <div class="table-cell">
              <div class="tickets-progress">
                <div class="progress-bar" :style="{ width: event.tickets.sold / event.tickets.total * 100 + '%' }"></div>
                <span>{{ event.tickets.sold }} / {{ event.tickets.total }}</span>
              </div>
            </div>
            <div class="table-cell">
              <span :class="{
                'status-active': event.status === 'active',
                'status-cancelled': event.status === 'cancelled',
                'status-completed': event.status === 'completed'
              }">
                {{ getStatusText(event.status) }}
              </span>
            </div>
            <div class="table-cell actions-cell">
              <button class="btn-action view-btn" @click="viewEvent(event.id)">
                <i class="bi bi-eye"></i>
              </button>
              <button class="btn-action edit-btn" @click="editEvent(event.id)">
                <i class="bi bi-pencil"></i>
              </button>
              <button 
                class="btn-action cancel-btn" 
                @click="cancelEvent(event.id)"
                v-if="event.status === 'active'"
              >
                <i class="bi bi-x-circle"></i>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-events">
          <i class="bi bi-calendar-x"></i>
          <p>Aún no has creado ningún evento</p>
          <router-link to="/nuevo-evento" class="btn-cta">
            <i class="bi bi-plus-lg"></i> Crear mi primer evento
          </router-link>
        </div>
      </section>

      <!-- Evento destacado (próximo evento) -->
      <section v-if="nextEvent" class="featured-event">
        <h2><i class="bi bi-star"></i> Tu Próximo Evento</h2>
        <div class="featured-card">
          <div class="featured-image">
            <img :src="nextEvent.image" :alt="nextEvent.title">
          </div>
          <div class="featured-details">
            <h3>{{ nextEvent.title }}</h3>
            <p><i class="bi bi-calendar-event"></i> {{ nextEvent.date }}</p>
            <p><i class="bi bi-geo-alt"></i> {{ nextEvent.location }}</p>
            <div class="featured-metrics">
              <div class="metric-item">
                <i class="bi bi-ticket-perforated"></i>
                <span>{{ nextEvent.tickets.sold }} vendidas</span>
              </div>
              <div class="metric-item">
                <i class="bi bi-people"></i>
                <span>{{ nextEvent.tickets.total - nextEvent.tickets.sold }} disponibles</span>
              </div>
              <div class="metric-item">
                <i class="bi bi-cash-stack"></i>
                <span>{{ formatCurrency(nextEvent.revenue) }} recaudado</span>
              </div>
            </div>
            <div class="featured-actions">
              <button class="btn-promote">
                <i class="bi bi-megaphone"></i> Promocionar
              </button>
              <button class="btn-manage">
                <i class="bi bi-gear"></i> Gestionar
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Pie de página -->
    <footer class="organizer-footer">
      <p><i class="bi bi-c-circle"></i> 2025 FastEvents. Panel de Organizador</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PerfilOrganizador',
  data() {
    return {
      metrics: {
        totalEvents: 4,
        ticketsSold: 142,
        totalRevenue: 3560.75,
        upcomingEvents: 2
      },
      events: [
        {
          id: 1,
          title: 'Concierto de Rock Alternativo',
          date: '25 Ago 2025, 20:00',
          location: 'Teatro Municipal',
          image: 'https://s3.amazonaws.com/s3.timetoast.com/public/uploads/photo/8420304/image/5d71bf34c6ac3af595abdab253f8a697?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJB6ZCNNAN7BE7WDQ%2F20250601%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250601T021455Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=311b1af9463f5ad49b8bb3e59f9f89edc629a06dc7a438910b4e81a849b5ce4d',
          tickets: {
            sold: 78,
            total: 120
          },
          status: 'active',
          revenue: 1950.00
        },
        {
          id: 2,
          title: 'Festival de Cine Independiente',
          date: '15 Sep 2025, 18:00',
          location: 'Centro Cultural',
          image: 'https://www.prensa-latina.cu/wp-content/uploads/2025/03/Festivales-y-eventos-de-cine-que-no-te-puedes-perder-1.jpg',
          tickets: {
            sold: 64,
            total: 100
          },
          status: 'active',
          revenue: 1280.00
        },
        {
          id: 3,
          title: 'Charla de Tecnología Blockchain',
          date: '10 Jul 2025, 19:30',
          location: 'Auditorio UCB',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaVwKdDQmiBlogfU6PJF0xeKYrapbi1sLcng&s',
          tickets: {
            sold: 45,
            total: 45
          },
          status: 'completed',
          revenue: 450.00
        },
        {
          id: 4,
          title: 'Exposición de Arte Digital',
          date: '5 Jun 2025, 10:00',
          location: 'Galería de Arte',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiK3w0NimmZ8OhwO7EL9HBX32R1oATVUqoiA&s',
          tickets: {
            sold: 0,
            total: 50
          },
          status: 'cancelled',
          revenue: 0.00
        }
      ]
    };
  },
  computed: {
    nextEvent() {
      return this.events.find(event => event.status === 'active');
    }
  },
  methods: {
    formatCurrency(value) {
      return '$' + value.toFixed(2);
    },
    getStatusText(status) {
      const statusMap = {
        active: 'Activo',
        cancelled: 'Cancelado',
        completed: 'Completado'
      };
      return statusMap[status] || status;
    },
    viewEvent(id) {
      console.log('Ver evento:', id);
      // Navegar a la página del evento
    },
    editEvent(id) {
      console.log('Editar evento:', id);
      // Navegar a la edición del evento
    },
    cancelEvent(id) {
      Swal.fire({
        title: '¿Cancelar evento?',
        text: 'Esta acción notificará a los compradores y procesará reembolsos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, mantener',
        background: '#1a1a2e',
        color: '#ffffff',
        showCloseButton: true,
        width: '500px'
      }).then((result) => {
        if (result.isConfirmed) {
          const eventIndex = this.events.findIndex(e => e.id === id);
          if (eventIndex !== -1) {
            this.events[eventIndex].status = 'cancelled';
            Swal.fire({
              title: 'Evento cancelado',
              text: 'Se ha notificado a los compradores y procesado los reembolsos.',
              icon: 'success',
              background: '#1a1a2e',
              color: '#ffffff',
              showCloseButton: true,
              width: '500px'
            });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
/* Estilos base */
.organizer-page {
  min-height: 100vh;
  background: linear-gradient(120deg, #150120, #362d4b);
  color: white;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  flex-direction: column;
}

/* Contenido principal */
.organizer-container {
  flex: 1;
  padding: 2rem 5%;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Panel de bienvenida */
.welcome-card {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  background: linear-gradient(120deg, #150120, #362d4b);
}

.organizer-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.organizer-avatar i {
  font-size: 3rem;
  color: #f5a623;
}

.organizer-info h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.organizer-info h1 span {
  color: #f5a623;
}

.organizer-email, .organizer-role {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.organizer-email i, .organizer-role i {
  color: #f5a623;
}

/* Métricas rápidas */
.metrics-section {
  margin: 3rem 0;
}

.metrics-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #f5a623;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.metric-card:hover {
  transform: translateY(-5px);
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.total-events {
  background: rgba(101, 87, 255, 0.2);
  color: #6557ff;
}

.tickets-sold {
  background: rgba(255, 165, 35, 0.2);
  color: #f5a623;
}

.total-revenue {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.upcoming-events {
  background: rgba(255, 66, 108, 0.2);
  color: #ff416c;
}

.metric-info h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.metric-info p {
  font-size: 1.5rem;
  font-weight: bold;
}

/* Listado de eventos */
.events-section {
  margin: 3rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #f5a623;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-new-event {
  background: #f5a623;
  color: black;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 30px;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-new-event:hover {
  background: #ff416c;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.events-table {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto;
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 1.5rem;
  font-weight: bold;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr auto;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.3s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.header-cell, .table-cell {
  padding: 0.5rem;
  display: flex;
  align-items: center;
}

.event-name {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.event-thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 5px;
  object-fit: cover;
}

.tickets-progress {
  width: 100%;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, #f5a623, #ff416c);
  border-radius: 10px;
}

.tickets-progress span {
  position: relative;
  z-index: 1;
  font-size: 0.8rem;
  line-height: 20px;
  padding: 0 0.5rem;
  color: white;
}

.status-active {
  color: #4CAF50;
}

.status-cancelled {
  color: #FF5252;
}

.status-completed {
  color: #9E9E9E;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.view-btn {
  background: rgba(101, 87, 255, 0.2);
  color: #6557ff;
}

.view-btn:hover {
  background: #6557ff;
  color: white;
}

.edit-btn {
  background: rgba(255, 165, 35, 0.2);
  color: #f5a623;
}

.edit-btn:hover {
  background: #f5a623;
  color: black;
}

.cancel-btn {
  background: rgba(255, 82, 82, 0.2);
  color: #FF5252;
}

.cancel-btn:hover {
  background: #FF5252;
  color: white;
}

.empty-events {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.empty-events i {
  font-size: 3rem;
  color: #f5a623;
  margin-bottom: 1rem;
}

.empty-events p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.btn-cta {
  background: #f5a623;
  color: black;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-cta:hover {
  background: #ff416c;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Evento destacado */
.featured-event {
  margin: 3rem 0;
}

.featured-event h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #f5a623;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.featured-card {
  display: flex;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.featured-image {
  width: 40%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.featured-image img {
  width: 100%;
  height: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.featured-details {
  padding: 2rem;
  flex: 1;
}

.featured-details h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #f5a623;
}

.featured-details p {
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.featured-details i {
  color: #f5a623;
}

.featured-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.8rem;
  border-radius: 10px;
}

.metric-item i {
  color: #f5a623;
}

.featured-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-promote, .btn-manage {
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-promote {
  background: #6557ff;
  color: white;
}

.btn-promote:hover {
  background: #4d3eff;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-manage {
  background: transparent;
  color: white;
  border: 2px solid #f5a623;
}

.btn-manage:hover {
  background: #f5a623;
  color: black;
}

/* Pie de página */
.organizer-footer {
  text-align: center;
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
}

.organizer-footer i {
  margin-right: 0.3rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .featured-card {
    flex-direction: column;
  }
  
  .featured-image {
    width: 100%;
    height: 250px;
  }
}

@media (max-width: 992px) {
  .table-header, .table-row {
    grid-template-columns: 2fr 1fr 1fr auto;
  }
  
  .header-cell:nth-child(4), .table-cell:nth-child(4),
  .header-cell:nth-child(5), .table-cell:nth-child(5) {
    display: none;
  }
}

@media (max-width: 768px) {
  .welcome-card {
    flex-direction: column;
    text-align: center;
  }
  
  .table-header, .table-row {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .header-cell {
    display: none;
  }
  
  .table-cell {
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .table-cell:last-child {
    border-bottom: none;
  }
  
  .actions-cell {
    justify-content: center;
    padding-top: 1rem;
  }
}

@media (max-width: 576px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .featured-actions {
    flex-direction: column;
  }
  
  .btn-promote, .btn-manage {
    width: 100%;
    justify-content: center;
  }
}
</style>