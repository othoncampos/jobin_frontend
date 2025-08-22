<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useAuthStore } from '@/store/auth' 
  import { useRouter } from 'vue-router'
  import UploadFile from "./UploadFile"
  import { lista_classificacao_arquivo } from '@/services/Data_Values';
import { colaborador_dados_minimos } from '@/services/colaborador_service';
  
  const router = useRouter()
  const auth = useAuthStore()

  const props = defineProps({
    class_id: {type: Number, default: 0},
  });

  const messages = ref([])

  const selectDefault = lista_classificacao_arquivo[ props.class_id ]
  const selectOptions = lista_classificacao_arquivo

  const select = ref(selectDefault)
  const clickUpload = ref(false)
  const upload = ref(false)
  const files = ref([])
  
  const disableFileUpload = computed(() => select.value.id === 0)
  const disableClassFile = computed(() => props.class_id > 0)
  const enableUploadButton = computed(() => select.value.id !== 0 && files.value.length > 0 && !clickUpload.value)

  onMounted(() => {
      handleClean()
  })

  const handleClean = () => {
      files.value = []
      select.value = selectDefault
      upload.value = false
      clickUpload.value = false
  }

  const handleGoBack = () => {
      console.log('Go back acionado')
      router.back();
  }

  const handleSubmit = () => {
      upload.value = true
      clickUpload.value = true
  }

  function onUploadSuccess(data) {
      console.log('Upload com sucesso:', data)
  }

  function onUploadFail(error) {
      // console.error('Erro no upload.novo:', error)
      messages.value.push({
        text: error.filename + ': ' + error.descricao,
        color: 'error',
        timeout: 3000,
      })            
  }

  function onUploadCancelled(data) {
      console.warn('Upload cancelado:', data.data)
  }

  function removeFileFromList(data) {
      files.value = files.value.filter(u => u.name !== data.fileName)
  }

  function handleDeleteError(data) {
      messages.value.push({
          text: data.fileName + ': ' + data.error,
          color: 'error',
          timeout: 3000,
      })
  }

</script>

<template>
  <AdminLayout>
    <b-row>
      <b-col lg="12">
        <b-row class="justify-content-evenly mb-4">
          
          <b-card no-body>
            <b-card-header>Upload de Arquivos</b-card-header>
            <b-card-body>
              <label>Classificação do Arquivo</label>

              <v-select v-model="select"
                :items="selectOptions"
                item-title="nome"
                item-value="id"
                label="Selecione a classificação"
                return-object
                single-line
                persistent-hint
                class="mb-4"
                :disabled="disableClassFile"
              />

              <v-file-input
                v-model="files"
                :show-size="1000"
                label="Selecione os arquivos"
                placeholder="Selecionar arquivos"
                prepend-icon="mdi-paperclip"
                variant="outlined"
                counter
                multiple
                :disabled="disableFileUpload"
              >
                <template v-slot:selection="{ fileNames }">
                  <template v-for="(fileName, index) in fileNames" :key="fileName">
                    <v-chip
                      v-if="index < 4"
                      class="me-2"
                      color="deep-purple-accent-4"
                      size="small"
                      label
                    >
                      {{ fileName }}
                    </v-chip>

                    <span
                      v-else-if="index === 4"
                      class="text-overline text-grey-darken-3 mx-2"
                    >
                      +{{ files.length - 4 }} arquivo(s)
                    </span>
                  </template>
                </template>
              </v-file-input>
            </b-card-body>

            
            <b-card-footer>
              <v-btn
                variant="elevated"
                color="blue"
                :disabled="!enableUploadButton"
                @click="handleSubmit"
                class="me-2"
              >Upload</v-btn>

              <v-btn
                variant="outlined"
                color="blue"
                @click="handleClean"
                class="me-2"
              >Limpar</v-btn>

              <v-btn
                variant="tonal"
                color="teal"
                @click="handleGoBack"
                class="me-2"
              >Voltar</v-btn>
            </b-card-footer>
          </b-card>
        </b-row>
      </b-col>
    </b-row>

    <!-- Seção de progresso -->
    <b-row v-if="upload && files.length > 0">
      <b-col lg="12">
        <b-row class="justify-content-evenly mb-4">
          <b-card no-body>
            <b-card-header>Andamento do Upload</b-card-header>
            <b-card-body>
              <v-list lines="three" select-strategy="leaf">
                <v-list-item v-for="file in files" :key="file.name">
                  <UploadFile 
                    :file="file"
                    :emp_id="auth.getEmpId()"
                    :user_id="auth.getUserId()"
                    :size="file.size"
                    :class_id="Number(select.id)"
                    @upload-success="onUploadSuccess"
                    @upload-fail="onUploadFail"
                    @upload-cancelled="onUploadCancelled"
                    @file-deleted="removeFileFromList"
                    @file-delete-fail="handleDeleteError"
                  />
                </v-list-item>
              </v-list>
            </b-card-body>
          </b-card>
        </b-row>
      </b-col>
    </b-row>

    <v-snackbar-queue
        v-model="messages"
        location="top right"
        close-on-content-click
    />
  </AdminLayout>
</template>
