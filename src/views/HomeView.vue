<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProcessos, type Processo } from '@/api/triagem'
import MainTable from '@/components/MainTable.vue'
import SideBar from '@/components/SideBar.vue'

const todosProcessos = ref<Processo[]>([])
const dadosFiltrados = ref<Processo[]>([])

function filtrarProcessos(filtros: Record<string, string>) {
  dadosFiltrados.value = todosProcessos.value.filter((proc) => {
    return (
      (!filtros.numeroProcesso || proc.numeroProcesso.includes(filtros.numeroProcesso)) &&
      (!filtros.tema || proc.tema.toLowerCase().includes(filtros.tema.toLowerCase())) &&
      (!filtros.dataDistribuicao || proc.dataDistribuicao === filtros.dataDistribuicao) &&
      (!filtros.responsavel || proc.responsavel.toLowerCase().includes(filtros.responsavel.toLowerCase())) &&
      (!filtros.status || proc.status === filtros.status) &&
      (!filtros.ultimaAtualizacao || proc.ultimaAtualizacao === filtros.ultimaAtualizacao)
    )
  })
}

onMounted(async () => {
  try {
    todosProcessos.value = await getProcessos()
    dadosFiltrados.value = [...todosProcessos.value]
  } catch (error) {
    console.error('Erro ao buscar processos:', error)
  }
})
</script>

<template>
  <main>
    <div class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-12 gap-6">
        <SideBar @apply="filtrarProcessos" />
        <MainTable :data="dadosFiltrados" />
      </div>
    </div>
  </main>
</template>
