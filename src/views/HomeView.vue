<template>
  <main>
    <div class="container mx-auto py-6">
      <AddTriagem :open="showModal" @close="showModal = false" @added="atualizarProcessos" />

      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-3">
          <SideBar @apply="filtrarProcessos" />
        </div>

        <div class="col-span-9 space-y-6">
          <Dashboard
            :emAndamento="emAndamento"
            :abertos="abertos"
            :revisao="revisao"
            :concluidos="concluidos"
            :temasMaisAtuados="temasMaisAtuados"
          />
          <MainTable :data="dadosFiltrados" @refresh="atualizarProcessos" />
        </div>
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
import Dashboard from '@/components/Dashboard.vue'

const store = useTriagemStore()
const dadosFiltrados = ref<Processo[]>([])
const showModal = ref(false)
const emAndamento = ref(0)
const abertos = ref(0)
const concluidos = ref(0)
const revisao = ref(0)

const temasMaisAtuados = [
  { nome: 'Cível', total: 10, icon: 'fa-solid fa-gavel' },
  { nome: 'Trabalhista', total: 7, icon: 'fa-solid fa-briefcase' },
  { nome: 'Penal', total: 6, icon: 'fa-solid fa-scale-balanced' },
]

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
      (!filtros.responsavel ||
        proc.responsavel.toLowerCase().includes(filtros.responsavel.toLowerCase())) &&
      (!filtros.status || proc.status === filtros.status) &&
      (!filtros.ultimaAtualizacao || proc.ultimaAtualizacao === filtros.ultimaAtualizacao)
    )
  })
}

onMounted(async () => {
  await atualizarProcessos()
  emAndamento.value = store.processos.filter((p) => p.status === 'Em andamento').length
  abertos.value = store.processos.filter((p) => p.status === 'Aberto').length
  concluidos.value = store.processos.filter((p) => p.status === 'Concluído').length
  revisao.value = store.processos.filter((p) => p.status === 'Para revisão').length
})
</script>
