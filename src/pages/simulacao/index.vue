<script setup>
    import { ref } from 'vue'
    import { formatMoney } from '@/services/formatString'

    // // Props (opcional): passe itens de menu e versão se quiser customizar
    const props = defineProps({
      nr_prestacao: {
        type: Number,
        // default: 0,
        // validator: v => Number.isInteger(v) && v >= 0, // garante inteiro não-negativo
      },
      vl_prestacao: {
        type: Number,
        // default: 0, // aceita decimais
        // validator: v => Number.isInteger(v) && v >= 0, // garante inteiro não-negativo
      },
    })
    
    // Estados de UI
    const show_resultado = ref(false)
    const show_button_reset = ref(false)
    const show_await_result = ref(false)

    // Proteção (seguro)
    const com_seguro = ref(true)

    // Parâmetros do produto
    const taxa_juros_mensal = ref(null)
    const nr_minimo_parcela = ref(null)
    const nr_maximo_parcela = ref(null)
    const vl_minimo_parcela = ref(null)
    const vl_maximo_parcela = ref(null)

    // Inputs do formulário
    // Estado local espelhado das props (evita mutação direta das props)
    const nr_prestacao = ref(props.nr_prestacao ?? 0)
    const vl_prestacao = ref(props.vl_prestacao ?? 0)
    console.log('nr_prestacao', nr_prestacao.value, 'vl_prestacao', vl_prestacao.value)
    console.log('nr_prestacao', props.nr_prestacao, 'vl_prestacao', props.vl_prestacao)
    
    const selected_month = ref(null)

    // Usuário (mantido como no original)
    const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
    const emp_id = ref(user.value.emp_id)
    const col_id = ref(user.value.col_id)

    // Opções do select (adaptado para Vuetify: { title, value })
    const options_select = ref([
        { value: null, title: 'Selecione uma instituição' },
        { value: '1', title: 'Banco XPTO' },
        { value: '2', title: 'Banco 123' },
        { value: '3', title: 'Banco ABC' },
        { value: '4', title: 'Banco XYZ' },
    ])

    // Valor selecionado
    const selected = ref(null)

    // Atualiza parâmetros quando muda a instituição
    const handleChange = (val) => {
      if (val != null) {
          taxa_juros_mensal.value = 2.5
          nr_minimo_parcela.value = 1
          nr_maximo_parcela.value = 60
          vl_minimo_parcela.value = 100
          vl_maximo_parcela.value = 5000
      } else {
          taxa_juros_mensal.value = null
          nr_minimo_parcela.value = null
          nr_maximo_parcela.value = null
          vl_minimo_parcela.value = null
          vl_maximo_parcela.value = null
      }
    }

    // Form
    const formRef = ref(null)

    // Validações (rules)
    const rules = {
      required: (v) => !!v || 'Campo obrigatório',
      moneyRange: (v) => {
          if (v == null || v === '') return 'Campo obrigatório'
          if (vl_minimo_parcela.value != null && v < vl_minimo_parcela.value) {
          return `Mínimo ${formatMoney(vl_minimo_parcela.value)}`
          }
          if (vl_maximo_parcela.value != null && v > vl_maximo_parcela.value) {
          return `Máximo ${formatMoney(vl_maximo_parcela.value)}`
          }
          return true
      },
      parcelaRange: (v) => {
          if (v == null || v === '') return 'Campo obrigatório'
          if (nr_minimo_parcela.value != null && +v < +nr_minimo_parcela.value) {
          return `Mínimo ${nr_minimo_parcela.value}`
          }
          if (nr_maximo_parcela.value != null && +v > +nr_maximo_parcela.value) {
          return `Máximo ${nr_maximo_parcela.value}`
          }
          return true
      },
    }

    // Submete
    const onSubmit = async () => {
      const { valid } = await formRef.value.validate()
      if (!valid) return

      show_await_result.value = true
      setTimeout(() => {
          show_resultado.value = true
          show_button_reset.value = true
          show_await_result.value = false
      }, 1500)
    }

    // Reset
    const onReset = () => {
        show_resultado.value = false
        show_button_reset.value = false
        selected.value = null
        vl_prestacao.value = null
        nr_prestacao.value = null
        selected_month.value = null
        formRef.value?.resetValidation()
    }

    // Toggle (apenas mantém a reatividade)
    const onchange_toggle = (val) => {
        com_seguro.value = val
    }

    // Gera 3 meses a partir do mês atual (pt-BR)
    const buildFirstInstallmentOptions = () => {
        const base = new Date()
        base.setDate(1) // evita problemas de fuso/DST

        const options = []
        for (let i = 0; i < 3; i++) {
            const d = new Date(base.getFullYear(), base.getMonth() + i, 1)
            const y = d.getFullYear()
            const m = String(d.getMonth() + 1).padStart(2, '0')

            // nome do mês em pt-BR e capitalizado
            const monthName = d.toLocaleString('pt-BR', { month: 'long' })
            const title =
            `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} / ${y}`

            options.push({
            title,                 // o que aparece no select
            value: `${y}-${m}`,    // valor que você envia/guarda (ex: 2025-08)
            raw: d,                // se precisar da Date depois
            })
        }
        return options
    }

    const firstInstallmentOptions = ref(buildFirstInstallmentOptions())
