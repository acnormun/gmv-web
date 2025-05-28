<template>
  <aside id="sidebar" class="col-span-3 space-y-4">
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <h2 class="text-lg mb-4">Filtros</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm text-neutral-600 mb-1">Número do Processo</label>
          <input
            v-model="filtros.numeroProcesso"
            type="text"
            class="w-full border rounded-md px-3 py-2"
            placeholder="0000000-00.0000.0.00.0000"
          />
        </div>
        <div>
          <label class="block text-sm text-neutral-600 mb-1">Tema</label>
          <input
            v-model="filtros.tema"
            type="text"
            class="w-full border rounded-md px-3 py-2"
            placeholder="Ex: Direito Civil"
          />
        </div>
        <div>
          <label class="block text-sm text-neutral-600 mb-1">Data da Distribuição</label>
          <input
            v-model="filtros.dataDistribuicao"
            type="date"
            class="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label class="block text-sm text-neutral-600 mb-1">Responsável</label>
          <input
            v-model="filtros.responsavel"
            type="text"
            class="w-full border rounded-md px-3 py-2"
            placeholder="Nome"
          />
        </div>
        <div>
          <label class="block text-sm text-neutral-600 mb-1">Status</label>
          <select v-model="filtros.status" class="w-full border rounded-md px-3 py-2">
            <option value="">Todos</option>
            <option>Em andamento</option>
            <option>Concluído</option>
            <option>Arquivado</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-neutral-600 mb-1">Última Atualização</label>
          <input
            v-model="filtros.ultimaAtualizacao"
            type="date"
            class="w-full border rounded-md px-3 py-2"
          />
        </div>
        <button @click="emitirFiltros" class="w-full bg-neutral-900 text-white py-2 rounded-md hover:bg-neutral-800">
          Aplicar Filtros
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
const emit = defineEmits(['apply'])

const filtros = reactive({
  numeroProcesso: '',
  tema: '',
  dataDistribuicao: '',
  responsavel: '',
  status: '',
  ultimaAtualizacao: ''
})

const emitirFiltros = () => {
  emit('apply', { ...filtros })
}
</script>

<style>
#sidebar {
  font-family: Inter;
}
</style>
