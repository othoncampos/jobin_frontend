<template>
  <v-card class="pa-0 fill-height" elevation="2" style="min-height: 300px;">
    <v-container
      fluid
      class="pa-0 ma-0 fill-height d-flex align-center justify-center"
    >
      <!-- PDF ativo -->
      <iframe
        v-if="pdfUrl"
        :src="pdfUrl"
        class="pdf-frame"
      />
      
      <!-- Nenhum PDF -->
      <div
        v-else
        class="d-flex flex-column align-center justify-center text-center"
        style="width: 100%; height: 100%;"
      >
        <v-img
          src="@/assets/file.png"
          alt="Arquivo"
          max-width="280"
          max-height="280"
          contain
        />
        <p class="text-medium-emphasis mt-4">
          Nenhum PDF selecionado para visualização.
        </p>
      </div>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';

const props = defineProps({
  pdfBlob: {
    type: Blob,
    default: null
  }
});

const pdfUrl = ref(null);

const updatePdfUrl = (newBlob) => {
  if (pdfUrl.value) {
    window.URL.revokeObjectURL(pdfUrl.value);
  }
  pdfUrl.value = newBlob ? window.URL.createObjectURL(newBlob) : '';
};

watch(() => props.pdfBlob, updatePdfUrl, { immediate: true });

onUnmounted(() => {
  if (pdfUrl.value) {
    window.URL.revokeObjectURL(pdfUrl.value);
  }
});
</script>

<style scoped>
  .pdf-frame {
    width: 100%;
    height: 100%;
    border: none;
  }

  .v-card {
    max-height: 100%;
    height: 100%;
  }
</style>