</script>

<template>
  <AdminLayout>
    <v-container fluid>
      <v-form ref="formRef" @submit.prevent="onSubmit" @reset.prevent="onReset">
        <!-- Seleção de instituição + info -->
        <v-card color="#F5F5F5" class="mb-4">
            <v-card-text>
                <v-row>
                    <v-col cols="3" md="4">
                            <v-select
                            v-model="selected"
                            :items="options_select"
                            item-title="title"
                            item-value="value"
                            label="Instituição financeira"
                            variant="outlined"
                            density="comfortable"
                            :disabled="show_resultado"
                            @update:modelValue="handleChange"
                        />
                        
                        
                    </v-col>
                    <v-col cols="3" md="2">
                        <div class="d-flex">
                            <div class="me-3">
                            <v-avatar size="32" variant="tonal" color="error">
                                <v-icon>mdi-percent-outline</v-icon>
                            </v-avatar>
                            </div>
                            <div>
                            <div class="text-body-2">Taxa de Juros</div>
                            <div class="text-medium-emphasis">
                                {{ taxa_juros_mensal ?? '--' }} %
                            </div>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="3" md="2">
                        <div class="d-flex">
                            <div class="me-3">
                            <v-avatar size="32" variant="tonal" color="primary">
                                <v-icon>mdi-format-list-numbered</v-icon>
                            </v-avatar>
                            </div>
                            <div>
                            <div class="text-body-2">Mínimo de parcelas</div>
                            <div class="text-medium-emphasis">
                                {{ nr_minimo_parcela ?? '--' }}
                            </div>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="3" md="2">
                        <div class="d-flex">
                            <div class="me-3">
                            <v-avatar size="32" variant="tonal" color="primary">
                                <v-icon>mdi-format-list-numbered-rtl</v-icon>
                            </v-avatar>
                            </div>
                            <div>
                            <div class="text-body-2">Máximo de parcelas</div>
                            <div class="text-medium-emphasis">
                                {{ nr_maximo_parcela ?? '--' }}
                            </div>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Campos principais -->
        <v-card color="#F5F5F5" class="mb-4">
            <v-card-text>
                <r-row class="d-flex align-center">
                    <v-col cols="4" md="4">
                        <h5 class="mb-2">Quanto você precisa?</h5>
                        <div class="text-medium-emphasis text-caption mb-2">
                            de {{ vl_minimo_parcela != null ? formatMoney(vl_minimo_parcela) : '--' }}
                            até {{ vl_maximo_parcela != null ? formatMoney(vl_maximo_parcela) : '--' }}.
                        </div>

                        <v-text-field
                            v-model="vl_prestacao"
                            
                            type="number"
                            label="Insira o valor desejado"
                            prefix="R$"
                            variant="outlined"
                            density="comfortable"
                            :rules="[rules.moneyRange]"
                            required
                        />
                    </v-col>

                    <v-col cols="4" md="4">
                        <h5 class="mb-2">Quando você prefere pagar?</h5>
                        <div class="text-medium-emphasis text-caption mb-2">
                            escolha entre os meses disponíveis
                        </div>

                        <v-select v-model="selected_month"
                            :items="firstInstallmentOptions"
                            item-title="title"
                            item-value="value"
                            label="Mês da primeira parcela"
                            placeholder="-- Selecione um mês --"
                            prepend-inner-icon="mdi-calendar-month-outline"
                            variant="outlined"
                            density="comfortable"
                            :rules="[rules.required]"
                            required
                            />
                    </v-col>

                    <v-col cols="4" md="4">
                            <h5 class="mb-2">Qual o melhor prazo?</h5>
                            <div class="text-medium-emphasis text-caption mb-2">
                            escolha entre {{ nr_minimo_parcela ?? '--' }} até {{ nr_maximo_parcela ?? '--' }}
                            </div>

                            <v-text-field
                            v-model="nr_prestacao"
                            type="number"
                            label="Quantidade de parcelas"
                            prepend-inner-icon="mdi-pound"
                            variant="outlined"
                            density="comfortable"
                            :rules="[rules.parcelaRange]"
                            required
                            />
                    </v-col>
                </r-row>
            </v-card-text>
        </v-card>

        <!-- Proteção (seguro) + botões -->
        <v-card color="#F5F5F5" class="mb-4">
            <v-card-text>
                <v-row>
                  <v-col cols="12" class="d-flex align-center">
                    <h3 class="mr-4">Proteger empréstimo?</h3>
                    <v-switch
                      v-model="com_seguro"
                      inset
                      color="primary"
                      @update:modelValue="onchange_toggle"
                      :label="com_seguro ? 'Sim' : 'Não'"
                    />
                  </v-col>

                  <v-col cols="12" class="d-flex align-center">
                    <v-icon class="mr-3" size="36">
                      {{ com_seguro ? 'mdi-shield-check' : 'mdi-shield-outline' }}
                    </v-icon>
                    <h2 class="mb-0">
                      empréstimo{{ com_seguro ? ' protegido' : ' desprotegido' }}
                    </h2>
                  </v-col>

                  <v-col cols="12" class="d-flex align-center">
                    <v-icon class="mr-2" size="28">
                      {{ com_seguro ? 'mdi-check' : 'mdi-close' }}
                    </v-icon>
                    <h5 class="mb-0 mr-6">
                      {{ com_seguro ? 'com ' : 'sem ' }}proteção em casos de desemprego, invalidez e morte
                    </h5>

                    <v-icon class="mr-2" size="28">
                      {{ com_seguro ? 'mdi-check' : 'mdi-close' }}
                    </v-icon>
                    <h5 class="mb-0">
                      {{ com_seguro ? 'com ' : 'sem ' }}taxas reduzidas
                    </h5>
                  </v-col>

                  <v-col cols="12" class="d-flex justify-center mt-6">
                    <v-btn
                      v-if="!show_button_reset"
                      type="submit"
                      size="large"
                      color="secondary"
                      class="mr-3"
                      variant="elevated"
                      :loading="show_await_result"
                      :disabled="show_await_result"
                    >
                      <v-icon start>
                        {{ com_seguro ? 'mdi-shield-check' : 'mdi-shield-outline' }}
                      </v-icon>
                      <span>obter cotação</span>
                    </v-btn>

                    <v-btn
                      v-else
                      type="reset"
                      size="large"
                      color="success"
                      variant="outlined"
                    >
                      <v-icon start>
                        {{ com_seguro ? 'mdi-shield-check' : 'mdi-shield-outline' }}
                      </v-icon>
                      nova cotação
                    </v-btn>
                  </v-col>

                  <v-col cols="12" class="d-flex justify-center" v-if="show_resultado">
                    <h3 class="mb-3 text-center">
                      a sua oferta para o valor simulado é:
                      <small class="text-medium-emphasis text-h5 ml-2">60X</small>
                      de
                      <small class="text-medium-emphasis text-h5 ml-1">R$ 600,00</small>
                    </h3>
                  </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        
        <!-- Detalhes da oferta -->
        <v-row v-if="show_resultado" class="mt-3">
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <div class="mb-2">
                  <h3 class="mb-1">detalhes da oferta</h3>
                  <h5 class="text-medium-emphasis">
                    Veja aqui o seu plano de pagamento e tudo o que você está economizando ao contratar o empréstimo pessoal.
                  </h5>
                </div>

                <v-list lines="one" density="comfortable">
                  <v-list-item>
                    <template #title>taxa de juros reduzida</template>
                    <template #append>
                      <span class="text-body-2">{{ taxa_juros_mensal }}% ao mês</span>
                    </template>
                  </v-list-item>

                  <v-list-item>
                    <template #title>parcelas do empréstimo</template>
                    <template #append>
                      <span class="text-body-2">{{ formatMoney(taxa_juros_mensal) }}</span>
                    </template>
                  </v-list-item>

                  <v-list-item>
                    <template #title>parcelas do seguro</template>
                    <template #append>
                      <span class="text-body-2">{{ taxa_juros_mensal }}</span>
                    </template>
                  </v-list-item>

                  <v-list-item>
                    <template #title>valor total</template>
                    <template #append>
                      <span class="text-body-2">{{ nr_prestacao }}x {{ vl_prestacao }}</span>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </AdminLayout>
</template>

<style scoped>
/* estilinhos leves para aproximar do visual do original */
.text-medium-emphasis { opacity: 0.7; }
</style>
