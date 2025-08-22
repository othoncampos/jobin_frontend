<script setup>
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

// Props (opcional): passe itens de menu e versão se quiser customizar
const props = defineProps({
  appName: { type: String, default: 'Vuetify' },
  appHref: { type: String, default: '/' },
  versions: { type: Array, default: () => ['3.x', '2.7', '2.6'] },
  currentVersion: { type: String, default: '3.x' },
})

const theme = useTheme()
const isDark = computed({
  get: () => theme.global.current.value.dark,
  set: v => (theme.global.name.value = v ? 'dark' : 'light')
})

const search = ref('')
const version = ref(props.currentVersion)
const drawer = ref(false)

const primaryItems = [
  { title: 'Docs', href: '#docs' },
  { title: 'Ecosystem', href: '#ecosystem' },
  { title: 'Community', href: '#community' },
]

const ecosystemItems = [
  { title: 'Store', href: '#store', icon: 'mdi-cart-outline' },
  { title: 'Themes', href: '#themes', icon: 'mdi-palette-outline' },
  { title: 'Playground', href: '#play', icon: 'mdi-flask-outline' },
]

function onSearch () {
  // conecte ao seu provider de busca (ex.: Algolia)
  console.log('search:', search.value)
}
</script>

<template>
  <v-app-bar flat height="64" class="border-b" :elevation="0">
    <v-container class="px-2" fluid>
      <div class="d-flex align-center justify-space-between">
        <!-- Esquerda: Menu (mobile) + Logo/Título -->
        <div class="d-flex align-center">
          <v-app-bar-nav-icon class="d-md-none me-1" @click="drawer = true" />

          <a :href="props.appHref" class="d-flex align-center text-decoration-none">
            <v-avatar size="28" class="me-2">
              <!-- Use seu logo aqui -->
              <v-icon icon="mdi-vuetify" size="28" />
            </v-avatar>
            <v-toolbar-title class="text-h6 font-weight-bold mb-0">
              {{ props.appName }}
            </v-toolbar-title>
          </a>
        </div>

        <!-- Centro: Navegação principal (desktop) -->
        <div class="d-none d-md-flex align-center gap-2">
          <v-btn v-for="it in primaryItems" :key="it.title" :href="it.href" variant="text" class="text-high-emphasis px-3">
            {{ it.title }}
          </v-btn>

          <v-menu location="bottom">
            <template #activator="{ props: a }">
              <v-btn v-bind="a" variant="text" class="px-3">
                Ecosystem
                <v-icon end icon="mdi-chevron-down" />
              </v-btn>
            </template>
            <v-list density="compact">
              <v-list-item v-for="item in ecosystemItems" :key="item.title" :href="item.href" :prepend-icon="item.icon" :title="item.title" />
            </v-list>
          </v-menu>
        </div>

        <!-- Direita: Busca, versão, tema, GitHub -->
        <div class="d-flex align-center" style="gap:.5rem;">
          <v-text-field
            v-model="search"
            density="compact"
            hide-details
            variant="solo"
            single-line
            rounded
            clearable
            flat
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            class="d-none d-sm-flex"
            style="min-width: 220px;"
            @keyup.enter="onSearch"
          />

          <v-select
            v-model="version"
            :items="props.versions"
            density="compact"
            hide-details
            variant="outlined"
            style="max-width: 96px;"
          />

          <v-btn icon :title="isDark ? 'Light mode' : 'Dark mode'" @click="isDark = !isDark">
            <v-icon :icon="isDark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'" />
          </v-btn>

          <v-btn icon href="https://github.com/vuetifyjs/vuetify" target="_blank" rel="noopener">
            <v-icon icon="mdi-github" />
          </v-btn>

          <v-btn class="d-none d-md-inline-flex" href="#get-started" color="primary" variant="flat">
            Get Started
          </v-btn>
        </div>
      </div>
    </v-container>
  </v-app-bar>

  <!-- Drawer mobile -->
  <v-navigation-drawer v-model="drawer" location="left" temporary>
    <v-list>
      <v-list-item :href="props.appHref">
        <template #prepend>
          <v-icon icon="mdi-vuetify" />
        </template>
        <v-list-item-title class="font-weight-bold">{{ props.appName }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-divider />
    <v-list density="comfortable" nav>
      <v-list-item v-for="it in primaryItems" :key="it.title" :href="it.href" :title="it.title" />
      <v-list-group value="ecosystem">
        <template #activator="{ props: a }">
          <v-list-item v-bind="a" title="Ecosystem" prepend-icon="mdi-puzzle-outline" />
        </template>
        <v-list-item v-for="it in ecosystemItems" :key="it.title" :href="it.href" :title="it.title" :prepend-icon="it.icon" />
      </v-list-group>
    </v-list>

    <div class="pa-4">
      <v-text-field
        v-model="search"
        density="comfortable"
        hide-details
        variant="solo"
        single-line
        rounded
        clearable
        flat
        placeholder="Search"
        prepend-inner-icon="mdi-magnify"
        @keyup.enter="onSearch"
      />
      <div class="d-flex align-center mt-2" style="gap:.5rem;">
        <v-select v-model="version" :items="props.versions" density="compact" hide-details variant="outlined" />
        <v-btn block color="primary" variant="flat" href="#get-started">Get Started</v-btn>
      </div>
      <div class="d-flex align-center justify-space-between mt-2">
        <span class="text-caption">Theme</span>
        <v-switch v-model="isDark" hide-details inset density="comfortable" />
      </div>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.border-b { border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08); }
.gap-2 { gap: .5rem; }
</style>
