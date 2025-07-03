<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Gestão de Processos - Múltiplas Operações</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <div>
            <p class="text-sm text-blue-600 font-medium">Processos Totais</p>
            <p class="text-2xl font-bold text-blue-900">{{ processos.length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="text-sm text-yellow-600 font-medium">Em Processamento</p>
            <p class="text-2xl font-bold text-yellow-900">{{ progressStore.activeTasks.length }}</p>
          </div>
        </div>
      </div>
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <div class="flex items-center">
          <svg class="w-8 h-8 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <p class="text-sm text-green-600 font-medium">Concluídos Hoje</p>
            <p class="text-2xl font-bold text-green-900">{{ progressStore.completedTasks.length }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap gap-4 mb-6">
      <button
        @click="openNewProcessForm"
        class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Novo Processo
      </button>
      <button
        @click="demonstrarMultiplos"
        class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 9.172V5z"></path>
        </svg>
        Demo: 3 Processos
      </button>
      <button
        @click="demonstrarCincoProcessos"
        class="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 flex items-center gap-2 font-medium shadow-md hover:shadow-lg transition-all"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        Demo: 5 Processos
      </button>
    </div>
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 bg-gray-50 border-b">
        <h2 class="text-lg font-semibold text-gray-900">Processos Recentes</h2>
      </div>
      <div class="divide-y divide-gray-200">
        <div
          v-for="processo in processos"
          :key="processo.id"
          class="p-6 hover:bg-gray-50 transition-colors"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="font-semibold text-lg text-gray-900">{{ processo.numeroProcesso }}</h3>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusClass(processo.status)"
                >
                  {{ processo.status }}
                </span>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getPrioridadeClass(processo.prioridade)"
                >
                  {{ getPrioridadeIcon(processo.prioridade) }} {{ processo.prioridade }}
                </span>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                <div>
                  <span class="font-medium">Tema:</span> {{ processo.tema }}
                </div>
                <div>
                  <span class="font-medium">Responsável:</span> {{ processo.responsavel }}
                </div>
                <div>
                  <span class="font-medium">Distribuição:</span> {{ formatarData(processo.dataDistribuicao) }}
                </div>
                <div>
                  <span class="font-medium">Última Atualização:</span> {{ formatarData(processo.ultimaAtualizacao) }}
                </div>
              </div>
              <div v-if="processo.comentarios" class="text-sm text-gray-600 mb-2">
                <span class="font-medium">Comentários:</span> {{ processo.comentarios }}
              </div>
              <div v-if="processo.suspeitos && processo.suspeitos.length > 0" class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <span class="text-sm text-red-600 font-medium">
                  {{ processo.suspeitos.length }} suspeito(s) detectado(s)
                </span>
              </div>
            </div>
            <div class="flex gap-2 ml-4">
              <button
                @click="viewProcess(processo)"
                class="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors"
                title="Visualizar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
              <button
                @click="editProcess(processo)"
                class="text-green-600 hover:text-green-800 p-2 rounded-md hover:bg-green-50 transition-colors"
                title="Editar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                @click="deleteProcess(processo)"
                class="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition-colors"
                title="Deletar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div v-if="processos.length === 0" class="p-12 text-center text-gray-500">
          <svg class="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-lg font-medium mb-2">Nenhum processo encontrado</p>
          <p class="text-gray-400">Clique em "Novo Processo" para começar</p>
        </div>
      </div>
    </div>
    <div
      v-if="showToast"
      class="fixed bottom-20 left-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300"
    >
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        {{ toastMessage }}
      </div>
    </div>
    <AddTriagem
      :open="showForm"
      :mode="formMode"
      @close="closeForm"
      @added="handleProcessAdded"
    />
  </div>
</template>
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTriagemStore } from '@/stores/triagem.store'
import { useProgressStore } from '@/stores/progress.store'
import AddTriagem from '@/components/AddTriagem.vue'

const triagemStore = useTriagemStore()
const progressStore = useProgressStore()
const showForm = ref(false)
const formMode = ref<'new' | 'view' | 'edit'>('new')
const showToast = ref(false)
const toastMessage = ref('')

const processos = ref([
  {
    id: '1',
    numeroProcesso: '2024.001.123456-7',
    tema: 'CÍVEL',
    responsavel: 'LOURIVAL',
    status: 'Em andamento',
    prioridade: 'ALTA',
    dataDistribuicao: '2024-06-15',
    ultimaAtualizacao: '2024-06-30',
    comentarios: 'Processo complexo com múltiplas partes',
    suspeitos: ['João Silva', 'Maria Santos']
  },
  {
    id: '2',
    numeroProcesso: '2024.002.789012-3',
    tema: 'PENAL',
    responsavel: 'NAIRA',
    status: 'Para revisão',
    prioridade: 'MÉDIA',
    dataDistribuicao: '2024-06-20',
    ultimaAtualizacao: '2024-06-29',
    comentarios: 'Aguardando documentação adicional',
    suspeitos: []
  },
  {
    id: '3',
    numeroProcesso: '2024.003.456789-1',
    tema: 'TRABALHISTA',
    responsavel: 'NATÁLIA',
    status: 'Concluído',
    prioridade: 'BAIXA',
    dataDistribuicao: '2024-06-10',
    ultimaAtualizacao: '2024-06-28',
    comentarios: 'Processo finalizado com acordo',
    suspeitos: []
  }
])

function openNewProcessForm() {
  formMode.value = 'new'
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

function handleProcessAdded(operationId: string) {
  console.log(`🆕 [MainComponent] Processo adicionado - Operation ID: ${operationId}`)
  closeForm()
  showToastMessage('Processo sendo processado em segundo plano')
}

async function demonstrarMultiplos() {
  showToastMessage('Iniciando 3 processos simultaneamente...')
  const processosDemo = [
    { numero: '2024.DEMO.001-1', tema: 'CÍVEL' },
    { numero: '2024.DEMO.002-2', tema: 'PENAL' },
    { numero: '2024.DEMO.003-3', tema: 'TRABALHISTA' }
  ]
  processosDemo.forEach((processo, index) => {
    setTimeout(() => {
      const fakeOperationId = `demo-${Date.now()}-${index}`
      console.log(`🚀 [MainComponent] Iniciando processo demo: ${processo.numero}`)
      progressStore.addTask(fakeOperationId, processo.numero)
      simulateProgress(fakeOperationId)
    }, index * 1000)
  })
}

async function demonstrarCincoProcessos() {
  showToastMessage('Iniciando 5 processos simultaneamente...')
  const processosDemo = [
    { numero: '2024.BATCH.001-1', tema: 'CÍVEL' },
    { numero: '2024.BATCH.002-2', tema: 'PENAL' },
    { numero: '2024.BATCH.003-3', tema: 'TRABALHISTA' },
    { numero: '2024.BATCH.004-4', tema: 'TRIBUTÁRIO' },
    { numero: '2024.BATCH.005-5', tema: 'ADMINISTRATIVO' }
  ]
  processosDemo.forEach((processo, index) => {
    setTimeout(() => {
      const fakeOperationId = `batch-${Date.now()}-${index}`
      console.log(`🚀 [MainComponent] Iniciando processo batch: ${processo.numero}`)
      progressStore.addTask(fakeOperationId, processo.numero)
      simulateProgress(fakeOperationId)
    }, index * 200)
  })
}

function simulateProgress(operationId: string) {
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5
    const messages = [
      'Enviando arquivo PDF...',
      'Convertendo para Markdown...',
      'Processando com IA...',
      'Detectando suspeitos...',
      'Salvando no banco...',
      'Finalizando processo...'
    ]
    const step = Math.min(Math.floor((progress / 100) * messages.length) + 1, messages.length)
    const message = messages[step - 1] || 'Processando...'
    progressStore.updateTaskProgress(operationId, {
      percentage: Math.min(progress, 100),
      step,
      message
    })
    if (progress >= 100) {
      clearInterval(interval)
    }
  }, 800)
}

function viewProcess(processo: any) {
  triagemStore.processoSelecionado = processo
  formMode.value = 'view'
  showForm.value = true
}

function editProcess(processo: any) {
  triagemStore.processoSelecionado = processo
  formMode.value = 'edit'
  showForm.value = true
}

function deleteProcess(processo: any) {
  if (confirm(`Tem certeza que deseja deletar o processo ${processo.numeroProcesso}?`)) {
    const index = processos.value.findIndex(p => p.id === processo.id)
    if (index > -1) {
      processos.value.splice(index, 1)
      showToastMessage('Processo deletado com sucesso')
    }
  }
}

function showToastMessage(message: string) {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

function formatarData(data: string) {
  return new Date(data).toLocaleDateString('pt-BR')
}

function getStatusClass(status: string) {
  switch (status) {
    case 'Em andamento':
      return 'bg-yellow-100 text-yellow-800'
    case 'Para revisão':
      return 'bg-orange-100 text-orange-800'
    case 'Concluído':
      return 'bg-green-100 text-green-800'
    case 'Aberto':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getPrioridadeClass(prioridade: string) {
  switch (prioridade) {
    case 'ALTA':
      return 'bg-red-100 text-red-800'
    case 'MÉDIA':
      return 'bg-yellow-100 text-yellow-800'
    case 'BAIXA':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getPrioridadeIcon(prioridade: string) {
  switch (prioridade) {
    case 'ALTA':
      return '🔴'
    case 'MÉDIA':
      return '🟡'
    case 'BAIXA':
      return '🟢'
    default:
      return '⚪'
  }
}

onMounted(() => {
  console.log('🚀 Sistema integrado com store global carregado!')
  progressStore.initializeSocket()
})
</script>
