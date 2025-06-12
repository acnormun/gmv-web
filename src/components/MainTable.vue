<template>
  <div id="main-content" class="w-full">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Header Modern -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-xl font-semibold text-gray-900">Lista de Processos</h1>
            <p class="text-sm text-gray-600">Gerencie e acompanhe todos os processos</p>
          </div>
          <div class="flex items-center gap-3">
            <button 
              @click="exportarTabelaParaPdf" 
              class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Exportar PDF
            </button>
            <button 
              @click="abrirNovo" 
              class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Novo Processo
            </button>
            <AddTriagem :open="showModal" :mode="modalMode" @close="showModal = false" @added="solicitarAtualizacao" />
          </div>
        </div>
      </div>

      <!-- Filters/Stats Bar -->
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Total: <strong class="text-gray-900">{{ lista.length }}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Em aberto: <strong class="text-gray-900">{{ processosAbertos }}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Atrasados: <strong class="text-gray-900">{{ processosAtrasados }}</strong></span>
            </div>
          </div>
          <div class="text-sm text-gray-500">
            Página {{ paginaAtual }} de {{ totalPaginas }}
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th 
                v-for="coluna in colunas" 
                :key="coluna.key"
                class="text-left py-4 px-6 cursor-pointer hover:bg-gray-100 select-none transition-colors group"
                @click="ordenarPor(coluna.key)"
              >
                <div class="flex items-center gap-2">
                  <span class="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{{ coluna.nome }}</span>
                  <div class="flex flex-col opacity-60 group-hover:opacity-100">
                    <svg 
                      class="w-3 h-3 -mb-1" 
                      :class="ordem.campo === coluna.key && ordem.direcao === 'asc' ? 'text-blue-600' : 'text-gray-400'"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                    <svg 
                      class="w-3 h-3 rotate-180" 
                      :class="ordem.campo === coluna.key && ordem.direcao === 'desc' ? 'text-blue-600' : 'text-gray-400'"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                </div>
              </th>
              <th class="text-left py-4 px-6">
                <span class="text-sm font-semibold text-gray-700">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr 
              v-for="(item, index) in processosPaginados" 
              :key="index" 
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="py-4 px-6">
                <span class="text-sm font-medium text-gray-900">{{ item.numeroProcesso }}</span>
              </td>
              <td class="py-4 px-6">
                <span class="text-sm text-gray-700">{{ item.tema }}</span>
              </td>
              <td class="py-4 px-6">
                <div class="flex flex-col gap-1">
                  <span class="text-sm text-gray-700">{{ formatarData(item.dataDistribuicao) }}</span>
                  <span 
                    v-if="getDiasAtraso(item.dataDistribuicao) > 6 && ['Aberto', 'Em andamento', 'Para revisão'].includes(item.status)"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit"
                  >
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ getDiasAtraso(item.dataDistribuicao) }} dias atrasado
                  </span>
                  <span 
                    v-else-if="getDiasAtraso(item.dataDistribuicao) > 0 && ['Aberto', 'Em andamento', 'Para revisão'].includes(item.status)"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 w-fit"
                  >
                    {{ getDiasAtraso(item.dataDistribuicao) }} dias
                  </span>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="text-sm text-gray-700">{{ item.responsavel }}</span>
              </td>
              <td class="py-4 px-6">
                <span 
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="statusPillClass(item.status)"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span class="text-sm text-gray-700">{{ formatarData(item.ultimaAtualizacao) }}</span>
              </td>
              <td class="py-4 px-6">
                <span 
                  v-if="temSuspeitos(item)"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  {{ getSuspeitosCount(item) }} suspeito(s)
                </span>
                <span v-else class="text-sm text-gray-400">-</span>
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-2">
                  <button 
                    @click="abrirModal('view', item)"
                    class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Visualizar"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button 
                    @click="(e) => toggleMenu(index, e)"
                    class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                    title="Mais opções"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Mostrando <strong>{{ Math.min((paginaAtual - 1) * itensPorPagina + 1, lista.length) }}</strong> 
            a <strong>{{ Math.min(paginaAtual * itensPorPagina, lista.length) }}</strong> 
            de <strong>{{ lista.length }}</strong> resultados
          </div>
          
          <nav class="flex items-center gap-2">
            <button 
              @click="paginaAtual--" 
              :disabled="paginaAtual === 1" 
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            
            <div class="flex items-center gap-1">
              <template v-for="pageNum in getVisiblePages()" :key="pageNum">
                <button
                  v-if="pageNum !== '...'"
                  @click="typeof pageNum === 'number' && (paginaAtual = pageNum)"
                  :class="[
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    pageNum === paginaAtual 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  {{ pageNum }}
                </button>
                <span v-else class="px-2 py-2 text-gray-500">...</span>
              </template>
            </div>
            
            <button 
              @click="paginaAtual++" 
              :disabled="paginaAtual === totalPaginas" 
              class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </nav>
        </div>
      </div>

      <!-- Menu Dropdown -->
      <teleport to="body">
        <div v-if="menuAberto !== null" :style="menuEstilo" class="absolute z-50 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <button 
            @click="abrirModal('edit', lista[menuAberto])" 
            class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Editar
          </button>
          <button 
            @click="abrirArquivo(lista[menuAberto])" 
            class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Ver arquivo
          </button>
          <div class="border-t border-gray-200">
            <button 
              @click="excluir(lista[menuAberto])" 
              class="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Excluir
            </button>
          </div>
        </div>
      </teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AddTriagem from './AddTriagem.vue'
