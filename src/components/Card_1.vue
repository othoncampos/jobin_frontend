<script setup>
    import { computed } from 'vue';

    const props = defineProps({
        title: { type: String, required: true },
        subtitle: { type: String, default: '' },
        value: { type: [String, Number], default: '' },
        icon: { type: String, default: 'mdi-information' },
        color: { type: String, default: 'primary' },
        loading: { type: Boolean, default: false },
        clickable: { type: Boolean, default: false },
        onClick: { type: Function, default: null }
    })

    // const emit = defineEmits(['click'])

    const valueLength = computed(() => {
        if (props.value === null || props.value === undefined) return 0
        return typeof props.value === 'number'
            ? props.value.toString().length
            : props.value.length
    })

    const isTruncated = computed(() => valueLength.value > 12)
    const truncatedValue = computed(() => isTruncated ? props.value.substring(0,12) : props.value)
    
    function handleClick() {
        console.log('handleClick', props.clickable, props.onClick)
        if (props.clickable && typeof props.onClick === 'function') {
            props.onClick();
        }
    }

    const cardColor = computed(() => `${props.color}-lighten-5`)
</script>

<template>
    <v-card 
        :loading="props.loading" 
        :class="{ 'cursor-pointer': props.clickable }"
        :color="props.color + '-lighten-5'"
        @click="handleClick"
        hover
    >
        <v-card-title class="text-overline" >
            <strong>{{ props.title }}</strong>
            <div class="text-medium-emphasis font-weight-regular">
                {{props.subtitle}}
            </div>
            <div style="display: flex; justify-content: space-between;">
                <template v-if="!isTruncated">
                    <span class="text-green-darken-3 text-h6 font-weight-bold">
                        {{ props.value }}
                    </span>
                </template>
                <template v-else>
                    <!-- <span class="text-green-darken-3 text-h6 font-weight-bold">
                        {{ props.value.substring(0,12) }}
                    </span> -->
                    <v-tooltip location="top">
                        <template #activator="{ props: tooltipProps }">
                        <span
                            v-bind="tooltipProps"
                            class="text-green-darken-3 text-h6 font-weight-bold"
                            style="cursor: help;"
                        >
                            {{ truncatedValue }}...
                            <v-icon icon="mdi-information-outline" size="16" />
                        </span>
                        </template>
                        {{ props.value }}
                    </v-tooltip>
                </template>
                <v-icon :color="props.color" size="24">{{props.icon}}</v-icon>
            </div>
        </v-card-title> 
    </v-card>

</template>

<style scoped>
    .cursor-pointer {
        cursor: pointer;
    }
</style>