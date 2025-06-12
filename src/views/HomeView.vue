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
          <SideBar @apply="filtrarProcessos" @clearFilters="limparFiltros" />
        </div>

        <div class="col-span-9 space-y-6">
          <Dashboard
            :emAndamento="emAndamento"
            :abertos="abertos"
            :revisao="revisao"
            :concluidos="concluidos"
            :emAtraso="emAtraso"
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
const emAtraso = ref(0)

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
  emAtraso.value = store.processos.filter((p) => verificarProcessoEmAtraso(p)).length
}

function filtrarProcessos(filtros: Record<string, any>) {
  console.log('🔍 Aplicando filtros:', filtros) // Debug

  dadosFiltrados.value = store.processos.filter((proc) => {
    // Filtro por número do processo
    const filtroNumero = !filtros.numeroProcesso || 
      proc.numeroProcesso.toLowerCase().includes(filtros.numeroProcesso.toLowerCase())

    // Filtro por tema (array)
    const filtroTema = !filtros.tema?.length || 
      filtros.tema.includes(proc.tema)

    // Filtro por data de distribuição
    const filtroDataDistribuicao = !filtros.dataDistribuicao || 
      proc.dataDistribuicao === filtros.dataDistribuicao

    // Filtro por responsável (array)
    const filtroResponsavel = !filtros.responsavel?.length || 
      filtros.responsavel.includes(proc.responsavel)

    // Filtro por status
    const filtroStatus = !filtros.status || 
      proc.status === filtros.status

    // Filtro por última atualização
    const filtroUltimaAtualizacao = !filtros.ultimaAtualizacao || 
      proc.ultimaAtualizacao === filtros.ultimaAtualizacao

    // Filtro por suspeitos
    const filtroSuspeitos = !filtros.suspeitos || 
      (proc.suspeitos && proc.suspeitos.length > 0)

    // Filtro por tipo de atraso
    const filtroTipoAtraso = !filtros.tipoAtraso || verificarTipoAtraso(proc, filtros.tipoAtraso)

    const resultado = filtroNumero && 
                     filtroTema && 
                     filtroDataDistribuicao && 
                     filtroResponsavel && 
                     filtroStatus && 
                     filtroUltimaAtualizacao && 
                     filtroSuspeitos &&
                     filtroTipoAtraso

    return resultado
  })

  console.log('📊 Processos filtrados:', dadosFiltrados.value.length) // Debug
}

// Função para verificar se um processo está em atraso
function verificarProcessoEmAtraso(processo: Processo): boolean {
  // Se já está concluído, não está em atraso
  if (processo.status === 'Concluído') {
    return false
  }

  const hoje = new Date()
  
  // Verifica a última atualização (mais de 30 dias)
  if (processo.ultimaAtualizacao) {
    const ultimaAtualizacao = new Date(processo.ultimaAtualizacao)
    const diasSemAtualizacao = Math.floor((hoje.getTime() - ultimaAtualizacao.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diasSemAtualizacao > 30) {
      return true
    }
  }

  // Verifica a data de distribuição (mais de 60 dias sem conclusão)
  if (processo.dataDistribuicao) {
    const dataDistribuicao = new Date(processo.dataDistribuicao)
    const diasSemConclusao = Math.floor((hoje.getTime() - dataDistribuicao.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diasSemConclusao > 60) {
      return true
    }
  }

  return false
}

function verificarTipoAtraso(processo: Processo, tipoAtraso: string): boolean {
  if (processo.status === 'Concluído') {
    return false
  }

  const hoje = new Date()
  let diasSemAtualizacao = 0
  let diasSemConclusao = 0

  if (processo.ultimaAtualizacao) {
    const ultimaAtualizacao = new Date(processo.ultimaAtualizacao)
    diasSemAtualizacao = Math.floor((hoje.getTime() - ultimaAtualizacao.getTime()) / (1000 * 60 * 60 * 24))
  }

  if (processo.dataDistribuicao) {
    const dataDistribuicao = new Date(processo.dataDistribuicao)
    diasSemConclusao = Math.floor((hoje.getTime() - dataDistribuicao.getTime()) / (1000 * 60 * 60 * 24))
  }

  switch (tipoAtraso) {
    case 'todos_atraso':
      return diasSemConclusao >= 15
    case 'atraso_leve':
      return (diasSemConclusao >= 10) || (diasSemAtualizacao < 15)
    case 'atraso_grave':
      return diasSemConclusao > 30
    case 'sem_atualizacao':
      return diasSemAtualizacao > 30
    default:
      return true
  }
}

function limparFiltros() {
  console.log('🧹 Limpando filtros') 
  dadosFiltrados.value = [...store.processos]
}

onMounted(() => {
  atualizarProcessos()
})
</script>