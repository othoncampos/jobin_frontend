<template>
  <b-card class="card-box p-0">
    <div class="p-0 d-flex align-items-center justify-content-center" style="height: 100%">
      <iframe v-if="pdfUrl" :src="pdfUrl" style="width: 100%; height: 100%; border: none"></iframe>
      <div v-else class="d-flex flex-column justify-content-center mt-3">
        <div class="box-img m-auto">
          <img src="../assets/file.png" alt="file" />
        </div>
        <p class="text-muted">Nenhum PDF selecionado para visualização.</p>
      </div>
    </div>
  </b-card>
</template>

<script setup>
    import { ref, watch, onUnmounted } from 'vue';
    import { defineProps } from "vue";

    const props = defineProps({
        pdfBlob: {
            type: Blob,
            default: null
        }
    });

    const pdfUrl = ref(null);

    // Função para atualizar a URL sempre que o blob mudar
    const updatePdfUrl = (newBlob) => {
        // Libera a URL anterior para evitar vazamentos de memória
        if (pdfUrl.value) {
            window.URL.revokeObjectURL(pdfUrl.value);
        }
        pdfUrl.value = newBlob ? window.URL.createObjectURL(newBlob) : '';
    };

    // Observa mudanças no blob para atualizar a URL
    watch(() => props.pdfBlob, (newBlob) => {updatePdfUrl(newBlob);}, { immediate: true });

    // Garante que a URL seja revogada quando o componente for desmontado
    onUnmounted(() => {
        if (pdfUrl.value) {
            window.URL.revokeObjectURL(pdfUrl.value);
        }
    });
</script>

<style scoped>
    .card-box {
      height: 640px;
      overflow: hidden; /* Adiciona overflow hidden para impedir scroll indesejado */
    }

    .card-box iframe {
      width: 100%; /* Garante que o iframe preencha o card horizontalmente */
      height: 100%; /* Garante que o iframe preencha o card verticalmente */
      border: none; /* Remove a borda do iframe */
    }

    .box-img {
      width: 280px;
      height: 280px;
    }

    .box-img img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
</style>
