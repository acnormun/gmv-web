<template>
  <div id="dashboard" class="bg-white p-6 rounded-lg shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg font-semibold text-neutral-900">Painel de Processos</h2>
        <p class="text-sm text-neutral-500">Visão geral dos processos</p>
      </div>
    </div>

    <!-- Status Cards -->
    <div class="grid grid-cols-4 gap-6 mb-6">
      <div class="bg-neutral-50 rounded-lg p-4 flex items-center space-x-4">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-200">
          <i class="fa-regular fa-folder-open text-xl text-neutral-700"></i>
        </div>
        <div>
          <div class="text-2xl text-neutral-900">{{ abertos }}</div>
          <div class="text-sm text-neutral-600">Aberto</div>
        </div>
      </div>
      <div class="bg-neutral-50 rounded-lg p-4 flex items-center space-x-4">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-200">
          <i class="fa-solid fa-spinner text-xl text-neutral-700"></i>
        </div>
        <div>
          <div class="text-2xl text-neutral-900">{{ emAndamento }}</div>
          <div class="text-sm text-neutral-600">Em andamento</div>
        </div>
      </div>
      <div class="bg-neutral-50 rounded-lg p-4 flex items-center space-x-4">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-200">
          <i class="fa-regular fa-folder-open text-xl text-neutral-700"></i>
        </div>
        <div>
          <div class="text-2xl text-neutral-900">{{ abertos }}</div>
          <div class="text-sm text-neutral-600">Para revisão</div>
        </div>
      </div>
      <div class="bg-neutral-50 rounded-lg p-4 flex items-center space-x-4">
        <div class="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-200">
          <i class="fa-solid fa-circle-check text-xl text-neutral-700"></i>
        </div>
        <div>
          <div class="text-2xl text-neutral-900">{{ concluidos }}</div>
          <div class="text-sm text-neutral-600">Concluído</div>
        </div>
      </div>
    </div>

    <!-- Temas -->
    <div id="tema-block" class="mt-2">
      <h3 class="text-base mb-2 text-neutral-900">Temas Mais Atuados</h3>
      <div class="flex flex-wrap gap-3">
        <div
          v-for="tema in temasMaisAtuados"
          :key="tema.nome"
          class="flex items-center space-x-2 bg-neutral-100 rounded-full px-4 py-1"
        >
          <i :class="tema.icon + ' text-neutral-700'"></i>
          <span class="text-sm text-neutral-800">{{ tema.nome }}</span>
          <span class="text-xs text-neutral-500">({{ tema.total }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  emAndamento: number
  abertos: number
  revisao: number
  concluidos: number
  temasMaisAtuados: { nome: string; total: number; icon: string }[]
}>()
</script>
