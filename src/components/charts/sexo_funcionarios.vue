<script setup>
    import { ref, computed, watch } from 'vue';
    import { colaborador_qtd_sexo } from '@/services/colaborador_service';

    const props = defineProps({
        emp_id: { type: String, required: true },
        status: { type: String, default: '' },
        height: { type: String, default: '250' },
        color: { type: String, default: 'primary' },
    })

    const loading = ref(false)
    const error   = ref('')
    const data_rows   = ref([])

    const options_pie = computed(() => {
        return {
            title: {
                text: 'SEXO DOS FUNCIONÁRIOS',
                padding: [10, 0, 8, 10], // top, right, bottom, left
                textStyle: {
                    fontSize: '0.75rem',
                    fontWeight: 1000,
                    letterSpacing: '0.2rem',
                    textTransform: 'uppercase', // precisa aplicar via CSS se não funcionar direto
                }
            },
            tooltip: {
                trigger: 'item',
            },
            legend: {
                orient: 'vertical',
                top: 'center',
                left: '0%',       // mais colado na borda
                itemWidth: 30,    // tamanho do ícone da legenda
                itemGap: 10,      // espaçamento entre os itens
                textStyle: {
                    fontSize: 12
                }
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                padAngle: 5,
                itemStyle: {
                    borderRadius: 5
                },
                label: {
                    show: true,
                    
                    position: 'center',
                    formatter: `${total.value}`,
                    // position: 'outer',
                    // formatter: `{b}: {d}%`,
                    // formatter: '{d}%', // ou '{b}: {d}%' para porcentagem
                    fontSize: 16,
                    fontWeight: 'bold',
                    // color: '#333'
                },
                data: data_rows.value
                }
            ]
        };
    });

    const total = computed(() => data_rows.value.reduce((s, i) => s + i.value, 0))

    async function fetchData() {
        if (!props.emp_id) return
        loading.value = true
        error.value = ''
        try {
            const resp = await colaborador_qtd_sexo(props.emp_id, props.status)
            // console.log('sexo_fetchData', resp)
            const entradas = Object.entries(resp)
            entradas.forEach(([chave, valor]) => {
                data_rows.value.push({
                    "value": valor, 
                    "name": chave
                })
                
            })
            // console.log(data)
            console.log('fetchData_data', data_rows.value)
        } catch (e) {
            console.error('tempo-servico.fetch error', e)
            error.value = 'Falha ao carregar tempo de serviço.'
        } finally {
            loading.value = false
        }
    }

    watch(() => [props.emp_id, props.status], fetchData, { immediate: true })

    const chartStyle = computed(() => ({
        width: '100%',
        height: typeof props.height === 'number'
            ? `${props.height}px`
            : /px$/.test(props.height) ? props.height : `${props.height}px`
        })
    )
</script>

<template>
    <v-card  flat :color="props.color + '-lighten-5'">
        <v-skeleton-loader v-if="loading" type="image" :loading="loading"  />
        <!-- <v-chart v-else :option="options_pie" autoresize style="width: 100%; height: 200%;" /> -->
         <v-chart v-else :option="options_pie" autoresize :style="chartStyle" />
        
    </v-card>
</template>
