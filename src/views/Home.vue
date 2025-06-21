<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Vive el <span class="highlight">espectáculo</span></h1>
        <p><i class="bi bi-stars"></i> Compra entradas para los eventos más emocionantes y exclusivos. FastEvents te conecta con la experiencia.</p>
        <router-link to="/login" class="btn-cta">Comenzar</router-link>
      </div>
      <div class="hero-right">
        <img src="https://thumbs.dreamstime.com/b/rock-concert-29673156.jpg" alt="Animación FastEvents">
        <img src="https://images.squarespace-cdn.com/content/v1/5a788c8f1f318d63a931258e/8bfec417-8dcb-4cb5-b88b-b167a1c729b8/P1034013.jpeg" alt="Animación FastEvents">
        <img src="https://media.istockphoto.com/id/1806011581/photo/overjoyed-happy-young-people-dancing-jumping-and-singing-during-concert-of-favorite-group.jpg?s=612x612&w=0&k=20&c=cMFdhX403-yKneupEN-VWSfFdy6UWf1H0zqo6QBChP4=" alt="Animación FastEvents">
      </div>
    </section>

    <!-- Event Categories -->
    <section class="categories-section">
      <h2>Explora por categoría</h2>
      <div class="categories-grid">
        <div class="category-card" v-for="(category, index) in categories" :key="index">
          <i :class="category.icon"></i>
          <h3>{{ category.name }}</h3>
          <p>{{ category.description }}</p>
        </div>
      </div>
    </section>

    <!-- Featured Events -->
    <section class="featured-section">
      <h2>Eventos destacados</h2>
      <div class="events-carousel">
        <div class="event-card" v-for="(event, index) in featuredEvents" :key="index">
          <img :src="event.image" :alt="event.title">
          <div class="event-info">
            <h3>{{ event.title }}</h3>
            <p><i class="bi bi-calendar-event"></i> {{ event.date }}</p>
            <p><i class="bi bi-geo-alt"></i> {{ event.location }}</p>
            <router-link to="/events" class="btn-secondary">Ver detalles</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works -->
    <section class="steps-section">
      <h2>¿Cómo funciona?</h2>
      <div class="steps-container">
        <div class="step" v-for="(step, index) in steps" :key="index">
          <div class="step-number">{{ index + 1 }}</div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="testimonials-section">
      <h2>Lo que dicen nuestros clientes</h2>
      <div class="testimonials-grid">
        <div class="testimonial-card" v-for="(testimonial, index) in testimonials" :key="index">
          <div class="testimonial-content">
            <i class="bi bi-quote"></i>
            <p>{{ testimonial.text }}</p>
          </div>
          <div class="testimonial-author">
            <img :src="testimonial.avatar" :alt="testimonial.name">
            <div>
              <h4>{{ testimonial.name }}</h4>
              <p>{{ testimonial.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <h2>¿Listo para vivir la experiencia?</h2>
      <p>Regístrate ahora y obtén acceso a los mejores eventos</p>
      <router-link to="/register" class="btn-cta">Crear cuenta</router-link>
    </section>

    <!-- Footer -->
    <footer>
      <div class="footer-content">
        <div class="footer-brand">
          <h3>FastEvents</h3>
          <p>Tu puerta de entrada a los mejores espectáculos</p>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h4>Explorar</h4>
            <router-link to="/events">Eventos</router-link>
            <router-link to="/categories">Categorías</router-link>
            <router-link to="/organizers">Organizadores</router-link>
          </div>
          <div class="link-group">
            <h4>Empresa</h4>
            <router-link to="/about">Nosotros</router-link>
            <router-link to="/contact">Contacto</router-link>
            <router-link to="/careers">Carreras</router-link>
          </div>
          <div class="link-group">
            <h4>Legal</h4>
            <router-link to="/terms">Términos</router-link>
            <router-link to="/privacy">Privacidad</router-link>
            <router-link to="/cookies">Cookies</router-link>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p><i class="bi bi-c-circle"></i> 2025 FastEvents. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const categories = ref([
  {
    name: 'Conciertos',
    icon: 'bi bi-music-note-beamed',
    description: 'Los mejores artistas en vivo'
  },
  {
    name: 'Teatro',
    icon: 'bi bi-mask',
    description: 'Obras clásicas y contemporáneas'
  },
  {
    name: 'Deportes',
    icon: 'bi bi-trophy',
    description: 'Eventos deportivos emocionantes'
  },
  {
    name: 'Conferencias',
    icon: 'bi bi-megaphone',
    description: 'Aprende de los expertos'
  }
]);

const featuredEvents = ref([
  {
    title: 'Festival de Música Electrónica',
    date: '15 Nov 2025',
    location: 'Bogotá, Colombia',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    title: 'Obra: El Principito',
    date: '22-30 Nov 2025',
    location: 'Medellín, Colombia',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    title: 'Final Liga de Fútbol',
    date: '5 Dic 2025',
    location: 'Cali, Colombia',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1493&q=80'
  }
]);

const steps = ref([
  {
    title: 'Explora eventos',
    description: 'Encuentra el evento perfecto entre nuestras diversas categorías'
  },
  {
    title: 'Selecciona tus entradas',
    description: 'Elige la cantidad y tipo de entradas que deseas'
  },
  {
    title: 'Pago seguro',
    description: 'Realiza el pago de forma rápida y segura'
  },
  {
    title: 'Disfruta el evento',
    description: 'Recibe tus entradas por email y prepárate para vivir la experiencia'
  }
]);

const testimonials = ref([
  {
    text: 'Compré entradas para el concierto de mi banda favorita y todo el proceso fue súper fácil. ¡Volveré a usar FastEvents!',
    name: 'María Gómez',
    role: 'Cliente frecuente',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    text: 'Como organizador, FastEvents me ha permitido llegar a más público y gestionar mis eventos de manera profesional.',
    name: 'Carlos Rodríguez',
    role: 'Organizador de eventos',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    text: 'La plataforma es intuitiva y los precios son competitivos. Excelente servicio al cliente también.',
    name: 'Ana Martínez',
    role: 'Usuario premium',
    avatar: 'https://randomuser.me/api/portraits/women/63.jpg'
  }
]);

defineOptions({
  name: 'Home'
});
</script>

<style scoped>
/* Base Styles */
.home-container {
  width: 100%;
  overflow-x: hidden;
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(120deg, #150120, #362d4b);
  color: white;
}

section {
  padding: 4rem 5%;
  width: 100%;
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #f5a623;
}

/* Hero Section */
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 80vh;
  gap: 2rem;
  position: relative;
}

.hero-content {
  max-width: 600px;
  z-index: 2;
}

.hero-content h1 {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.highlight {
  color: #ff416c;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-right {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 400px; /* Altura fija para el contenedor */
}

.hero-right img {
  aspect-ratio: 1 / 1;
  object-fit: cover;
  width: 80%;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: absolute;
  transition: all 0.3s ease;
  background: white;
  padding: 10px;
}

/* Posiciona cada imagen */
.hero-right img:nth-child(1) {
  top: 10px;
  left: -50px;
  z-index: 3;
  transform: rotate(3deg);
}

.hero-right img:nth-child(2) {
  top: 90px;
  left: 100px;
  z-index: 2;
  transform: rotate(-5deg);
  width: 75%;
}

.hero-right img:nth-child(3) {
  top: -40px;
  left: 150px;
  z-index: 1;
  transform: rotate(2deg);
  width: 70%;
}

/* Efecto hover */

/* .hero-right:hover img:nth-child(1) {
  transform: rotate(5deg) translateY(-10px);
  width: 70%;
  top: 20px;
  left: 30px;
}

.hero-right:hover img:nth-child(2) {
  transform: rotate(-7deg) translateY(-5px);
  width: 70%;
  
}

.hero-right:hover img:nth-child(3) {
  transform: rotate(4deg) translateY(-5px);
  width: 70%;
  top: 0;
} */

/* Buttons */
.btn-cta {
  background-color: #f5a623;
  color: black;
  font-weight: bold;
  padding: 12px 30px;
  border-radius: 30px;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}

.btn-cta:hover {
  background-color: #ff416c;
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background-color: transparent;
  color: white;
  border: 2px solid #f5a623;
  padding: 8px 20px;
  border-radius: 30px;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-secondary:hover {
  background-color: #f5a623;
  color: black;
}

/* Categories Section */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.category-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.15);
}

.category-card i {
  font-size: 2.5rem;
  color: #f5a623;
  margin-bottom: 1rem;
}

.category-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

/* Featured Events */
.featured-section {
  background: rgba(0, 0, 0, 0.2);
}

.events-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.event-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  color: #333;
  transition: transform 0.3s ease;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.event-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.event-info {
  padding: 1.5rem;
}

.event-info h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #3C1053;
}

.event-info p {
  margin-bottom: 0.5rem;
  color: #666;
}

.event-info i {
  color: #f5a623;
  margin-right: 0.5rem;
}

/* Steps Section */
.steps-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.step {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  position: relative;
}

.step-number {
  position: absolute;
  top: -20px;
  left: 20px;
  background: #f5a623;
  color: black;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.step h3 {
  font-size: 1.3rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

/* Testimonials */
.testimonials-section {
  background: rgba(0, 0, 0, 0.2);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
}

.testimonial-content i {
  font-size: 2rem;
  color: #f5a623;
  opacity: 0.5;
}

.testimonial-content p {
  font-style: italic;
  margin: 1rem 0;
  line-height: 1.6;
}

.testimonial-author {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

.testimonial-author img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
}

.testimonial-author h4 {
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
}

.testimonial-author p {
  font-size: 0.9rem;
  color: #ccc;
}

/* CTA Section */
.cta-section {
  text-align: center;
  background: linear-gradient(135deg, #ff416c, #f5a623);
  padding: 5rem;
}

.cta-section h2 {
  color: white;
  margin-bottom: 1rem;
}

.cta-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

/* Footer */
footer {
  background: #150120;
  color: white;
  padding: 3rem 5% 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-brand h3 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #f5a623;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
}

.link-group h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #f5a623;
}

.link-group a {
  display: block;
  color: #ccc;
  margin-bottom: 0.5rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.link-group a:hover {
  color: #f5a623;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #ccc;
  font-size: 0.9rem;
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding-top: 6rem;
  }

  .hero-content {
    max-width: 100%;
    padding-left: 0;
  }

  .hero-right img {
    aspect-ratio: 1 / 1;
    max-width: 100%;
    margin-top: 2rem;
  }
}

@media (max-width: 768px) {
  section {
    padding: 3rem 5%;
  }

  h2 {
    font-size: 2rem;
  }

  .cta-section {
    padding: 3rem 5%;
  background: linear-gradient(135deg, #ff416c, #f5a623);
  }
}

@media (max-width: 576px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .hero-content p {
    font-size: 1rem;
  }

  .btn-cta {
    padding: 10px 25px;
    font-size: 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>