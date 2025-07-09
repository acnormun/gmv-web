<template>
  <div v-if="isVisible && !isMinimized" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="text-center">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">
            {{ taskData?.numeroProcesso || `Processo ${operationId?.slice(-8)}` }}
          </h3>
          <div class="flex items-center space-x-2">
            <button
              @click="minimize"
              class="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
              title="Minimizar progresso"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <button
              @click="close"
              class="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
              title="Fechar"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            class="bg-blue-600 h-3 rounded-full transition-all duration-500"
            :style="{ width: `${progress.percentage}%` }"
          ></div>
        </div>
        <div class="text-lg font-semibold text-gray-800 mb-4">
          {{ progress.percentage.toFixed(0) }}%
        </div>
        <div class="space-y-3 mb-4">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="flex items-center text-sm"
            :class="getStepClass(index + 1)"
          >
            <div class="w-6 h-6 rounded-full flex items-center justify-center mr-3 border-2"
                 :class="getStepIconClass(index + 1)">
              <span v-if="progress.step > index + 1" class="text-green-600 font-bold">✓</span>
              <span v-else-if="progress.step === index + 1" class="animate-spin text-blue-600">⟳</span>
              <span v-else class="text-gray-400 text-xs">{{ index + 1 }}</span>
            </div>
            <span>{{ step }}</span>
          </div>
        </div>
        <div class="text-sm text-blue-600 font-medium mb-4">
          {{ progress.message }}
        </div>
        <div class="text-xs text-gray-400 mb-2">
          Conexão: {{ store.connectionStatus }}
        </div>
        <div v-if="progress.error" class="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded">
          ❌ {{ progress.errorMessage || progress.message }}
        </div>
        <div v-if="progress.completed" class="text-sm text-green-600 mt-2 p-2 bg-green-50 rounded">
          ✅ Processo concluído com sucesso!
          <div v-if="autoCloseCountdown > 0" class="text-xs text-gray-500 mt-1">
            Fechando em {{ autoCloseCountdown }}s...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useProgressStore } from '@/stores/progress.store'

const props = defineProps<{
  operationId: string | null
  visible: boolean
}>()

const emit = defineEmits(['close', 'complete', 'error', 'progress'])

const store = useProgressStore()
const isMinimized = ref(false)
const autoCloseCountdown = ref(0)
let autoCloseTimer: NodeJS.Timeout | null = null
let countdownInterval: NodeJS.Timeout | null = null

const taskData = computed(() => {
  if (!props.operationId) return null
  return store.inProgress.find(task => task.uuid === props.operationId) || null
})

const progress = computed(() => {
  if (!taskData.value) {
    return {
      step: 0,
      message: 'Conectando...',
      percentage: 0,
      error: false,
      errorMessage: '',
      completed: false
    }
  }

  let actualStep = taskData.value.step || getStepFromPercentage(taskData.value.percentage)
  
  // Garante que o step seja válido (entre 1 e 12)
  actualStep = Math.max(1, Math.min(12, actualStep))
  
  // Usa a mensagem do backend se disponível, senão usa o label do step
  let displayMessage = taskData.value.message
  if (!displayMessage || displayMessage === 'Conectando...' || displayMessage === 'Iniciando processamento...') {
    displayMessage = stepLabels[actualStep] || taskData.value.message
  }

  return {
    step: actualStep,
    message: displayMessage,
    percentage: taskData.value.percentage,
    error: taskData.value.error,
    errorMessage: taskData.value.errorMessage,
    completed: taskData.value.completed
  }
})

const isVisible = computed(() => props.visible && props.operationId && !isMinimized.value)

// Mapeamento baseado na análise dos logs reais do backend
const stepLabels = {
  1: 'Conectando...',
  2: 'Validando dados',
  3: 'Processando PDF do PJe',
  4: 'Analisando suspeição',
  5: 'Preparando arquivos',
  6: 'Salvando markdown',
  7: 'Atualizando busca',
  8: 'Executando anonimização',
  9: 'Salvando versão anonimizada',
  10: 'Atualizando tabela',
  11: 'Enviando notificação',
  12: 'Processo concluído'
}

