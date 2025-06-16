<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <div class="text-center">
        <h3 class="text-lg font-semibold mb-4">Processando Documento</h3>
        
        <!-- Barra de progresso -->
        <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            class="bg-blue-600 h-3 rounded-full transition-all duration-500"
            :style="{ width: `${progress.percentage}%` }"
          ></div>
        </div>
        
        <!-- Porcentagem -->
        <div class="text-lg font-semibold text-gray-800 mb-4">
          {{ progress.percentage.toFixed(0) }}%
        </div>
        
        <!-- Etapas -->
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
        
        <!-- Mensagem atual -->
        <div class="text-sm text-blue-600 font-medium mb-4">
          {{ progress.message }}
        </div>
        
        <!-- Status da conexão -->
        <div class="text-xs text-gray-400 mb-2">
          Conexão: {{ connectionStatus }}
        </div>
        
        <!-- Erro se houver -->
        <div v-if="progress.error" class="text-sm text-red-600 mt-2 p-2 bg-red-50 rounded">
          ❌ {{ progress.message }}
        </div>
        
        <!-- Sucesso -->
        <div v-if="progress.percentage >= 100 && !progress.error" class="text-sm text-green-600 mt-2 p-2 bg-green-50 rounded">
          ✅ Processo adicionado com sucesso!
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch, onMounted } from 'vue'
import { io, Socket } from 'socket.io-client'

interface ProgressData {
  step: number
  message: string
  percentage: number
  operation_id?: string
  error?: boolean
}

const props = defineProps<{
  operationId: string | null
  visible: boolean
}>()

const emit = defineEmits(['complete', 'error'])

const progress = ref<ProgressData>({
  step: 0,
  message: 'Conectando...',
  percentage: 0,
  error: false
})

const connectionStatus = ref('Desconectado')

const steps = [
  'Validando dados',
  'Analisando suspeitos', 
  'Preparando arquivos',
  'Salvando documento',
  'Salvando arquivo original',
  'Gerando anonimização',
  'Atualizando tabela',
  'Finalizando processo'
]

const isVisible = computed(() => props.visible && props.operationId)

let socket: Socket | null = null

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

const initializeSocket = () => {
  console.log('🚀 Inicializando socket...')
  
  // Se já existe socket conectado, não cria outro
  if (socket && socket.connected) {
    console.log('✅ Socket já existe e está conectado, reutilizando...')
    return
  }
  
  if (socket) {
    console.log('🔄 Desconectando socket existente...')
    socket.disconnect()
    socket = null
  }
  
  // Conecta no backend (porta 5000)
  socket = io('http://localhost:5000', {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: true // Força nova conexão
  })
  
  socket.on('connect', () => {
    connectionStatus.value = 'Conectado'
    console.log('🔌 WebSocket conectado ao backend')
    // @ts-ignore
    console.log('🆔 Socket ID:', socket.id)
  })
  
  socket.on('disconnect', (reason) => {
    connectionStatus.value = `Desconectado (${reason})`
    console.log('🔌 WebSocket desconectado:', reason)
  })
  
  socket.on('connect_error', (error) => {
    connectionStatus.value = 'Erro de conexão'
    console.error('❌ Erro na conexão WebSocket:', error)
  })
  
  // Este é o evento que o backend manda!
  socket.on('progress_update', (data: ProgressData) => {
    console.log('📊 Progresso recebido:', data)
    progress.value = data
    
    // Se chegou a 100% e não tem erro
    if (data.percentage >= 100 && !data.error) {
      setTimeout(() => {
        emit('complete')
      }, 2000) // Aguarda 2 segundos para mostrar sucesso
    }
    
    // Se tem erro (step 0 geralmente indica erro)
    if (data.error || (data.step === 0 && data.percentage === 0)) {
      progress.value.error = true
      setTimeout(() => {
        emit('error', data.message)
      }, 3000)
    }
  })
  
  // Adiciona listener para todos os eventos (debug)
  socket.onAny((eventName, ...args) => {
    console.log('📨 Evento WebSocket recebido:', eventName, args)
  })
}

// Variável para controlar se já está registrado
let isRegistered = false
let currentRegisteredId: string | null = null

const startListening = (operationId: string) => {
  console.log('🎯 === INICIANDO REGISTRO ===')
  console.log('🆔 Operation ID:', operationId)
  console.log('🔄 Já registrado?', isRegistered, 'para ID:', currentRegisteredId)
  
  // Se já está registrado para este mesmo ID, não registra novamente
  if (isRegistered && currentRegisteredId === operationId) {
    console.log('✅ Já registrado para este operation_id, pulando...')
    return
  }
  
  console.log('🔌 Socket existe?', !!socket)
  console.log('🔌 Socket conectado?', socket?.connected)
  console.log('🆔 Socket ID:', socket?.id)
  
  if (!socket) {
    console.error('❌ Socket não existe!')
    return
  }
  
  if (!socket.connected) {
    console.error('❌ Socket não conectado!')
    return
  }
  
  console.log('📤 Enviando start_listening...')
  
  // Adiciona listener para resposta (apenas uma vez)
  socket.once('progress_update', (data) => {
    console.log('✅ Primeira resposta recebida:', data)
    isRegistered = true
    currentRegisteredId = operationId
  })
  
  socket.once('error', (error) => {
    console.error('❌ Erro recebido:', error)
    isRegistered = false
    currentRegisteredId = null
  })
  
  // Emite o evento
  socket.emit('start_listening', { operation_id: operationId })
  console.log('📤 start_listening enviado!')
  
  // Confirma se foi enviado
  setTimeout(() => {
    // @ts-ignore
    console.log('⏰ Verificação após 1s: Socket ainda conectado?', socket.connected)
    if (!isRegistered) {
      console.log('⚠️ Ainda não registrado após 1s')
    }
  }, 1000)
}

// Inicializa socket quando componente monta
onMounted(() => {
  console.log('🚀 Inicializando WebSocket...')
  initializeSocket()
})

// Observa mudanças no operationId
watch(() => props.operationId, (newId, oldId) => {
  console.log('🔄 Watch operationId mudou:', { old: oldId, new: newId })
  
  if (newId && newId !== oldId) { // Só executa se realmente mudou
    console.log('🆔 Novo operation ID detectado:', newId)
    
    // Reset progress
    progress.value = {
      step: 0,
      message: 'Registrando canal de progresso...',
      percentage: 0,
      error: false
    }
    
    // Reset registration status
    isRegistered = false
    currentRegisteredId = null
    
    // Função para tentar registrar
    const tryRegister = () => {
      if (socket?.connected) {
        console.log('✅ Socket conectado, registrando...')
        startListening(newId)
      } else {
        console.log('❌ Socket não conectado, inicializando...')
        initializeSocket()
        
        // Aguarda conexão e registra (apenas uma vez)
        socket?.once('connect', () => {
          console.log('✅ Socket conectou, registrando após delay...')
          setTimeout(() => {
            startListening(newId)
          }, 100)
        })
      }
    }
    
    // Tenta registrar
    tryRegister()
  }
})

// Cleanup quando componente desmonta
onUnmounted(() => {
  console.log('🧹 Desconectando WebSocket...')
  if (socket) {
    socket.disconnect()
  }
})
</script>