import type { Processo } from '@/api/triagem'
import { useTriagemStore } from '@/stores/triagem.store'
import { deleteProcesso, getProcesso } from '@/api/triagem'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const store = useTriagemStore()
const showModal = ref(false)
const modalMode = ref<'new' | 'view' | 'edit'>('new')
const menuAberto = ref<number | null>(null)
const menuPos = ref({ top: 0, left: 0 })

const paginaAtual = ref(1)
const itensPorPagina = 8

// Sistema de ordenação
const ordem = ref<{campo: string | null, direcao: 'asc' | 'desc'}>({
  campo: null,
  direcao: 'asc'
})

// Definição das colunas ordenáveis
const colunas = [
  { key: 'numeroProcesso', nome: 'Nº Processo' },
  { key: 'tema', nome: 'Tema' },
  { key: 'dataDistribuicao', nome: 'Data da Distribuição' },
  { key: 'responsavel', nome: 'Responsável' },
  { key: 'status', nome: 'Status' },
  { key: 'ultimaAtualizacao', nome: 'Última Atualização' },
  { key: 'suspeitos', nome: 'Suspeitos' }
]

const emit = defineEmits(['refresh'])

const props = defineProps<{
  data: Processo[]
}>()

// Estatísticas computadas
const processosAbertos = computed(() => {
  return props.data.filter(p => ['Aberto', 'Em andamento', 'Para revisão'].includes(p.status)).length
})

const processosAtrasados = computed(() => {
  return props.data.filter(p => 
    ['Aberto', 'Em andamento', 'Para revisão'].includes(p.status) && 
    getDiasAtraso(p.dataDistribuicao) > 6
  ).length
})

// Função para gerar páginas visíveis na paginação
function getVisiblePages() {
  const total = totalPaginas.value
  const current = paginaAtual.value
  const delta = 2 // Número de páginas para mostrar em cada lado da atual
  
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  const pages = []
  const start = Math.max(1, current - delta)
  const end = Math.min(total, current + delta)
  
  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push('...')
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  if (end < total) {
    if (end < total - 1) pages.push('...')
    pages.push(total)
  }
  
  return pages
}

// Função para formatar data
function formatarData(data: string): string {
  if (!data) return ''
  
  // Se já está no formato DD/MM/YYYY, retorna como está
  if (data.includes('/')) {
    return data
  }
  
  // Se está no formato YYYY-MM-DD, converte para DD/MM/YYYY
  if (data.includes('-') && data.length === 10) {
    try {
      const [ano, mes, dia] = data.split('-')
      return `${dia}/${mes}/${ano}`
    } catch {
      return data
    }
  }
  
  return data
}

// Função para calcular dias de atraso
function getDiasAtraso(dataDistribuicao: string): number {
  if (!dataDistribuicao) return 0
  
  try {
    let dataDistrib: Date
    
    // Se formato DD/MM/YYYY
    if (dataDistribuicao.includes('/')) {
      const [dia, mes, ano] = dataDistribuicao.split('/')
      dataDistrib = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))
    } 
    // Se formato YYYY-MM-DD
    else if (dataDistribuicao.includes('-')) {
      dataDistrib = new Date(dataDistribuicao)
    } 
    else {
      return 0
    }
    
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0) // Reset hora para comparação só de data
    dataDistrib.setHours(0, 0, 0, 0)
    
    // Calcula diferença em dias
    const diferencaMs = hoje.getTime() - dataDistrib.getTime()
    const diferencaDias = Math.floor(diferencaMs / (1000 * 60 * 60 * 24))
    
    return Math.max(0, diferencaDias)
  } catch (error) {
    return 0
  }
}

// Função para verificar se tem suspeitos
function temSuspeitos(item: Processo): boolean {
  if (!item.suspeitos) return false
  
  if (Array.isArray(item.suspeitos)) {
    return item.suspeitos.length > 0 && item.suspeitos.some(s => s !== null && s !== undefined && s !== '')
  }
  
  if (typeof item.suspeitos === 'string') {
    return item.suspeitos.trim() !== '' && item.suspeitos !== 'nan'
  }
  
  return false
}

// Função para obter quantidade de suspeitos
function getSuspeitosCount(item: Processo): number {
  if (!temSuspeitos(item)) return 0
  
  if (Array.isArray(item.suspeitos)) {
    return item.suspeitos.filter(s => s !== null && s !== undefined && s !== '').length
  }
  
  if (typeof item.suspeitos === 'string') {
    return item.suspeitos.split(',').filter(s => s.trim() !== '').length
  }
  
  return 0
}

