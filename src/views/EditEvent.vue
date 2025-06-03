<template>
    <!-- Navbar (reutilizado) -->
    <div class="navbar-container">
      <div class="brand">
        <i class="bi bi-lightning-charge-fill"></i>
        <span style="color: #f5a623;">Fast</span><span style="color: white;">Events</span>
      </div>
      <div class="navbar">
        <router-link :to="`/EventosLis/${eventId}`" class="nav-item">
          <i class="bi bi-arrow-left"></i> Volver al evento
        </router-link>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="edit-event-content" v-if="event">
      <div class="form-header">
        <h1><i class="bi bi-pencil-square"></i> Editar Evento</h1>
        <p v-if="ticketsSold > 0" class="warning-message">
          <i class="bi bi-exclamation-triangle"></i> Advertencia: Este evento ya tiene {{ ticketsSold }} entradas vendidas.
        </p>
      </div>

      <!-- Formulario -->
      <div class="form-container">
        <!-- Sección 1: Información básica -->
        <div class="form-section">
          <h2><i class="bi bi-info-circle"></i> Información básica</h2>
          <div class="form-group">
            <label for="title"><i class="bi bi-card-heading"></i> Título*</label>
            <input 
              type="text" 
              id="title" 
              v-model="event.title" 
              :disabled="ticketsSold > 0"
              required
            >
          </div>

          <div class="form-group">
            <label for="description"><i class="bi bi-text-paragraph"></i> Descripción*</label>
            <textarea 
              id="description" 
              v-model="event.description" 
              rows="4"
              required
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label><i class="bi bi-people"></i> Capacidad total*</label>
              <input 
                type="number" 
                v-model.number="event.capacity" 
                min="1" 
                :disabled="ticketsSold > 0"
                required
              >
              <small v-if="ticketsSold > 0" class="hint">
                No puedes modificar la capacidad porque ya hay entradas vendidas
              </small>
            </div>

            <div class="form-group">
              <label><i class="bi bi-tags"></i> Estado*</label>
              <select v-model="event.status" required>
                <option value="draft">Borrador</option>
                <option value="active">Activo</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Sección 2: Fecha y ubicación -->
        <div class="form-section">
          <h2><i class="bi bi-geo-alt"></i> Ubicación y fecha</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="location"><i class="bi bi-geo-alt"></i> Ubicación*</label>
              <input 
                type="text" 
                id="location" 
                v-model="event.location" 
                required
              >
            </div>

            <div class="form-group">
              <label for="event_date"><i class="bi bi-calendar-date"></i> Fecha y hora*</label>
              <input 
                type="datetime-local" 
                id="event_date" 
                v-model="formattedDateTime"
                required
              >
            </div>
          </div>
        </div>

        <!-- Sección 3: Entradas vendidas -->
        <div class="form-section" v-if="ticketsSold > 0">
          <h2><i class="bi bi-ticket-perforated"></i> Entradas vendidas</h2>
          <div class="sold-tickets">
            <div class="ticket-stats">
              <div class="stat-card">
                <h3>Total vendidas</h3>
                <p>{{ ticketsSold }}</p>
              </div>
              <div class="stat-card">
                <h3>Disponibles</h3>
                <p>{{ event.capacity - ticketsSold }}</p>
              </div>
              <div class="stat-card">
                <h3>Ingresos</h3>
                <p>${{ totalRevenue.toFixed(2) }}</p>
              </div>
            </div>

            <button 
              class="btn-view-tickets"
              @click="showTicketsModal = true"
            >
              <i class="bi bi-list-ul"></i> Ver listado completo
            </button>
          </div>
        </div>

        <!-- Sección 4: Cancelación -->
        <div class="form-section" v-if="event.status !== 'cancelled'">
          <h2><i class="bi bi-exclamation-octagon"></i> Cancelar evento</h2>
          <div class="cancel-warning">
            <p>Al cancelar el evento:</p>
            <ul>
              <li>Se notificará automáticamente a todos los compradores</li>
              <li>Se procesarán reembolsos si aplica</li>
              <li>No podrás reactivarlo después</li>
            </ul>
            <button 
              class="btn-cancel-event"
              @click="confirmCancelEvent"
            >
              <i class="bi bi-x-circle"></i> Cancelar Evento
            </button>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="form-actions">
          <button 
            class="btn-save"
            @click="saveChanges"
            :disabled="isSaving"
          >
            <span v-if="isSaving">
              <i class="bi bi-arrow-repeat spin"></i> Guardando...
            </span>
            <span v-else>
              <i class="bi bi-check-circle"></i> Guardar cambios
            </span>
          </button>

          <router-link 
            :to="`/EventosLis/${eventId}`" 
            class="btn-cancel"
          >
            <i class="bi bi-x-circle"></i> Descartar
          </router-link>
        </div>
      </div>
    </div>

    <!-- Modal de tickets vendidos -->
    <div v-if="showTicketsModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Entradas vendidas</h3>
          <button @click="showTicketsModal = false" class="modal-close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="tickets-table">
            <div class="table-header">
              <div>ID</div>
              <div>Comprador</div>
              <div>Asiento</div>
              <div>Precio</div>
              <div>Estado pago</div>
            </div>
            <div class="table-body">
              <div v-for="ticket in tickets" :key="ticket.id" class="table-row">
                <div>#{{ ticket.id }}</div>
                <div>{{ ticket.buyer_name || 'Anónimo' }}</div>
                <div>{{ ticket.seat_number || 'General' }}</div>
                <div>${{ ticket.price }}</div>
                <div :class="'status-' + ticket.payment_status">
                  {{ formatPaymentStatus(ticket.payment_status) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showTicketsModal = false" class="btn-close-modal">
            <i class="bi bi-check-lg"></i> Cerrar
          </button>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  name: 'EditarEvento',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const eventId = route.params.id;
    const event = ref(null);
    const tickets = ref([]);
    const isSaving = ref(false);
    const showTicketsModal = ref(false);

    // Datos de ejemplo (simulando API)
    const fetchEventData = async () => {
      // Simular llamada API para obtener el evento
      await new Promise(resolve => setTimeout(resolve, 500));
      event.value = {
        id: eventId,
        organizer_id: 1,
        title: 'Concierto de Jazz',
        description: 'Una noche de jazz con los mejores artistas locales',
        location: 'Teatro Principal, Ciudad',
        event_date: '2025-07-15T20:00:00',
        capacity: 200,
        status: 'active',
        created_at: '2025-06-01T10:00:00',
        updated_at: '2025-06-01T10:00:00'
      };

      // Simular llamada API para obtener tickets
      await new Promise(resolve => setTimeout(resolve, 300));
      tickets.value = [
        { id: 1, buyer_id: 2, buyer_name: 'Juan Pérez', seat_number: 'A12', price: 25.00, payment_status: 'completed' },
        { id: 2, buyer_id: 3, buyer_name: 'María Gómez', seat_number: 'B05', price: 25.00, payment_status: 'completed' },
        { id: 3, buyer_id: 4, buyer_name: 'Carlos Ruiz', seat_number: null, price: 20.00, payment_status: 'pending' }
      ];
    };

    // Computed properties
    const ticketsSold = computed(() => {
      return tickets.value.filter(t => t.payment_status === 'completed').length;
    });

    const totalRevenue = computed(() => {
      return tickets.value
        .filter(t => t.payment_status === 'completed')
        .reduce((sum, ticket) => sum + ticket.price, 0);
    });

    const formattedDateTime = computed({
      get() {
        if (!event.value) return '';
        return event.value.event_date.slice(0, 16);
      },
      set(value) {
        event.value.event_date = value + ':00';
      }
    });

    // Métodos
    const formatPaymentStatus = (status) => {
      const statusMap = {
        'completed': 'Completado',
        'pending': 'Pendiente',
        'refunded': 'Reembolsado',
        'failed': 'Fallido'
      };
      return statusMap[status] || status;
    };

    const saveChanges = async () => {
      isSaving.value = true;
      try {
        // Simular llamada API para guardar cambios
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        Swal.fire({
          title: '¡Cambios guardados!',
          text: 'El evento se ha actualizado correctamente',
          icon: 'success',
          confirmButtonColor: '#f5a623'
        }).then(() => {
          router.push(`/eventos/${eventId}`);
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron guardar los cambios',
          icon: 'error',
          confirmButtonColor: '#ff416c'
        });
      } finally {
        isSaving.value = false;
      }
    };

    const confirmCancelEvent = () => {
      Swal.fire({
        title: '¿Cancelar este evento?',
        html: `
          <p>Esta acción no se puede deshacer y se notificará a los <strong>${ticketsSold.value}</strong> compradores.</p>
          <p>¿Deseas continuar?</p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff416c',
        cancelButtonColor: '#f5a623',
        confirmButtonText: 'Sí, cancelar evento',
        cancelButtonText: 'No, mantener activo'
      }).then((result) => {
        if (result.isConfirmed) {
          cancelEvent();
        }
      });
    };

    const cancelEvent = async () => {
      try {
        // Simular llamada API para cancelar evento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Actualizar estado local
        event.value.status = 'cancelled';
        
        Swal.fire({
          title: 'Evento cancelado',
          text: 'Se han notificado a los compradores y procesado los reembolsos',
          icon: 'success',
          confirmButtonColor: '#f5a623'
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cancelar el evento',
          icon: 'error',
          confirmButtonColor: '#ff416c'
        });
      }
    };

    // Lifecycle hook
    onMounted(fetchEventData);

    return {
      eventId,
      event,
      tickets,
      ticketsSold,
      totalRevenue,
      formattedDateTime,
      isSaving,
      showTicketsModal,
      formatPaymentStatus,
      saveChanges,
      confirmCancelEvent
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

.edit-event-container {
  background: linear-gradient(120deg, #3C1053, #AD8BFF);
  min-height: 100vh;
  color: white;
}

.edit-event-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem;
}

.form-header {
  margin-bottom: 2rem;
}

.form-header h1 {
  font-size: 2.5rem;
  color: #f5a623;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.warning-message {
  color: #ffcc00;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 204, 0, 0.1);
  padding: 0.8rem;
  border-radius: 8px;
}

/* Formulario */
.form-container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  backdrop-filter: blur(5px);
}

.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-right: 1rem;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: #f5a623;
}

.form-group {
  margin-bottom: 1.5rem;
  margin-right: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 2px #f5a623;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group small.hint {
  display: block;
  margin-top: 0.3rem;
  font-size: 0.8rem;
  opacity: 0.7;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.form-row .form-group {
  flex: 1;
}

/* Entradas vendidas */
.sold-tickets {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1.5rem;
}

.ticket-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.stat-card h3 {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.stat-card p {
  font-size: 1.5rem;
  font-weight: bold;
}

.btn-view-tickets {
  background: rgba(245, 166, 35, 0.2);
  color: #f5a623;
  border: 1px solid #f5a623;
  border-radius: 30px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view-tickets:hover {
  background: rgba(245, 166, 35, 0.3);
}

/* Cancelación */
.cancel-warning {
  background: rgba(255, 65, 108, 0.1);
  border: 1px solid rgba(255, 65, 108, 0.3);
  border-radius: 10px;
  padding: 1.5rem;
}

.cancel-warning p {
  margin-bottom: 1rem;
  font-weight: 500;
}

.cancel-warning ul {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.cancel-warning li {
  margin-bottom: 0.5rem;
}

.btn-cancel-event {
  background: #ff416c;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.8rem 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel-event:hover {
  background: #e6375d;
}

/* Botones de acción */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-save {
  background: #f5a623;
  color: black;
  border: none;
  border-radius: 30px;
  padding: 0.8rem 2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:hover:not(:disabled) {
  background: #e69a1f;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-cancel {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 0.8rem 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: linear-gradient(135deg, #3C1053, #2a0a3d);
  border-radius: 15px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.5rem;
  color: #f5a623;
}

.modal-close {
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close:hover {
  color: #ff416c;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.tickets-table {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.table-header, .table-row {
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 120px;
  gap: 1rem;
  padding: 0.8rem 0;
  align-items: center;
}

.table-header {
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  background: #3C1053;
}

.table-body {
  max-height: 50vh;
  overflow-y: auto;
}

.table-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.status-completed {
  color: #4CAF50;
}

.status-pending {
  color: #FFC107;
}

.status-refunded {
  color: #9E9E9E;
}

.status-failed {
  color: #FF5252;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: flex-end;
}

.btn-close-modal {
  background: #f5a623;
  color: black;
  border: none;
  border-radius: 30px;
  padding: 0.6rem 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close-modal:hover {
  background: #e69a1f;
}

/* Responsive */
@media (max-width: 768px) {
  .edit-event-content {
    padding: 1rem;
  }

  .form-row {
    flex-direction: column;
    gap: 1rem;
  }

  .ticket-stats {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .table-header, .table-row {
    grid-template-columns: 60px 1fr 80px 80px 100px;
    font-size: 0.8rem;
    gap: 0.5rem;
  }
}
</style>