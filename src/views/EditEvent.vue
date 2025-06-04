<!-- src/views/EditEvent.vue -->
<template>
  <div class="edit-event-container">
    <!-- Navbar -->
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
      </div>

      <!-- Formulario -->
      <div class="form-container">
        <!-- Información básica -->
        <div class="form-section">
          <h2><i class="bi bi-info-circle"></i> Información básica</h2>
          <div class="form-group">
            <label for="title"><i class="bi bi-card-heading"></i> Título*</label>
            <input 
              type="text" 
              id="title" 
              v-model="event.title" 
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
                required
              >
            </div>
            <div class="form-group">
              <label><i class="bi bi-tags"></i> Estado*</label>
              <select v-model="event.status" required>
                <option value="borrador">Borrador</option>
                <option value="activo">Activo</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Fecha y ubicación -->
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

        <!-- Cancelación -->
        <div class="form-section" v-if="event.status !== 'cancelado'">
          <h2><i class="bi bi-exclamation-octagon"></i> Cancelar evento</h2>
          <div class="cancel-warning">
            <p>Al cancelar el evento:</p>
            <ul>
              <li>No podrás reactivarlo.</li>
            </ul>
            <button class="btn-cancel-event" @click="confirmCancelEvent">
              <i class="bi bi-x-circle"></i> Cancelar Evento
            </button>
          </div>
        </div>

        <!-- Acciones -->
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
          <router-link :to="`/EventosLis/${eventId}`" class="btn-cancel">
            <i class="bi bi-x-circle"></i> Descartar
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  name: 'EditEvent',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const eventId = route.params.id;
    const event = ref(null);
    const isSaving = ref(false);

    // Cargar datos del evento
    const fetchEventData = async () => {
      try {
        const eventResponse = await fetch(`http://localhost:8081/events/${eventId}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (!eventResponse.ok) throw new Error('Error al cargar el evento');
        const eventData = await eventResponse.json();

        // Normalizar fecha
        if (eventData.eventDate) {
          let parsedDate;
          if (eventData.eventDate.includes('T')) {
            parsedDate = new Date(eventData.eventDate);
          } else {
            parsedDate = new Date(eventData.eventDate.replace(' ', 'T') + 'Z');
          }
          if (isNaN(parsedDate)) throw new Error('Formato de fecha inválido');
          eventData.eventDate = parsedDate.toISOString();
        }
        event.value = {
          id: eventData.id,
          organizer_id: eventData.organizerId,
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          event_date: eventData.eventDate,
          capacity: eventData.capacity,
          status: eventData.status
        };
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los datos',
          icon: 'error',
          confirmButtonColor: '#ff416c'
        }).then(() => router.push('/EventosLis'));
      }
    };

    // Manejo de fecha
    const formattedDateTime = computed({
      get() {
        if (!event.value?.event_date) return '';
        const date = new Date(event.value.event_date);
        if (isNaN(date)) return '';
        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return localDate.toISOString().slice(0, 16);
      },
      set(value) {
        if (!value) return;
        const localDate = new Date(value + ':00');
        if (!isNaN(localDate)) {
          event.value.event_date = localDate.toISOString();
        }
      }
    });

    // Métodos
    const saveChanges = async () => {
      if (!event.value?.title || !event.value.description || !event.value.location || 
          !event.value.event_date || !event.value.capacity || !event.value.status) {
        Swal.fire({
          title: 'Error',
          text: 'Completa todos los campos obligatorios',
          icon: 'error',
          confirmButtonColor: '#ff416c'
        });
        return;
      }

      isSaving.value = true;
      try {
        const response = await fetch(`http://localhost:8081/events/${eventId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            id: event.value.id,
            organizerId: event.value.organizer_id,
            title: event.value.title,
            description: event.value.description,
            location: event.value.location,
            eventDate: event.value.event_date,
            capacity: event.value.capacity,
            status: event.value.status
          })
        });

        if (!response.ok) throw new Error('Error al guardar los cambios');
        const updatedEvent = await response.json();

        // Normalizar fecha devuelta
        if (updatedEvent.eventDate) {
          let parsedDate;
          if (updatedEvent.eventDate.includes('T')) {
            parsedDate = new Date(updatedEvent.eventDate);
          } else {
            parsedDate = new Date(updatedEvent.eventDate.replace(' ', 'T') + 'Z');
          }
          if (!isNaN(parsedDate)) updatedEvent.eventDate = parsedDate.toISOString();
        }
        event.value = {
          id: updatedEvent.id,
          organizer_id: updatedEvent.organizerId,
          title: updatedEvent.title,
          description: updatedEvent.description,
          location: updatedEvent.location,
          event_date: updatedEvent.eventDate,
          capacity: updatedEvent.capacity,
          status: updatedEvent.status
        };

        Swal.fire({
          title: '¡Éxito!',
          text: 'Evento actualizado correctamente',
          icon: 'success',
          confirmButtonColor: '#f5a623'
        }).then(() => router.push(`/EventosLis/${eventId}`));
      } catch (error) {
        console.error('Error:', error);
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
        title: '¿Cancelar evento?',
        text: 'Esta acción es irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff416c',
        cancelButtonColor: '#f5a623',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, mantener'
      }).then((result) => {
        if (result.isConfirmed) cancelEvent();
      });
    };

    const cancelEvent = async () => {
      try {
        const response = await fetch(`http://localhost:8081/events/${eventId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            id: event.value.id,
            organizerId: event.value.organizer_id,
            title: event.value.title,
            description: event.value.description,
            location: event.value.location,
            eventDate: event.value.event_date,
            capacity: event.value.capacity,
            status: 'cancelado'
          })
        });

        if (!response.ok) throw new Error('Error al cancelar el evento');
        event.value.status = 'cancelado';

        Swal.fire({
          title: 'Cancelado',
          text: 'Evento cancelado correctamente',
          icon: 'success',
          confirmButtonColor: '#f5a623'
        });
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cancelar el evento',
          icon: 'error',
          confirmButtonColor: '#ff416c'
        });
      }
    };

    // Cargar datos al montar
    onMounted(fetchEventData);

    return {
      eventId,
      event,
      formattedDateTime,
      isSaving,
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
.table-header, .table-ticket {
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 120px;
  gap: 1rem;
  padding: 0.25rem;
  align-items: center;
}
.table-header {
  font-weight: bold;
  border-bottom: 1px solid rgba(255, 0, 255, 0.2);
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
  color: #00ff00; /* Verde brillante */
}
.status-pending {
  color: #FFFF00;
}
.status-refunded {
  color: #999999; /* Gris oscuro */
}
.status-failed {
  color: #FF0000; /* Rojo brillante */
}
.modal-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.0);
  display: flex;
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
@media (max-width: 768px) {
  .edit-event-content {
    padding: 2rem;
  }
  .form-row {
    flex-direction: row;
    gap: 1rem;
  }
  .ticket-stats {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  .table-header, .table-ticket {
    grid-template-columns: 60px 1fr 80px 80px 100px;
}
}
</style>