<template>
  <section class="contact-section">
    <div class="container">
      <h2><i class="bi bi-building"></i> ¿Quieres organizar eventos con nosotros?</h2>
      <p class="subtitle">Completa el formulario y nos pondremos en contacto contigo</p>
      
      <div class="contact-grid">
        <div class="contact-form">
          <form @submit.prevent="submitOrganizerRequest">
            <div class="form-group">
              <label for="company"><i class="bi bi-building"></i> Nombre de la Empresa</label>
              <input 
                type="text" 
                id="company" 
                v-model="form.company" 
                placeholder="Ej: Producciones Musicales S.A."
                required
              >
            </div>

            <div class="form-group">
              <label for="email"><i class="bi bi-envelope"></i> Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                placeholder="contacto@empresa.com"
                required
              >
            </div>

            <div class="form-group">
              <label for="phone"><i class="bi bi-telephone"></i> Teléfono de Contacto</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="form.phone" 
                placeholder="+502 1234 5678"
              >
            </div>

            <div class="form-group">
              <label for="message"><i class="bi bi-chat-text"></i> Mensaje</label>
              <textarea 
                id="message" 
                v-model="form.message" 
                placeholder="Cuéntanos sobre los eventos que quieres organizar..."
                rows="4"
                required
              ></textarea>
            </div>

            <button type="submit" class="btn-submit" :disabled="loading">
              <span v-if="!loading">
                <i class="bi bi-send"></i> Enviar Solicitud
              </span>
              <span v-else>
                <i class="bi bi-arrow-repeat spinner"></i> Enviando...
              </span>
            </button>
          </form>
        </div>

        <div class="contact-info">
          <div class="info-card">
            <h3><i class="bi bi-info-circle"></i> Información de Contacto</h3>
            <div class="info-item">
              <i class="bi bi-envelope"></i>
              <span>codecapibara@fastevents.com</span>
            </div>
            <div class="info-item">
              <i class="bi bi-telephone"></i>
              <span>+555 5555-1234</span>
            </div>
            <div class="info-item">
              <i class="bi bi-clock"></i>
              <span>Lunes a Sábaso: 8:00 - 20:00</span>
            </div>
          </div>

          <div class="faq-card">
            <h3><i class="bi bi-question-circle"></i> Preguntas Frecuentes</h3>
            <div class="faq-item">
              <h4>¿Qué tipos de eventos puedo organizar?</h4>
              <p>Conciertos, obras de teatro, charlas, ferias y cualquier evento cultural o educativo.</p>
            </div>
            <div class="faq-item">
              <h4>¿Cuánto cuesta publicar eventos?</h4>
              <p>La publicación es gratuita, solo cobramos un porcentaje por cada entrada vendida.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
  name: 'ContactOrganizers',
  data() {
    return {
      form: {
        company: '',
        email: '',
        phone: '',
        message: 'Quiero organizar eventos en FastEvents'
      },
      loading: false
    };
  },
  methods: {
    async submitOrganizerRequest() {
      this.loading = true;
      
      try {
        // Configuración para registrar como ORGANIZER
        const password = this.generateTempPassword(); // Genera una contraseña temporal
        const registerUrl = `http://localhost:8085/users/register?password=${encodeURIComponent(password)}`;
        
        const userData = {
          name: this.form.company,
          email: this.form.email,
          role: 'ORGANIZER',
          phone: this.form.phone,
          message: this.form.message
        };

        // Envía la solicitud
        const response = await axios.post(registerUrl, userData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Muestra confirmación
        Swal.fire({
          title: '¡Solicitud enviada!',
          html: `
            <div class="text-left">
              <div class="notification-item">
                <strong>Gracias por tu interés, ${this.form.company}</strong>
                <p>Hemos recibido tu solicitud para ser organizador.</p>
                <p>Nos pondremos en contacto contigo en breve para completar el proceso.</p>
              </div>
            </div>
          `,
          confirmButtonText: 'Entendido',
          background: '#1a1a2e',
          color: '#ffffff',
          showCloseButton: true,
          width: '500px'
        });

        // Resetea el formulario
        this.form = {
          company: '',
          email: '',
          phone: '',
          message: 'Quiero organizar eventos en FastEvents'
        };

      } catch (error) {
        console.error('Error en el registro:', error);
        
        let errorMessage = 'Ocurrió un error al enviar tu solicitud. Por favor, inténtalo de nuevo.';
        
        if (error.response && error.response.status === 409) {
          errorMessage = 'Este correo electrónico ya está registrado como organizador.';
        }

        Swal.fire({
          title: 'Error',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Entendido',
          background: '#1a1a2e',
          color: '#ffffff',
          showCloseButton: true,
          width: '500px'
        });
      } finally {
        this.loading = false;
      }
    },
    generateTempPassword() {
      // Genera una contraseña temporal segura
      return Math.random().toString(36).slice(-10) + 'A1!';
    }
  }
};
</script>

<style scoped>
/* Estilos base consistentes con tu home */
.contact-section {
  background: linear-gradient(120deg, #150120, #362d4b);
  color: white;
  padding: 4rem 5%;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #f5a623;
}

.subtitle {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 3rem;
  color: rgba(255, 255, 255, 0.8);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-top: 2rem;
}

.contact-form {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  backdrop-filter: blur(10px);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.8rem;
  color: #e0e0e0;
}

input, textarea {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: 0.3s;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

input:focus, textarea:focus {
  background: rgba(255, 255, 255, 0.2);
}

.btn-submit {
  width: 100%;
  background: #f5a623;
  border: none;
  color: black;
  font-weight: bold;
  padding: 12px;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.3s ease-in-out;
  margin-top: 10px;
}

.btn-submit:hover:not(:disabled) {
  background: #ff416c;
  color: white;
  transform: scale(1.02);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card, .faq-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
}

.info-card h3, .faq-card h3 {
  color: #f5a623;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.info-item i {
  font-size: 1.2rem;
  color: #f5a623;
}

.faq-item {
  margin-bottom: 1.5rem;
}

.faq-item h4 {
  color: #f5a623;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.faq-item p {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 992px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-info {
    grid-row: 1;
  }
}

@media (max-width: 576px) {
  h2 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .contact-form, .info-card, .faq-card {
    padding: 1.5rem;
  }
}
</style>