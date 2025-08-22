<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/store/auth' 
    import { arquivo_delete, arquivo_get_list_by_emp, arquivo_process, arquivo_count_upload, arquivo_count_upload_status } from '@/services/arquivo_service'
    import { formatFileSize } from '@/services/util'
    import Card_1 from '@/components/Card_1.vue';

    import { getNomeClassificacaoPorId, getNomeStatusArquivoById } from '@/services/Data_Values';
    import { data_formatada_DD_MM_YYYY } from '@/services/formatString';

    const router = useRouter()
    const auth = useAuthStore()


    function processItem(item) {
        console.log('item', item)
        arquivo_process(item.emp_id, item.user_id, item.id)
        .then( (resp) => {
            console.log('arquivo_process.resp', resp)
        })
        .catch( (err) => {
            console.log('arquivo_process.err', err)
        })
    }

    function deleteItem(emp_id, file_id) {
        arquivo_delete(emp_id, file_id)
        .then( () => {
            loadItems()
        })
    }
    
    const headers = ref([
        { title: 'Nome', key: 'original_name', align: 'start', sortable: false },
        { title: 'Tipo', key: 'type', align: 'center' },
        { title: 'Classificação', key: 'class_id', align: 'center' },
        { title: 'Tamanho', key: 'size', align: 'end' },
        { title: 'Situação', key: 'status', align: 'center' },
        { title: 'Criado', key: 'create_at', align: 'center' },
        { title: 'Modificado', key: 'update_at', align: 'center' },
        { title: 'Ações', key: 'actions', align: 'center', sortable: false},
    ])
  
    const search = ref('')
    const serverItems = ref([])
    const loading = ref(true)
    const totalItems = ref(0)
    const itemsPerPage = ref(5)

    const total_uploads = ref(0)
    const get_total_uploads = ref(true)

    const total_uploads_proc = ref(0)
    const get_total_uploads_proc = ref(true)

    const total_uploads_erro = ref(0)
    const get_total_uploads_erro = ref(true)
    
    const total_uploads_pend = ref(0)
    const get_total_uploads_pend = ref(true)


    const options = ref({
        page: 1,
        itemsPerPage: 5,
        sortBy: [],
        search: ''
    });

    function loadItems () {
        loading.value = true
        // const { page, itemsPerPage, sortBy } = options;

        // Exemplo simples usando somente paginação local
        // const start = (page - 1) * itemsPerPage;
        // const end = page * itemsPerPage;
        
        arquivo_get_list_by_emp(1)
        .then( resp => {
            serverItems.value = resp
            totalItems.value = resp?.length || 0
            loading.value = false
        })
    }

    const disableProcessButton = (status) => {
        var value = [0].includes(Number(status));
        return !value
    };

    const new_upload = () => {
        router.push('/arquivo/novo')
    }

    onMounted(() => {
        const emp_id = auth.getEmpId()
        
        arquivo_count_upload(emp_id)
        .then( (resp) => {
            total_uploads.value = resp
            get_total_uploads.value = false
        })
        .catch( (err) => {
            total_uploads.value = '---'
            get_total_uploads.value = true
        })

        // Buscando numero de pendentes
        arquivo_count_upload_status( emp_id, 0)
        .then( (resp) => {
            total_uploads_pend.value = resp
            get_total_uploads_pend.value = false
        })
        .catch( (err) => {
            total_uploads_pend.value = '---'
            get_total_uploads_pend.value = true
        })

        // Buscando numero de Processados
        arquivo_count_upload_status( emp_id, 2)
        .then( (resp) => {
            total_uploads_proc.value = resp
            get_total_uploads_proc.value = false
        })
        .catch( (err) => {
            total_uploads_proc.value = '---'
            get_total_uploads_proc.value = true
        })

        // Buscando numero de Erros
        arquivo_count_upload_status( emp_id, 3)
        .then( (resp) => {
            total_uploads_erro.value = resp
            get_total_uploads_erro.value = false
        })
        .catch( (err) => {
            total_uploads_erro.value = '---'
            get_total_uploads_erro.value = true
        })
        // 0: "Pendente",
        // 1: "Em Processamento",
        // 2: "Processado",
        // 3: "Erro no Processamento",
        // 4: "Não Necessário",
    })
