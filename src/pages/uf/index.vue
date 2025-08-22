<template>
    <AdminLayout>
        <!-- <v-card flat style="width: 95%;">   -->
        <v-card flat>  
            <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-city"></v-icon> &nbsp; Estados&nbsp;&nbsp;
                <v-spacer></v-spacer>
                <v-btn variant="flat" color="success" @click="handleNew">Novo</v-btn>&nbsp;
                &nbsp;&nbsp;
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
            </v-card-title>

            <v-divider></v-divider>
            <v-data-table :headers="headers" :items="filtered">
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

    import { uf_delete, uf_lista_all } from '@/services/uf_services';

    const router = useRouter()

    onMounted(() => {
        atualizar_estados()
    })

    const itens = ref([])
    const search = ref('')

    const headers = [
        { align: 'start', key: 'id', title: 'Código', sortable: true},
        { key: 'sigla', title: 'Sigla', sortable: true },
        { key: 'nome', title: 'Nome', sortable: true },
        { key: 'actions', title: 'Ações', sortable: false }
    ]
    
    const filtered = computed(() => {
        if (!search.value) return itens.value
        
        const searchLower = search.value.toLowerCase()
        return itens.value.filter(item => 
            item.nome.toLowerCase().includes(searchLower)
        )
    })

    function atualizar_estados() {
        uf_lista_all()
        .then( resp => {
            console.log('ufs.atualizar_estados', resp)
            itens.value = resp
        })
        .catch(err => {
            console.error('Erro ao atualizar estados:', err)
        });
    }

    function editItem(item) {
        router.push(`/edituf/${item.id}`)
    }

    async function deleteItem(item) {
        if (confirm(`Tem certeza que deseja deletar o estado: ${item.nome}?`)) {
            try {
                await uf_delete(item.id);
                atualizar_estados();
            } catch (err) {
                console.error('Erro ao deletar:', err)
            }
        }
    }

    function viewItem(item) {
        router.push(`/viewuf/${item.id}`)
    }

    function handleNew() {
        router.push('/newuf')
    }
</script>