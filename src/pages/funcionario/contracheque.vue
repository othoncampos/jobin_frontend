<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useAuthStore } from '@/store/auth' 
    import { useRouter } from 'vue-router'
    import AdminLayout from '@/layouts/AdminLayout.vue';
    import Card from '@/components/Card_1.vue';
    import { contracheque_list_by_emp } from '@/services/contracheque_service';
    import { formatMoney, formatText } from '@/services/formatString';
    import { contracheque_resumo, contracheque_qtd_valor_by_emp, contracheque_last_cch_by_emp } from '@/services/contracheque_service';

    import { padTo2Digits } from '@/services/util';
    // Itens pada o data-table
    const search = ref('')
    const itemsPerPage = ref(5)
    const list_cch = ref([])
    
    const qtd_contracheques = ref(null)
    const valor_bruto = ref(null)
    const ultima_folha_mesano = ref(null)
    const ultima_folha_valor = ref(null)

    const actions_itens = [
        { action: 'view', text: 'Visualizar', icon: 'mdi-eye-outline' },    
        { action: 'edit', text: 'Editar', icon: 'mdi-file-edit-outline' },
        { action: 'delete', text: 'Deletar', icon: 'mdi-delete-empty-outline' },
    ]

    const list_colunms = ref([
        { title: 'Ano', key: 'ano', sortable: false, align: 'center' },
        { title: 'Mês', key: 'mes', sortable: false, align: 'center' },
        { title: 'Colaboradores', key: 'qtd_colaboradores', sortable: false, align: 'center' },
        { title: 'Valor', key: 'valor_bruto', sortable: false, align: 'center' },
        { title: 'Arquivos', key: 'qtd_arquivos', sortable: false, align: 'center' },
        { key: 'actions', title: 'Ações', isActions: true, align: 'center' }
    ]);

    // Variaveis 
    const router = useRouter()
    const auth = useAuthStore()

    const handleClick = () => {
        console.log('Card clicado! -> 1')
    }

    const handleNew = () => {
        router.push({ name: 'ArquivoNovo', params: { class_id: 1 } })
    }

    const actionTableClick = (action, item) => {
        console.log('Click', action, item)
    }

    // Dados do graficos
    const data_chart = ref({})
    const legend_x_axis = ref('')

    // -----
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
        console.log('list_return', list_return)
        return list_return;
    })
    
    const list_quantidade_total = computed(() => {
        return Object.keys(data_chart.value).map(mes => data_chart.value[mes].quantidade_total)
    })

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

    onMounted( () => {
        contracheque_list_by_emp(auth.getEmpId())
        .then((resp) => {
            // console.log("contracheque_list_by_emp", resp)
            list_cch.value = resp
        })

        contracheque_resumo(auth.getEmpId(), 6)
        .then( (resp) => {
            data_chart.value = resp
            legend_x_axis.value =  Object.keys(resp)
            console.log("onMounted.contracheque_resumo", legend_x_axis.value)
        })

        contracheque_qtd_valor_by_emp( auth.getEmpId() )
        .then( (resp) => {
            qtd_contracheques.value = resp.qtd_contracheques;
            valor_bruto.value = resp.valor_bruto;
            // console.log('contracheque_qtd_valor_by_emp', resp)
        })

        contracheque_last_cch_by_emp( auth.getEmpId() )
        .then( (resp) => {
            ultima_folha_mesano.value = padTo2Digits(resp.mes) + '/' + resp.ano;
            ultima_folha_valor.value = formatMoney(resp.total_bruto);
            // console.log('contracheque_qtd_valor_by_emp', resp)
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
                <span class="text-h6 font-weight-medium">Contracheques</span>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4">
                <v-row>
                    <v-col cols="6" md="6">
                        <Card :loading="false" 
                            :clickable="true" 
                            title="Quantidade" 
                            subtitle="Cadastrados" 
                            :value="qtd_contracheques"
                            @click="handleClick"
                            icon="mdi-account-cash-outline"
                            color="green"
                        />
                    </v-col>
                    <v-col cols="6" md="6">
                        <Card :loading="false" 
                            :clickable="true" 
                            title="Valor Total" 
                            subtitle="Salário Pagos" 
                            :value="formatMoney(valor_bruto)"
                            @click="handleClick"
                            icon="mdi-cash-multiple"
                            color="green"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6" md="6">
                        <Card :loading="false" 
                            :clickable="true" 
                            title="Últ. Folha" 
                            subtitle="Mês/Ano" 
                            :value="ultima_folha_mesano"
                            @click="handleClick"
                            icon="mdi-calendar-check-outline"
                            color="green"
                        />
                    </v-col>
                    <v-col cols="6" md="6">
                        <Card :loading="false" 
                            :clickable="true" 
                            title="Últ. Folha" 
                            subtitle="Valor" 
                            :value="ultima_folha_valor"
                            @click="handleClick"
                            icon="mdi-cash-multiple"
                            color="green"
                    />
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="8" class="d-flex flex-column fill-height">
                <v-row>
                    <v-col>
                        <v-chart :option="option2" style="height: 257px" />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="d-flex flex-column fill-height">
                <v-card flat>
                    <v-card-title class="d-flex align-center pe-2">
                        <v-icon icon="mdi-account-details-outline"></v-icon> &nbsp;
                        Lista de Folhas
                        <v-spacer></v-spacer>
                        <!-- <b-btn variant="outlined" color="primary" @click="router.push('/funcionario/contracheque/novo')">
                            <v-icon icon="mdi-plus" class="me-2"></v-icon>
                            Novo Contracheque
                        </b-btn> -->
                        <v-btn variant="flat" color="success" @click="handleNew">Novo</v-btn>
                        &nbsp;&nbsp;&nbsp;
                        
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
                        :items="list_cch"
                        :search="search"
                        item-value="name"
                        :items-per-page="itemsPerPage"
                    >
                    <template #item.valor_bruto="{ item }">
                        {{formatMoney(item.valor_bruto)}}
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