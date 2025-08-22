<script setup>
    import Api from '@/services/Api';
    import { arquivo_delete } from '@/services/arquivo_service';
    import { formatFileSize } from '@/services/util';
    import { ref, onMounted, defineEmits, defineProps, computed } from 'vue'
    
    const emit = defineEmits(['upload-success', 'upload-fail', 'upload-cancelled', 'file-deleted', 'file-delete-fail'])

    const props = defineProps({
        file: File,
        emp_id: Number,
        user_id: Number,
        class_id: Number,
        size: Number, 
    })

    const deleting = ref(false)

    const fileName = computed(() => props.file.name || 'Arquivo desconhecido')
    const fileSize = computed(() => formatFileSize(props.file.size) || 0)

    const file_id = ref(0)
    const sending = ref(true)
    const uploadProgress = ref(20);
    const error_upload = ref(false)
    const error_desc = ref('Erro no Upload')
    
    
    const abortController = ref(null)

    // Funções de feedback (você pode conectar com seu sistema de snackbar)
    function showError(message) {
      console.error("UploadFole.showError: ", message)
      error_upload.value = true
      error_desc.value = message
    }

    function showSuccess(message) {
      console.log("UploadFole.showSuccess: ", message)
    }

    function getErrorMessage(err) {
      console.log("UploadFile.getErrorMessage: ", err)
      if (err.name === 'AbortError') return 'Upload cancelado pelo usuário'
      if (err?.response?.data?.detail) return err.response.data.detail
      if (err?.response?.data?.message) return err.response.data.message
      if (err?.data?.detail?.descricao) return err.data.detail.descricao
      if (err?.message) return err.message
      return 'Erro desconhecido'
    }

    // Função de envio
    const handleSubmit = async () => {
      // const user = JSON.parse(localStorage.getItem('user'))

      const formData = new FormData()
      formData.append('file', props.file)
      formData.append('class_id', props.class_id)
      formData.append('emp_id', props.emp_id)
      formData.append('user_id', props.user_id)

      abortController.value = new AbortController()

      try {
        const response = await Api
          .postMultipart(
            '/arq/upload', 
            formData, 
            (progressEvent) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              uploadProgress.value = percent;
            },
            abortController.value.signal
          );

        // console.log('UploadFole: Upload concluído:', response);
        uploadProgress.value = 100;
        sending.value = false;
        file_id.value = response;

        emit('upload-success', {file_id: response})
        showSuccess('UploadFole: Upload concluído com sucesso!')
      } catch (err) {
        console.log(err)
        const msg = getErrorMessage(err)  
        if (err.name === 'AbortError') {
          emit('upload-cancelled', { file: props.file })
        } else {
          emit('upload-fail', {
            "filename": err.data.detail.filename,
            "descricao": err.data.detail.descricao
        })
        }
        showError(msg)
        
        uploadProgress.value = 0;
        error_upload.value=true;
        error_desc.value = msg
        
      } finally{
        sending.value = false
      }
    }

    const cancelUpload = () => {
        if (abortController.value) {
            abortController.value.abort()
        }
    }

    const deleteFile = async (emp_id, file_id) => {
      deleting.value = true
      try {
        await arquivo_delete(emp_id, file_id)
        emit('file-deleted', { "fileName": fileName.value })
      } catch (error) {
        console.error(error)
        var msg = getErrorMessage(error)
        emit('file-delete-fail', { "fileName": fileName.value, error: msg })
      } finally {
        setTimeout(() => (deleting.value = false), 13000)
      }
    }

    onMounted(() => {
      handleSubmit()

    })
</script>

<template>
  <v-card class="pa-3 my-2" variant="tonal">
    <v-row>
      <v-col cols="8">
        <div>
          <h5 class="text-subtitle-1 mb-1">{{ fileName }}</h5>
          <p><strong>{{ fileSize }}</strong></p>
        </div>
      </v-col>

      <v-col cols="4" class="d-flex align-center justify-end">

  <!-- Caso sem erro -->
  <div v-if="!error_upload" class="d-flex align-center flex-wrap gap-2">
    <!-- Barra de progresso circular -->
    <v-progress-circular
      v-if="sending"
      :model-value="uploadProgress"
      :rotate="360"
      :size="35"
      :width="5"
      color="teal"
    >
      {{ upload_value }}
    </v-progress-circular>

    <!-- Botão de cancelar durante envio -->
    <v-btn v-if="sending" variant="flat" color="yellow-lighten-4" @click="cancelUpload">Abortar</v-btn>

    <!-- Botão de delete quando não está enviando -->
    


    <div v-else class="d-flex align-center space-around">
      <v-icon color="success" size="x-large" icon="mdi-check-outline"></v-icon>
      <v-chip variant="text">Upload Concluido</v-chip>
      <v-btn variant="flat" @click="deleteFile(emp_id, file_id)" color="red" :loading="deleting">Delete</v-btn>
    </div>
  </div>

  <!-- Caso com erro -->
  <div v-else class="d-flex align-center space-around">
    <v-icon color="error" size="x-large" icon="mdi-alert"></v-icon>
    <v-chip variant="text">
      {{ error_desc }}
    </v-chip>
    <v-btn variant="text" @click="clearError">Fechar</v-btn>
  </div>

</v-col>

      
                                    
    </v-row>
  </v-card>
</template>
