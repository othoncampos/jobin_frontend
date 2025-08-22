<template>
    <AdminLayout>
        <v-card flat style="width: 98%;">  
            <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-city"></v-icon> &nbsp; Cadastro de Estados&nbsp;&nbsp;
                <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <form @submit.prevent="submit">
                    <!-- <v-text-field v-model="id" :rules="idRules" label="ID"></v-text-field> -->
                    <v-text-field v-model="sigla" :rules="siglaRules" label="Sigla"></v-text-field>
                    <v-text-field v-model="nome" :rules="nomeRules" label="Nome"></v-text-field>

                    <v-btn flat color="teal" class="me-4" type="submit">Salvar</v-btn>
                    <v-btn variant="outlined" class="me-4" @click="handleReset">clear</v-btn>
                    <v-btn flat color="teal" variant="outlined" class="me-4" @click="handlGoBack">Voltar</v-btn>
                </form>
            </v-card-text>
        </v-card>
    </AdminLayout>
</template>

<script setup>
    import { uf_add } from '@/services/uf_services';
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()
  
    const id = ref('')
    const idRules = [
        v => (!!v && /^\d+$/.test(v)) || 'ID deve conter apenas números.',
        v => (!!v && v.length >= 2) || 'ID deve ter pelo menos 2 dígitos.'
    ]

    const sigla = ref('')
    const siglaRules = [
        v => (!!v && /^[A-Z]{2}$/.test(v)) || 'Sigla deve ter 2 letras maiúsculas.'
    ]

    const nome = ref('')
    const nomeRules = [
        v => (!!v && v.length >= 3) || 'Nome deve ter pelo menos 3 caracteres.'
    ]

    function submit() {
        let formData = {
            // id: id.value,
            sigla: sigla.value,
            nome: nome.value
        } 
        uf_add(formData)
        .then( resp => {
            router.push('/uf')
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