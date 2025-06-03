<!-- src/views/Eventos.vue -->
<template>
  <div class="eventos-container">
    <h2 class="titulo-seccion">Eventos disponibles</h2>
    <div class="eventos-lista" v-if="eventos.length > 0">
      <div v-for="evento in eventos" :key="evento.id" class="evento-card animate__animated animate__fadeInUp">
        <h3 class="evento-titulo">{{ evento.title }}</h3>
        <p class="evento-descripcion">{{ evento.description }}</p>
        <p><i class="bi bi-calendar-event"></i> <strong>Fecha:</strong> {{ formatoFecha(evento.eventDate) }}</p>
        <p><i class="bi bi-geo-alt-fill"></i> <strong>Lugar:</strong> {{ evento.location }}</p>
        <p><i class="bi bi-people-fill"></i> <strong>Capacidad:</strong> {{ evento.capacity }}</p>
        <router-link :to="`/ComprarTicket/${evento.id}`" class="btn-comprar">
          <i class="bi bi-ticket-perforated-fill"></i> Comprar entradas
        </router-link>
      </div>
    </div>
    <p v-else class="sin-eventos">No hay eventos disponibles en este momento.</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

export default {
  name: 'Eventos',
  setup() {
    const eventos = ref([]);

    // Cargar eventos desde el backend
    const fetchEventos = async () => {
      try {
        const response = await fetch('http://localhost:8081/events', {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('Error al cargar los eventos');
        const data = await response.json();

        // Filtrar eventos activos y normalizar fechas
        eventos.value = data
          .filter(evento => evento.status === 'activo')
          .map(evento => ({
            id: evento.id,
            title: evento.title,
            description: evento.description,
            eventDate: evento.eventDate.includes('T')
              ? new Date(evento.eventDate).toISOString()
              : new Date(evento.eventDate.replace(' ', 'T') + 'Z').toISOString(),
            location: evento.location,
            capacity: evento.capacity,
            status: evento.status
          }));
      } catch (error) {
        console.error('Error:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los eventos',
          icon: 'error',
          confirmButtonColor: '#ff416c'
        });
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

    // Cargar eventos al montar
    onMounted(fetchEventos);

    return {
      eventos,
      formatoFecha
    };
  }
};
</script>

<style scoped>
.eventos-container {
  padding: 60px 30px;
  color: white;
  min-height: 100vh;
}

.titulo-seccion {
  font-size: 2.8rem;
  margin-bottom: 40px;
  text-align: center;
  color: #f5a623;
  font-weight: bold;
}

.eventos-lista {
  display: grid;
  gap: 40px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.evento-card {
  background: #333333; /* Fondo sólido más oscuro para evitar transparencias */
  border: 1px solid rgba(255, 255, 255, 0.15); /* Borde más sutil */
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Sombra más suave */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.evento-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3); /* Sombra más ligera al hacer hover */
}

.evento-titulo {
  color: #ffda79;
  font-size: 1.7rem;
  margin-bottom: 10px;
}

.evento-descripcion {
  font-size: 1rem;
  margin-bottom: 15px;
  color: #ddd;
}

.evento-card p {
  margin: 6px 0;
  font-size: 0.95rem;
}

.evento-card i {
  color: #f5a623;
  margin-right: 5px;
}

.btn-comprar {
  display: inline-block;
  margin-top: 20px;
  background: linear-gradient(45deg, #f5a623, #ff416c);
  color: black;
  font-weight: bold;
  padding: 12px 25px;
  border-radius: 30px;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-comprar:hover {
  transform: scale(1.07);
  background: linear-gradient(45deg, #ff416c, #f5a623);
}

.sin-eventos {
  text-align: center;
  font-size: 1.2rem;
  color: #aaa;
}
</style>