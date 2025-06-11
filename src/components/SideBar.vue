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
          <div class="relative dropdown-temas">
            <div
              @click="dropdownTemaAberto = !dropdownTemaAberto"
              class="w-full border rounded-md px-3 py-2 cursor-pointer hover:border-neutral-400 min-h-[40px] flex items-center justify-between"
            >
              <span class="text-sm text-neutral-700">
                {{
                  filtros.tema.length > 0
                    ? `${filtros.tema.length} selecionado(s)`
                    : 'Selecionar temas'
                }}
              </span>
              <svg
                class="w-4 h-4 text-neutral-500 transition-transform"
                :class="{ 'rotate-180': dropdownTemaAberto }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>

            <!-- Dropdown Content -->
            <div
              v-if="dropdownTemaAberto"
              class="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              <div class="p-2 space-y-1">
                <label
                  v-for="tema in temas"
                  :key="tema"
                  class="flex items-center space-x-2 p-2 hover:bg-neutral-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="tema"
                    v-model="filtros.tema"
                    class="text-neutral-900 focus:ring-neutral-500 rounded"
                  />
                  <span class="text-sm text-neutral-700">{{ tema }}</span>
                </label>
              </div>

              <div class="border-t p-2">
                <button
                  @click="filtros.tema = []"
                  class="w-full px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-50 rounded"
                >
                  Limpar seleção
                </button>
              </div>
            </div>
          </div>
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
          <div class="relative dropdown-responsaveis">
            <div
              @click="dropdownAberto = !dropdownAberto"
              class="w-full border rounded-md px-3 py-2 cursor-pointer hover:border-neutral-400 min-h-[40px] flex items-center justify-between"
            >
              <span class="text-sm text-neutral-700">
                {{
                  filtros.responsavel.length > 0
                    ? `${filtros.responsavel.length} selecionado(s)`
                    : 'Selecionar responsáveis'
                }}
              </span>
              <svg
                class="w-4 h-4 text-neutral-500 transition-transform"
                :class="{ 'rotate-180': dropdownAberto }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>

            <!-- Dropdown Content -->
            <div
              v-if="dropdownAberto"
              class="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              <div class="p-2 space-y-1">
                <label
                  v-for="responsavel in responsaveis"
                  :key="responsavel"
                  class="flex items-center space-x-2 p-2 hover:bg-neutral-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="responsavel"
                    v-model="filtros.responsavel"
                    class="text-neutral-900 focus:ring-neutral-500 rounded"
                  />
                  <span class="text-sm text-neutral-700">{{ responsavel }}</span>
                </label>
              </div>

              <div class="border-t p-2">
                <button
                  @click="filtros.responsavel = []"
                  class="w-full px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-50 rounded"
                >
                  Limpar seleção
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm text-neutral-600 mb-1">Status</label>
          <select v-model="filtros.status" class="w-full border rounded-md px-3 py-2">
            <option value="">Todos</option>
            <option>Aberto</option>
            <option>Em andamento</option>
            <option>Para revisão</option>
            <option>Concluído</option>
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
        <div>
          <label class="flex items-center space-x-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              v-model="filtros.suspeitos"
              class="text-neutral-900 focus:ring-neutral-500 rounded"
            />
            <span>Somente com suspeição</span>
          </label>
        </div>

        <button
          @click="emitirFiltros"
          class="w-full bg-neutral-900 text-white py-2 rounded-md hover:bg-neutral-800"
        >
          Aplicar Filtros
        </button>
        <button
          @click="emit('clearFilters')"
          class="text-sm text-neutral-500 hover:text-neutral-800 underline"
        >
          Limpar filtros
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue'
const emit = defineEmits(['apply', 'clearFilters'])

const dropdownAberto = ref(false)
const dropdownTemaAberto = ref(false)

// Fechar dropdown ao clicar fora
const handleClickOutside = (event: Event) => {
  const dropdownResponsaveis = document.querySelector('.dropdown-responsaveis')
  const dropdownTemas = document.querySelector('.dropdown-temas')

  if (dropdownResponsaveis && !dropdownResponsaveis.contains(event.target as Node)) {
    dropdownAberto.value = false
  }

  if (dropdownTemas && !dropdownTemas.contains(event.target as Node)) {
    dropdownTemaAberto.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const temas = [
  'CÍVEL',
  'PENAL',
  'SAÚDE',
  'TRABALHISTA',
  'ADMINISTRATIVO',
  'TRIBUTÁRIO',
  'PREVIDENCIÁRIO',
  'CONSUMIDOR',
  'FAMÍLIA',
  'AMBIENTAL',
  'EMPRESARIAL',
  'ELEITORAL',
  'IMOBILIÁRIO',
  'MILITAR',
  'DIGITAL',
]

const responsaveis = [
  'LOURIVAL',
  'NAIRA',
  'NATÁLIA',
  'JUSSARA',
  'LEISI',
  'JORDAM',
  'RAQUEL',
  'FERNANDA',
  'VANUCE',
]

const filtros = reactive({
  numeroProcesso: '',
  tema: [] as string[],
  dataDistribuicao: '',
  responsavel: [] as string[],
  status: '',
  ultimaAtualizacao: '',
  suspeitos: false,
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
