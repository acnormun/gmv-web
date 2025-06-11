<template>
  <div id="main-content" class="col-span-9">
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-xl">Processos</h1>
        <div class="flex space-x-2">
          <button @click="exportarTabelaParaPdf" class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-neutral-50">
            <img src="../assets/download-solid.svg" class="h-5 w-5" alt="Exportar" />
            <span>Exportar</span>
          </button>
          <button @click="abrirNovo" class="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-800">
            <img src="@/assets/plus-solid.svg" class="w-4 h-4" />
            Novo Processo
          </button>
          <AddTriagem :open="showModal" :mode="modalMode" @close="showModal = false" @added="solicitarAtualizacao" />
        </div>
      </div>

      <!-- Debug Info -->
      <div v-if="debugMode" class="mb-4 p-3 bg-gray-100 rounded text-xs">
        <div><strong>Total de itens:</strong> {{ props.data.length }}</div>
        <div><strong>Ordenação:</strong> {{ ordem.campo }} - {{ ordem.direcao }}</div>
        <div v-if="props.data.length > 0"><strong>Primeiro item:</strong> {{ JSON.stringify(props.data[0]) }}</div>
      </div>

      <!-- Legenda de cores -->
      <div class="mb-4 p-3 bg-gray-50 rounded-lg">
        <h3 class="text-sm font-medium mb-2">Legenda de Status por Data:</h3>
        <div class="flex space-x-4 text-xs">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-white border rounded"></div>
            <span>Normal</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-yellow-200 rounded"></div>
            <span>Mais de 6 dias</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-orange-200 rounded"></div>
            <span>Mais de 10 dias</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-red-200 rounded"></div>
            <span>Suspeitos + Atraso</span>
          </div>
        </div>
      </div>

      <!-- Controles de Debug -->
      <div class="mb-4 flex gap-2">
        <button @click="debugMode = !debugMode" class="px-3 py-1 bg-gray-200 rounded text-xs">
          {{ debugMode ? 'Hide' : 'Show' }} Debug
        </button>
        <button @click="testarCores" class="px-3 py-1 bg-blue-200 rounded text-xs">
          Testar Cores
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th 
                v-for="coluna in colunas" 
                :key="coluna.key"
                class="text-left py-3 px-4 cursor-pointer hover:bg-gray-50 select-none"
                @click="ordenarPor(coluna.key)"
              >
                <div class="flex items-center gap-2">
                  <span>{{ coluna.nome }}</span>
                  <div class="flex flex-col">
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
              <th class="text-left py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in processosPaginados" 
              :key="index" 
              class="border-b hover:bg-neutral-50 transition-colors"
              :class="getLinhaClass(item)"
            >
              <td class="py-3 px-4">{{ item.numeroProcesso }}</td>
              <td class="py-3 px-4">{{ item.tema }}</td>
              <td class="py-3 px-4">
                <div class="flex flex-col gap-1">
                  <span class="text-sm">{{ formatarData(item.dataDistribuicao) }}</span>
                  <span 
                    v-if="getDiasAtraso(item.dataDistribuicao) > 0"
                    class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-center w-fit"
                  >
                    {{ getDiasAtraso(item.dataDistribuicao) }} dias
                  </span>
                </div>
              </td>
              <td class="py-3 px-4">{{ item.responsavel }}</td>
              <td class="py-3 px-4">
                <div class="flex justify-start">
                  <span class="px-2 py-1 rounded-full text-sm font-medium whitespace-nowrap" :class="statusPillClass(item.status)">
                    {{ item.status }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-4">{{ formatarData(item.ultimaAtualizacao) }}</td>
              <td class="py-3 px-4">
                <div class="flex justify-start">
                  <span 
                    v-if="temSuspeitos(item)"
                    class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full whitespace-nowrap"
                  >
                    {{ getSuspeitosCount(item) }} suspeito(s)
                  </span>
                  <span v-else class="text-xs text-gray-400">
                    -
                  </span>
                </div>
              </td>
              <td class="py-3 px-4 relative">
                <button class="text-neutral-600 hover:text-neutral-900 mr-2" @click="abrirModal('view', item)">
                  <img src="@/assets/eye-solid.svg" class="w-4 h-4" />
                </button>
                <button class="text-neutral-600 hover:text-neutral-900 mr-2" @click="(e) => toggleMenu(index, e)">
                  <img src="@/assets/ellipsis-vertical-solid.svg" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-center items-center space-x-2 mt-4">
        <button @click="paginaAtual--" :disabled="paginaAtual === 1" class="px-3 py-1 border rounded disabled:opacity-40">
          Anterior
        </button>
        <span class="text-sm">Página {{ paginaAtual }} de {{ totalPaginas }}</span>
        <button @click="paginaAtual++" :disabled="paginaAtual === totalPaginas" class="px-3 py-1 border rounded disabled:opacity-40">
          Próxima
        </button>
      </div>

      <teleport to="body">
        <div v-if="menuAberto !== null" :style="menuEstilo" class="absolute z-50 w-32 bg-white border rounded shadow-md">
          <button @click="abrirModal('edit', lista[menuAberto])" class="block w-full text-left text-sm px-4 py-2 hover:bg-neutral-100">
            Editar
          </button>
          <button @click="abrirArquivo(lista[menuAberto])" class="block w-full text-left text-sm px-4 py-2 hover:bg-neutral-100">
            Ver arquivo
          </button>
          <button @click="excluir(lista[menuAberto])" class="block w-full text-left text-sm px-4 py-2 text-red-600 hover:bg-neutral-100">
            Excluir
          </button>
        </div>
      </teleport>

      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-neutral-600">Mostrando {{ lista.length }} resultados</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
const debugMode = ref(false)

const paginaAtual = ref(1)
const itensPorPagina = 4

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

// Função para calcular dias de atraso (melhorada)
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
    console.warn('Erro ao calcular dias de atraso:', error, dataDistribuicao)
    return 0
  }
}

