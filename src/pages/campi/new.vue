<template>
    <AdminLayout>
        <v-card flat style="width: 98%;">  
            <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-city"></v-icon> &nbsp; Cadastro de Campus&nbsp;&nbsp;
                <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <form @submit.prevent="submit">
                    <v-text-field v-model="nome" :rules="nomeRules" label="Nome"></v-text-field>
                    <v-text-field v-model="sigla" :rules="siglaRules" label="Sigla"></v-text-field>
                    <v-select
                        v-model="estadoSelecionado"
                        :items="estados"
                        item-title="nome"
                        item-value="id"
                        label="Selecione um Estado"
                        return-object
                        clearable
                    />

                    <v-select
                    v-model="selectedCidade"
                    :items="cidadesFiltradas"
                    item-title="nome"
                    item-value="id"
                    label="Selecione uma Cidade"
                    return-object
                    clearable
                    :disabled="!estadoSelecionado"
                    />


                    <v-btn flat color="teal" class="me-4" type="submit">Salvar</v-btn>

                    <v-btn variant="outlined" class="me-4" @click="handleReset">clear</v-btn>
                    <v-btn flat color="teal" variant="outlined" class="me-4" @click="handleBack">Voltar</v-btn>
                </form>
            </v-card-text>
        </v-card>
    </AdminLayout>
</template>

<script setup>
    import { ref, onMounted, watch } from 'vue'
    import { useRouter } from 'vue-router'

    import { campi_add } from '@/services/campi_services'
    import { cidade_add, cidade_lista_all } from '@/services/cidade_services'
    import { uf_lista_all } from '@/services/uf_services'

    const router = useRouter()
  
    const nome = ref('')
    const nomeRules = [
    v => (!!v && v.length >= 3) || 'Nome deve ter pelo menos 3 caracteres.'
    ]


    const sigla = ref('')
    const siglaRules = [
        v => (!!v && /^[A-Z]{2}$/.test(v)) || 'Sigla deve ter 2 letras maiúsculas.'
    ]

    const estados = ref([])
    const cidades = ref([])
    const cidadesFiltradas = ref([])
    const estadoSelecionado = ref(null)
    const selectedCidade = ref(null)

    onMounted(async () => {
    const respEstados = await uf_lista_all();
    if (respEstados?.length) {
        estados.value = respEstados.sort((a, b) => a.nome.localeCompare(b.nome));
    }

    const respCidades = await cidade_lista_all();
    if (respCidades?.length) {
        cidades.value = respCidades.sort((a, b) => a.nome.localeCompare(b.nome));
    }
    });

    watch(estadoSelecionado, (novoEstado) => {
        if (novoEstado && novoEstado.id) {
            cidadesFiltradas.value = cidades.value
                .filter(c => c.uf.id === novoEstado.id)
                .sort((a, b) => a.nome.localeCompare(b.nome));
        } else {
            cidadesFiltradas.value = [];
        }
        selectedCidade.value = null;
    });

    function submit() {
    if (!selectedCidade.value) {
        alert("Selecione uma cidade.");
        return;
    }

    let formData = {
        nome: nome.value,
        sigla: sigla.value,
        cidade: { id: selectedCidade.value.id }
    };

    campi_add(formData)
        .then(() => {
            router.push('/campi');
        })
        .catch(() => {
            alert("Erro ao cadastrar campus. Verifique os dados.");
        });
}


    function handleReset() {
        sigla.value = ''
        nome.value = ''
        estadoSelecionado.value = null
        selectedCidade.value = null
    }

    function handleBack() {
        router.push('/campi')
    }

</script>