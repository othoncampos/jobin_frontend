<template>
    <AdminLayout>
        <v-card flat style="width: 98%;">  
            <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-city"></v-icon> &nbsp; Cadastro de Cidades&nbsp;&nbsp;
                <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <form @submit.prevent="submit">
                    <v-text-field v-model="nome" :rules="nomeRules" label="Nome"></v-text-field>
                    <Select_estado v-model="selectedUf"></Select_estado>
                    <v-btn flat color="teal" class="me-4" type="submit">Salvar</v-btn>
                    <v-btn variant="outlined" class="me-4" @click="handleReset">clear</v-btn>
                    <v-btn flat color="teal" variant="outlined" class="me-4" @click="handlGoBack">Voltar</v-btn>
                </form>
            </v-card-text>
        </v-card>
    </AdminLayout>
</template>

<script setup>
    import { cidade_add } from '@/services/cidade_services';
    import { uf_add } from '@/services/uf_services';
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const selectedUf = ref(null)
  
    const codigo = ref('')
    const nome = ref('')
    const nomeRules = [
        v => (!!v && v.length >= 3) || 'Nome deve ter pelo menos 3 caracteres.'
    ]

    function submit() {
        let formData = {
            // id: codigo.value,
            nome: nome.value,
            uf: { id: selectedUf.value }
        } 
        cidade_add(formData)
        .then( resp => {
            router.push('/cidade')
        })
    }

    function handleReset() {
        id.value = ''
        sigla.value = ''
        nome.value = ''
    }

    function handlGoBack() {
        router.push('/uf')
    }
</script>