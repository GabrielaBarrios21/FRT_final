<template>
  <div class="parent-container">
    <div class="login-container animate__animated animate__fadeInDown">
      <h2><i class="bi bi-lightning-charge-fill"></i> FastEvents</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="usuario"><i class="bi bi-person-fill"></i> Usuario</label>
          <input 
            type="text" 
            id="usuario" 
            v-model="usuario" 
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
            >
            <button type="button" class="toggle-password" @click="togglePassword">
              <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
          </div>
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          <span v-if="!loading">
            <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
          </span>
          <span v-else>
            <i class="bi bi-arrow-repeat spinner"></i> Procesando...
          </span>
        </button>

        <div class="extra-links">
          <p><router-link to="#"><u>¿Olvidaste tu contraseña?</u></router-link></p>
          <p><router-link to="/registro">¿No tienes una cuenta? <u>¡Regístrate aquí!</u></router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      usuario: '',
      contrasena: '',
      showPassword: false,
      loading: false
    };
  },
  methods: {
    async handleSubmit() {
      this.loading = true;
      
      try {
        // Configuración de la petición
        const params = new URLSearchParams();
        params.append('email', this.usuario);
        params.append('password', this.contrasena);

        // Realizar la petición al backend
        const response = await axios.post('http://localhost:8085/users/login', params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        // Si la respuesta es exitosa
        if (response.status === 200) {
          // Guardar datos del usuario (puedes usar Vuex o localStorage)
          localStorage.setItem('user', JSON.stringify(response.data));
          
          // Mostrar notificación de éxito
          Swal.fire({
            title: '¡Bienvenido!',
            icon: 'success',
            html: `
              <div class="text-left">
                <div class="notification-item">
                  <strong>Inicio de sesión exitoso</strong>
                  <p>Has iniciado sesión correctamente como ${response.data.email}</p>
                </div>
              </div>
            `,
            confirmButtonText: 'Continuar',
            background: '#1a1a2e',
            color: '#ffffff',
            showCloseButton: true,
            width: '500px'
          }).then(() => {
            // Redirigir a la página principal
            this.$router.push('/');
          });
        }
      } catch (error) {
        // Manejo de errores
        console.error('Error en el login:', error);
        
        Swal.fire({
          title: 'Error',
          text: 'Credenciales incorrectas. Por favor, inténtalo de nuevo.',
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
}

.login-container {
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

.extra-links a {
  color: #f5a623;
  text-decoration: none;
  transition: 0.3s;
}

.extra-links a:hover {
  color: #ff416c;
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
</style>