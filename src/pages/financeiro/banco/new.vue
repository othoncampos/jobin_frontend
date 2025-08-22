<template>
    <AdminLayout>
        <v-card flat style="width: 98%;">  
            <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-city"></v-icon> &nbsp; Novo Banco&nbsp;&nbsp;
                <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <form @submit.prevent="submit">
                    <v-row>
                        <v-col cols="12" md="2">
                            <v-number-input 
                                label="Código"
                                v-model="nr_banco"
                            ></v-number-input>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field clearable label="Nome" v-model="nm_banco" :rules="nomeRules" ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="2">
                            <v-switch 
                                v-model="fl_ativo" 
                                color="indigo"
                                :label="`Ativo: ${fl_ativo?'Sim':'Não'}`"
                                label="Ativo">
                            </v-switch>
                        </v-col>
                        <v-col cols="12" md="2">
                            <v-switch 
                                v-model="fl_emite_boleto"
                                color="indigo"
                                :label="`Emite Boleto?: ${fl_emite_boleto?'Sim':'Não'}`"
                                label="Emite Boleto?">
                            </v-switch>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" md="4">
                            <v-text-field clearable label="URL" v-model="url_banco" :rules="urlRules"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-text-field clearable label="Imagem" v-model="url_logo" :rules="url_logo"></v-text-field>
                        </v-col>
                    </v-row>
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
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()
    const selectedUf = ref(null)
  
    const nr_banco = ref(0)
    const nm_banco = ref('')
    const url_banco = ref('')
    const url_logo = ref('')
    const fl_ativo = ref(true)
    const fl_emite_boleto = ref(true)

    const nomeRules = [
        v => (!!v && v.length >= 2) || 'Nome deve ter pelo menos 3 caracteres.'
    ]

    const urlRules = [
       v => !v || /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(v) || 'URL inválida.'
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
        nr_banco.value = 0
        nm_banco.value = ''
        url_banco.value = ''
        url_logo.value = ''
        fl_ativo.value = true
        fl_emite_boleto.value = true
    }

    function handlGoBack() {
        router.push('/banco')
    }
</script>