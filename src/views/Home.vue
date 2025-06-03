<template>
  <div>
    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Vive el <span style="color: #ff416c;">espectáculo</span></h1>
        <p><i class="bi bi-stars"></i> Compra entradas para los eventos más emocionantes y exclusivos. FastEvents te conecta con la experiencia.</p>
        <router-link to="/login" class="btn-cta">Comenzar</router-link>
      </div>
      <div class="hero-right">
        <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXU4YTgxdDhnYWNudnEweGM2MTc5eDBxemFic2Y4aDdtOGxkN3NrbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/FiyE8SgsrY9mxUtaLq/giphy.gif" alt="Animación FastEvents">
      </div>
    </section>

    <footer>
      <i class="bi bi-c-circle"></i> 2025 FastEvents. Todos los derechos reservados.
    </footer>
  </div>
</template>

<script setup>
defineOptions({
  name: 'Home'
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(120deg, #3C1053, #AD8BFF); /* Dark lilac to light medium lilac */
  color: white;
  min-height: 100vh;
}

/* --- Navbar completo --- */
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

/* --- Hero --- */
.hero-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 50px 5%;
  min-height: 80vh;
  flex-direction: row;
  gap: 100px;
}

.hero-content {
  max-width: 600px;
  text-align: left;
  padding-left: 20px;
}

.hero-content h1 {
  font-size: 4.5rem;
  margin-bottom: 30px;
  color: #f5a623;
  letter-spacing: 5px;
}

.hero-content p {
  color: #e0e0e0;
  font-size: 1.3rem;
  margin-bottom: 30px;
  letter-spacing: 2px;
}

.btn-cta {
  background-color: #f5a623;
  color: black;
  font-weight: bold;
  padding: 12px 30px;
  border-radius: 30px;
  text-decoration: none;
  display: inline-block;
  transition: 0.3s ease-in-out;
  margin-top: -20px;
}

.btn-cta:hover {
  background-color: #ff416c;
  transform: scale(1.05);
}

.hero-right img {
  max-width: 300px;
}

footer {
  text-align: center;
  padding: 20px;
  color: #ccc;
}
</style>