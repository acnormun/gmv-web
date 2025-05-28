<template>
  <main>
    <div class="container mx-auto px-4 py-6">
      <AddTriagem
        :open="showModal"
        @close="showModal = false"
        @added="atualizarProcessos"
      />

      <div class="grid grid-cols-12 gap-6">
        <SideBar @apply="filtrarProcessos" />
        <MainTable :data="dadosFiltrados" @refresh="atualizarProcessos" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTriagemStore } from '@/stores/triagem.store'
import type { Processo } from '@/api/triagem'

import MainTable from '@/components/MainTable.vue'
import SideBar from '@/components/SideBar.vue'
import AddTriagem from '@/components/AddTriagem.vue'

const store = useTriagemStore()

const dadosFiltrados = ref<Processo[]>([])
const showModal = ref(false)

async function atualizarProcessos() {
  console.log('🔄 Atualizando processos...')
  await store.carregarProcessos()
  dadosFiltrados.value = [...store.processos]
}

function filtrarProcessos(filtros: Record<string, string>) {
  dadosFiltrados.value = store.filtrar(filtros)
}

onMounted(async () => {
  await atualizarProcessos()
})
</script>
