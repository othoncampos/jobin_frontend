<script setup>
    import { ref, computed, watch } from 'vue';
    import { colaborador_tempo_servico } from '@/services/colaborador_service';
    
    const props = defineProps({
        emp_id: { type: String, required: true },
        status: { type: String, default: '' },
        height: { type: String, default: '250' },
        color: { type: String, default: 'teal' },
    })
    
    const RANGES = ['< 1 ano', '1–3 anos', '3–5 anos', '5–10 anos', '10–15 anos', '15+ anos']
    const loading = ref(false)
    const error   = ref('')
    const labels  = ref([...RANGES])
    const values  = ref([0, 0, 0, 0, 0, 0])

    const chartOption = computed(() => ({   
        title: {
            text: 'TEMPO DE EMPRESA',
            padding: [10, 0, 8, 10], // top, right, bottom, left
            textStyle: {
                fontSize: '0.75rem',
                fontWeight: 1000,
                letterSpacing: '0.2rem',
                textTransform: 'uppercase', // precisa aplicar via CSS se não funcionar direto
            }
        },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: 8, right: 20, top: 35, bottom: 8, containLabel: true },
        xAxis: { type: 'value' },
        yAxis: { type: 'category', data: labels.value },
        series: [{
            type: 'bar',
            data: values.value,
            label: { show: true, position: 'right' },
            barWidth: 20,
            emphasis: { focus: 'series' },
        }],
    }))

    function normalizeResponse(resp) {
        // Aceita dois formatos: { labels: [...], counts: [...] } OU { '< 1 ano': 3, '1–3 anos': 5, ... }
        if (!resp) return { labels: [...RANGES], counts: new Array(RANGES.length).fill(0) }

        // axios costuma embutir em resp.data; se já for o payload, trate igual
        const payload = resp?.data ?? resp

        if (Array.isArray(payload?.labels) && Array.isArray(payload?.counts)) {
            // Garante que a ordem siga RANGES quando possível
            const map = new Map(payload.labels.map((k, i) => [k, Number(payload.counts[i]) || 0]))
            const orderedCounts = RANGES.map(r => map.get(r) ?? 0)
            return { labels: [...RANGES], counts: orderedCounts }
        }

        // Dicionário simples
        if (payload && typeof payload === 'object') {
            const countsByRange = new Map(Object.entries(payload).map(([k, v]) => [k, Number(v) || 0]))
            const orderedCounts = RANGES.map(r => countsByRange.get(r) ?? 0)
            return { labels: [...RANGES], counts: orderedCounts }
        }

        return { labels: [...RANGES], counts: new Array(RANGES.length).fill(0) }
    }

    async function fetchData() {
        if (!props.emp_id) return
        
        loading.value = true
        error.value = ''
        try {
            // Chamada estilo JS (não Python): argumentos posicionais
            const resp = await colaborador_tempo_servico(props.emp_id, props.status)
            const { labels: L, counts: V } = normalizeResponse(resp)
            labels.value = L
            values.value = V
            console.log('fetchData', resp)
        } catch (e) {
            console.error('tempo-servico.fetch error', e)
            error.value = 'Falha ao carregar tempo de serviço.'
            labels.value = [...RANGES]
            values.value = new Array(RANGES.length).fill(0)
        } finally {
            loading.value = false
        }
    }

    watch(() => [props.emp_id, props.status], fetchData, { immediate: true })

    const chart_style = computed(() => ({
        height: typeof props.height === 'number' ? `${props.height}px` : (/px$/.test(props.height) ? props.height : `${props.height}px`),
        width: '100%'
    }))
</script>

<template>
    <v-card  flat :color="props.color + '-lighten-5'">
        <v-skeleton-loader v-if="loading" type="image" :loading="loading" :height="chart_style.height" />
        <v-chart v-else :option="chartOption" :style="chart_style" autoresize />
    </v-card>
</template>
