<template>
    <v-btn @click="clickTeste1">Teste1</v-btn>
    <v-btn>Teste2</v-btn>
    <v-btn>Teste3</v-btn>
</template>

<script setup>
    import { useRouter } from 'vue-router'
    const router = useRouter()

    function clickTeste1() {
        router.push(`/teste1`)
    }
</script>

<style>

</style>