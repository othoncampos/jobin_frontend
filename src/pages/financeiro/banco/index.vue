<template>
    <AdminLayout>
        <v-card flat style="width: 98%;">  
            <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-bank"></v-icon> &nbsp; Bancos&nbsp;&nbsp;
                <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <div class="d-flex align-center justify-start ga-2 me-2"> 
                    <v-btn variant="flat" color="tonal" @click="handlGoBack">Voltar</v-btn>
                    <v-btn variant="flat" color="success" @click="handleNew">Novo</v-btn>
                </div>

                <v-data-table :headers="headers" :items="filtered">
                    <template v-slot:item.uf="{ item }">
                        {{ item.uf.sigla }} - {{ item.uf.nome }}
                    </template>
                    <template #item.fl_ativo="{ item }">
                        <v-chip :color="getSimNao(item.fl_ativo).cor" dark>
                            <v-icon start>{{ getSimNao(item.fl_ativo).icon }}</v-icon>
                            {{ getSimNao(item.fl_ativo).nome }}
                        </v-chip>
                    </template>
                    <template #item.fl_emite_boleto="{ item }">
                        <v-chip :color="getSimNao(item.fl_emite_boleto).cor" dark>
                            <v-icon start>{{ getSimNao(item.fl_emite_boleto).icon }}</v-icon>
                            {{ getSimNao(item.fl_emite_boleto).nome }}
                        </v-chip>
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
            </v-card-text>
        </v-card>
    </AdminLayout>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    import { banco_lista_all } from '@/services/banco_services';
    import { getSimNao } from '@/services/Data_Values';

    const router = useRouter()

    onMounted(() => {
        atualizar_lista()
    })

    const itens = ref([])
    const search = ref('')

    const headers = [
        { title: 'Nr Banco', key: 'nr_banco', align: 'start', sortable: true},
        { title: 'Nome', key: 'nm_banco', align: 'start', sortable: true },
        { title: 'URL', key: 'url_banco', align: 'start', sortable: false},
        { title: 'Logo', key: 'url_logo', align: 'center', sortable: false},
        { title: 'Ativo?', key: 'fl_ativo', align: 'center', sortable: false},
        { title: 'Boleto?', key: 'fl_emite_boleto', align: 'center', sortable: false},
        { title: 'Criado', key: 'create_at', align: 'center', sortable: false},
        { title: 'Modificado', key: 'update_at', align: 'center', sortable: false},
        { title: 'Ações', key: 'actions', align: 'center', sortable: false }
    ]

    const filtered = computed(() => {
        return itens.value.filter(item => {
            const matchesSearch = !search.value || item.nome.toLowerCase().includes(search.value.toLowerCase());
            return matchesSearch;
        });
    });

    function atualizar_lista() {
        banco_lista_all()
        .then( resp => {
            console.log('atualizar_lista', resp)
            itens.value = resp
        })
        .catch(err => {
            console.error('Erro ao atualizar estados:', err)
        });
    }

    function editItem(item) {
        console.log(item)
        router.push(`/banco_edit/${item.id}`)
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
        router.push('/banconovo')
    }

    function handlGoBack() {
        router.push('/dashadmin')
    }
    
</script>