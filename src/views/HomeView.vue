<template>
  <main>
    <div class="container mx-auto px-2 py-6">
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
  await store.carregarProcessos()
  dadosFiltrados.value = [...store.processos]
}

function filtrarProcessos(filtros: Record<string, any>) {
  dadosFiltrados.value = store.processos.filter((proc) => {
    return (
      (!filtros.numeroProcesso || proc.numeroProcesso.includes(filtros.numeroProcesso)) &&
      (!filtros.tema?.length || filtros.tema.includes(proc.tema)) &&
      (!filtros.dataDistribuicao || proc.dataDistribuicao === filtros.dataDistribuicao) &&
      (!filtros.responsavel || proc.responsavel.toLowerCase().includes(filtros.responsavel.toLowerCase())) &&
      (!filtros.status || proc.status === filtros.status) &&
      (!filtros.ultimaAtualizacao || proc.ultimaAtualizacao === filtros.ultimaAtualizacao)
    )
  })
}

onMounted(async () => {
  await atualizarProcessos()
})
</script>