// Função para determinar o step baseado na porcentagem se o step não estiver definido
const getStepFromPercentage = (percentage: number) => {
  if (percentage >= 100) return 12
  if (percentage >= 95) return 11
  if (percentage >= 90) return 10
  if (percentage >= 80) return 9
  if (percentage >= 75) return 8
  if (percentage >= 65) return 7
  if (percentage >= 55) return 6
  if (percentage >= 45) return 5
  if (percentage >= 35) return 4
  if (percentage >= 25) return 3
  if (percentage >= 10) return 2
  return 1
}

// Array ordenado para exibição na interface
const steps = [
  'Conectando...',
  'Validando dados',
  'Processando PDF do PJe',
  'Analisando suspeição',
  'Preparando arquivos',
  'Salvando markdown',
  'Atualizando busca',
  'Executando anonimização',
  'Salvando versão anonimizada',
  'Atualizando tabela',
  'Enviando notificação',
  'Processo concluído'
]

function minimize() {
  isMinimized.value = true
  store.closeDetails()
  clearAutoCloseTimers()
}

function close() {
  clearAutoCloseTimers()
  emit('close')
  store.closeDetails()
}

function clearAutoCloseTimers() {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  autoCloseCountdown.value = 0
}

function startAutoClose() {
  console.log('🕐 Iniciando fechamento automático em 3 segundos...')
  autoCloseCountdown.value = 3
  
  // Countdown visual
  countdownInterval = setInterval(() => {
    autoCloseCountdown.value--
    if (autoCloseCountdown.value <= 0) {
      clearInterval(countdownInterval!)
      countdownInterval = null
    }
  }, 1000)
  
  // Fechamento automático
  autoCloseTimer = setTimeout(() => {
    console.log('🔒 Fechando janela automaticamente após conclusão')
    close()
  }, 3000)
}

const getStepClass = (stepNumber: number) => {
  if (progress.value.step > stepNumber) {
    return 'text-green-600 font-medium'
  } else if (progress.value.step === stepNumber) {
    return 'text-blue-600 font-semibold'
  } else {
    return 'text-gray-400'
  }
}

const getStepIconClass = (stepNumber: number) => {
  if (progress.value.step > stepNumber) {
    return 'border-green-600 bg-green-50'
  } else if (progress.value.step === stepNumber) {
    return 'border-blue-600 bg-blue-50'
  } else {
    return 'border-gray-300 bg-gray-50'
  }
}

watch(() => progress.value, (newProgress, oldProgress) => {
  if (!oldProgress) return

  emit('progress', newProgress)

  if (newProgress.completed && !oldProgress.completed) {
    console.log('✅ Processo concluído, iniciando fechamento automático')
    
    // Emitir evento de conclusão
    setTimeout(() => {
      emit('complete', newProgress)
    }, 500)
    
    // Iniciar fechamento automático após 3 segundos
    startAutoClose()
  }

  if (newProgress.error && !oldProgress.error) {
    clearAutoCloseTimers() // Não fechar automaticamente em caso de erro
    setTimeout(() => {
      emit('error', newProgress.errorMessage || newProgress.message)
    }, 1000)
  }
}, { deep: true })

onMounted(() => {
  store.initializeSocket()
})

onUnmounted(() => {
  clearAutoCloseTimers()
})

watch(() => props.operationId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    console.log('🔄 ProgressWebSocket: Nova operação detectada:', newId)
    clearAutoCloseTimers() // Limpar timers da operação anterior
    
    if (!store.inProgress.find(t => t.uuid === newId)) {
      store.addTask(newId)
    }
  }
})

watch(() => props.visible, (newVisible, oldVisible) => {
  // Se a janela for fechada manualmente, limpar os timers
  if (oldVisible && !newVisible) {
    clearAutoCloseTimers()
  }
})

watch(() => progress.value.percentage, (newPercentage) => {
  if (newPercentage > 0 && newPercentage < 100 && props.visible && !isMinimized.value) {
    setTimeout(() => {
      if (progress.value.percentage > 0 && progress.value.percentage < 100) {
        minimize()
      }
    }, 3000)
  }
})
</script>