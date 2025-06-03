<template>
  <div class="create-event-container">
    <!-- Navbar (reutilizado) -->
    <div class="navbar-container">
      <div class="brand">
        <i class="bi bi-lightning-charge-fill"></i>
        <span style="color: #f5a623;">Fast</span><span style="color: white;">Events</span>
      </div>
      <div class="navbar">
        <router-link to="/OrgHome" class="nav-item"><i class="bi bi-arrow-left"></i> Volver</router-link>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="create-event-content">
      <div class="form-header">
        <h1><i class="bi bi-plus-circle"></i> Crear Nuevo Evento</h1>
        <p>Completa los detalles para publicar tu evento en la plataforma.</p>
      </div>

      <!-- Formulario en pasos (stepper) -->
      <div class="form-stepper">
        <div class="stepper-progress">
          <div 
            v-for="(step, index) in steps" 
            :key="index" 
            :class="{ 'active': currentStep === index, 'completed': currentStep > index }"
            @click="setStep(index)"
          >
            <span class="step-number">{{ index + 1 }}</span>
            <span class="step-label">{{ step.label }}</span>
          </div>
        </div>

        <!-- Paso 1: Información básica -->
        <div v-if="currentStep === 0" class="form-step">
          <div class="form-group">
            <label for="title"><i class="bi bi-card-heading"></i> Título del evento*</label>
            <input 
              type="text" 
              id="title" 
              v-model="event.title" 
              placeholder="Ej: Concierto de Jazz" 
              required
            >
          </div>

          <div class="form-group">
            <label for="description"><i class="bi bi-text-paragraph"></i> Descripción*</label>
            <textarea 
              id="description" 
              v-model="event.description" 
              rows="4"
              placeholder="Describe el evento, artistas invitados, etc."
              required
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="category"><i class="bi bi-tags"></i> Categoría*</label>
              <select id="category" v-model="event.category" required>
                <option value="">Seleccionar...</option>
                <option value="concierto">Concierto</option>
                <option value="teatro">Teatro</option>
                <option value="deporte">Deporte</option>
                <option value="conferencia">Conferencia</option>
              </select>
            </div>

            <div class="form-group">
              <label for="capacity"><i class="bi bi-people"></i> Capacidad*</label>
              <input 
                type="number" 
                id="capacity" 
                v-model.number="event.capacity" 
                min="1" 
                placeholder="Ej: 100" 
                required
              >
            </div>
          </div>
        </div>

        <!-- Paso 2: Fecha y ubicación -->
        <div v-if="currentStep === 1" class="form-step">
          <div class="form-row">
            <div class="form-group">
              <label for="date"><i class="bi bi-calendar-date"></i> Fecha del evento*</label>
              <input 
                type="date" 
                id="date" 
                v-model="event.date" 
                :min="new Date().toISOString().split('T')[0]" 
                required
              >
            </div>

            <div class="form-group">
              <label for="time"><i class="bi bi-clock"></i> Hora*</label>
              <input 
                type="time" 
                id="time" 
                v-model="event.time" 
                required
              >
            </div>
          </div>

          <div class="form-group">
            <label for="location"><i class="bi bi-geo-alt"></i> Ubicación*</label>
            <input 
              type="text" 
              id="location" 
              v-model="event.location" 
              placeholder="Dirección o enlace virtual" 
              required
            >
          </div>

          <div class="form-group">
            <label><i class="bi bi-globe"></i> Tipo de ubicación</label>
            <div class="radio-group">
              <label>
                <input 
                  type="radio" 
                  v-model="event.locationType" 
                  value="presencial" 
                  checked
                > Presencial
              </label>
              <label>
                <input 
                  type="radio" 
                  v-model="event.locationType" 
                  value="virtual"
                > Virtual
              </label>
            </div>
          </div>
        </div>

        <!-- Paso 3: Entradas -->
        <div v-if="currentStep === 2" class="form-step">
          <div class="form-group">
            <label for="ticketType"><i class="bi bi-ticket-perforated"></i> Tipo de entrada*</label>
            <select 
              id="ticketType" 
              v-model="event.ticketType" 
              @change="event.seatMap = null"
              required
            >
              <option value="general">General (sin asiento asignado)</option>
              <option value="numerada">Numerada (con asiento asignado)</option>
            </select>
          </div>

          <!-- Mapa de asientos (solo para entradas numeradas) -->
          <div v-if="event.ticketType === 'numerada'" class="seat-map-container">
            <h3><i class="bi bi-grid"></i> Configurar mapa de asientos</h3>
            <div class="seat-map-preview">
              <div 
                v-for="(row, rowIndex) in seatMapPreview" 
                :key="rowIndex" 
                class="seat-row"
              >
                <span class="row-label">Fila {{ String.fromCharCode(65 + rowIndex) }}</span>
                <div 
                  v-for="(seat, seatIndex) in row" 
                  :key="seatIndex" 
                  class="seat"
                  :class="{ 'selected': seat }"
                  @click="toggleSeat(rowIndex, seatIndex)"
                >
                  {{ seatIndex + 1 }}
                </div>
              </div>
            </div>
            <div class="seat-map-controls">
              <div class="form-group small">
                <label>Filas</label>
                <input 
                  type="number" 
                  v-model.number="seatConfig.rows" 
                  min="1" 
                  max="10"
                  @change="generateSeatPreview"
                >
              </div>
              <div class="form-group small">
                <label>Asientos por fila</label>
                <input 
                  type="number" 
                  v-model.number="seatConfig.seatsPerRow" 
                  min="1" 
                  max="20"
                  @change="generateSeatPreview"
                >
              </div>
            </div>
          </div>

          <!-- Precios -->
          <div class="form-group">
            <label for="price"><i class="bi bi-cash-stack"></i> Precio por entrada ($)*</label>
            <input 
              type="number" 
              id="price" 
              v-model.number="event.price" 
              min="0" 
              step="0.01" 
              required
            >
          </div>
        </div>

        <!-- Paso 4: Imágenes y confirmación -->
        <div v-if="currentStep === 3" class="form-step">
          <div class="form-group">
            <label><i class="bi bi-image"></i> Imágenes del evento</label>
            <div class="image-uploader">
              <label for="imageUpload" class="upload-area">
                <i class="bi bi-cloud-arrow-up"></i>
                <span>Arrastra imágenes o haz clic para seleccionar</span>
                <input 
                  type="file" 
                  id="imageUpload" 
                  accept="image/*" 
                  multiple 
                  @change="handleImageUpload"
                  hidden
                >
              </label>
              <div v-if="event.images.length > 0" class="image-preview">
                <div 
                  v-for="(image, index) in event.images" 
                  :key="index" 
                  class="preview-item"
                >
                  <img :src="image.preview" alt="Preview">
                  <button @click="removeImage(index)" class="remove-btn">
                    <i class="bi bi-x-circle"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen del evento -->
          <div class="event-summary">
            <h3><i class="bi bi-check-circle"></i> Resumen del evento</h3>
            <div class="summary-item">
              <span class="label">Título:</span>
              <span class="value">{{ event.title || 'No especificado' }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Fecha y hora:</span>
              <span class="value">{{ formatDateTime() || 'No especificado' }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Ubicación:</span>
              <span class="value">{{ event.location || 'No especificada' }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Capacidad:</span>
              <span class="value">{{ event.capacity || '0' }} asistentes</span>
            </div>
            <div class="summary-item">
              <span class="label">Tipo de entrada:</span>
              <span class="value">{{ event.ticketType === 'numerada' ? 'Numerada' : 'General' }}</span>
            </div>
          </div>
        </div>

        <!-- Controles de navegación -->
        <div class="form-navigation">
          <button 
            v-if="currentStep > 0" 
            @click="prevStep" 
            class="nav-btn secondary"
          >
            <i class="bi bi-chevron-left"></i> Anterior
          </button>
          <button 
            v-if="currentStep < steps.length - 1" 
            @click="nextStep" 
            class="nav-btn primary"
            :disabled="!isStepValid"
          >
            Siguiente <i class="bi bi-chevron-right"></i>
          </button>
          <button 
            v-if="currentStep === steps.length - 1" 
            @click="submitEvent" 
            class="nav-btn success"
            :disabled="!isFormValid"
          >
            <i class="bi bi-check-lg"></i> Publicar Evento
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

export default {
  name: 'CrearEvento',
  setup() {
    const router = useRouter();
    const currentStep = ref(0);
    const steps = [
      { label: 'Información', validator: validateStep1 },
      { label: 'Fecha/Lugar', validator: validateStep2 },
      { label: 'Entradas', validator: validateStep3 },
      { label: 'Confirmación', validator: validateStep4 }
    ];

    // Datos del evento
    const event = ref({
      title: '',
      description: '',
      category: '',
      capacity: null,
      date: '',
      time: '',
      location: '',
      locationType: 'presencial',
      ticketType: 'general',
      price: null,
      images: [],
      seatMap: null
    });

    // Configuración de asientos
    const seatConfig = ref({
      rows: 5,
      seatsPerRow: 10
    });

    const seatMapPreview = ref([]);

    // Generar preview del mapa de asientos
    const generateSeatPreview = () => {
      seatMapPreview.value = Array.from({ length: seatConfig.value.rows }, () => 
        Array(seatConfig.value.seatsPerRow).fill(false)
      );
    };

    // Toggle para selección de asientos
    const toggleSeat = (rowIndex, seatIndex) => {
      seatMapPreview.value[rowIndex][seatIndex] = !seatMapPreview.value[rowIndex][seatIndex];
    };

    // Subida de imágenes
    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          event.value.images.push({
            file,
            preview: reader.result
          });
        };
        reader.readAsDataURL(file);
      });
    };

    // Eliminar imagen
    const removeImage = (index) => {
      event.value.images.splice(index, 1);
    };

    // Validadores por paso
    function validateStep1() {
      return event.value.title && event.value.description && event.value.category && event.value.capacity > 0;
    }

    function validateStep2() {
      return event.value.date && event.value.time && event.value.location;
    }

    function validateStep3() {
      return event.value.price !== null && event.value.price >= 0;
    }

    function validateStep4() {
      return true; // Todos los campos ya fueron validados
    }

    // Navegación entre pasos
    const nextStep = () => {
      if (steps[currentStep.value].validator()) {
        if (currentStep.value === 2 && event.value.ticketType === 'numerada') {
          event.value.seatMap = seatMapPreview.value;
        }
        currentStep.value++;
      } else {
        Swal.fire({
          title: 'Campos incompletos',
          text: 'Por favor completa todos los campos requeridos',
          icon: 'warning',
          confirmButtonColor: '#f5a623'
        });
      }
    };

    const prevStep = () => {
      currentStep.value--;
    };

    const setStep = (index) => {
      if (index < currentStep.value) {
        currentStep.value = index;
      }
    };

    // Formatear fecha para el resumen
    const formatDateTime = () => {
      if (!event.value.date || !event.value.time) return '';
      const date = new Date(`${event.value.date}T${event.value.time}`);
      return date.toLocaleString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // Enviar formulario
    const submitEvent = async () => {
      try {
        // Aquí iría la llamada a tu API
        const formData = new FormData();
        Object.keys(event.value).forEach(key => {
          if (key !== 'images') {
            formData.append(key, event.value[key]);
          }
        });
        event.value.images.forEach((img, index) => {
          formData.append(`images[${index}]`, img.file);
        });

        // Simulación de éxito
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        Swal.fire({
          title: '¡Evento creado!',
          text: 'Tu evento ha sido publicado exitosamente',
          icon: 'success',
          confirmButtonColor: '#f5a623'
        }).then(() => {
          router.push('/OrgHome');
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al crear el evento',
          icon: 'error',
          confirmButtonColor: '#ff416c'
        });
      }
    };

    // Computed properties
    const isStepValid = computed(() => steps[currentStep.value].validator());
    const isFormValid = computed(() => steps.every(step => step.validator()));

    // Inicializar preview de asientos
    generateSeatPreview();

    return {
      currentStep,
      steps,
      event,
      seatConfig,
      seatMapPreview,
      isStepValid,
      isFormValid,
      generateSeatPreview,
      toggleSeat,
      handleImageUpload,
      removeImage,
      nextStep,
      prevStep,
      setStep,
      formatDateTime,
      submitEvent
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

.create-event-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h1 {
  font-size: 2.5rem;
  color: #f5a623;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.form-header p {
  opacity: 0.8;
  font-size: 1.1rem;
}

/* Stepper */
.form-stepper {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 3rem;
  backdrop-filter: blur(5px);
}

.stepper-progress {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  position: relative;
}

.stepper-progress::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 1;
}

.stepper-progress > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  cursor: pointer;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.step-label {
  font-size: 0.9rem;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.stepper-progress > div.active .step-number {
  background: #f5a623;
  color: black;
  font-weight: bold;
}

.stepper-progress > div.active .step-label,
.stepper-progress > div.completed .step-label {
  opacity: 1;
}

.stepper-progress > div.completed .step-number {
  background: #4CAF50;
  color: white;
}

/* Formulario */
.form-step {
  min-height: 400px;
}

.form-group {
  margin-bottom: 1.5rem;
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
  background: rgba(49, 6, 6, 0.1);
  color: white;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 2px #f5a623;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.form-row .form-group {
  flex: 1;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.radio-group label:hover {
  opacity: 1;
}

/* Mapa de asientos */
.seat-map-container {
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.seat-map-preview {
  margin: 1rem 0;
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.seat-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.row-label {
  width: 80px;
  font-size: 0.8rem;
  opacity: 0.7;
}

.seat {
  width: 30px;
  height: 30px;
  margin-right: 5px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.seat:hover {
  background: rgba(255, 255, 255, 0.3);
}

.seat.selected {
  background: #f5a623;
  color: black;
  font-weight: bold;
}

.seat-map-controls {
  display: flex;
  gap: 1rem;
}

.form-group.small {
  flex: 1;
}

.form-group.small input {
  padding: 0.5rem;
}

/* Subida de imágenes */
.image-uploader {
  margin-top: 1rem;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #f5a623;
  background: rgba(245, 166, 35, 0.1);
}

.upload-area i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #f5a623;
}

.upload-area span {
  text-align: center;
  opacity: 0.8;
}

.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.preview-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  background: rgba(255, 65, 108, 0.8);
  border: none;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Resumen del evento */
.event-summary {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.event-summary h3 {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f5a623;
}

.summary-item {
  display: flex;
  margin-bottom: 0.8rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-item .label {
  flex: 0 0 120px;
  font-weight: 500;
  opacity: 0.8;
}

.summary-item .value {
  flex: 1;
}

/* Navegación */
.form-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  border: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn i {
  font-size: 1.1rem;
}

.primary {
  background: #f5a623;
  color: black;
}

.secondary {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.success {
  background: #4CAF50;
  color: white;
}

.nav-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .create-event-content {
    padding: 1rem;
  }

  .form-row {
    flex-direction: column;
    gap: 1rem;
  }

  .stepper-progress {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .stepper-progress > div {
    flex: 1;
  }

  .step-label {
    font-size: 0.7rem;
  }
}
</style>