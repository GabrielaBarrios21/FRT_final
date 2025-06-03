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
      </div>
    </div>

    <!-- Hero Section -->
    <div class="events-hero">
      <h1><i class="bi bi-calendar-event"></i> Explora Eventos</h1>
      <p>Encuentra los mejores eventos cerca de ti</p>
    </div>

    <!-- Filtros -->
    <div class="filters-container">
      <div class="search-bar">
        <i class="bi bi-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar eventos..." 
          @input="applyFilters"
        >
      </div>
      
      <div class="filter-group">
        <select v-model="categoryFilter" @change="applyFilters">
          <option value="">Todas las categorías</option>
          <option value="concierto">Conciertos</option>
          <option value="teatro">Teatro</option>
          <option value="deporte">Deportes</option>
          <option value="conferencia">Conferencias</option>
        </select>
      </div>
      
      <div class="filter-group">
        <select v-model="dateFilter" @change="applyFilters">
          <option value="">Cualquier fecha</option>
          <option value="hoy">Hoy</option>
          <option value="semana">Esta semana</option>
          <option value="mes">Este mes</option>
          <option value="futuro">Próximos</option>
        </select>
      </div>
      
      <div class="filter-group" v-if="isOrganizer">
        <select v-model="statusFilter" @change="applyFilters">
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="draft">Borradores</option>
          <option value="cancelled">Cancelados</option>
        </select>
      </div>
    </div>

    <!-- Lista de eventos -->
    <div class="events-list">
      <!-- Mensaje cuando no hay eventos -->
      <div v-if="filteredEvents.length === 0" class="no-events">
        <i class="bi bi-calendar-x"></i>
        <h3>No se encontraron eventos</h3>
        <p>Intenta ajustar tus filtros de búsqueda</p>
        <router-link to="/CrearEve" class="btn-create-event" v-if="isOrganizer">
          <i class="bi bi-plus-circle"></i> Crear mi primer evento
        </router-link>
      </div>

      <!-- Tarjetas de eventos -->
      <div v-for="event in filteredEvents" :key="event.id" class="event-card">
        <div class="event-image">
          <img :src="event.image || 'https://via.placeholder.com/300x200?text=FastEvents'" alt="Evento">
          <div class="event-badge" :class="event.status">
            {{ formatStatus(event.status) }}
          </div>
        </div>
        
        <div class="event-details">
          <div class="event-header">
            <h3>{{ event.title }}</h3>
            <div class="event-actions" v-if="isOrganizer && event.organizer_id === currentUser.id">
              <router-link :to="`/EventosLis/EditEvent/${event.id}`" class="action-btn">
                <i class="bi bi-pencil"></i>
              </router-link>
              <button @click="confirmDelete(event.id)" class="action-btn danger">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          
          <p class="event-description">{{ truncateDescription(event.description) }}</p>
          
          <div class="event-meta">
            <div class="meta-item">
              <i class="bi bi-calendar"></i>
              <span>{{ formatDate(event.event_date) }}</span>
            </div>
            <div class="meta-item">
              <i class="bi bi-geo-alt"></i>
              <span>{{ event.location }}</span>
            </div>
            <div class="meta-item">
              <i class="bi bi-ticket-perforated"></i>
              <span>{{ event.tickets_sold }}/{{ event.capacity }} vendidas</span>
            </div>
          </div>
          
          <div class="event-footer">
            <div class="event-price">
              <span v-if="event.price > 0">${{ event.price.toFixed(2) }}</span>
              <span v-else>Gratis</span>
            </div>
            
            <div class="event-buttons">
              <router-link 
                :to="`/eventos/${event.id}`" 
                class="btn-details"
              >
                Ver detalles
              </router-link>
              
              <button 
                v-if="!isOrganizer && event.status === 'active'" 
                class="btn-buy"
                @click="handleBuyClick(event.id)"
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div class="pagination" v-if="filteredEvents.length > 0">
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="page-btn"
      >
        <i class="bi bi-chevron-left"></i>
      </button>
      
      <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
      
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  name: 'ListaEventos',
  setup() {
    const router = useRouter();
    
    // Datos de usuario (simulados)
    const currentUser = ref({
      id: 1,
      role: 'organizer' // Cambiar a 'user' para vista de comprador
    });
    
    // Datos de eventos (simulados - luego reemplazar con API)
    const events = ref([
      {
        id: 1,
        organizer_id: 1,
        title: 'Concierto de Jazz Nocturno',
        description: 'Disfruta de una noche llena de los mejores ritmos de jazz con artistas internacionales.',
        location: 'Teatro Principal, Ciudad',
        event_date: '2025-07-15T20:00:00',
        capacity: 200,
        tickets_sold: 145,
        price: 25.99,
        category: 'concierto',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      },
      {
        id: 2,
        organizer_id: 2,
        title: 'Charla de Tecnología Avanzada',
        description: 'Conoce las últimas tendencias en inteligencia artificial y blockchain con expertos del sector.',
        location: 'Centro de Convenciones',
        event_date: '2025-07-20T18:30:00',
        capacity: 150,
        tickets_sold: 87,
        price: 12.50,
        category: 'conferencia',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
      },
      {
        id: 3,
        organizer_id: 1,
        title: 'Obra de Teatro: El Mago de Oz',
        description: 'Clásica obra de teatro familiar con actores profesionales y efectos especiales.',
        location: 'Auditorio Municipal',
        event_date: '2025-08-05T17:00:00',
        capacity: 300,
        tickets_sold: 210,
        price: 18.00,
        category: 'teatro',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80'
      },
      {
        id: 4,
        organizer_id: 1,
        title: 'Torneo de Fútbol Local',
        description: 'Apoya a tu equipo favorito en el torneo anual de la ciudad.',
        location: 'Estadio Municipal',
        event_date: '2025-07-25T15:00:00',
        capacity: 500,
        tickets_sold: 320,
        price: 8.00,
        category: 'deporte',
        status: 'active',
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1605&q=80'
      },
      {
        id: 5,
        organizer_id: 1,
        title: 'Evento Borrador',
        description: 'Este es un evento que aún no se ha publicado.',
        location: 'Por definir',
        event_date: '2025-09-10T19:00:00',
        capacity: 100,
        tickets_sold: 0,
        price: 15.00,
        category: 'concierto',
        status: 'draft',
        image: null
      }
    ]);

    // Filtros
    const searchQuery = ref('');
    const categoryFilter = ref('');
    const dateFilter = ref('');
    const statusFilter = ref('');
    const currentPage = ref(1);
    const itemsPerPage = 6;

    // Computed properties
    const isOrganizer = computed(() => currentUser.value.role === 'organizer');

    const filteredEvents = computed(() => {
      let result = [...events.value];
      
      // Aplicar filtros
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(e => 
          e.title.toLowerCase().includes(query) || 
          e.description.toLowerCase().includes(query)
        );
      }
      
      if (categoryFilter.value) {
        result = result.filter(e => e.category === categoryFilter.value);
      }
      
      if (dateFilter.value) {
        const now = new Date();
        result = result.filter(e => {
          const eventDate = new Date(e.event_date);
          switch (dateFilter.value) {
            case 'hoy':
              return eventDate.toDateString() === now.toDateString();
            case 'semana':
              const nextWeek = new Date();
              nextWeek.setDate(now.getDate() + 7);
              return eventDate >= now && eventDate <= nextWeek;
            case 'mes':
              const nextMonth = new Date();
              nextMonth.setMonth(now.getMonth() + 1);
              return eventDate >= now && eventDate <= nextMonth;
            case 'futuro':
              return eventDate >= now;
            default:
              return true;
          }
        });
      }
      
      if (isOrganizer.value && statusFilter.value) {
        result = result.filter(e => e.status === statusFilter.value);
      } else if (!isOrganizer.value) {
        // Para usuarios normales, solo mostrar eventos activos
        result = result.filter(e => e.status === 'active');
      }
      
      // Ordenar por fecha más cercana
      result.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
      
      return result;
    });

    const paginatedEvents = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredEvents.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredEvents.value.length / itemsPerPage);
    });

    // Métodos
    const formatDate = (dateString) => {
      const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      };
      return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const truncateDescription = (text) => {
      const maxLength = 120;
      return text.length > maxLength 
        ? text.substring(0, maxLength) + '...' 
        : text;
    };

    const formatStatus = (status) => {
      const statusMap = {
        'active': 'Activo',
        'draft': 'Borrador',
        'cancelled': 'Cancelado'
      };
      return statusMap[status] || status;
    };

    const applyFilters = () => {
      currentPage.value = 1; // Resetear a primera página al aplicar filtros
    };

    const handleBuyClick = (eventId) => {
      router.push(`/eventos/${eventId}/comprar`);
    };

    const confirmDelete = (eventId) => {
      const event = events.value.find(e => e.id === eventId);
      if (event.tickets_sold > 0) {
        Swal.fire({
          title: 'No se puede eliminar',
          text: 'Este evento ya tiene entradas vendidas. Debes cancelarlo en lugar de eliminarlo.',
          icon: 'warning',
          confirmButtonColor: '#f5a623'
        });
        return;
      }

      Swal.fire({
        title: '¿Eliminar evento?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff416c',
        cancelButtonColor: '#f5a623',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteEvent(eventId);
        }
      });
    };

    const deleteEvent = (eventId) => {
      // Simular llamada API
      events.value = events.value.filter(e => e.id !== eventId);
      Swal.fire({
        title: 'Evento eliminado',
        icon: 'success',
        confirmButtonColor: '#f5a623'
      });
    };

    // Lifecycle hook
    onMounted(() => {
      // Aquí iría la llamada a la API para cargar eventos
      // Ejemplo: fetchEvents();
    });

    return {
      currentUser,
      isOrganizer,
      searchQuery,
      categoryFilter,
      dateFilter,
      statusFilter,
      currentPage,
      filteredEvents: paginatedEvents,
      totalPages,
      formatDate,
      truncateDescription,
      formatStatus,
      applyFilters,
      handleBuyClick,
      confirmDelete
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
.events-container {
  background: linear-gradient(120deg, #3C1053, #AD8BFF);
  min-height: 100vh;
  color: white;
}

/* Hero Section */
.events-hero {
  text-align: center;
  padding: 3rem 1rem;
  background: rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
}

.events-hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #f5a623;
}

.events-hero p {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Filtros */
.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0 1.5rem;
  margin-bottom: 2rem;
  align-items: center;
}

.search-bar {
  flex: 1;
  min-width: 250px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar i {
  position: absolute;
  left: 15px;
  opacity: 0.7;
}

.search-bar input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border-radius: 30px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: inherit;
  transition: all 0.3s ease;
}

.search-bar input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 2px #f5a623;
}

