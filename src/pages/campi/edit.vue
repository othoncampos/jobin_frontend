<template>
  <AdminLayout>
    <v-card flat style="width: 98%;">
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-city"></v-icon> &nbsp; Editar Campus&nbsp;&nbsp;
        <v-spacer></v-spacer>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <form @submit.prevent="submit">
          <v-text-field v-model="id" label="Código" disabled />
          <v-text-field v-model="nome" :rules="nomeRules" label="Nome" />
          <v-text-field v-model="sigla" :rules="siglaRules" label="Sigla" />

          <v-select
            v-model="estadoSelecionado"
            :items="estados"
            item-title="nome"
            item-value="id"
            label="Selecione um Estado"
            return-object
            clearable
            @update:modelValue="handleEstadoChange"
          />

          <v-select
            v-model="cidadeSelecionadaId"
            :items="cidadesFiltradas"
            item-title="nome"
            item-value="id"
            :label="cidadeLabel"
            clearable
            :disabled="!estadoSelecionado"
          />

          <v-btn flat color="teal" class="me-4" type="submit">Salvar</v-btn>
          <v-btn flat color="teal" variant="outlined" class="me-4" @click="handlGoBack">Voltar</v-btn>
        </form>
      </v-card-text>
    </v-card>
  </AdminLayout>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { campi_find_by_id, campi_update } from '@/services/campi_services'
  import { cidade_lista_all } from '@/services/cidade_services'
  import { uf_lista_all } from '@/services/uf_services'

  const router = useRouter()
  const route = useRoute()

  const id = ref('')
  const nome = ref('')
  const sigla = ref('')
  const estados = ref([])
  const cidades = ref([])
  const cidadesFiltradas = ref([])
  const cidadeLabel = ref('Selecione uma Cidade')

  const estadoSelecionado = ref(null)
  const cidadeSelecionadaId = ref(null)
  const carregandoInicialmente = ref(true)
  const estadoFoiAlterado = ref(false)

  const nomeRules = [
    v => (!!v && v.length >= 3) || 'Nome deve ter pelo menos 3 caracteres.'
  ]
  const siglaRules = [
    v => (!!v && /^[A-Z]{2}$/.test(v)) || 'Sigla deve ter 2 letras maiúsculas.'
  ]

  onMounted(async () => {
    const estadosNaoOrdenados = await uf_lista_all()
    estados.value = estadosNaoOrdenados.sort((a, b) => a.nome.localeCompare(b.nome))
    
    cidades.value = await cidade_lista_all()

    const id_param = route.params.id
    const response = await campi_find_by_id(id_param)

    id.value = response.id
    nome.value = response.nome
    sigla.value = response.sigla

    const cidade = response.cidade
    estadoSelecionado.value = estados.value.find(e => e.id === cidade.uf.id)
    cidadesFiltradas.value = cidades.value.filter(c => c.uf.id === cidade.uf.id)
    cidadeSelecionadaId.value = cidade.id

    carregandoInicialmente.value = false
  })

  function handleEstadoChange() {
    if (carregandoInicialmente.value) return
    
    estadoFoiAlterado.value = true
    cidadeLabel.value = "Escolha uma nova cidade"
    
    if (estadoSelecionado.value?.id) {
      cidadesFiltradas.value = cidades.value.filter(c => c.uf.id === estadoSelecionado.value.id)
      cidadeSelecionadaId.value = null
    } else {
      cidadesFiltradas.value = []
      cidadeSelecionadaId.value = null
    }
  }

  watch(estadoSelecionado, (novoEstado) => {
    if (carregandoInicialmente.value) return

    if (novoEstado?.id) {
        cidadesFiltradas.value = cidades.value
            .filter(c => c.uf.id === novoEstado.id)
            .sort((a, b) => a.nome.localeCompare(b.nome))
    } else {
        cidadesFiltradas.value = []
        cidadeSelecionadaId.value = null
    }
  })

  function submit() {
    if (!cidadeSelecionadaId.value) {
      alert("Selecione uma cidade.")
      return
    }

    const formData = {
      id: id.value,
      nome: nome.value,
      sigla: sigla.value,
      cidade: { id: cidadeSelecionadaId.value }
    }

    campi_update(formData)
      .then(() => {
        router.push('/campi')
      })
      .catch(() => {
        alert("Erro ao atualizar campus.")
      })
  }

  function handlGoBack() {
    router.push('/campi')
  }
</script>