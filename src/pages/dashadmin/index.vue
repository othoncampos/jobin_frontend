<script setup lang="ts">
    import AdminLayout from '@/layouts/AdminLayout.vue';
    import Card from '@/components/Card_1.vue';
    
    import { ref } from 'vue';

    const total_funcionarios = ref(10)
    const mes = ref(8)
    const ano = ref(2025)

    const handleClick = () => {
        console.log('Card clicado! -> 1')
    }

    const option = {
        title: {
            text: `Faturamento do mês: ${mes.value}/${ano.value}`,
            left: 'left',
            top: 'top',
            textStyle: {
                fontFamily: "Roboto",
                fontSize: 14,
                fontWeight: '700',
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'shadow'
            },
            formatter: function (params) {
            var tar = params[1];
            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            splitLine: { show: false },
            data: ['Total', 'Rent', 'Utilities', 'Transportation', 'Meals', 'Other']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
            name: 'Placeholder',
            type: 'bar',
            stack: 'Total',
            itemStyle: {
                borderColor: 'transparent',
                color: 'transparent'
            },
            emphasis: {
                itemStyle: {
                borderColor: 'transparent',
                color: 'transparent'
                }
            },
            data: [0, 1700, 1400, 1200, 300, 0]
            },
            {
            name: 'Life Cost',
            type: 'bar',
            stack: 'Total',
            label: {
                show: true,
                position: 'inside'
            },
            data: [2900, 1200, 300, 200, 900, 300]
            }
        ]
    };

    const pie_funcioarios = {
        title: {
            text: 'Contratos de Funcionários',
            left: 'left',
            top: 'top',
            textStyle: {
                fontFamily: "Roboto",
                fontSize: 14,
                // fontWeight: 'bold',
                // color: '#757575'
            }
        },
        tooltip: {
            trigger: 'item'
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
                name: 'Contratos Funcionários',
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
                    formatter: `Total: \n${total_funcionarios.value}`,
                    // position: 'outer',
                    // formatter: `{b}: {d}%`,
                    // formatter: '{d}%', // ou '{b}: {d}%' para porcentagem
                    fontSize: 16,
                    fontWeight: 'bold',
                    // color: '#333'
                },
                data: [
                    { value: 11, name: 'CLT' },
                    { value: 9, name: 'PJ' },
                    { value: 4, name: 'Sócios' },
                    { value: 2, name: 'Outros' },
                ]
            }
        ]
    };
    
    const option1 = {
  title: {
        text: 'Exemplo de Gráfico de Barras Agrupadas'
    },
  tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
  xAxis: {
    type: 'category',
    data: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [30, 120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      stack: 'total',
      itemStyle: {
                color: 'blue'
            },
      emphasis: {
                focus: 'series'
            },
    },
    {
      data: [-10, -20, -150, -120, -80, -40, -75, -30],
      type: 'bar',
      stack: 'total',
      itemStyle: {
                color: 'red'
            },
      
      emphasis: {
                focus: 'series'
            },
    },
      {
      data: [ 20, 100,   50,   30,   0,  30, 35, 100],
      type: 'line',
      itemStyle: {
                color: 'orange'
            },
    }
    
  ]
    };

    const option2 = {
    title: {
        text: 'Stacked Line'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
        saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
    ]
    };

    const chartOption = {
        title: { show: false },
        tooltip: {},
        xAxis: { type: 'category', data: ['Jan', 'Fev', 'Mar'] },
        yAxis: { type: 'value' },
        grid: {
            top: 20,
            bottom: 10,
            left: 10,
            right: 10,
            containLabel: true
        },
        series: [
            { type: 'bar', data: [100, 150, 80], name: 'Vendas' }
        ]

    }

    import ContaTimeline from '@/components/ContaTimeline.vue'

    const eventos = [
        { data: '2025-07-01', quantidade: 12, valor: 5230.0 },
        { data: '2025-07-05', quantidade: 8, valor: 3170.0 },
        { data: '2025-07-10', quantidade: 15, valor: 7420.0 }
    ]
</script>

<template>
    <AdminLayout>
        <v-row>
            <v-col cols="6">
                <v-row>
                    <v-col cols="4" md="4">
                        <Card :loading="false" 
                              :clickable="true" 
                              title="teste" 
                              subtitle="subteste" 
                              value="90"
                              @click="handleClick"
                              icon="mdi-alarm"
                              color="green"
                        />
                    </v-col>
                    <v-col cols="4" md="4">
                        <Card :loading="false" 
                              :clickable="true" 
                              title="teste" 
                              subtitle="subteste" 
                              value="90"
                              @click="handleClick"
                        />
                    </v-col>
                    <v-col cols="4" md="4">
                        <Card :loading="false" 
                              :clickable="true" 
                              title="teste" 
                              subtitle="subteste" 
                              value="90"
                              @click="handleClick"
                              icon="mdi-alarm"
                              color="green"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4" md="4">
                        <Card :loading="false" 
                              :clickable="true" 
                              title="teste" 
                              subtitle="subteste" 
                              value="90"
                              @click="handleClick"
                              icon="mdi-alarm"
                              color="green"
                        />
                    </v-col>
                    <v-col cols="4" md="4">
                        <Card :loading="false" 
                              :clickable="true" 
                              title="teste" 
                              subtitle="subteste" 
                              value="90"
                              @click="handleClick"
                    />
                    </v-col>
                    <v-col cols="4" md="4">
                        <Card :loading="false" 
                              :clickable="true" 
                              title="teste" 
                              subtitle="subteste" 
                              value="90"
                              @click="handleClick"
                              icon="mdi-alarm"
                              color="green"
                        />
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="3" class="d-flex flex-column fill-height">
                <v-card loading hover class="fill-height">
                    <v-chart :option="pie_funcioarios" autoresize style="width: 100%; height: 200%;" />
                </v-card> 
            </v-col>
            <v-col cols="3" class="d-flex flex-column fill-height">
                <v-card loading hover class="fill-height">
                    <v-chart :option="option" style="height: 197px" />
                </v-card> 
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="4" class="d-flex flex-column fill-height">
                <ContaTimeline :eventos="eventos"/>
            </v-col>
            <v-col cols="8" class="d-flex flex-column fill-height">
                <!-- <v-card> -->
                    <v-chart auto-resize :option="option1" style="height: 370px" />
                <!-- </v-card> -->
            </v-col>
            
        </v-row>
    </AdminLayout>
</template>