// Função para verificar se tem suspeitos (melhorada)
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
    // Se é uma string com nomes separados por vírgula
    return item.suspeitos.split(',').filter(s => s.trim() !== '').length
  }
  
  return 0
}

// Função para determinar a classe CSS da linha baseada na data e suspeitos (melhorada)
function getLinhaClass(item: Processo): string {
  const diasAtraso = getDiasAtraso(item.dataDistribuicao)
  const temSuspeitosItem = temSuspeitos(item)
  
  console.log(`Processo ${item.numeroProcesso}:`, {
    diasAtraso,
    temSuspeitosItem,
    dataDistribuicao: item.dataDistribuicao,
    suspeitos: item.suspeitos
  })
  
  // Vermelho: tem suspeitos E passou de 6 dias
  if (temSuspeitosItem && diasAtraso > 6) {
    return 'bg-red-200 hover:bg-red-300'
  }
  
  // Laranja: passou de 10 dias (sem suspeitos)
  if (diasAtraso > 10) {
    return 'bg-orange-200 hover:bg-orange-300'
  }
  
  // Amarelo: passou de 6 dias (sem suspeitos)
  if (diasAtraso > 6) {
    return 'bg-yellow-200 hover:bg-yellow-300'
  }
  
  // Normal
  return ''
}

// Função de teste para debug
function testarCores() {
  console.log('=== TESTE DE CORES ===')
  props.data.forEach((item, index) => {
    const dias = getDiasAtraso(item.dataDistribuicao)
    const suspeitos = temSuspeitos(item)
    const classe = getLinhaClass(item)
    console.log(`${index + 1}. ${item.numeroProcesso}: ${dias} dias, suspeitos: ${suspeitos}, classe: ${classe}`)
  })
}

// Função de ordenação (melhorada)
function ordenarPor(campo: string) {
  console.log('Ordenando por:', campo)
  
  if (ordem.value.campo === campo) {
    // Se já está ordenando por este campo, inverte a direção
    ordem.value.direcao = ordem.value.direcao === 'asc' ? 'desc' : 'asc'
  } else {
    // Novo campo, começa com ascendente
    ordem.value.campo = campo
    ordem.value.direcao = 'asc'
  }
}

// Lista ordenada (melhorada)
const listaOrdenada = computed(() => {
  if (!ordem.value.campo) return [...props.data]
  
  const lista = [...props.data]
  
  lista.sort((a, b) => {
    const campo = ordem.value.campo as keyof Processo
    let valorA = a[campo]
    let valorB = b[campo]
    
    // Tratamento especial para datas
    if (campo === 'dataDistribuicao' || campo === 'ultimaAtualizacao') {
      try {
        // Converte para timestamp para comparação
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

        // Use timestamps for comparison, but don't assign to valorA/valorB
        valorA = timestampA as any
        valorB = timestampB as any
      } catch (error) {
        console.warn('Erro ao ordenar por data:', error)
        // Se não conseguir converter, mantém como string
      }
    }
    
    // Tratamento especial para suspeitos (ordenar por quantidade)
    if (campo === 'suspeitos') {
      const countA = getSuspeitosCount(a)
      const countB = getSuspeitosCount(b)
      let resultado = 0
      if (countA < countB) resultado = -1
      else if (countA > countB) resultado = 1
      return ordem.value.direcao === 'desc' ? -resultado : resultado
    }
    
    // Conversão para string para comparação se necessário
    if (typeof valorA === 'string' && typeof valorB === 'string') {
      valorA = valorA.toLowerCase()
      valorB = valorB.toLowerCase()
    }
    
    // Garantir que não são undefined/null
    if (valorA === undefined || valorA === null) valorA = ''
    if (valorB === undefined || valorB === null) valorB = ''
    
    let resultado = 0
    if (valorA < valorB) resultado = -1
    else if (valorA > valorB) resultado = 1
    
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
      return 'bg-neutral-300 text-neutral-800'
    case 'Em andamento':
      return 'bg-blue-100 text-blue-800'
    case 'Para revisão':
      return 'bg-yellow-100 text-yellow-800'
    case 'Concluído':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-neutral-100 text-neutral-600'
  }
}

// Debug quando componente monta
onMounted(() => {
  console.log('MainTable montado com dados:', props.data)
  if (props.data.length > 0) {
    console.log('Primeiro item:', props.data[0])
  }
})
</script>