<template>
  <div>
    <!-- Navbar -->
    <div class="navbar-container">
      <div class="brand">
        <i class="bi bi-lightning-charge-fill"></i>
        <span style="color: #f5a623;">Fast</span><span style="color: white;">Events</span>
      </div>
      <div class="navbar">
        <router-link to="/" class="nav-item">Home</router-link>
        <router-link to="/about" class="nav-item">About</router-link>
        <router-link to="/eventos" class="nav-item">Eventos</router-link>
        <router-link to="/contacto" class="nav-item">Contacto</router-link>
        <router-link to="/login" class="nav-item">Login</router-link>
      </div>
    </div>

    <!-- Payment Section -->
    <section class="payment-section">
      <div class="payment-content">
        <h1>Pago de <span style="color: #ff416c;">Entrada</span></h1>
        <p><i class="bi bi-ticket-perforated"></i> Evento: {{ eventTitle }}</p>
        <p>Monto a pagar: {{ amount }} USD</p>
        <form @submit.prevent="handlePayment">
          <input type="text" placeholder="Número de tarjeta" v-model="cardNumber" required>
          <input type="text" placeholder="Fecha de expiración (MM/AA)" v-model="expiry" required>
          <input type="text" placeholder="CVV" v-model="cvv" required>
          <button type="submit" class="btn-cta">Pagar</button>
        </form>
        <p v-if="paymentStatus" class="status-message">{{ paymentStatus }}</p>
      </div>
    </section>

    <footer>
      <i class="bi bi-c-circle"></i> 2025 FastEvents. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Pagos',
  data() {
    return {
      ticketId: this.$route.params.ticketId,
      eventTitle: '',
      amount: 0,
      cardNumber: '',
      expiry: '',
      cvv: '',
      paymentStatus: ''
    }
  },
  mounted() {
    this.fetchTicketDetails();
  },
  methods: {
    async fetchTicketDetails() {
      try {
        const response = await fetch(`/api/tickets/${this.ticketId}`);
        const ticket = await response.json();
        this.eventTitle = ticket.event_title; // Asumiendo que la API devuelve el título del evento
        this.amount = ticket.price; // El precio del ticket es el monto a pagar
      } catch (error) {
        console.error('Error al obtener detalles del ticket:', error);
        this.paymentStatus = 'Error al cargar los detalles del pago';
      }
    },
    async handlePayment() {
      try {
        const paymentData = {
          ticket_id: this.ticketId,
          amount: this.amount
          // En un caso real, incluiría detalles de pago para la pasarela externa
        };
        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentData)
        });
        if (response.ok) {
          this.paymentStatus = '¡Pago exitoso! Se ha enviado una confirmación a tu correo.';
        } else {
          this.paymentStatus = 'Error al procesar el pago';
        }
      } catch (error) {
        console.error('Error al procesar el pago:', error);
        this.paymentStatus = 'Error al procesar el pago';
      }
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(120deg, #3C1053, #AD8BFF);
  color: white;
  min-height: 100vh;
}

/* Navbar */
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

/* Payment Section */
.payment-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 5%;
  min-height: 80vh;
}

.payment-content {
  max-width: 600px;
  text-align: center;
}

.payment-content h1 {
  font-size: 4.5rem;
  margin-bottom: 30px;
  color: #f5a623;
  letter-spacing: 5px;
}

.payment-content p {
  color: #e0e0e0;
  font-size: 1.3rem;
  margin-bottom: 20px;
  letter-spacing: 2px;
}

.payment-content form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.payment-content input {
  padding: 12px;
  width: 100%;
  max-width: 300px;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
  margin: 0 auto;
}

.btn-cta {
  background-color: #f5a623;
  color: black;
  font-weight: bold;
  padding: 12px 30px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  transition: 0.3s ease-in-out;
}

.btn-cta:hover {
  background-color: #ff416c;
  transform: scale(1.05);
}

.status-message {
  margin-top: 20px;
  font-weight: bold;
}

footer {
  text-align: center;
  padding: 20px;
  color: #ccc;
}
</style>