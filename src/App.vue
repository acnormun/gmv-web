<template>
  <main>
    <header
      id="header"
      class="w-full h-[65px] py-3 border-b bg-white shadow-sm flex items-center justify-center"
    >
      <div class="w-full max-w-[2000px] px-2 lg:px-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <img src="./assets/scale-balanced-solid.svg" class="w-6 h-6" alt="Gabinete - Márcio Vidal" />
          <span class="title text-xl font-semibold text-neutral-800">Gabinete - Márcio Vidal</span>
        </div>
        
        <!-- Navegação -->
        <nav class="flex items-center gap-1">
          <router-link 
            to="/"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
            :class="$route.name === 'home' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0a2 2 0 01-2 2H10a2 2 0 01-2-2v0z"></path>
              </svg>
              Processos
            </div>
          </router-link>
          
          <router-link 
            to="/produtividade"
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
            :class="$route.name === 'produtividade' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
          >
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Produtividade
            </div>
          </router-link>
        </nav>
      </div>
    </header>
    <div class="flex-1 bg-[#F9FAFB]">
      <RouterView />
    </div>
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'

onMounted(async () => {
  console.log('App mounted')
})
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #F9FAFB;
  font-family: Inter;
}

.title {
  font-family: Inter;
}
</style>