</script>

<template>
    <AdminLayout>
        <v-card elevation="2">
        <v-card-title class="d-flex align-center pe-2">
            <v-icon icon="mdi-file-multiple" class="me-2"></v-icon>
            <span class="text-h6 font-weight-medium">Arquivos</span>
        </v-card-title>

        <v-card-text>
            <!-- Cards de Resumo -->
            <!-- <v-container fluid> -->
                <v-row dense>
                    <v-col cols="12" md="3">
                        <Card_1 title="Uploads"
                                subtitle="Total de arquivos"
                                :loading="get_total_uploads" 
                                :value="total_uploads" 
                                color="green"
                                icon="mdi-file-multiple"
                        />
                    </v-col>
                    <v-col cols="12" md="3">
                        <Card_1 title="Processados"
                                subtitle="Total de arquivos processados"
                                :loading="get_total_uploads_proc" 
                                :value="total_uploads_proc" 
                                color="blue"
                                icon="mdi-check"
                        />
                    </v-col>
                    <v-col cols="12" md="3">
                        <Card_1 title="Erro"
                                subtitle="Arquivos com erro"
                                :loading="get_total_uploads_erro" 
                                :value="total_uploads_erro"
                                color="red"
                                icon="mdi-file-document-alert"
                        />
                    </v-col>
                    <v-col cols="12" md="3">
                        <Card_1 title="Pendentes"
                                subtitle="Arquivos pendentes"
                                :loading="get_total_uploads_pend" 
                                :value="total_uploads_pend" 
                                color="warning"
                                icon="mdi-receipt-clock-outline"
                        />
                        
                    </v-col>
                </v-row>
            <!-- </v-container> -->

            <!-- Botão Nova Folha -->
            <v-row class="my-4">
                <v-col cols="12">
                    <v-btn color="primary" variant="flat" @click="new_upload">
                        <v-icon start>mdi-plus</v-icon>
                        Nova Upload
                    </v-btn>
                </v-col>
            </v-row>
            <!-- Tabela de Arquivos -->
            <v-data-table-server
                v-model:items-per-page="itemsPerPage"
                :headers="headers"
                :items="serverItems"
                :items-length="totalItems"
                :items-per-page="itemsPerPage"
                :loading="loading"
                :search="search"
                item-value="name"
                :show-select="true"
                @update:options="loadItems"
            >
                <template #item.class_id="{ item }">
                    {{ getNomeClassificacaoPorId(item.class_id) }}
                </template>

                <template #item.size="{ item }">
                    {{ formatFileSize(item.size) }}
                </template>

                <template #item.create_at="{ item }">
                    {{ data_formatada_DD_MM_YYYY(item.create_at, true) }}
                </template>

                <template #item.update_at="{ item }">
                    {{ data_formatada_DD_MM_YYYY(item.update_at, true) }}
                </template>

                <template #item.status="{ item }">
                    <v-chip :color="getNomeStatusArquivoById(item.status).cor" dark>
                    <v-icon start>{{ getNomeStatusArquivoById(item.status).icon }}</v-icon>
                    {{ getNomeStatusArquivoById(item.status).nome }}
                    </v-chip>
                </template>

                <template #item.type="{ item }">
                    <v-chip label size="x-small" variant="flat" color="default">
                        {{ item.type.replace('.', '') }}
                    </v-chip>
                </template>

            <template #item.actions="{ item }">
                <v-btn
                    :disabled="disableProcessButton(item.status)"
                    color="success"
                    icon
                    variant="outlined"
                    size="small"
                    class="me-2"
                    @click="processItem(item)"
                >
                    <v-icon>mdi-cog-outline</v-icon>
                    <v-tooltip activator="parent" location="top">Processar Arquivo</v-tooltip>
                </v-btn>

                <v-btn
                color="error"
                icon
                variant="outlined"
                size="small"
                @click="deleteItem(item.emp_id, item.id)"
                >
                <v-icon>mdi-delete</v-icon>
                <v-tooltip activator="parent" location="top">Deletar Arquivo</v-tooltip>
                </v-btn>
            </template>
            </v-data-table-server>
        </v-card-text>
        </v-card>
    </AdminLayout>
</template>
