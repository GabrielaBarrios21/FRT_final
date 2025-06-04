<template>
  <div class="profile-page">
    <!-- Contenido principal -->
    <main class="profile-container">
      <!-- Sección de información del usuario -->
      <section class="user-info-section">
        <div class="user-card">
          <div class="user-avatar">
            <i class="bi bi-person-circle"></i>
          </div>
          <div class="user-details">
            <h1>Gabriela Barrios</h1>
            <p class="user-email">
              <i class="bi bi-envelope"></i> gabtbm2104@gmail.com
            </p>
            <div class="user-stats">
              <div class="stat-item">
                <i class="bi bi-ticket-perforated"></i>
                <span>{{ tickets.length }} entradas</span>
              </div>
              <div class="stat-item">
                <i class="bi bi-calendar-check"></i>
                <span>{{ attendedEvents }} eventos asistidos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección de entradas compradas -->
      <section class="tickets-section">
        <h2><i class="bi bi-ticket-perforated"></i> Mis Entradas</h2>
        
        <div v-if="tickets.length > 0" class="tickets-grid">
          <div v-for="ticket in tickets" :key="ticket.id" class="ticket-card">
            <div class="ticket-event">
              <img :src="ticket.event.image" :alt="ticket.event.title" class="event-image">
              <div class="event-info">
                <h3>{{ ticket.event.title }}</h3>
                <p><i class="bi bi-calendar-event"></i> {{ ticket.event.date }}</p>
                <p><i class="bi bi-geo-alt"></i> {{ ticket.event.location }}</p>
              </div>
            </div>
            <div class="ticket-details">
              <div class="detail-row">
                <span class="detail-label">N° de Entrada:</span>
                <span class="detail-value">#{{ ticket.id }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tipo:</span>
                <span class="detail-value">{{ ticket.type }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Precio:</span>
                <span class="detail-value">{{ formatCurrency(ticket.price) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Fecha compra:</span>
                <span class="detail-value">{{ ticket.purchaseDate }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Estado:</span>
                <span class="detail-value" :class="{
                  'status-active': ticket.status === 'active',
                  'status-used': ticket.status === 'used',
                  'status-cancelled': ticket.status === 'cancelled'
                }">
                  {{ getStatusText(ticket.status) }}
                </span>
              </div>
            </div>
            <div class="ticket-actions">
              <button class="btn-download">
                <i class="bi bi-download"></i> Descargar
              </button>
              <button v-if="ticket.status === 'active'" class="btn-transfer">
                <i class="bi bi-arrow-left-right"></i> Transferir
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <i class="bi bi-ticket-perforated"></i>
          <p>Aún no has comprado entradas</p>
          <router-link to="/eventos" class="btn-cta">
            <i class="bi bi-calendar-event"></i> Explorar Eventos
          </router-link>
        </div>
      </section>
    </main>

    <!-- Pie de página -->
    <footer class="profile-footer">
      <p><i class="bi bi-c-circle"></i> 2025 FastEvents. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PerfilCliente',
  data() {
    return {
      user: {
        name: 'Gabriela Barrios',
        email: 'gabtbm2104@gmail.com'
      },
      tickets: [
        {
          id: 'FT-78945612',
          type: 'General',
          price: 25.99,
          purchaseDate: '15 Jun 2025',
          status: 'active',
          event: {
            id: 1,
            title: 'Concierto de Rock Internacional',
            date: '15 Jul 2025, 20:00',
            location: 'Arena Ciudad de México',
            image: 'https://via.placeholder.com/300x200?text=Concierto+Rock'
          }
        },
        {
          id: 'FT-32165498',
          type: 'VIP',
          price: 89.99,
          purchaseDate: '10 May 2025',
          status: 'active',
          event: {
            id: 2,
            title: 'Festival de Jazz al Aire Libre',
            date: '22 Ago 2025, 18:00',
            location: 'Parque Central',
            image: 'https://via.placeholder.com/300x200?text=Festival+Jazz'
          }
        },
        {
          id: 'FT-14725836',
          type: 'General',
          price: 35.50,
          purchaseDate: '5 Abr 2025',
          status: 'used',
          event: {
            id: 3,
            title: 'Obra de Teatro: El Principito',
            date: '20 May 2025, 19:30',
            location: 'Teatro Nacional',
            image: 'https://via.placeholder.com/300x200?text=Teatro+Principito'
          }
        }
      ]
    };
  },
  computed: {
    attendedEvents() {
      return this.tickets.filter(t => t.status === 'used').length;
    }
  },
  methods: {
    formatCurrency(value) {
      return '$' + value.toFixed(2);
    },
    getStatusText(status) {
      const statusMap = {
        active: 'Activa',
        used: 'Utilizada',
        cancelled: 'Cancelada'
      };
      return statusMap[status] || status;
    }
  }
};
</script>

<style scoped>
/* Estilos base */
.profile-page {
  min-height: 100vh;
  background: linear-gradient(120deg, #150120, #362d4b);
  color: white;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  flex-direction: column;
}

/* Contenido principal */
.profile-container {
  flex: 1;
  padding: 2rem 5%;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Tarjeta de usuario */
.user-info-section {
  margin-bottom: 3rem;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar i {
  font-size: 4rem;
  color: #f5a623;
}

.user-details h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #f5a623;
}

.user-email {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.user-email i {
  color: #f5a623;
}

.user-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 30px;
}

.stat-item i {
  color: #f5a623;
}

/* Sección de entradas */
.tickets-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #f5a623;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tickets-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.ticket-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s;
}

.ticket-card:hover {
  transform: translateY(-5px);
}

.ticket-event {
  display: flex;
  padding: 1.5rem;
  gap: 1.5rem;
}

.event-image {
  width: 120px;
  height: 120px;
  border-radius: 10px;
  object-fit: cover;
}

.event-info h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #f5a623;
}

.event-info p {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.event-info i {
  color: #f5a623;
}

.ticket-details {
  padding: 1.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.detail-label {
  color: rgba(255, 255, 255, 0.6);
}

.detail-value {
  font-weight: bold;
}

.status-active {
  color: #4CAF50;
}

.status-used {
  color: #9E9E9E;
}

.status-cancelled {
  color: #FF5252;
}

.ticket-actions {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  justify-content: center;
}

.btn-download, .btn-transfer {
  padding: 8px 16px;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.btn-download {
  background: #f5a623;
  color: black;
}

.btn-download:hover {
  background: #ff416c;
  color: white;
}

.btn-transfer {
  background: transparent;
  color: white;
  border: 1px solid #f5a623;
}

.btn-transfer:hover {
  background: #f5a623;
  color: black;
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.empty-state i {
  font-size: 3rem;
  color: #f5a623;
  margin-bottom: 1rem;
}

.empty-state p {
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

/* Pie de página */
.profile-footer {
  text-align: center;
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-footer i {
  margin-right: 0.3rem;
}

/* Responsive */
@media (max-width: 992px) {
  .ticket-card {
    grid-template-columns: 1fr;
  }
  
  .ticket-details {
    border-left: none;
    border-right: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .ticket-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}

@media (max-width: 768px) {
  .user-card {
    flex-direction: column;
    text-align: center;
  }
  
  .user-stats {
    justify-content: center;
  }
  
  .ticket-event {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .event-image {
    width: 100%;
    height: 180px;
  }
}

@media (max-width: 576px) {

  .ticket-actions {
    flex-direction: column;
  }
  
  .btn-download, .btn-transfer {
    width: 100%;
    justify-content: center;
  }
}
</style>