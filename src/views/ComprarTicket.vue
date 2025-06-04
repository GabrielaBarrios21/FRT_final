<template>
  <div class="comprar-container">
    <div class="grid-container">
      <!-- Columna izquierda: Detalles del evento -->
      <div class="info-panel">
        <h2>{{ evento.title || 'Cargando...' }}</h2>
        <p><strong>Ubicación:</strong> {{ evento.location || 'N/A' }}</p>
        <p><strong>Fecha:</strong> {{ formatoFecha(evento.eventDate) }}</p>
        <p><strong>Precio:</strong> ${{ evento.price || 'N/A' }}</p>

        <label><strong>Tipo de entrada:</strong></label>
        <select v-model="tipoEntrada" class="input-select">
          <option value="general">General</option>
          <option value="numerada">Numerada</option>
        </select>

        <label><strong>Cantidad:</strong></label>
        <input type="number" v-model.number="cantidad" min="1" max="10" class="input-select" />
      </div>

      <!-- Columna derecha: Mapa de asientos -->
      <div class="asientos-panel" v-if="tipoEntrada === 'numerada'">
        <div class="escenario">ESCENARIO</div>

        <div class="asientos-grid">
          <div
            v-for="asiento in asientos"
            :key="asiento.codigo"
            :class="[
              'asiento',
              asiento.ocupado ? 'ocupado' : '',
              asientosSeleccionados.includes(asiento.codigo) ? 'seleccionado' : ''
            ]"
            @click="seleccionarAsiento(asiento)"
          >
            {{ asiento.codigo }}
          </div>
        </div>

        <!-- Asientos seleccionados -->
        <center>
          <div class="seleccionados-container" v-if="asientosSeleccionados.length">
            <h4>Asientos seleccionados:</h4>
            <div class="chips">
              <span class="chip" v-for="(asiento, index) in asientosSeleccionados" :key="index">
                {{ asiento }}
              </span>
            </div>
          </div>
        </center>
      </div>
    </div>

    <!-- Mensaje de estado del botón -->
    <div v-if="botonDeshabilitado" class="mensaje-error">
      {{ mensajeBotonDeshabilitado }}
    </div>

    <!-- Botón de compra -->
    <button class="btn-comprar" @click="realizarCompra" :disabled="botonDeshabilitado">
      Comprar ahora
    </button>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';

