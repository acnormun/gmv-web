<template>
  <main>
    <div class="container mx-auto py-6">
      <AddTriagem
        :open="showModal"
        mode="new"
        @close="showModal = false"
        @added="atualizarProcessos"
      />

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
import { ref, onMounted, computed } from 'vue'
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

const icones = {
  'CÍVEL': 'gavel-solid.svg',
  'TRABALHISTA': 'briefcase-solid.svg',
  'PENAL': 'scale-balanced-solid.svg',
  'SAÚDE': 'heart-pulse-solid.svg',
  'ADMINISTRATIVO': 'building-columns-solid.svg',
  'TRIBUTÁRIO': 'receipt-solid.svg',
  'PREVIDENCIÁRIO': 'user-shield-solid.svg',
  'CONSUMIDOR': 'cart-shopping-solid.svg',
  'FAMÍLIA': 'people-roof-solid.svg',
  'AMBIENTAL': 'tree-solid.svg',
  'EXECUÇÃO FISCAL': 'file-invoice-dollar-solid.svg',
  'EMPRESARIAL': 'briefcase-solid.svg',
  'ELEITORAL': 'landmark-solid.svg',
  'IMOBILIÁRIO': 'house-solid.svg',
  'MILITAR': 'shield-halved-solid.svg',
  'DIGITAL': 'microchip-solid.svg'
};

const temasMaisAtuados = computed(() => {
  const contagem = new Map<string, number>()
  store.processos.forEach(p => {
    if (!p.tema) return
    contagem.set(p.tema, (contagem.get(p.tema) || 0) + 1)
  })

  return [...contagem.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([nome, total]) => ({
      nome,
      total,
      //@ts-ignore
      icon: icones[nome] || 'folder-solid.svg'
    }))
})

async function atualizarProcessos() {
  await store.carregarProcessos()
  dadosFiltrados.value = [...store.processos]

  emAndamento.value = store.processos.filter((p) => p.status === 'Em andamento').length
  abertos.value = store.processos.filter((p) => p.status === 'Aberto').length
  concluidos.value = store.processos.filter((p) => p.status === 'Concluído').length
  revisao.value = store.processos.filter((p) => p.status === 'Para revisão').length
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

onMounted(() => {
  atualizarProcessos()
})
</script>