// Função de ordenação
function ordenarPor(campo: string) {
  if (ordem.value.campo === campo) {
    // Se já está ordenando por este campo, inverte a direção
    ordem.value.direcao = ordem.value.direcao === 'asc' ? 'desc' : 'asc'
  } else {
    // Novo campo, começa com ascendente
    ordem.value.campo = campo
    ordem.value.direcao = 'asc'
  }
}

// Lista ordenada
const listaOrdenada = computed(() => {
  if (!ordem.value.campo) return [...props.data]
  
  const lista = [...props.data]
  
  lista.sort((a, b) => {
    const campo = ordem.value.campo as keyof Processo
    let valorA = a[campo]
    let valorB = b[campo]
    let sortA: string | number = valorA as string
    let sortB: string | number = valorB as string

    // Tratamento especial para datas
    if (campo === 'dataDistribuicao' || campo === 'ultimaAtualizacao') {
      try {
        let timestampA = 0
        let timestampB = 0

        if (typeof valorA === 'string' && valorA) {
          if (valorA.includes('/')) {
            const [dia, mes, ano] = valorA.split('/')
            timestampA = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia)).getTime()
          } else if (valorA.includes('-')) {
            timestampA = new Date(valorA).getTime()
          }
        }

        if (typeof valorB === 'string' && valorB) {
          if (valorB.includes('/')) {
            const [dia, mes, ano] = valorB.split('/')
            timestampB = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia)).getTime()
          } else if (valorB.includes('-')) {
            timestampB = new Date(valorB).getTime()
          }
        }
        sortA = timestampA
        sortB = timestampB
      } catch (error) {
        // Se não conseguir converter, mantém como string
      }
    } else if (campo === 'suspeitos') {
      // Ordenar por quantidade de suspeitos
      sortA = getSuspeitosCount(a)
      sortB = getSuspeitosCount(b)
    } else {
      if (typeof valorA === 'string') {
        sortA = valorA.toLowerCase()
      }
      if (typeof valorB === 'string') {
        sortB = valorB.toLowerCase()
      }
    }

    // Garantir que não são undefined/null
    if (sortA === undefined || sortA === null) sortA = ''
    if (sortB === undefined || sortB === null) sortB = ''

    let resultado = 0
    if (sortA < sortB) resultado = -1
    else if (sortA > sortB) resultado = 1

    return ordem.value.direcao === 'desc' ? -resultado : resultado
  })
  
  return lista
})

const lista = computed(() => listaOrdenada.value)

const totalPaginas = computed(() =>
  Math.ceil(lista.value.length / itensPorPagina)
)

const processosPaginados = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina
  const fim = inicio + itensPorPagina
  return lista.value.slice(inicio, fim)
})

function solicitarAtualizacao() {
  emit('refresh')
}

function abrirNovo() {
  store.limparSelecionado()
  modalMode.value = 'new'
  showModal.value = true
}

function abrirModal(mode: 'view' | 'edit', processo: Processo) {
  store.selecionarProcesso(processo)
  modalMode.value = mode
  showModal.value = true
  menuAberto.value = null
}

async function abrirArquivo(processo: Processo) {
  await getProcesso(processo.numeroProcesso)
}

function toggleMenu(index: number, event: MouseEvent) {
  if (menuAberto.value === index) {
    menuAberto.value = null
    return
  }

  const button = (event.target as HTMLElement).closest('button')
  if (button) {
    const rect = button.getBoundingClientRect()
    menuPos.value = {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    }
  }

  menuAberto.value = index
}

const menuEstilo = computed(() => {
  return `top: ${menuPos.value.top}px; left: ${menuPos.value.left}px;`
})

async function excluir(processo: Processo) {
  const confirmacao = confirm(
    `Tem certeza que deseja excluir o processo ${processo.numeroProcesso}?`,
  )
  if (!confirmacao) return

  try {
    await deleteProcesso(processo.numeroProcesso)
    solicitarAtualizacao()
  } catch {
    alert('Erro ao excluir processo.')
  } finally {
    menuAberto.value = null
  }
}

function exportarTabelaParaPdf() {
  const doc = new jsPDF()

  autoTable(doc, {
    head: [[
      'Nº Processo', 'Tema', 'Data da Distribuição',
      'Responsável', 'Status', 'Última Atualização', 'Suspeitos'
    ]],
    body: lista.value.map(item => [
      item.numeroProcesso,
      item.tema,
      formatarData(item.dataDistribuicao),
      item.responsavel,
      item.status,
      formatarData(item.ultimaAtualizacao),
      getSuspeitosCount(item)
    ]),
    margin: { top: 20 },
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 0, 0] },
  })

  doc.save('processos.pdf')
}

function statusPillClass(status: string): string {
  switch (status) {
    case 'Aberto':
      return 'bg-gray-100 text-gray-800'
    case 'Em andamento':
      return 'bg-blue-100 text-blue-800'
    case 'Para revisão':
      return 'bg-yellow-100 text-yellow-800'
    case 'Concluído':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}
</script>