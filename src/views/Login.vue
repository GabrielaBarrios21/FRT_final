<template>
  <div class="login-container animate__animated animate__fadeInDown">
    <h2><i class="bi bi-lightning-charge-fill"></i> FastEvents</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="usuario"><i class="bi bi-person-fill"></i> Usuario</label>
        <input type="text" id="usuario" v-model="usuario" required>
      </div>

      <div class="form-group">
        <label for="contrasena"><i class="bi bi-lock-fill"></i> Contraseña</label>
        <input type="password" id="contrasena" v-model="contrasena" required>
      </div>

      <button type="submit" class="btn-login"><i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión</button>

      <div class="extra-links">
        <p><router-link to="#">¿Olvidaste tu contraseña?</router-link></p>
        <p><router-link to="#">¿No tienes cuenta? Regístrate</router-link></p>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      usuario: '',
      contrasena: ''
    };
  },
  methods: {
    handleSubmit() {
      // Simulate form submission to procesar_login.php
      console.log('Form submitted:', {
        usuario: this.usuario,
        contrasena: this.contrasena
      });
      // Add logic to handle form submission (e.g., API call)
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(120deg, #230134, #6A1B9A, #9D76F7); /* Dark lilac to medium lilac to light medium lilac */
  color: white;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
  color: #e0e0e0;
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
}

input:focus {
  background: rgba(255, 255, 255, 0.2);
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