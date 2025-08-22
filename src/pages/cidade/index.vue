<template>
    <AdminLayout>
        <v-card flat style="width: 95%;">  
            <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-city"></v-icon> &nbsp; Cidades&nbsp;&nbsp;
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="success" @click="handleNew">Novo</v-btn>&nbsp;
                &nbsp;
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
                <template v-slot:item.uf="{ item }">
                    {{ item.uf.sigla }} - {{ item.uf.nome }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-btn size="small" icon color="info" @click="viewItem(item)">
                        <v-icon>mdi-eye</v-icon> <!-- Visualizar -->
                        <v-tooltip activator="parent" location="top">Visualizar: {{item.nome}}</v-tooltip>
                    </v-btn>
                    &nbsp;
                    <v-btn size="small" icon color="primary" @click="editItem(item)">
                        <v-icon>mdi-pencil</v-icon>
                        <v-tooltip activator="parent" location="top">Editar: {{item.nome}}</v-tooltip>
                    </v-btn>
                    &nbsp;
                    <v-btn size="small" icon color="error" @click="deleteItem(item)">
                        <v-icon>mdi-delete</v-icon> <!-- Deletar -->
                        <v-tooltip activator="parent" location="top">Deletar: {{item.nome}}</v-tooltip>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
    </AdminLayout>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    import { uf_lista_all } from '@/services/uf_services';
    import { cidade_lista_all, cidade_delete } from '@/services/cidade_services';

    const router = useRouter()

    onMounted(() => {
        atualizar_cidades()
        atualizar_ufs();
    })

    const itens = ref([])
    const search = ref('')

    const ufs = ref([]);
    const selectedUf = ref(null);

    const headers = [
        { align: 'start', key: 'id', title: 'Código', sortable: true},
        { key: 'nome', title: 'Nome', sortable: true },
        { key: 'uf', title: 'Estado', sortable: true },
        { key: 'actions', title: 'Ações', sortable: false }
    ]
    
    const filtered = computed(() => {
        return itens.value.filter(item => {
            const matchesSearch = !search.value || item.nome.toLowerCase().includes(search.value.toLowerCase());
            const matchesUf = !selectedUf.value || (item.uf && item.uf.id === selectedUf.value);
            return matchesSearch && matchesUf;
        });
    });

    function atualizar_cidades() {
        cidade_lista_all()
        .then( resp => {
            itens.value = resp
        })
        .catch(err => {
            console.error('Erro ao atualizar estados:', err)
        });
    }

    function atualizar_ufs() {
        uf_lista_all()
        .then(resp => {
            // Mapear para um formato mais amigável (ex: AL - Alagoas)
            ufs.value = resp.map(uf => ({
                id: uf.id,
                label: `${uf.sigla} - ${uf.nome}`
            }));
        })
        .catch(err => {
            console.error('Erro ao atualizar estados:', err);
        });
    }

    function editItem(item) {
        router.push(`/editcid/${item.id}`)
    }

    async function deleteItem(item) {
        if (confirm(`Tem certeza que deseja deletar o estado: ${item.nome}?`)) {
            try {
                await cidade_delete(item.id);
                atualizar_cidades();
            } catch (err) {
                console.error('Erro ao deletar:', err)
            }
        }
    }

    function viewItem(item) {
        router.push(`/viewcid/${item.id}`)
    }

    function handleNew() {
        router.push('/newcid')
    }

    function limparFiltros() {
        search.value = ''
        selectedUf.value = null
    }
</script>