.filter-group select {
  padding: 0.8rem 1rem;
  border-radius: 30px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-group select:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 2px #f5a623;
}

/* Lista de eventos */
.events-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  padding: 0 1.5rem;
  margin-bottom: 3rem;
}

.no-events {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
}

.no-events i {
  font-size: 3rem;
  color: #f5a623;
  margin-bottom: 1rem;
}

.no-events h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.no-events p {
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.btn-create-event {
  background: #f5a623;
  color: black;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-create-event:hover {
  background: #e69a1f;
  transform: translateY(-2px);
}

/* Tarjeta de evento */
.event-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.event-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.event-card:hover .event-image img {
  transform: scale(1.05);
}

.event-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 0.3rem 0.8rem;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: bold;
}

.event-badge.active {
  background: #4CAF50;
  color: white;
}

.event-badge.draft {
  background: #FFC107;
  color: black;
}

.event-badge.cancelled {
  background: #F44336;
  color: white;
}

.event-details {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.event-header h3 {
  font-size: 1.3rem;
  margin-right: 1rem;
}

.event-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(245, 166, 35, 0.3);
}

.action-btn.danger:hover {
  background: rgba(244, 67, 54, 0.3);
}

.event-description {
  opacity: 0.9;
  margin-bottom: 1.5rem;
  flex: 1;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 0.9rem;
}

.meta-item i {
  opacity: 0.7;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.event-price {
  font-size: 1.2rem;
  font-weight: bold;
  color: #f5a623;
}

.event-buttons {
  display: flex;
  gap: 0.8rem;
}

.btn-details {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-details:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-buy {
  background: #f5a623;
  color: black;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  border: none;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-buy:hover {
  background: #e69a1f;
  transform: translateY(-2px);
}

/* Paginación */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
}

.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background: rgba(245, 166, 35, 0.3);
}

.page-info {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  .events-hero h1 {
    font-size: 2rem;
  }

  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar, .filter-group select {
    width: 100%;
  }

  .events-list {
    grid-template-columns: 1fr;
    padding: 0 1rem;
  }

  .event-card {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .event-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .event-buttons {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>