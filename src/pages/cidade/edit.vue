<template>
    <AdminLayout>
        <v-card flat style="width: 98%;">  
            <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-city"></v-icon> &nbsp; Editar Cidade&nbsp;&nbsp;
                <v-spacer></v-spacer>
            </v-card-title> 
            <v-divider></v-divider>
            <v-card-text>
                <form @submit.prevent="submit">
                    <v-text-field v-model="id" label="Código" disabled="true"></v-text-field>
                    <v-text-field v-model="nome" :rules="nomeRules" label="Nome"></v-text-field>
                    <Select_estado v-model="selectedUf"></Select_estado>

                    <v-btn flat color="teal" class="me-4" type="submit">Salvar</v-btn>
                    <v-btn flat color="teal" variant="outlined" class="me-4" @click="handlGoBack">Voltar</v-btn>
                </form>
            </v-card-text>
        </v-card>
    </AdminLayout>
</template>

<script setup>
    import { ref, onMounted } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { cidade_find_by_id, cidade_update } from '@/services/cidade_services';

    const router = useRouter()
    const route = useRoute()

    const id = ref('')
    const nome = ref('')
    const selectedUf = ref('')
    
    onMounted(async () => {
        const id_param = route.params.id
        const response = await cidade_find_by_id(id_param)
        id.value = response.id
        nome.value = response.nome
        selectedUf.value = response.uf.id
    })

    const nomeRules = [
        v => (!!v && v.length >= 3) || 'Nome deve ter pelo menos 3 caracteres.'
    ]

    function submit() {
        let formData = {
            id: id.value,
            nome: nome.value,
            uf: { id: selectedUf.value }
        } 
        
        cidade_update(formData)
        .then( resp => {
            router.push('/cidade')
        });
    }

    function handlGoBack() {
        router.push('/cidade')
    }
</script>
