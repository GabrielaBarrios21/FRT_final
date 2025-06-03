<template>
    <h2 class="titulo-seccion">Eventos disponibles</h2>
    <div class="eventos-lista">
      <div v-for="evento in eventos" :key="evento.id" class="evento-card animate__animated animate__fadeInUp">
        <h3 class="evento-titulo">{{ evento.title }}</h3>
        <p class="evento-descripcion">{{ evento.description }}</p>
        <p><i class="bi bi-calendar-event"></i> <strong>Fecha:</strong> {{ formatoFecha(evento.event_date) }}</p>
        <p><i class="bi bi-geo-alt-fill"></i> <strong>Lugar:</strong> {{ evento.location }}</p>
        <p><i class="bi bi-people-fill"></i> <strong>Capacidad:</strong> {{ evento.capacity }}</p>
        <router-link :to="`/ComprarTicket`" class="btn-comprar">
          <i class="bi bi-ticket-perforated-fill"></i> Comprar entradas
        </router-link>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Eventos',
  data() {
    return {
      eventos: [
        {
          id: 1,
          title: "Concierto Rock 2025",
          description: "Una noche llena de música y energía.",
          event_date: "2025-07-15T20:00:00",
          location: "Auditorio Nacional",
          capacity: 500,
        },
        {
          id: 2,
          title: "Obra de Teatro - Hamlet",
          description: "La clásica tragedia de Shakespeare.",
          event_date: "2025-08-10T19:00:00",
          location: "Teatro Principal",
          capacity: 300,
        }
      ]
    }
  },
  methods: {
    formatoFecha(fecha) {
      return new Date(fecha).toLocaleString();
    }
  }
}
</script>

<style scoped>
.eventos-container {
  padding: 60px 30px;
  background: linear-gradient(135deg, #1f1f1f 0%, #2c2c2c 100%);
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
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 25px;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.evento-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.4);
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
  color: #00000086;
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
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.btn-comprar:hover {
  transform: scale(1.07);
  background: linear-gradient(45deg, #ff416c, #f5a623);
}
</style>
