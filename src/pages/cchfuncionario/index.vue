<script setup>
    import { ref, onMounted, computed, watch } from 'vue';
    import { useAuthStore } from '@/store/auth' 
    import { useRouter } from 'vue-router'
    import AdminLayout from '@/layouts/AdminLayout.vue';
    import Card from '@/components/Card_1.vue';
    import VisualizarPDF from '@/components/VisualizarPDF.vue';
    import {
        colaborador_get_count_cch,
        colaborador_get_last_cch,
        colaborador_get_list_cch,
        colaborador_view_cch,
        colaborador_download_cch
    } from '@/services/colaborador_service';
    import {monthName, padTo2Digits} from '@/services/util';

    // // ---- Aviso de “marcar como entregue” ----
    const showDeliveryDialog = ref(false)
    const dontShowAgain = ref(false)
    const skipDeliveryNotice = ref(false)
    const _resolveDelivery = ref(null)

    function openDeliveryNotice() {
        console.log("openDeliveryNotice - selected_cch:", selected_cch.value);
        if (selected_cch.value?.entregue) {
            skipDeliveryNotice.value = true
            dontShowAgain.value = true
        }
        
        return new Promise((resolve) => {
            if (skipDeliveryNotice.value) return resolve(true)
            
            dontShowAgain.value = false

            _resolveDelivery.value = (ok) => {
                if (dontShowAgain.value) {
                    skipDeliveryNotice.value = true
                }
                showDeliveryDialog.value = false
                resolve(ok)
            }
            showDeliveryDialog.value = true
        })
    }
    const onDeliveryCancel = () => _resolveDelivery.value?.(false)
    const onDeliveryContinue = () => _resolveDelivery.value?.(true)
    
    // Utilizada na tabs
    const tab = ref(null)

    // Utilizado para visualizacao do PDF
    const pdfBlob = ref(null);
    
    // Grafico do primeiro TAB
    const option_tab1 = computed( () => {
        const bruto = selected_cch.value?.valor_bruto ?? 0;
        const descontos = selected_cch.value?.valor_descontos ?? 0;
        const liquido = selected_cch.value?.valor_liquido ?? 0;
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
                data: [monthName(selected_cch.value?.mes ?? 0)]
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                formatter: function (value) {
                    return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
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
                    data: [bruto],
                    barWidth: 60,
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
                    data: [descontos],
                    barWidth: 60,
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
                    data: [liquido],
                    barWidth: 60,
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

    // Grafico do segundo TAB
    const option_tab2 = computed(() => {
        const data = [...select_cch_itens.value]
            .sort((a, b) => (b.ano * 100 + b.mes) - (a.ano * 100 + a.mes)) // ordena por ano e mês decrescente
            .slice(0, 6) // pega os últimos 6 meses
            .reverse();  // inverte para ordem cronológica

        const categorias = data.map(item => `${padTo2Digits(item.mes)}/${item.ano}`);
        const liquidos = data.map(item => item.valor_liquido ?? 0);
        const descontos = data.map(item => item.valor_descontos ?? 0);

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['Líquido', 'Descontos']
            },
            xAxis: {
                type: 'value',
                axisLabel: {
                    formatter: (value) => 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                }
            },
            yAxis: {
                type: 'category',
                data: categorias
                
            },
            series: [
                {
                    name: 'Descontos',
                    type: 'bar',
                    barWidth: 40,
                    stack: 'total',
                    label: { show: true, position: 'inside', color: '#fff' },
                    emphasis: { focus: 'series' },
                    itemStyle: { color: '#F2674A' },
                    data: descontos
                },
                {
                    name: 'Líquido',
                    type: 'bar',
                    barWidth: 40,
                    stack: 'total',
                    label: { show: true, position: 'inside', color: '#fff' },
                    emphasis: { focus: 'series' },
                    itemStyle: { color: '#125abf' },
                    data: liquidos
                },
                
            ]
        };
    });

    // Variaveis 
    const router = useRouter()
    const auth = useAuthStore()
    const cch_qtd = ref(0)
    const cch_ultimo = ref({})
    const cch_mes_ano = computed( () => {
        return padTo2Digits(cch_ultimo.value.mes) + '/' + cch_ultimo.value.ano
    })

    // Variavel com os contracheques do funcionario
    const select_cch_itens = ref([])
    // Variavel com o item selecionado
    const selected_cch = ref(null)
    // Formata a label do select
    const options = computed(() =>
        select_cch_itens.value.map(item => ({
            ...item,
            label: `${padTo2Digits(item.mes)}/${item.ano}`
        }))
    );

    function handlGoBack() {
        router.back(); 
    }

    const atualizar_select_list = async () => {
        colaborador_get_list_cch( auth.getEmpId(), auth.getUserId() )
        .then( (resp) => {
            // console.log("colaborador_get_list_cch.onMounted", resp)
            select_cch_itens.value= resp
        })
        .catch( (error) => {
            console.error("Erro ao atualizar a lista de contracheques:", error);
            select_cch_itens.value= null
        });
    }
    
    onMounted( () => {
        colaborador_get_count_cch(auth.getEmpId(), auth.getUserId())
        .then( (resp) => {
            // console.log("colaborador_get_count_cch.onMounted", resp)
            cch_qtd.value = resp            
        })

        colaborador_get_last_cch( auth.getEmpId(), auth.getUserId() )
        .then( (resp) => {
            // console.log("colaborador_get_last_cch.onMounted", resp)
            cch_ultimo.value = resp
        })

        atualizar_select_list();
    })

    const atualizar_pdfblob = async (cch) => {
        // Se houver algum valor inválido, reseta o PDF
        if (!cch || !cch.file_url || !cch.cch_id) {
            pdfBlob.value = null;
            return;
        }

        // Evita condição de corrida: só aplica o último resultado
        const reqId = Symbol('load-cch');
        atualizar_pdfblob._lastReq = reqId;

        try {
            // Se o serviço aceita parâmetros POSICIONAIS:
            const response = await colaborador_view_cch(
                auth.getUserId(),
                cch.cch_id,
                'v'
            );

            // Normaliza para Blob (se vier AxiosResponse ou Blob direto)
            const blob = response instanceof Blob
                ? response
                : (response?.data instanceof Blob
                    ? response.data
                    : new Blob([response?.data ?? response], { type: 'application/pdf' }));

            // Só aplica se ainda for a requisição mais recente
            if (atualizar_pdfblob._lastReq === reqId) {
                pdfBlob.value = blob;
            }
        } catch (err) {
            console.error('Erro ao carregar o PDF:', err);
            if (atualizar_pdfblob._lastReq === reqId) {
                pdfBlob.value = null;
            }
        }
    };

    const visualizar_arquivo = async () => {
        if ( selected_cch.value == null || !selected_cch?.value.cch_id ) {
            alert("Nenhum contracheque selecionado.");
            return
        }
        const ok = await openDeliveryNotice()
        if (!ok) return
        // console.log("visualizar_arquivo - selected_cch:", selected_cch.value);
        if (!selected_cch.value) {
            console.warn("Nenhum contracheque selecionado.");
            return;
        }
        await atualizar_pdfblob(selected_cch.value)
        if (selected_cch.value && !selected_cch.value.entregue) {
            atualizar_select_list();
        }
        
    }

    const download_cch = async () => {
        if ( selected_cch.value == null || !selected_cch?.value.cch_id ) {
            alert("Nenhum contracheque selecionado.");
            return
        }
        const ok = await openDeliveryNotice()
        if (!ok) return
        
        // Certifique-se de que selected_cch.value tenha as propriedades corretas
        if (!selected_cch.value) {
            console.warn("Nenhum contracheque selecionado.");
            return;
        }

        // Obtém os IDs e o nome do arquivo do contracheque selecionado
        const col_id    = auth.getUserId();
        const cch_id = selected_cch.value.cch_id;
        const file_name = selected_cch.value.name || selected_cch.value.file_name;
        
        // Verifica se os IDs e o nome do arquivo são válidos
        if (!col_id || !cch_id || !file_name) {
            console.warn("ID do contracheque ou nome do arquivo inválido.");
            return;
        }

        // Chama o serviço de download do contracheque do colaborador
        try {
            const resp = await colaborador_download_cch(
                col_id,          // ok
                cch_id,          // ok
                'd',             // 'd' de download (ou 'v' se seu backend usar isso)
                null,            // ip_origem (pode deixar null)
                navigator.userAgent ?? null,
                file_name
            );
            // TODO: Colocar o tratamento para exibir um alerta avisando que o download aconteceu ou informando um erro
            return resp;
        } catch (error) {
            console.error(error);
        }
        if (selected_cch.value && !selected_cch.value.entregue) {
            atualizar_select_list();
        }
    }

    watch(
        selected_cch,
        (novo, antigo) => {
            // console.log("watch.selected_cch - novo:", novo, "antigo:", antigo);
            if (antigo && (novo.ano !== antigo.ano || novo.mes !== antigo.mes)) {
                pdfBlob.value = null; // força reset
                showDeliveryDialog.value = false
                dontShowAgain.value = false
                skipDeliveryNotice.value = false
                _resolveDelivery.value = null
            }
        },
        { immediate: false }
    );
</script>

<template>
    <v-dialog v-model="showDeliveryDialog" max-width="520">
        <v-card>
            <v-card-title class="text-warning">Atenção</v-card-title>
            <v-card-text>
            <v-alert
                type="warning"
                variant="tonal"
                density="comfortable"
                icon="mdi-alert"
                class="mb-2"
            >
                Ao <b>visualizar</b> ou <b>baixar</b> este contracheque, ele será
                <b>marcado como ENTREGUE</b> no sistema.
            </v-alert>

            <v-checkbox
                v-model="dontShowAgain"
                density="comfortable"
                label="Não mostrar novamente"
                hide-details
            />
            </v-card-text>
            <v-card-actions class="justify-end">
            <v-btn variant="text" @click="onDeliveryCancel">Cancelar</v-btn>
            <v-btn color="warning" @click="onDeliveryContinue">Continuar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <AdminLayout>
        <v-card flat style="width: 98%;">  
            <v-card-title class="d-flex align-center pe-2">
                <v-icon icon="mdi-account-cash-outline"></v-icon> &nbsp; Contracheques&nbsp;&nbsp;
                <div class="d-flex align-center justify-start ga-2 me-2"> 
                    <v-btn variant="flat" color="tonal" @click="handlGoBack">Voltar</v-btn>
                </div>
                <v-spacer></v-spacer>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-row>
                    <v-col cols="2">
                        <v-row>
                            <v-col cols="12" md="12">
                                <Card :loading="false" 
                                    :clickable="false" 
                                    title="Contracheques" 
                                    subtitle="Quantidade" 
                                    :value="cch_qtd"
                                    icon="mdi-account-cash-outline"
                                    color="green"
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" md="12">
                                <Card :loading="false" 
                                    title="Último" 
                                    subtitle="Ano/Mês" 
                                    :value="cch_mes_ano"
                                    icon="mdi-account-star"
                                    color="green"
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <h3>Selecione o Contracheque</h3>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-select
                                        v-model="selected_cch"
                                        :items="options"
                                        label="Contracheque"
                                        item-title="label"
                                        item-value="item"
                                        return-object
                                        dense
                                />
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="10">
                        <v-card>
                            <v-tabs v-model="tab"  
                                    align-tabs="center" 
                                    color="deep-purple-accent-4"
                            >
                                <v-tab value="1">Contracheque: Gráficos</v-tab>
                                <v-tab value="2">Evoulção Financeira</v-tab>
                                <v-tab value="3">Contracheque: Detelhes</v-tab>
                            </v-tabs>
                            <v-tabs-window v-model="tab">
                                <v-tabs-window-item value="1">
                                    <v-container fluid style="height: calc(100vh - 380px);">
                                        <v-row class="fill-height">
                                            <v-col cols="12" class="fill-height">
                                                <v-chart :option="option_tab1" style="height: 100%; width: 100%;" autoresize />
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-tabs-window-item>
                                <v-tabs-window-item value="2">
                                    <v-container fluid style="height: calc(100vh - 380px);">
                                        <v-row class="fill-height">
                                            <v-col cols="12" class="fill-height">
                                                <v-chart :option="option_tab2" style="height: 100%; width: 100%;" autoresize />
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-tabs-window-item>
                                <v-tabs-window-item value="3">
                                    <v-container fluid style="height: calc(100vh - 380px);">
                                        <v-row justify="center" align="center" dense>
                                            <v-col cols="auto">
                                                <v-btn
                                                color="primary"
                                                variant="flat"
                                                prepend-icon="mdi-eye"
                                                @click="visualizar_arquivo"
                                                >
                                                Visualizar
                                                </v-btn>
                                            </v-col>
                                            <v-col cols="auto">
                                                <v-btn
                                                color="success"
                                                variant="flat"
                                                prepend-icon="mdi-download"
                                                @click="download_cch"
                                                >
                                                Download
                                                </v-btn>
                                            </v-col>
                                        </v-row>    
                                        <v-row class="fill-height">
                                            <v-col cols="12" class="fill-height">
                                                <VisualizarPDF :pdfBlob="pdfBlob"/>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-tabs-window-item>
                            </v-tabs-window>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>       
    </AdminLayout>
</template>