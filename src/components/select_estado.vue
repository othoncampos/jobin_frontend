<template>
  <v-select
    v-model="internalUf"
    :items="ufs"
    item-title="label"
    item-value="id"
    density="comfortable"
    label="Filtrar por Estado"
    clearable
    variant="solo-filled"
  />
</template>

<script setup>
    import { uf_lista_all } from '@/services/uf_services'
    import { ref, watch, onMounted, defineProps, defineEmits } from 'vue'

    const props = defineProps({
        modelValue: {
            type: [Number, null], // ID do estado ou null
            default: null
        }
    })
    const emit = defineEmits(['update:modelValue'])

    const ufs = ref([])
    const internalUf = ref(props.modelValue) // Local state

    onMounted(() => {
    uf_lista_all()
        .then(resp => {
        ufs.value = resp.map(uf => ({
            id: uf.id,
            label: `${uf.sigla} - ${uf.nome}`
        }))
        })
        .catch(err => {
        console.error('Erro ao atualizar estados:', err)
        })
    })

    // Sempre que internalUf mudar, emite para o pai
    watch(internalUf, (newValue) => {
        emit('update:modelValue', newValue)
    })

    // Sempre que o pai mudar o v-model, atualiza localmente
    watch(() => props.modelValue, (newValue) => {
        internalUf.value = newValue
    })
</script>
