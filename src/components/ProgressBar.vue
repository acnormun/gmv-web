<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="text-center">
        <h3 class="text-lg font-semibold mb-4">Processando Documento</h3>
        
        <!-- Barra de progresso -->
        <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            :style="{ width: `${progress.percentage}%` }"
          ></div>
        </div>
        
        <!-- Porcentagem -->
        <div class="text-sm text-gray-600 mb-4">
          {{ progress.percentage.toFixed(0) }}%
        </div>
        
        <!-- Etapas -->
        <div class="space-y-2 mb-4">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="flex items-center text-sm"
            :class="getStepClass(index + 1)"
          >
            <div class="w-6 h-6 rounded-full flex items-center justify-center mr-3">
              <span v-if="progress.step > index + 1" class="text-green-600">✓</span>
              <span v-else-if="progress.step === index + 1" class="animate-spin">⟳</span>
              <span v-else class="text-gray-400">{{ index + 1 }}</span>
            </div>
            <span>{{ step }}</span>
          </div>
        </div>
        
        <!-- Mensagem atual -->
        <div class="text-sm text-blue-600 font-medium">
          {{ progress.message }}
        </div>
        
        <!-- Erro se houver -->
        <div v-if="progress.error" class="text-sm text-red-600 mt-2">
          {{ progress.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'

interface ProgressData {
  step: number
  message: string
  percentage: number
  error?: boolean
  timestamp: number
}

const props = defineProps<{
  operationId: string | null
  visible: boolean
}>()

const emit = defineEmits(['complete', 'error'])

const progress = ref<ProgressData>({
  step: 0,
  message: 'Iniciando...',
  percentage: 0,
  timestamp: 0
})

const steps = [
  'Validando dados',
  'Analisando suspeitos', 
  'Preparando arquivos',
  'Salvando documento',
  'Salvando arquivo original',
  'Atualizando tabela',
  'Finalizando processo'
]

const isVisible = computed(() => props.visible && props.operationId)

let eventSource: EventSource | null = null

const getStepClass = (stepNumber: number) => {
  if (progress.value.step > stepNumber) {
    return 'text-green-600'
  } else if (progress.value.step === stepNumber) {
    return 'text-blue-600 font-medium'
  } else {
    return 'text-gray-400'
  }
}

const startListening = (operationId: string) => {
  if (eventSource) {
    eventSource.close()
  }
  
  // Adiciona headers para CORS se necessário
  eventSource = new EventSource(`http://localhost:5000/progress/${operationId}`)
  
  eventSource.onopen = () => {
    console.log('Conexão SSE estabelecida')
  }
  
  eventSource.onmessage = (event) => {
    console.log('Dados recebidos:', event.data)
    try {
      const data: ProgressData = JSON.parse(event.data)
      progress.value = data
      
      if (data.percentage >= 100 && !data.error) {
        setTimeout(() => {
          emit('complete')
          eventSource?.close()
        }, 1500)
      }
      
      if (data.error) {
        emit('error', data.message)
        eventSource?.close()
      }
    } catch (e) {
      console.error('Erro ao processar dados de progresso:', e)
      console.error('Dados recebidos:', event.data)
    }
  }
  
  eventSource.onerror = (error) => {
    console.error('Erro na conexão SSE:', error)
    // Tenta reconectar uma vez
    if (eventSource?.readyState === EventSource.CLOSED) {
      console.log('Tentando reconectar...')
      setTimeout(() => {
        if (props.operationId) {
          startListening(props.operationId)
        }
      }, 2000)
    }
  }
}

// Observa mudanças no operationId
watch(() => props.operationId, (newId) => {
  if (newId) {
    // Reset progress quando inicia nova operação
    progress.value = {
      step: 0,
      message: 'Conectando...',
      percentage: 0,
      timestamp: 0
    }
    startListening(newId)
  }
})

onUnmounted(() => {
  if (eventSource) {
    eventSource.close()
  }
})
</script>