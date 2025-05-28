<template>
  <main>
    <div id="content" class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-12 gap-6">
        <SideBar @apply="filtrarProcessos" />
        <MainTable :data="dadosFiltrados" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainTable from '@/components/MainTable.vue'
import SideBar from '@/components/SideBar.vue'

const todosProcessos = ref([
  {
    numeroProcesso: '0001234-12.2025.8.26.0000',
    tema: 'Direito Civil',
    dataDistribuicao: '2025-05-10',
    responsavel: 'Maria Souza',
    status: 'Em andamento',
    ultimaAtualizacao: '2025-05-14'
  },
  {
    numeroProcesso: '0002345-23.2025.8.26.0000',
    tema: 'Direito Penal',
    dataDistribuicao: '2025-04-02',
    responsavel: 'João Silva',
    status: 'Concluído',
    ultimaAtualizacao: '2025-05-20'
  },
  {
    numeroProcesso: '0003456-34.2025.8.26.0000',
    tema: 'Direito Administrativo',
    dataDistribuicao: '2025-01-15',
    responsavel: 'Ana Pereira',
    status: 'Arquivado',
    ultimaAtualizacao: '2025-03-01'
  }
])

const dadosFiltrados = ref([...todosProcessos.value])

function filtrarProcessos(filtros: Record<string, string>) {
  dadosFiltrados.value = todosProcessos.value.filter(processo => {
    return (
      (!filtros.numeroProcesso || processo.numeroProcesso.includes(filtros.numeroProcesso)) &&
      (!filtros.tema || processo.tema.toLowerCase().includes(filtros.tema.toLowerCase())) &&
      (!filtros.dataDistribuicao || processo.dataDistribuicao === filtros.dataDistribuicao) &&
      (!filtros.responsavel || processo.responsavel.toLowerCase().includes(filtros.responsavel.toLowerCase())) &&
      (!filtros.status || processo.status === filtros.status) &&
      (!filtros.ultimaAtualizacao || processo.ultimaAtualizacao === filtros.ultimaAtualizacao)
    )
  })
}
</script>
