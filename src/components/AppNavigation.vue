<template>
    <v-navigation-drawer rail-width="104" rail permanent>
        <!-- 
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/75.jpg"
          ></v-list-item>
        </v-list>
        -->
        
        <v-list density="compact" nav>
          <v-tooltip v-for="item in menu_admin" :key="item.value" location="right">
            <template #activator="{ props }">
                <v-list-item v-bind="props" :value="item.value"  @click="toggleDrawer(item.value)" :disabled="item.disabled" class="compact-item">
                    <div class="d-flex flex-column align-center">
                        <v-icon :icon="item.icon"/>
                        <span class="text-caption">{{item.contract_title || item.title}}</span>
                    </div>
                </v-list-item>
            </template>
            <span>{{ item.title }}</span>
          </v-tooltip>
        </v-list>
      </v-navigation-drawer>

      <!-- Submenu Lateral: Sobreposto em mobile, permanente em desktop -->
      <v-navigation-drawer
        v-if="submenuItems.length"
        :permanent="!isMobile"
        :temporary="isMobile"
        width="260"
        v-model="submenuDrawer"
      >
        <v-list density="compact" nav>
          <v-list-item
            v-for="item in submenuItems"
            :key="item.value"
            :prepend-icon="item.icon"
            :title="item.title"
            :disabled="item.disabled"
            @click="!item.disabled && itemSelecionado(item.value)"
          />
        </v-list>
      </v-navigation-drawer>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { useRouter } from 'vue-router'
    import { useAuthStore } from '@/store/auth' 
    import { useMenuStore } from '@/store/menu_store';
    
    const router = useRouter()
    const auth = useAuthStore()
    const menu_admin = useMenuStore().getMenu()
    
    const nome = ref('')
    const perfil = ref('')
    const opcao = ref('')
    const submenuDrawer = ref(false)

    onMounted(() => {
      nome.value = auth.getNome()
      perfil.value = auth.getNomePerfil()
    })

    const submenuItems = computed(() => {
        const current = menu_admin.find(i => i.value === opcao.value)
        return current?.children || []
    })
  
    function itemSelecionado(item) {
        router.push(`/${item}`)
    }

    function toggleDrawer(menu) {
      const selected = menu_admin.find(i => i.value === menu)

      if (!selected) return

      if (selected.children && selected.children.length > 0) {
        // Item com submenu: abre drawer lateral
        if (opcao.value === menu) {
          opcao.value = ''
          submenuDrawer.value = false
        } else {
          opcao.value = menu
          submenuDrawer.value = true
        }
      } else {
        // Item sem submenu: navega diretamente
        itemSelecionado(menu)
        submenuDrawer.value = false
        opcao.value = ''
      }
    }
</script>