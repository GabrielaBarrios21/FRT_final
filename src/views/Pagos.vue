<template>
  <div class="payment-page">
    <!-- Proceso de pago -->
    <div class="payment-process">
      <!-- Paso 1: Resumen del pedido -->
      <section v-if="currentStep === 1" class="order-summary">
        <h2><i class="bi bi-cart-check"></i> Resumen de tu compra</h2>
        
        <div class="event-card">
          <div class="event-image">
            <img :src="event.image" :alt="event.title">
          </div>
          <div class="event-details">
            <h3>{{ event.title }}</h3>
            <p><i class="bi bi-calendar-event"></i> {{ event.date }}</p>
            <p><i class="bi bi-geo-alt"></i> {{ event.location }}</p>
            <p><i class="bi bi-ticket-perforated"></i> {{ ticket.quantity }} x {{ formatCurrency(ticket.price) }}</p>
            <p class="total">Total: <span>{{ formatCurrency(ticket.price * ticket.quantity) }}</span></p>
          </div>
        </div>

        <button @click="currentStep = 2" class="btn-cta">
          <i class="bi bi-credit-card"></i> Proceder al pago
        </button>
      </section>

      <!-- Paso 2: Datos de pago -->
      <section v-if="currentStep === 2" class="payment-form">
        <h2><i class="bi bi-credit-card"></i> Información de pago</h2>
        
        <div class="card-form">
          <div class="card-preview">
            <div class="credit-card" :class="{ 'flipped': cardFlipped }">
              <div class="card-front">
                <div class="card-logo">
                  <i class="bi bi-credit-card-2-front"></i>
                </div>
                <div class="card-number">
                  {{ cardNumber || '•••• •••• •••• ••••' }}
                </div>
                <div class="card-details">
                  <div class="card-name">
                    {{ cardName || 'NOMBRE EN TARJETA' }}
                  </div>
                  <div class="card-expiry">
                    {{ cardExpiry || 'MM/AA' }}
                  </div>
                </div>
              </div>
              <div class="card-back">
                <div class="card-stripe"></div>
                <div class="card-cvv">
                  {{ cardCvv || '•••' }}
                </div>
              </div>
            </div>
          </div>

          <form @submit.prevent="processPayment">
            <div class="form-group">
              <label>Número de tarjeta</label>
              <input 
                type="text" 
                v-model="cardNumber" 
                @input="formatCardNumber"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
                required
              >
            </div>

            <div class="form-group">
              <label>Nombre en la tarjeta</label>
              <input 
                type="text" 
                v-model="cardName" 
                placeholder="Como aparece en la tarjeta"
                required
              >
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Fecha de expiración</label>
                <input 
                  type="text" 
                  v-model="cardExpiry" 
                  @input="formatExpiry"
                  placeholder="MM/AA"
                  maxlength="5"
                  required
                >
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input 
                  type="text" 
                  v-model="cardCvv" 
                  @focus="cardFlipped = true"
                  @blur="cardFlipped = false"
                  placeholder="123"
                  maxlength="3"
                  required
                >
              </div>
            </div>

            <div class="form-actions">
              <button type="button" @click="currentStep = 1" class="btn-secondary">
                <i class="bi bi-arrow-left"></i> Volver
              </button>
              <button type="submit" class="btn-cta" :disabled="processingPayment">
                <span v-if="!processingPayment">
                  <i class="bi bi-lock"></i> Pagar {{ formatCurrency(ticket.price * ticket.quantity) }}
                </span>
                <span v-else>
                  <i class="bi bi-arrow-repeat spinner"></i> Procesando pago...
                </span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <!-- Paso 3: Confirmación   PAGO EXITOSO -->
      <!-- <section v-if="currentStep === 3" class="confirmation">

        <div class="confirmation-card">
          <div class="confirmation-icon success">
            <i class="bi bi-check-circle"></i>
          </div>
          <h2>¡Pago exitoso!</h2>
          <p>Hemos enviado los detalles de tu compra a <strong>{{ user.email }}</strong></p>
          <p>También hemos notificado al organizador del evento.</p>
          
          <div class="ticket-summary">
            <h3>Resumen de tu compra</h3>
            <p><strong>Evento:</strong> {{ event.title }}</p>
            <p><strong>Fecha:</strong> {{ event.date }}</p>
            <p><strong>Entradas:</strong> {{ ticket.quantity }}</p>
            <p><strong>Total:</strong> {{ formatCurrency(ticket.price * ticket.quantity) }}</p>
            <p><strong>Código de transacción:</strong> {{ payment.transactionId }}</p>
          </div>

          <div class="confirmation-actions">
            <router-link to="/" class="btn-cta">
              <i class="bi bi-house"></i> Volver al inicio
            </router-link>
            <router-link :to="'/tickets/' + ticket.id" class="btn-secondary">
              <i class="bi bi-ticket-perforated"></i> Ver mis entradas
            </router-link>
          </div>
        </div>
      </section> -->

      <!-- Paso 3: Pago fallido -->
      <section v-if="currentStep === 3" class="confirmation">
        <div class="confirmation-card error">
          <div class="confirmation-icon error">
            <i class="bi bi-x-circle"></i>
          </div>
          <h2>¡Pago no procesado!</h2>
          <p class="error-message">No pudimos completar tu compra. Por favor intenta nuevamente.</p>
          
          <div class="error-details">
            <p><i class="bi bi-exclamation-triangle"></i> <strong>Razón:</strong> {{ payment.errorMessage || 'Problema con el método de pago' }}</p>
            <p><i class="bi bi-credit-card"></i> <strong>Monto no cobrado:</strong> {{ formatCurrency(ticket.price * ticket.quantity) }}</p>
            <p><i class="bi bi-calendar-event"></i> <strong>Evento:</strong> {{ event.title }}</p>
          </div>

          <div class="suggestions">
            <h3>¿Qué puedes hacer ahora?</h3>
            <ul>
              <li><i class="bi bi-credit-card"></i> Verificar los datos de tu tarjeta</li>
              <li><i class="bi bi-clock"></i> Esperar unos minutos y volver a intentar</li>
              <li><i class="bi bi-headset"></i> Contactar a soporte técnico</li>
            </ul>
          </div>

          <div class="confirmation-actions">
            <button @click="currentStep = 2" class="btn-cta">
              <i class="bi bi-credit-card"></i> Reintentar pago
            </button>
            <router-link to="/" class="btn-secondary">
              <i class="bi bi-house"></i> Volver al inicio
            </router-link>
          </div>
        </div>
      </section>
    </div>

    <!-- Notificación de cancelación (simulada para demo)
    <div v-if="showCancellationNotice" class="cancellation-notice">
      <div class="notice-content">
        <div class="notice-icon">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <div class="notice-text">
          <h3>Evento cancelado</h3>
          <p>Lamentamos informarte que el evento "{{ event.title }}" ha sido cancelado.</p>
          <p>Hemos procesado el reembolso automático y se ha enviado un correo con los detalles.</p>
        </div>
        <button @click="showCancellationNotice = false" class="btn-notice">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div> -->
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'Pagos',
  data() {
    return {
      currentStep: 1,
      cardFlipped: false,
      processingPayment: false,
      showCancellationNotice: false,
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCvv: '',
      user: {
        id: 1,
        name: 'Usuario Demo',
        email: 'usuario@demo.com'
      },
      event: {
        id: 1,
        title: 'Concierto de Rock Internacional',
        date: '15 de Julio, 2025 - 20:00',
        location: 'Teatro al Aire Libre',
        image: 'https://s3.amazonaws.com/s3.timetoast.com/public/uploads/photo/8420304/image/5d71bf34c6ac3af595abdab253f8a697?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJB6ZCNNAN7BE7WDQ%2F20250601%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250601T021455Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=311b1af9463f5ad49b8bb3e59f9f89edc629a06dc7a438910b4e81a849b5ce4d',
        organizer: {
          id: 2,
          name: 'Producciones Musicales S.A.',
          email: 'contacto@produccionesmusicales.com'
        }
      },
      ticket: {
        id: 101,
        price: 120,
        quantity: 2,
        type: 'General'
      },
      payment: {
        id: null,
        transactionId: '',
        status: '',
        date: null
      }
    };
  },
  methods: {
    formatCurrency(value) {
      return 'Bs. ' + value.toFixed(2);
    },
    formatCardNumber() {
      // Formato: XXXX XXXX XXXX XXXX
      this.cardNumber = this.cardNumber.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    },
    formatExpiry() {
      // Formato: MM/AA
      this.cardExpiry = this.cardExpiry.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
    },
    async processPayment() {
      this.processingPayment = true;
      
      // Simulamos un retraso en el pago
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        // Simular pago exitoso
        this.payment = {
          id: Math.floor(Math.random() * 1000000),
          transactionId: 'TXN-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
          status: 'completed',
          date: new Date().toISOString()
        };
        
        // Simular envío de emails
        this.sendConfirmationEmails();
        
        // Mostrar confirmación
        this.currentStep = 3;
        
      } catch (error) {
        Swal.fire({
          title: 'Error en el pago',
          text: 'Ocurrió un error al procesar tu pago. Por favor intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          background: '#1a1a2e',
          color: '#ffffff',
          showCloseButton: true,
          width: '500px'
        });
      } finally {
        this.processingPayment = false;
      }
    },
    sendConfirmationEmails() {
      // Simular envío de emails (en producción sería una llamada al backend)
      console.log('Enviando email de confirmación a:', this.user.email);
      console.log('Enviando notificación al organizador:', this.event.organizer.email);
      
      // Simulación de notificación por cancelación (para demo)
      // En producción esto sería manejado por el backend cuando se cancele un evento
      setTimeout(() => {
        this.showCancellationNotice = true;
      }, 10000);
    }
  }
};
</script>

