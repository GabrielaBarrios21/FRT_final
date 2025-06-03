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
        <div class="seleccionados-container" v-if="asientosSeleccionados.length">
          <h4>Asientos seleccionados:</h4>
          <div class="chips">
            <span class="chip" v-for="(asiento, index) in asientosSeleccionados" :key="index">
              {{ asiento }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón de compra -->
    <button class="btn-comprar" @click="realizarCompra">Comprar ahora</button>
    <div v-if="compraExitosa" class="mensaje-exito">🎉 ¡Compra realizada con éxito!</div>
  </div>
</template>

<script>
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
      compraExitosa: false
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
          this.asientosSeleccionados.shift() // elimina el más antiguo
        }
        this.asientosSeleccionados.push(asiento.codigo)
      }
    },
    realizarCompra() {
      if (this.tipoEntrada === 'numerada' && this.asientosSeleccionados.length !== this.cantidad) {
        alert(`Debes seleccionar exactamente ${this.cantidad} asiento(s).`)
        return
      }
      this.compraExitosa = true
    }
  }
}
</script>

<style scoped>
.comprar-container {
  padding: 40px;
  color: white;
}

.grid-container {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.info-panel {
  flex: 1;
  min-width: 250px;
  background-color: #ffffff22;
  padding: 30px;
  border-radius: 20px;
}

.input-select {
  width: 100%;
  margin: 10px 0 20px;
  padding: 10px;
  border-radius: 8px;
  border: none;
}

.asientos-panel {
  flex: 2;
  min-width: 300px;
}

.escenario {
  background-color: #ff416c;
  color: white;
  text-align: center;
  padding: 10px;
  margin-bottom: 15px;
  font-weight: bold;
  border-radius: 8px;
}

.asientos-grid {
  display: grid;
  grid-template-columns: repeat(18, 1fr);
  gap: 6px;
}

.asiento {
  background-color: #1e90ff;
  border-radius: 4px;
  padding: 5px 0;
  text-align: center;
  font-size: 10px;
  color: white;
  cursor: pointer;
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
  padding: 12px 30px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.btn-comprar:hover {
  background-color: #ff416c;
  transform: scale(1.05);
}

.mensaje-exito {
  margin-top: 20px;
  font-size: 1.3rem;
  color: #00ff99;
}
</style>
