<template>
  <div v-if="store.minimized && store.hasActiveTasks" class="fixed bottom-4 right-4 z-50">
    <div class="bg-white rounded-lg shadow-xl border border-gray-200 max-w-sm">
      <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-900 flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
            Processando ({{ store.activeTasks.length }})
          </h3>
          <div class="flex items-center space-x-1">
            <button
              @click="store.clearFinished()"
              v-if="store.completedTasks.length > 0 || store.errorTasks.length > 0"
              class="text-gray-400 hover:text-red-600 p-1 rounded"
              title="Limpar finalizados"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
            <button
              @click="store.hideInterface()"
              class="text-gray-400 hover:text-gray-600 p-1 rounded"
              title="Ocultar interface"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div class="mt-1 text-xs text-gray-500">
          <span :class="connectionStatusClass">●</span>
          {{ store.connectionStatus }}
        </div>
      </div>
      <div class="max-h-80 overflow-y-auto">
        <div
          v-for="task in store.activeTasks"
          :key="task.uuid"
          @click="selectTask(task.uuid)"
          class="p-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-blue-50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-900 truncate">
                {{ task.numeroProcesso || `Processo ${task.uuid.slice(-8)}` }}
              </div>
              <div class="text-xs text-gray-500 truncate">
                {{ task.message }}
              </div>
            </div>
            <div class="ml-3 flex items-center space-x-2">
              <div class="text-sm font-bold text-blue-600">
                {{ Math.round(task.percentage) }}%
              </div>
              <div class="w-8 h-8 relative">
                <svg class="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="#e5e7eb"
                    stroke-width="3"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="none"
                    stroke="#3b82f6"
                    stroke-width="3"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="circumference - (task.percentage / 100) * circumference"
                    class="transition-all duration-500"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <button
                @click.stop="cancelTask(task.uuid)"
                class="text-gray-400 hover:text-red-600 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                title="Cancelar processo"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-2 w-full bg-gray-200 rounded-full h-1">
            <div
              class="bg-blue-500 h-1 rounded-full transition-all duration-500"
              :style="{ width: `${task.percentage}%` }"
            ></div>
          </div>
        </div>
        <div v-if="store.completedTasks.length > 0" class="border-t border-gray-200">
          <div class="px-3 py-2 bg-green-50 text-xs text-green-700 font-medium">
            ✓ Concluídos recentemente
          </div>
          <div
            v-for="task in store.completedTasks.slice(-3)"
            :key="task.uuid"
            class="p-2 border-b border-gray-100 last:border-b-0"
          >
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-600 truncate">
                {{ task.numeroProcesso || `Processo ${task.uuid.slice(-8)}` }}
              </div>
              <div class="text-green-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div v-if="store.errorTasks.length > 0" class="border-t border-gray-200">
          <div class="px-3 py-2 bg-red-50 text-xs text-red-700 font-medium">
            ⚠ Com problemas
          </div>
          <div
            v-for="task in store.errorTasks"
            :key="task.uuid"
            @click="selectTask(task.uuid)"
            class="p-2 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-red-50"
          >
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-600 truncate">
                {{ task.numeroProcesso || `Processo ${task.uuid.slice(-8)}` }}
              </div>
              <div class="text-red-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
            </div>
            <div class="text-xs text-red-500 truncate">
              {{ task.errorMessage }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="store.activeTasks.length === 0 && (store.completedTasks.length > 0 || store.errorTasks.length > 0)"
           class="p-3 text-center border-t border-gray-200">
        <div class="text-xs text-gray-500">Todos os processos finalizados</div>
        <button
          @click="store.clearFinished()"
          class="mt-1 text-xs text-blue-600 hover:text-blue-800"
        >
          Limpar histórico
        </button>
      </div>
    </div>
  </div>
  <ProgressWebSocket
    :operation-id="store.selectedTask"
    :visible="store.showDetails"
    @close="store.closeDetails()"
    @complete="handleComplete"
    @error="handleError"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress.store'
import ProgressWebSocket from './ProgressWebSocket.vue'

const store = useProgressStore()

const circumference = 2 * Math.PI * 14

const connectionStatusClass = computed(() => {
  if (store.connectionStatus === 'Conectado') return 'text-green-500'
  if (store.connectionStatus.includes('Erro')) return 'text-red-500'
  return 'text-yellow-500'
})

function selectTask(uuid: string) {
  console.log(`🎯 Selecionando task para detalhes: ${uuid}`)
  store.selectTask(uuid)
}

function cancelTask(uuid: string) {
  if (confirm('Tem certeza que deseja cancelar este processo?')) {
    store.cancelTask(uuid)
  }
}

function handleComplete(data: unknown) {
  console.log('✅ Processo concluído:', data)
  store.closeDetails()
}

function handleError(message: string) {
  console.error('❌ Erro no processo:', message)
}

store.initializeSocket()
</script>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f9fafb;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f9fafb;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>