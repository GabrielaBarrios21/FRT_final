<template>
  <div class="comprar-container">
    <div class="grid-container">
      <!-- Columna izquierda: Detalles del evento -->
      <div class="info-panel">
        <h2>{{ evento.title }}</h2>
        <p><strong>Ubicación:</strong> {{ evento.location }}</p>
        <p><strong>Fecha:</strong> {{ evento.date }}</p>
        <p><strong>Precio:</strong> ${{ evento.price }}</p>

        <label><strong>Tipo de entrada:</strong></label>
        <select v-model="tipoEntrada" class="input-select">
          <option value="general">General</option>
          <option value="numerada">Numerada</option>
        </select>

        <label><strong>Cantidad:</strong></label>
        <input type="number" v-model.number="cantidad" min="1" max="10" class="input-select" />
      </div>

      <!-- Columna derecha: Mapa de asientos -->
      <div class="asientos-panel" v-if="tipoEntrada === 'numerada'">
        <div class="escenario">ESCENARIO</div>

        <div class="asientos-grid">
          <div
            v-for="asiento in asientos"
            :key="asiento.codigo"
            :class="[
              'asiento',
              asiento.ocupado ? 'ocupado' : '',
              asientosSeleccionados.includes(asiento.codigo) ? 'seleccionado' : ''
            ]"
            @click="seleccionarAsiento(asiento)"
          >
            {{ asiento.codigo }}
          </div>
        </div>

        <!-- Asientos seleccionados -->
        <center><div class="seleccionados-container" v-if="asientosSeleccionados.length">
          <h4>Asientos seleccionados:</h4>
          <div class="chips">
            <span class="chip" v-for="(asiento, index) in asientosSeleccionados" :key="index">
              {{ asiento }}
            </span>
          </div>
        </div></center>
      </div>
    </div>

    <!-- Botón de compra -->
    <button class="btn-comprar" @click="realizarCompra" :disabled="botonDeshabilitado">
      Comprar ahora
    </button>
  </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  name: 'Comprar',
  data() {
    return {
      evento: {
        title: 'Concierto de Rock',
        location: 'Estadio Nacional',
        date: '2025-07-10 21:00',
        price: 120.0
      },
      tipoEntrada: 'numerada',
      cantidad: 4,
      asientos: [],
      asientosSeleccionados: [],
    }
  },
  mounted() {
    this.generarAsientos()
  },
  watch: {
    cantidad() {
      this.asientosSeleccionados = []
    },
    tipoEntrada() {
      this.asientosSeleccionados = []
    }
  },
  computed: {
    botonDeshabilitado() {
      if (this.tipoEntrada === 'numerada') {
        return this.asientosSeleccionados.length !== this.cantidad
      }
      return this.cantidad < 1
    }
  },
  methods: {
    generarAsientos() {
      const filas = 'ABCDEFGHIJ'.split('')
      const columnas = 18
      const ocupados = ['B3', 'C4', 'D10', 'F2', 'G17']

      this.asientos = []
      for (let fila of filas) {
        for (let col = 1; col <= columnas; col++) {
          const codigo = `${fila}${col}`
          this.asientos.push({
            codigo,
            ocupado: ocupados.includes(codigo)
          })
        }
      }
    },
    seleccionarAsiento(asiento) {
      if (asiento.ocupado) return

      const index = this.asientosSeleccionados.indexOf(asiento.codigo)

      if (index >= 0) {
        this.asientosSeleccionados.splice(index, 1)
      } else {
        if (this.asientosSeleccionados.length === this.cantidad) {
          this.asientosSeleccionados.shift()
        }
        this.asientosSeleccionados.push(asiento.codigo)
      }
    },
    mostrarError(mensaje) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: mensaje
      })
    },
    mostrarExito() {
  Swal.fire({
    icon: 'success',
    title: '¡Compra realizada con éxito!',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    willClose: () => {
      this.$router.push('/eventos')
    }
  })
},
    realizarCompra() {
      if (!this.cantidad || this.cantidad < 1) {
        this.mostrarError('Por favor, ingresa una cantidad válida de entradas.')
        return
      }

      if (this.tipoEntrada === 'numerada') {
        if (this.asientosSeleccionados.length !== this.cantidad) {
          this.mostrarError(`Debes seleccionar exactamente ${this.cantidad} asiento(s).`)
          return
        }
      } else if (this.tipoEntrada === 'general') {
        if (this.cantidad > 10) {
          this.mostrarError('No puedes comprar más de 10 entradas generales.')
          return
        }
      }

      this.mostrarExito()
    }
  }
}
</script>


<style scoped>
.comprar-container {
  padding: 50px 30px;
  color: white;
}

.grid-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.info-panel {
  flex: 1;
  min-width: 320px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.info-panel h2 {
  color: #ffd166;
  font-size: 1.8rem;
  margin-bottom: 15px;
}

.info-panel p,
label {
  margin-bottom: 10px;
  display: block;
}

.input-select {
  width: 100%;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
}

.asientos-panel {
  flex: 2;
  min-width: 720px;
  min-height: auto;
}

.escenario {
  background-color: #ff416c;
  color: white;
  text-align: center;
  padding: 12px;
  font-weight: bold;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.asientos-grid {
  display: grid;
  grid-template-columns: repeat(18, 1fr);
  gap: 5px;
  margin-bottom: 15px;
}

.asiento {
  background-color: #1e90ff;
  padding: 6px 0;
  font-size: 10px;
  border-radius: 5px;
  color: white;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
}

.asiento:hover:not(.ocupado):not(.seleccionado) {
  background-color: #0077cc;
}

.asiento.ocupado {
  background-color: #e74c3c;
  cursor: not-allowed;
}

.asiento.seleccionado {
  background-color: #2ecc71;
}

.seleccionados-container {
  margin-top: 20px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.chip {
  background-color: #2ecc71;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  color: black;
  font-weight: bold;
}

.btn-comprar {
  margin-top: 30px;
  background-color: #f5a623;
  color: black;
  font-weight: bold;
  padding: 14px 32px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-comprar:hover {
  background-color: #ff416c;
  transform: scale(1.05);
}

.btn-comprar:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.mensaje-exito {
  margin-top: 25px;
  font-size: 1.3rem;
  color: #00ff99;
  font-weight: bold;
}

.mensaje-error {
  margin-top: 20px;
  background-color: #ff4d4d;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  color: white;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
