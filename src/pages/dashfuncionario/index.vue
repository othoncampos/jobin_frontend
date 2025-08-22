<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useRouter } from 'vue-router'
    import AdminLayout from '@/layouts/AdminLayout.vue';
    import Card from '@/components/Card_1.vue';
    import { colaborador_dados_minimos, colaborador_get_last_cch } from '@/services/colaborador_service';
    import { useAuthStore } from '@/store/auth' 
    import { data_formatada_DD_MM_YYYY, formatMoney } from '@/services/formatString';
    import { valor_emprestimo } from '@/services/simulacoes_service';
    
    const router = useRouter()
    const auth = useAuthStore()
    
    const data_admissao = ref(null)
    const tipo_contrato = ref(null)
    const cargo_colaborador = ref(null)
    const view_info = ref(false)

    const ult_salario_bruto = ref(0)
    const ult_salario_liquido = ref(0)
    const ult_salario_desconto = ref(0)
    const margem_consignavel = ref(0)
    const ano = ref(0)
    const mes = ref(0)
    const headers_text = ref(null)
               
    const handleClickCCH =() => {
        console.log('handleClickCCH')
        // router.push('/cchfuncionario')
        // router.push({ name: 'CCH_Funcionario' })
        // router.push({ name: 'CCH_Funcionario', params: { id: 1 } }) // Exemplo com parâmetros
    }

    const handleClickSimulacao = (parcelas: number, valor: number) => {
        console.log('handleClickCCH')
        // router.push('/simulacao')
        // router.push({ name: 'Simulacao', params: {nr_prestacao: 1,  vl_prestacao: 100} })
        router.push({
            name: 'Simulacao',
            query: { nr_prestacao: parcelas, vl_prestacao: valor }
        })
    };

    const option = computed( () => {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function (params) {
                    let tooltip = params[0].axisValue + '<br/>';
                    params.forEach(p => {
                        tooltip += `${p.marker} ${p.seriesName}: R$ ${p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<br/>`;
                    });
                    return tooltip;
                }
            },
            legend: {
                data: ['Bruto', 'Descontos', 'Líquido'],
                bottom: 0
            },
            grid: {
                top: 20,      // espaço no topo
                right: 10,    // espaço à direita
                bottom: 50,   // espaço no rodapé (para legenda)
                // left: 70      // espaço à esquerda
            },
            xAxis: {
                type: 'category',
                data: ['Junho']
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                formatter: function (value) {
                    return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                    // return formatMoney(value)
                }
                },
                // name: 'R$ (Reais)',
                nameLocation: 'middle',
                nameRotate: 90,
                nameGap: 50
            },
            series: [
                {
                name: 'Bruto',
                type: 'bar',
                data: [ult_salario_bruto.value],
                itemStyle: { color: '#394B85' },
                label: {
                    show: true,
                    position: 'inside',
                    color: '#fff'
                }
                },
                {
                name: 'Descontos',
                type: 'bar',
                data: [ult_salario_desconto.value],
                itemStyle: { color: '#F2674A' },
                label: {
                    show: true,
                    position: 'inside',
                    color: '#fff'
                }
                },
                {
                name: 'Líquido',
                type: 'bar',
                data: [ult_salario_liquido.value],
                itemStyle: { color: '#12BFA0' },
                label: {
                    show: true,
                    position: 'inside',
                    color: '#fff'
                }
                }
            ]
        }
    });

    const dados_funcionarios = computed( () => {
        return [
            {
                title: "Data de Admissão",
                subtitle: "Funcionário desde",
                loading: false,
                clickable: true,
                value: data_admissao.value,
                click: handleClickCCH,
                icon: "mdi-calendar-range",
                color: "green"
            },
            {
                title: "Tipo de Contrato",
                subtitle: "Modalidade",
                loading: false,
                clickable: true,
                value: tipo_contrato.value,
                click: handleClickCCH,
                icon: "mdi-file-sign",
                color: "green"
            },
            {
                title: "Cargo",
                subtitle: "cargo ocupado",
                loading: false,
                clickable: true,
                value: cargo_colaborador.value,
                click: handleClickCCH,
                icon: "mdi-account-hard-hat-outline",
                color: "indigo"
            },
            {
                title: "Último Salário",
                subtitle: "Valor Bruto",
                loading: false,
                clickable: true,
                value: formatMoney(ult_salario_bruto.value),
                click: handleClickCCH,
                icon: "mdi-wallet-outline",
                color: "green"
            },
            {
                title: "Último Salário",
                subtitle: "Valor Liquido",
                loading: false,
                clickable: true,
                value: formatMoney(ult_salario_liquido.value),
                click: handleClickCCH,
                icon: "mdi-cash",
                color: "green"
            },
            {
                title: "Margem Consignável", 
                subtitle: "Valor Max. Parcela",
                loading: false,
                clickable: true,
                value: formatMoney(margem_consignavel.value),
                click: handleClickCCH,
                icon: "mdi-cash-plus",
                color: "green"
            },
        ]}
    );

    const array_parcelas = [6, 12, 24, 48, 60, -1]

    const simulacoes = computed(() => array_parcelas.map(nr_parcela => {
        if (nr_parcela === -1) {
            return {
                title: "Outros Valores",
                subtitle: "Simulações",
                loading: false,
                clickable: true,
                value: "Clique Aqui",
                // click: handleClickSimulacao(0, 0),
                click: () => handleClickSimulacao(0, 0),
                icon: "mdi-wallet-plus-outline",
                color: "amber"
            }
        } else {
            return {
                title: `${nr_parcela}x R$ ${formatMoney(margem_consignavel.value)}`,
                subtitle: "3,35% Juros",
                loading: false,
                clickable: true,
                value: valor_emprestimo(3.35, nr_parcela, margem_consignavel.value),
                click: () => handleClickSimulacao(nr_parcela, margem_consignavel.value),
                icon: "mdi-wallet-plus-outline",
                color: "indigo"
            }
        }
    }));

    onMounted( () => {
        colaborador_dados_minimos(auth.getEmpId(), auth.getUserId())
        .then( (e) => {
            console.log("colaborador_dados_minimos.onMounted.then", e);
            data_admissao.value = data_formatada_DD_MM_YYYY(e.data_admissao)
            tipo_contrato.value = e.tipo_contrato;
            cargo_colaborador.value = e.cargo;
            view_info.value = true;
        })
        .catch( (err) => {
            console.log("onMounted.err", err);
        });

        colaborador_get_last_cch(auth.getEmpId(), auth.getUserId())
        .then( (resp) => {
            // console.log("colaborador_get_last_cch.onMounted.then", resp);
            ult_salario_bruto.value = resp.valor_bruto.toFixed(2),
            ult_salario_liquido.value = resp.valor_liquido.toFixed(2),
            ult_salario_desconto.value = resp.valor_descontos.toFixed(2),
            margem_consignavel.value = ult_salario_liquido.value * 0.3;
            ano.value = resp.ano || '----';
            mes.value = resp.mes || '--';
            headers_text.value = "Último Contra Cheque: " + mes.value.toString().padStart(2, '0') + '/' + ano.value
        })
        .catch( (err) => {
            console.log("onMounted.err", err);
        });
    })
