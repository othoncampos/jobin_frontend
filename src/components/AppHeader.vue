<template>
    <v-app-bar app dark >
        <v-app-bar-title>
            <div class="d-flex align-center">
                <v-img
                    src="/logo-sm.png"
                    max-height="40"
                    max-width="40"
                    class="mr-3"
                    cover
                />
                <h2><strong>Influir</strong></h2>
            </div>
        </v-app-bar-title>
        <template v-slot:append>
            <button-change-theme></button-change-theme>
            <v-divider vertical></v-divider>
            <v-btn prepend-icon="mdi-login-variant" v-if="!auth.isAuthenticated" color="secondary" @click="handleLogin">
                Login
            </v-btn>
            <!-- <template v-else>
                <v-avatar>
                    <v-img alt="John" src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
                </v-avatar>
                <v-menu>
                <template v-slot:activator="{ props: menu }">
                    <v-tooltip location="top">
                        <template v-slot:activator="{ props: tooltip }">
                            <v-btn color="primary" v-bind="mergeProps(menu, tooltip)" append-icon="mdi-dots-vertical">
                                <strong class="me-2">{{auth.getNome()}}</strong>
                            </v-btn>
                        </template>
                        <span>I'm A Tooltip</span>
                    </v-tooltip>
                </template>
                <v-list>
                    <v-list-subheader>REPORTS</v-list-subheader>
                    <v-list-item
                        v-for="(item, index) in items"
                            :key="index"
                            :value="index"
                    >
                        <template v-slot:prepend>
                            <v-icon :icon="item.icon"></v-icon>
                        </template>

                        <v-list-item-title @click="item.action">{{ item.text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            </template> -->
            <v-btn v-else append-icon="mdi-login-variant" color="secondary" @click="handleLogout">
                Logout
            </v-btn>
        </template>
    </v-app-bar>
</template>

<script setup>

    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/store/auth.js'

    import { mergeProps } from 'vue'

    const items = [
        { text: 'Real-Time', icon: 'mdi-clock', action: '' },
        { text: 'Audience', icon: 'mdi-account', action: '' },
        { text: 'Sair', icon: 'mdi-login-variant', action: handleLogout },
    ]
   
    const auth = useAuthStore()
    const router = useRouter()

    function handleLogin() {
        // auth.login()
        router.push('/login')
    }

    function handleLogout() {    
        auth.logout()
        router.push('/')
    }
</script>

<style scoped lang="sass">
</style>
