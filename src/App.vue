<template>
  <div class="app-container">
    <NavBar v-if="showNavbar" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

defineOptions({
  name: 'App'
})

const route = useRoute();
const showNavbar = computed(() => {
  return !['/login', '/registro'].includes(route.path);
});
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100vw; /* Cambiado a viewport width */
  overflow-x: hidden; /* Asegura que no haya desbordamiento */
}

.main-content {
  flex: 1;
  width: 100%;
  overflow-x: hidden; /* Prevenir desbordamiento interno */
}
</style>