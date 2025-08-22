<template>
  <AdminLayout>
    <v-card flat style="width: 95%;">  
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-office-building"></v-icon> &nbsp; Campi&nbsp;&nbsp;

        <v-spacer></v-spacer>
        <v-btn variant="flat" color="success" @click="handleNew">Novo</v-btn>
        &nbsp;&nbsp;

        <v-select
          v-model="selectedUf"
          :items="ufs"
          item-title="label"
          item-value="id"
          density="compact"
          label="Filtrar por Estado"
          clearable
          variant="solo-filled"
          flat
          hide-details
        />

        <v-select
          v-model="selectedCidade"
          :items="cidades"
          item-title="label"
          item-value="id"
          density="compact"
          label="Filtrar por cidade"
          clearable
          variant="solo-filled"
          flat
          hide-details
        ></v-select>
        &nbsp;

        <v-text-field
          v-model="search"
          density="compact"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
          clearable
        ></v-text-field>

        <v-btn
          variant="flat"
          color="warning"
          class="ml-4"
          @click="limparFiltros"
        >
          <v-icon start>mdi-broom</v-icon> Limpar Filtros
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-data-table :headers="headers" :items="filtered">
        <template v-slot:item.cidade="{ item }">
          {{ item.cidade.nome }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn size="small" icon color="info" @click="viewItem(item)">
            <v-icon>mdi-eye</v-icon>
            <v-tooltip activator="parent" location="top">Visualizar: {{item.nome}}</v-tooltip>
          </v-btn>
          &nbsp;
          <v-btn size="small" icon color="primary" @click="editItem(item)">
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="top">Editar: {{item.nome}}</v-tooltip>
          </v-btn>
          &nbsp;
          <v-btn size="small" icon color="error" @click="deleteItem(item)">
            <v-icon>mdi-delete</v-icon>
            <v-tooltip activator="parent" location="top">Deletar: {{item.nome}}</v-tooltip>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import { cidade_lista_all } from '@/services/cidade_services'
import { campi_lista_all, campi_delete } from '@/services/campi_services'
import { uf_lista_all } from '@/services/uf_services'

const router = useRouter()

onMounted(() => {
  atualizarCampi()
  atualizarCidades()
  atualizarUfs()
})

const itens = ref([])
const search = ref('')
const cidades = ref([])
const selectedCidade = ref(null)

const ufs = ref([])
const selectedUf = ref(null)

const headers = [
  { align: 'start', key: 'id', title: 'Código', sortable: false },
  { key: 'nome', title: 'Nome', sortable: true },
  { key: 'sigla', title: 'Sigla', sortable: true },
  { key: 'cidade', title: 'Cidade', sortable: true },
  { key: 'actions', title: 'Ações', sortable: false }
]

const filtered = computed(() => {
  return itens.value.filter(item => {
    const matchesSearch = !search.value || item.nome.toLowerCase().includes(search.value.toLowerCase());
    const matchesCidade = !selectedCidade.value || (item.cidade && item.cidade.id === selectedCidade.value);
    const matchesUf = !selectedUf.value || (item.cidade && item.cidade.uf && item.cidade.uf.id === selectedUf.value);
    return matchesSearch && matchesCidade && matchesUf;
  });
})

function atualizarCampi() {
  campi_lista_all()
    .then(resp => {
      itens.value = resp
    })
    .catch(err => {
      console.error('Erro ao atualizar campi:', err)
    })
}

function atualizarUfs() {
  uf_lista_all()
    .then(resp => {
      ufs.value = resp
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .map(uf => ({
          id: uf.id,
          label: `${uf.sigla} - ${uf.nome}`
        }));
    })
    .catch(err => {
      console.error('Erro ao carregar UFs:', err)
    })
}

function atualizarCidades() {
  cidade_lista_all()
    .then(resp => {
      cidades.value = resp
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .filter(c => !selectedUf.value || c.uf.id === selectedUf.value)
        .map(cidade => ({
          id: cidade.id,
          label: cidade.nome
        }))
    })
    .catch(err => {
      console.error('Erro ao atualizar cidades:', err)
    })
}

watch(selectedUf, () => {
  atualizarCidades()
  selectedCidade.value = null
})

function editItem(item) {
  router.push(`/editcampi/${item.id}`)
}

async function deleteItem(item) {
  if (confirm(`Tem certeza que deseja deletar o campi: ${item.nome}?`)) {
    try {
      await campi_delete(item.id)
      atualizarCampi()
    } catch (err) {
      console.error('Erro ao deletar:', err)
    }
  }
}

function viewItem(item) {
  router.push(`/viewcampi/${item.id}`)
}

function handleNew() {
  router.push('/newcampi')
}

function limparFiltros() {
  search.value = ''
  selectedUf.value = null
  selectedCidade.value = null
}
</script>