export default {
  name: 'Comprar',
  setup() {
    const evento = ref({});
    const tipoEntrada = ref('numerada');
    const cantidad = ref(1); // Cambié el valor por defecto a 1 para evitar problemas iniciales
    const asientos = ref([]);
    const asientosSeleccionados = ref([]);
    const route = useRoute();
    const router = useRouter();
    const buyerId = 1; // ID estático del comprador

    // Obtener datos del evento
    const fetchEvento = async () => {
      const id = route.params.id;
      try {
        const response = await fetch(`http://localhost:8081/events/${id}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error(`Error ${response.status}: No se pudo cargar el evento`);
        const data = await response.json();
        evento.value = {
          id: data.id,
          organizerId: data.organizerId,
          title: data.title,
          description: data.description || 'Sin descripción',
          location: data.location || 'N/A',
          eventDate: data.eventDate.includes('T')
            ? new Date(data.eventDate).toISOString()
            : new Date(data.eventDate.replace(' ', 'T') + 'Z').toISOString(),
          capacity: data.capacity || 0,
          status: data.status || 'N/A',
          price: data.price || 120.0 // Valor por defecto
        };
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el evento. Verifica el ID o la conexión con el servidor.',
          confirmButtonColor: '#ff416c'
        });
      }
    };

    // Obtener asientos ocupados desde la API
    const fetchAsientosOcupados = async () => {
      const id = route.params.id;
      try {
        const response = await fetch(`http://localhost:8082/tickets/event/${id}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Error al cargar asientos ocupados');
        const tickets = await response.json();
        return tickets.map(ticket => ticket.seatNumber);
      } catch (error) {
        console.error('Error:', error);
        return [];
      }
    };

    // Generar asientos
    const generarAsientos = async () => {
      const filas = 'ABCDEFGHIJ'.split('');
      const columnas = 18;
      const ocupados = await fetchAsientosOcupados();

      asientos.value = [];
      for (let fila of filas) {
        for (let col = 1; col <= columnas; col++) {
          const codigo = `${fila}${col}`;
          asientos.value.push({
            codigo,
            ocupado: ocupados.includes(codigo)
          });
        }
      }
    };

    // Formatear fecha
    const formatoFecha = (fecha) => {
      if (!fecha) return 'Sin fecha';
      const date = new Date(fecha);
      if (isNaN(date)) return 'Fecha inválida';
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).replace(',', '');
    };

    // Seleccionar asiento
    const seleccionarAsiento = (asiento) => {
      if (asiento.ocupado) return;
      const index = asientosSeleccionados.value.indexOf(asiento.codigo);
      if (index >= 0) {
        asientosSeleccionados.value.splice(index, 1);
      } else {
        if (asientosSeleccionados.value.length === cantidad.value) {
          asientosSeleccionados.value.shift();
        }
        asientosSeleccionados.value.push(asiento.codigo);
      }
      // Depuración
      console.log('Asientos seleccionados:', asientosSeleccionados.value);
      console.log('Cantidad:', cantidad.value);
    };

    // Mostrar error
    const mostrarError = (mensaje) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: mensaje
      });
    };

    // Mostrar éxito
    const mostrarExito = () => {
      Swal.fire({
        icon: 'success',
        title: '¡Compra realizada con éxito!',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        willClose: () => {
          router.push('/eventos');
        }
      });
    };

    // Realizar compra
    const realizarCompra = async () => {
      if (!cantidad.value || cantidad.value < 1) {
        mostrarError('Por favor, ingresa una cantidad válida de entradas.');
        return;
      }

      if (tipoEntrada.value === 'numerada') {
        if (asientosSeleccionados.value.length !== cantidad.value) {
          mostrarError(`Debes seleccionar exactamente ${cantidad.value} asiento(s).`);
          return;
        }
      } else if (tipoEntrada.value === 'general') {
        if (cantidad.value > 10) {
          mostrarError('No puedes comprar más de 10 entradas generales.');
          return;
        }
      }

      // Enviar solicitud POST a /tickets
      try {
        const tickets = tipoEntrada.value === 'numerada'
          ? asientosSeleccionados.value.map(seat => ({
              eventId: evento.value.id,
              buyerId,
              seatNumber: seat,
              price: evento.value.price,
              status: 'CONFIRMED',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }))
          : Array.from({ length: cantidad.value }, () => ({
              eventId: evento.value.id,
              buyerId,
              seatNumber: 'General',
              price: evento.value.price,
              status: 'CONFIRMED',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }));

        for (const ticket of tickets) {
          const response = await fetch('http://localhost:8082/tickets', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(ticket)
          });
          if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo registrar el ticket`);
          }
        }

        mostrarExito();
      } catch (error) {
        console.error('Error:', error);
        mostrarError('No se pudo completar la compra. Intenta de nuevo.');
      }
    };

    // Computado para deshabilitar botón
    const botonDeshabilitado = computed(() => {
      if (!cantidad.value || isNaN(cantidad.value)) {
        return true;
      }
      if (tipoEntrada.value === 'numerada') {
        return asientosSeleccionados.value.length !== cantidad.value;
      }
      return cantidad.value < 1;
    });

    // Mensaje para explicar por qué el botón está deshabilitado
    const mensajeBotonDeshabilitado = computed(() => {
      if (!cantidad.value || isNaN(cantidad.value)) {
        return 'Por favor, ingresa una cantidad válida.';
      }
      if (tipoEntrada.value === 'numerada') {
        if (asientosSeleccionados.value.length < cantidad.value) {
          return `Selecciona ${cantidad.value - asientosSeleccionados.value.length} asiento(s) más.`;
        }
        if (asientosSeleccionados.value.length > cantidad.value) {
          return `Has seleccionado demasiados asientos. Selecciona solo ${cantidad.value}.`;
        }
      }
      if (cantidad.value < 1) {
        return 'La cantidad debe ser al menos 1.';
      }
      return '';
    });

    // Cargar evento y asientos al montar
    onMounted(async () => {
      await fetchEvento();
      await generarAsientos();
    });

    return {
      evento,
      tipoEntrada,
      cantidad,
      asientos,
      asientosSeleccionados,
      formatoFecha,
      seleccionarAsiento,
      realizarCompra,
      botonDeshabilitado,
      mensajeBotonDeshabilitado
    };
  }
};
</script>
<style scoped>
.comprar-container {
  padding: 50px 30px;
  color: white;
  background: #1f1f1f;
}

.grid-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.info-panel {
  flex: 1;
  min-width: 320px;
  background: #333333;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.info-panel h2 {
  color: #ffd166;
  font-size: 1.8rem;
  margin-bottom: 15px;
}

.info-panel p,
label {
  margin-bottom: 10px;
  display: block;
}

.input-select {
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
}

.asientos-panel {
  flex: 2;
  min-width: 720px;
  min-height: auto;
}

.escenario {
  background-color: #ff416c;
  color: white;
  text-align: center;
  padding: 12px;
  font-weight: bold;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.asientos-grid {
  display: grid;
  grid-template-columns: repeat(18, 1fr);
  gap: 5px;
  margin-bottom: 15px;
}

.asiento {
  background-color: #1e90ff;
  padding: 6px 0;
  font-size: 10px;
  border-radius: 5px;
  color: white;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
}

.asiento:hover:not(.ocupado):not(.seleccionado) {
  background-color: #0077cc;
}

.asiento.ocupado {
  background-color: #e74c3c;
  cursor: not-allowed;
}

.asiento.seleccionado {
  background-color: #2ecc71;
}

.seleccionados-container {
  margin-top: 20px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.chip {
  background-color: #2ecc71;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  color: black;
  font-weight: bold;
}

.btn-comprar {
  margin-top: 30px;
  background-color: #f5a623;
  color: black;
  font-weight: bold;
  padding: 14px 32px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-comprar:hover {
  background-color: #ff416c;
  transform: scale(1.05);
}

.btn-comprar:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>