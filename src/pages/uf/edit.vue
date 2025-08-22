<template>
    <AdminLayout>
        <v-card flat style="width: 98%;">  
            <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-city"></v-icon> &nbsp; Editar Estado&nbsp;&nbsp;
                <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <form @submit.prevent="submit">
                    <v-text-field v-model="id" label="ID" disabled="true" ></v-text-field>
                    <v-text-field v-model="sigla" :rules="siglaRules" label="Sigla"></v-text-field>
                    <v-text-field v-model="nome" :rules="nomeRules" label="Nome"></v-text-field>

                    <v-btn flat color="teal" class="me-4" type="submit">Salvar</v-btn>
                    <v-btn flat color="teal" variant="outlined" class="me-4" @click="handlGoBack">Voltar</v-btn>
                </form>
            </v-card-text>
        </v-card>
    </AdminLayout>
</template>

<script setup>
    import { uf_update } from '@/services/uf_services';
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
    
    const siglaRules = [
        v => (!!v && /^[A-Z]{2}$/.test(v)) || 'Sigla deve ter 2 letras maiúsculas.'
    ]

    const nomeRules = [
        v => (!!v && v.length >= 3) || 'Nome deve ter pelo menos 3 caracteres.'
    ]

    function submit() {
        let formData = {
            id: id.value,
            sigla: sigla.value,
            nome: nome.value
        } 
        uf_update(formData)
        .then( resp => {
            router.push('/uf')
        });
        // Aqui você pode chamar uma API, ou salvar no banco, etc.
    }

    function handlGoBack() {
        router.push('/uf')
    }
</script>