</script>

<template>
    <AdminLayout>
        <v-row dense class="ma-0">
            <v-col cols="6"><h2 class="text-medium-emphasis">Informações Básicas</h2></v-col>
            <v-col cols="6">
                <div class="d-flex flex-row justify-space-between align-center fill-height">
                    <h2 class="text-medium-emphasis">{{ headers_text }}</h2>
                    <a href="/cchfuncionario">mais...</a>
                </div>
            </v-col>
        </v-row>
        <v-row dense class="ma-0">
            <v-col cols="6">
                <v-row>
                    <v-col cols="4" md="4" 
                           v-for="(item, index) of dados_funcionarios" :key="index"
                    >
                        <Card :loading="item.loading" 
                            :clickable="item.clickable" 
                            :title="item.title" 
                            :subtitle="item.subtitle" 
                            :value="item.value"
                            :onclick="item.click"
                            :icon="item.icon"
                            :color="item.color"
                        />
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="6" class="d-flex flex-column fill-height">
                <v-chart :option="option" style="height: 197px" />
            </v-col>
        </v-row>
        <!--
        <v-row>
            <v-col cols="6">
                <h2 class="text-medium-emphasis">Simulações de Crédito</h2>
            </v-col>
        </v-row>
        <v-row dense class="ma-0">
            <v-col cols="2" class="d-flex flex-column fill-height" 
                   v-for="(item, index) of simulacoes" :key="index"
            >
                <Card :loading="item.loading" 
                      :clickable="item.clickable" 
                      :title="item.title" 
                      :subtitle="item.subtitle" 
                      :value="item.value"
                      :icon="item.icon"
                      :color="item.color"
                      :onclick="item.click"
                />
            </v-col>
        </v-row>
        -->
    </AdminLayout>
</template>