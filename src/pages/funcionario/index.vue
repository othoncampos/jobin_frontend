<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useAuthStore } from '@/store/auth' 
    import { useRouter } from 'vue-router'
    import AdminLayout from '@/layouts/AdminLayout.vue';
    import Card from '@/components/Card_1.vue';
    import { colaborador_get_by_emp, colaborador_qtd_status } from '@/services/colaborador_service';
    import { formatMoney } from '@/services/formatString';
    import { contracheque_resumo, contracheque_qtd_valor_by_emp } from '@/services/contracheque_service';
    import Faixa_Etaria from '@/components/charts/faixa_etaria.vue';
    import Tempo_Empresa from '@/components/charts/tempo_empresa.vue';
    import Sexo_Funcionarios from '@/components/charts/sexo_funcionarios.vue';
    

    // Itens pada o data-table
    const search = ref('')
    const itemsPerPage = ref(5)
    const list_func = ref([])

    const actions_itens = [
        { action: 'view', text: 'Visualizar', icon: 'mdi-eye-outline' },    
        { action: 'edit', text: 'Editar', icon: 'mdi-file-edit-outline' },
        { action: 'delete', text: 'Deletar', icon: 'mdi-delete-empty-outline' },
    ]

    const getCorSimNao = (valor) => valor === true ? 'green' : 'red'
    
    const getCorStatus = (valor) => {
        if (valor === 1 ) {
            return 'primary'
        }
        else if (valor === 2 ) {
            return 'red'
        }
    }
    
    const list_colunms = ref([
        { title: 'ID', key: 'id', sortable: false, align: 'center' },
        { title: 'Matricula', key: 'matricula', sortable: true, align: 'center' },
        { key: 'cpf', title: 'CPF', sortable: false, align: 'center' },
        { key: 'nome', title: 'Nome', sortable: true, align: 'start' },
        { key: 'possui_usuario', title: 'Usa o Site?', align: 'center' },
        { key: 'plano_saude', title: 'P. Saude?', align: 'center' },
        { key: 'auxilio_transporte', title: 'Transporte?', align: 'center' },
        { key: 'tipo_contrato', title: 'Contrato', align: 'center' },
        { key: 'salario', title: 'Salário', align: 'end' },
        { key: 'status', title: 'Status', align: 'center' },
        { key: 'actions', title: 'Ações', isActions: true, align: 'center' }
    ]);

    // Variaveis 
    const router = useRouter()
    const auth = useAuthStore()
    const dadosAPI = ref({})

    const handleClick = () => {
        console.log('Card clicado! -> 1')
    }

    const actionTableClick = (action, item) => {
        console.log('Click', action, item)
    }

    // Dados do graficos
    const data_chart = ref({})
    const legend_x_axis = ref('')

    const categorias = computed(() => {
        return data_chart.value ? Object.keys(data_chart.value) : []
    })

    // Pega todos os tipos de contrato dinamicamente
    // Computed para tipos de contrato (legend)
    const tiposContrato = computed(() => {
        if (!data_chart.value || categorias.value.length === 0) return []
        var list_tipos_contrato = Object.keys(data_chart.value[categorias.value[0]].tipos_contrato)
        list_tipos_contrato.push( "Qdt Funcionario")
        // return Object.keys(data_chart.value[categorias.value[0]].tipos_contrato)
        return list_tipos_contrato
    })

    // Computed para séries do gráfico
    const series = computed(() => {
        if (!data_chart.value) return []
        var list_return = tiposContrato.value.map(tipo => ({
                name: tipo,
                type: 'bar',
                tooltip: {
                    valueFormatter: value => `R$ ${value}`
                },
                data: categorias.value.map(mes =>
                    data_chart.value[mes].tipos_contrato[tipo]
                )
        }))
        
        var obj_line = {
            name: 'Qtd Funcionario',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
                valueFormatter: function (value) {
                    return value;
                }
            },
            data: list_quantidade_total.value
        }
        list_return.push( obj_line )
        return list_return;
    })
    
    const list_quantidade_total = computed(() => {
        return Object.keys(data_chart.value).map(mes => data_chart.value[mes].quantidade_total)
    })

    // const option2 = {
    const option2 = computed( () => {
        return {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                legend: {
                    // data: categorias.value,
                    data: tiposContrato.value
                },
                xAxis: [{
                        type: 'category',
                        data: categorias.value,
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'Valor',
                        min: 0,
                        max: 25000,
                        interval: 3000,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: 'Qdt Funcionario',
                        min: 0,
                        max: 30,
                        interval: 20,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: series.value
            };
        }
    )

    // Função de normalização para nomes amigáveis
    
    const dadosFunc = computed(() => {
        return {
            qtdCLT: dadosAPI.value["CLT"] || 0,
            qtdSOCIO: dadosAPI.value["SÓCIO"] || 0,
            qtdPJ: dadosAPI.value["PJ"] || 0,
            qtdNaoInformado: dadosAPI.value[null] || 0
        }
    })

    // Total baseado nos valores normalizados
    const totalFunc = computed(() =>
        Object.values(dadosFunc.value).reduce((acc, val) => acc + val, 0)
    )

    onMounted( () => {
        contracheque_resumo(auth.getEmpId(), 6)
        .then( (resp) => {
            data_chart.value = resp
            legend_x_axis.value =  Object.keys(resp)

            console.log("onMounted.contracheque_resumo", legend_x_axis.value)
        })

        colaborador_get_by_emp(auth.getEmpId())
        .then( (resp) => {
            console.log("onMounted", resp)
            list_func.value = resp;
        })

        colaborador_qtd_status( auth.getEmpId(), '1' )
        .then( (resp) => {
            // qtd_total_func.value = resp.    
            dadosAPI.value = resp
        })

        
    })

    function filterOnlyCapsText (value, query, item) {
        return value != null && query != null && typeof value === 'string' && value.toString().toLocaleUpperCase().indexOf(query) !== -1
    }
</script>

<template>
    <AdminLayout>
        <v-row>
            <v-col cols="4">
                <v-icon icon="mdi-file-multiple" class="me-2"></v-icon>
                <span class="text-h6 font-weight-medium">Lista de Funcionários</span>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="3">
                <v-row>
                    <v-col cols="6" md="6">
                        <Card :loading="false" 
                              :clickable="true" 
                              title="Funionários" 
                              subtitle="Ativos" 
                              :value="totalFunc"
                              @click="handleClick"
                              icon="mdi-account-group"
                              color="green"
                        />
                    </v-col>
                    <v-col cols="6" md="6">
                        <Card :loading="false" 
                              :clickable="true" 
                              title="Sócios" 
                              subtitle="Ativos" 
                              :value="dadosFunc.qtdSOCIO"
                              @click="handleClick"
                              icon="mdi-account-star"
                              color="green"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6" md="6">
                        <Card :loading="false" 
                              :clickable="true" 
                              title="CLT" 
                              subtitle="Ativos" 
                              :value="dadosFunc.qtdCLT"
                              @click="handleClick"
                              icon="mdi-account-multiple-plus"
                              color="green"
                        />
                    </v-col>
                    <v-col cols="6" md="6">
                        <Card :loading="false" 
                              :clickable="true" 
                              title="PJ / Outros" 
                              subtitle="Ativos" 
                              :value="`${dadosFunc.qtdPJ} / ${dadosFunc.qtdNaoInformado}`"
                              @click="handleClick"
                              icon="mdi-account-multiple-plus"
                              color="green"
                    />
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="3" class="d-flex flex-column fill-height">
                <v-row>
                    <v-col>
                        <Tempo_Empresa :emp_id="auth.getEmpId()" :status="1" :height="198" color="teal"/>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="3" class="d-flex flex-column fill-height">
                <v-row>
                    <v-col>
                        <Faixa_Etaria :emp_id="auth.getEmpId()" :status="1" :height="198" color="pink"/>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="3" class="d-flex flex-column fill-height">
                <v-row>
                    <v-col>
                        <Sexo_Funcionarios :emp_id="auth.getEmpId()" status="1" :height="198" color="pink"/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="d-flex flex-column fill-height">
                <v-card flat>
                    <v-card-title class="d-flex align-center pe-2">
                        <v-icon icon="mdi-account-details-outline"></v-icon> &nbsp;
                        Lista de Funcionários
                        
                        <v-spacer></v-spacer>
                        <div class="d-flex align-center justify-start ga-2 me-2"> 
                            <v-btn variant="flat" color="success" @click="handleNew">Novo</v-btn>
                        </div>
                        <v-text-field
                                v-model="search"
                                density="compact"
                                label="Search"
                                prepend-inner-icon="mdi-magnify"
                                variant="solo-filled"
                                flat
                                hide-details
                                single-line
                        ></v-text-field>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-data-table
                        :custom-filter="filterOnlyCapsText"
                        :headers="list_colunms"
                        :items="list_func"
                        :search="search"
                        item-value="name"
                        :items-per-page="itemsPerPage"
                    >

                    <template #item.possui_usuario="{ item }">
                        <v-chip :color="getCorSimNao(item.possui_usuario)" label size="x-small" variant="flat" >
                            {{ item.possui_usuario ? 'Sim' : 'Não' }}
                        </v-chip>
                    </template>

                    <template #item.plano_saude="{ item }">
                        <v-chip :color="getCorSimNao(item.plano_saude)" label size="x-small" variant="flat" >
                            {{ item.plano_saude ? 'Sim' : 'Não' }}
                        </v-chip>
                    </template>

                    <template #item.auxilio_transporte="{ item }">
                        <v-chip :color="getCorSimNao(item.auxilio_transporte)" label size="x-small" variant="flat" >
                            {{ item.auxilio_transporte ? 'Sim' : 'Não' }}
                        </v-chip>
                    </template>

                    <template #item.tipo_contrato="{ item }">
                        <v-chip label size="x-small" variant="flat" >
                            {{ item.tipo_contrato || " - - - " }}
                        </v-chip>
                    </template>

                    <template #item.status="{ item }">
                        <v-chip :color="getCorStatus(item.status)" label size="x-small" variant="flat" >
                            {{ item.status === 1 ? 'ATIVO' : 'INATIVO'  }}
                        </v-chip>
                    </template>

                    <template #item.salario="{ item }">
                        {{formatMoney(item.salario)}}
                    </template>

                    <template #item.actions="{ item }">
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
                            </template>

                            <v-list density="compact">
                                <v-list-subheader>Ações</v-list-subheader>

                                <v-list-item
                                    v-for="(action_item, i) in actions_itens"
                                    :key="i"
                                    :value="action_item"
                                    color="primary"
                                >
                                    <template v-slot:prepend>
                                        <v-icon :icon="action_item.icon"></v-icon>
                                    </template>
                                    <v-list-item-title v-text="action_item.text" @click="actionTableClick(action_item.action, item.id)"></v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </AdminLayout>
</template>