<style scoped>
/* Estilos base */
.payment-page {
  min-height: 100vh;
  background: linear-gradient(120deg, #150120, #362d4b);
  color: white;
  font-family: 'Montserrat', sans-serif;
}

.payment-process {
  padding: 2rem 5%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Estilos para cada paso */
.order-summary, .payment-form, .confirmation {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2.5rem;
  margin: 0 auto;
  max-width: 800px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.order-summary h2, .payment-form h2, .confirmation h2 {
  color: #f5a623;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
}

/* Estilos para la tarjeta del evento */
.event-card {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  overflow: hidden;
}

.event-image {
  width: 40%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-details {
  padding: 1.5rem;
  flex: 1;
}

.event-details h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #f5a623;
}

.event-details p {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.event-details i {
  color: #f5a623;
}

.total {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.total span {
  color: #f5a623;
  font-size: 1.4rem;
}

/* Estilos para el formulario de pago */
.card-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.card-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

.credit-card {
  width: 350px;
  height: 220px;
  perspective: 1000px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.credit-card.flipped {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-front {
  background: linear-gradient(135deg, #434343, #000000);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-back {
  background: linear-gradient(135deg, #000000, #434343);
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
}

.card-logo i {
  font-size: 2.5rem;
  color: #f5a623;
}

.card-number {
  font-size: 1.5rem;
  letter-spacing: 2px;
  text-align: center;
  font-family: 'Courier New', monospace;
}

.card-details {
  display: flex;
  justify-content: space-between;
}

.card-name {
  font-size: 0.9rem;
  text-transform: uppercase;
}

.card-expiry {
  font-size: 0.9rem;
}

.card-stripe {
  height: 40px;
  background: #333;
  margin-top: 1rem;
}

.card-cvv {
  margin-top: 1rem;
  padding: 0.5rem;
  background: white;
  color: #333;
  text-align: right;
  font-family: 'Courier New', monospace;
  border-radius: 5px;
  align-self: flex-end;
  width: 80%;
}

/* Estilos para los inputs */
.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
}

input:focus {
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  box-shadow: 0 0 0 2px #f5a623;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

/* Botones */
.btn-cta, .btn-secondary {
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cta {
  background: #f5a623;
  color: black;
}

.btn-cta:hover {
  background: #ff416c;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-cta:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid #f5a623;
}

.btn-secondary:hover {
  background: #f5a623;
  color: black;
}

/* Confirmación */
.confirmation-card {
  text-align: center;
}

.confirmation-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
}

.confirmation-icon.success {
  color: #4CAF50;
}

.ticket-summary {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 2rem 0;
  text-align: left;
}

.ticket-summary h3 {
  color: #f5a623;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 0.5rem;
}

.ticket-summary p {
  margin-bottom: 0.5rem;
}

.confirmation-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Notificación de cancelación */
.cancellation-notice {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.notice-content {
  background: rgba(255, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-width: 400px;
  position: relative;
}

.notice-icon {
  font-size: 2rem;
  color: #ff416c;
}

.notice-text h3 {
  color: #ff416c;
  margin-bottom: 0.5rem;
}

.notice-text p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.btn-notice {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
}

/* Spinner */
.spinner {
  animation: spin 1s linear infinite;
}

/* Agrega esto en tu sección de estilos */
/* Estilos de error en el pago */

.confirmation-card.error {
  background: rgba(255, 0, 0, 0.05);
  border: 1px solid rgba(255, 66, 108, 0.3);
}

.confirmation-icon.error {
  color: #ff416c;
  background: rgba(255, 66, 108, 0.2);
}

.error-message {
  color: #ff416c;
  font-weight: bold;
  margin: 1rem 0;
}

.error-details {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-left: 3px solid #ff416c;
}

.error-details p {
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-details i {
  color: #ff416c;
}

.suggestions {
  margin: 1.5rem 0;
}

.suggestions h3 {
  color: #f5a623;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.suggestions ul {
  list-style-type: none;
  padding-left: 0;
}

.suggestions li {
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: rgba(255, 255, 255, 0.8);
}

.suggestions i {
  color: #f5a623;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 992px) {
  .card-form {
    grid-template-columns: 1fr;
  }
  
  .card-preview {
    margin-bottom: 2rem;
  }
  
  .confirmation-actions {
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .event-card {
    flex-direction: column;
  }
  
  .event-image {
    width: 100%;
    height: 200px;
  }
  
  .credit-card {
    width: 280px;
    height: 180px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>