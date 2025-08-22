<template>
    <AdminLayout>
        <v-card flat style="width: 98%;">  
            <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-city"></v-icon> &nbsp; Visualizar Estado&nbsp;&nbsp;
                <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-list dense>
                    <v-list-item>
                        
                        <v-list-item-title><strong>ID:</strong> {{ id }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title><strong>Nome:</strong> {{ nome }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title><strong>Cidade:</strong> {{ cidade }} / {{ estado }}</v-list-item-title>
                    </v-list-item>
                </v-list>
                <v-btn flat color="teal" variant="outlined" class="me-4" @click="handlGoBack">Voltar</v-btn>    
            </v-card-text>
        </v-card>
    </AdminLayout>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'    
    import { cidade_find_by_id } from '@/services/cidade_services';

    const router = useRouter()
    const route = useRoute()

    const id = ref('')
    const nome = ref('')
    const cidade = ref('')
    const estado = ref('')

    onMounted(async () => {
        const id_param = route.params.id
        const response = await cidade_find_by_id(id_param)
        console.log('onMounted', response)
        id.value = response.id
        nome.value = response.nome
        cidade.value = response.uf.nome
        estado.value = response.uf.sigla
    })
    
    function handlGoBack() {
        router.push('/cidade')
    }
</script>
