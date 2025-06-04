<template>
  <div class="parent-container">
    <div class="login-container animate__animated animate__fadeInDown">
      <h2><i class="bi bi-lightning-charge-fill"></i> Registro</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="nombre"><i class="bi bi-person-badge"></i> Nombre Completo</label>
          <input 
            type="text" 
            id="nombre" 
            v-model="nombre" 
            placeholder="Nombres Apellidos"
            required
          >
        </div>

        <div class="form-group">
          <label for="email"><i class="bi bi-envelope-fill"></i> Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="ejemplo@gmail.com"
            required
          >
        </div>

        <div class="form-group">
          <label for="contrasena"><i class="bi bi-lock-fill"></i> Contraseña</label>
          <div class="password-input">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="contrasena" 
              v-model="contrasena" 
              placeholder="••••••••"
              required
              minlength="6"
            >
            <button type="button" class="toggle-password" @click="togglePassword">
              <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
          </div>
          <p class="password-hint">Mínimo 6 caracteres</p>
        </div>

        <div class="form-group">
          <label for="confirmarContrasena"><i class="bi bi-lock-fill"></i> Confirmar Contraseña</label>
          <div class="password-input">
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              id="confirmarContrasena" 
              v-model="confirmarContrasena" 
              placeholder="••••••••"
              required
            >
            <button type="button" class="toggle-password" @click="toggleConfirmPassword">
              <i class="bi" :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-group" v-if="showRoleField">
          <label for="rol"><i class="bi bi-person-rolodex"></i> Tipo de Usuario</label>
          <select id="rol" v-model="rol" class="form-select">
            <option value="USER">Usuario Normal</option>
            <option value="ORGANIZER">Organizador de Eventos</option>
          </select>
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="!loading">
            <i class="bi bi-person-plus"></i> Registrarse
          </span>
          <span v-else>
            <i class="bi bi-arrow-repeat spinner"></i> Procesando...
          </span>
        </button>

        <div class="extra-links">
            <p class="account-prompt">¿Ya tienes una cuenta? <router-link to="/login" class="login-link">Inicia Sesión</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      nombre: '',
      email: '',
      contrasena: '',
      confirmarContrasena: '',
      rol: 'USER', //USER=cliente normal, ORGANIZER=organizador de eventos
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      showRoleField: false // cambiar a true si quieres que los usuarios elijan su rol
    };
  },
  methods: {
    async handleSubmit() {
      // Validación de contraseñas coincidentes
      if (this.contrasena !== this.confirmarContrasena) {
        Swal.fire({
          title: 'Error',
          text: 'Las contraseñas no coinciden',
          icon: 'error',
          confirmButtonText: 'Entendido',
          background: '#1a1a2e',
          color: '#ffffff',
          showCloseButton: true,
          width: '500px'
        });
        return;
      }

      // Validación de longitud de contraseña
      if (this.contrasena.length < 6) {
        Swal.fire({
          title: 'Error',
          text: 'La contraseña debe tener al menos 6 caracteres',
          icon: 'error',
          confirmButtonText: 'Entendido',
          background: '#1a1a2e',
          color: '#ffffff',
          showCloseButton: true,
          width: '500px'
        });
        return;
      }

      this.loading = true;
      
      try {
        // Configuración de la petición
        const url = `http://localhost:8085/users/register?password=${encodeURIComponent(this.contrasena)}`;
        
        const userData = {
          name: this.nombre,
          email: this.email,
          role: this.rol
        };

        // Realizar la petición al backend
        const response = await axios.post(url, userData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Si la respuesta es exitosa
        if (response.status === 200) {
          Swal.fire({
            title: '¡Registro exitoso!',
            html: `
              <div class="text-left">
                <div class="notification-item">
                  <strong>Cuenta creada correctamente</strong>
                  <p>Bienvenido/a ${response.data.name}</p>
                  <p>Hemos enviado un correo de confirmación a ${response.data.email}</p>
                </div>
              </div>
            `,
            confirmButtonText: 'Continuar',
            background: '#1a1a2e',
            color: '#ffffff',
            showCloseButton: true,
            width: '500px'
          }).then(() => {
            // Redirigir a la página de login
            this.$router.push('/login');
          });
        }
      } catch (error) {
        // Manejo de errores
        console.error('Error en el registro:', error);
        
        let errorMessage = 'Ocurrió un error al registrar. Por favor, inténtalo de nuevo.';
        
        if (error.response && error.response.status === 400) {
          errorMessage = error.response.data.message || 'Datos inválidos. Verifica la información.';
        } else if (error.response && error.response.status === 409) {
          errorMessage = 'Este correo electrónico ya está registrado.';
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
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
};
</script>

<style scoped>
.parent-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  padding: 20px 0; 
  background: linear-gradient(120deg, #150120, #4f416d);
}

.login-container {
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 40px 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);
  animation: fadeInDown 1.5s;
}

.login-container h2 {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  color: #f5a623;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #e0e0e0;
  text-align: left;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: 0.3s;
  text-align: left;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

input:focus {
  background: rgba(255, 255, 255, 0.2);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 1rem;
  padding: 5px;
}

.toggle-password:hover {
  color: #f5a623;
}

.btn-login {
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

.btn-login:hover {
  background: #ff416c;
  color: white;
  transform: scale(1.05);
}

.extra-links {
  text-align: center;
  margin-top: 20px;
}

.extra-links {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* Línea divisoria sutil */
  text-align: center;
}

.extra-links a:hover {
  color: #ff416c;
}

.account-prompt {
  color: rgba(255, 255, 255, 0.8); /* Texto en blanco semi-transparente */
  font-weight: normal; /* Sin negrita */
  margin-bottom: 0; /* Elimina margen inferior */
}

.login-link {
  color: #f5a623; /* Amarillo/naranja como en tu login */
  text-decoration: underline; /* Subrayado para reconocer como enlace */
  transition: all 0.3s ease;
}

.login-link:hover {
  color: #ff416c; /* Color al hover como en tu login */
  text-decoration: none; /* Quita subrayado al hover */
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.password-hint {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 5px;
  text-align: left;
}

.form-select {
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

.form-select:focus {
  background: rgba(255, 255, 255, 0.2);
}

.extra-links {
  margin-top: 20px;
  text-align: center;
}

.extra-links a {
  color: #f5a623;
  text-decoration: none;
  transition: 0.3s;
}

.extra-links a:hover {
  color: #ff416c;
  text-decoration: underline;
}
</style>