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
                        <v-list-item-title><strong>Sigla:</strong> {{ sigla }}</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-list-item-title><strong>Nome:</strong> {{ nome }}</v-list-item-title>
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
    import { uf_find_by_id } from '@/services/uf_services'

    const router = useRouter()
    const route = useRoute()

    const id = ref('')
    const sigla = ref('')
    const nome = ref('')

    onMounted(async () => {
        const id_param = route.params.id
        const response = await uf_find_by_id(id_param)
        
        id.value = response.id
        sigla.value = response.sigla
        nome.value = response.nome
    })
    
    function handlGoBack() {
        router.push('/uf')
    }
</script>
