<template>
  <div class="eventos-container">
    <h2 class="titulo-seccion">Eventos disponibles</h2>

    <div class="eventos-lista">
      <div v-for="evento in eventos" :key="evento.id" class="evento-card">
        <h3>{{ evento.title }}</h3>
        <p>{{ evento.description }}</p>
        <p><strong>Fecha:</strong> {{ formatoFecha(evento.event_date) }}</p>
        <p><strong>Lugar:</strong> {{ evento.location }}</p>
        <p><strong>Capacidad:</strong> {{ evento.capacity }}</p>
        <router-link :to="`/ComprarTicket`" class="btn-comprar">Comprar entradas</router-link>
      </div>
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
  padding: 50px;
  color: white;
}

.titulo-seccion {
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
  color: #f5a623;
}

.eventos-lista {
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.evento-card {
  background-color: #ffffff22;
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.evento-card h3 {
  color: #ffda79;
  font-size: 1.5rem;
}

.btn-comprar {
  display: inline-block;
  margin-top: 15px;
  background-color: #f5a623;
  color: black;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-comprar:hover {
  background-color: #ff416c;
  transform: scale(1.05);
}
</style>
