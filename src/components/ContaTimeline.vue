<script setup>
const props = defineProps({
  eventos: {
    type: Array,
    required: true,
    default: () => []
    // Cada item: { data: '2025-07-01', quantidade: 12, valor: 5230.00 }
  }
})
</script>

<template>
  <v-card class="pa-4">
    <v-card-title class="text-h6">Contas por Data</v-card-title>

    <v-card-text>
      <v-timeline side="end" align="start" density="compact">
        <v-timeline-item
          v-for="(evento, index) in eventos"
          :key="index"
          dot-color="error"
        >
          <template #opposite>
            <div class="text-caption text-grey-darken-1">
              {{ formatarData(evento.data) }}
            </div>
          </template>

          <div class="text-subtitle-1 font-weight-medium">
            {{ evento.quantidade }} contas
          </div>
          <div class="text-body-2 text-grey-darken-2">
            Valor total: {{ formatarValor(evento.valor) }}
          </div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>

<script>
function formatarData(dataStr) {
  const [ano, mes, dia] = dataStr.split('-')
  return `${dia}/${mes}/${ano}`
}

function formatarValor(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}
</script>
