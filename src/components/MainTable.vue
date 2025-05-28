<template>
  <div id="main-content" class="col-span-9">
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-xl">Processos</h1>
        <div class="flex space-x-2">
          <button
            class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-neutral-50"
          >
            <img src="../assets/download-solid.svg" class="h-5 w-5" alt="Exportar" />
            <span>Exportar</span>
          </button>
          <button
            class="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800"
          >
            <img src="../assets/plus-solid.svg" class="h-5 w-5" alt="Adicionar" />
            <span>Novo Processo</span>
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4">Nº Processo</th>
              <th class="text-left py-3 px-4">Tema</th>
              <th class="text-left py-3 px-4">Data da Distribuição</th>
              <th class="text-left py-3 px-4">Responsável</th>
              <th class="text-left py-3 px-4">Status</th>
              <th class="text-left py-3 px-4">Última Atualização</th>
              <th class="text-left py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in data" :key="index" class="border-b hover:bg-neutral-50">
              <td class="py-3 px-4">{{ item.numeroProcesso }}</td>
              <td class="py-3 px-4">{{ item.tema }}</td>
              <td class="py-3 px-4">{{ item.dataDistribuicao }}</td>
              <td class="py-3 px-4">{{ item.responsavel }}</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 bg-neutral-100 rounded-full text-sm">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-3 px-4">{{ item.ultimaAtualizacao }}</td>
              <td class="py-3 px-4">
                <button class="text-neutral-600 hover:text-neutral-900 mr-2">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button class="text-neutral-600 hover:text-neutral-900 mr-2">
                  <i class="fa-solid fa-download"></i>
                </button>
                <button class="text-neutral-600 hover:text-neutral-900">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-neutral-600">Mostrando {{ data.length }} resultados</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: {
    type: Array<any>,
    required: true,
  },
})
</script>
