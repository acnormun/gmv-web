<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow w-[400px]">
      <h2 class="text-lg font-semibold mb-4">Novo Processo</h2>
      <form @submit.prevent="submit">
        <input
          v-model="form.numeroProcesso"
          class="input"
          placeholder="Número do Processo"
          required
        />
        <input v-model="form.tema" class="input" placeholder="Tema" required />
        <input v-model="form.dataDistribuicao" type="date" class="input" required />
        <input v-model="form.responsavel" class="input" placeholder="Responsável" required />
        <select v-model="form.status" class="input" required>
          <option>Em andamento</option>
          <option>Concluído</option>
          <option>Arquivado</option>
        </select>
        <input v-model="form.ultimaAtualizacao" type="date" class="input" required />
        <div class="flex justify-end mt-4 gap-2">
          <button type="button" @click="$emit('close')" class="text-sm text-neutral-500">
            Cancelar
          </button>
          <button type="submit" class="bg-neutral-900 text-white px-4 py-2 rounded">Salvar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { addProcesso, getProcessos, type Processo } from '@/api/triagem'

const emit = defineEmits(['close', 'added'])
defineProps<{ open: boolean }>()

const form = ref<Processo>({
  numeroProcesso: '',
  tema: '',
  dataDistribuicao: '',
  responsavel: '',
  status: 'Em andamento',
  ultimaAtualizacao: '',
})

async function submit() {
  try {
    await addProcesso(form.value).then(async () => {
        await getProcessos()
    })
    emit('added')                 
    emit('close')                 
  } catch (err) {
    console.error('Erro ao adicionar processo:', err)
    alert('Erro ao adicionar processo.')
  } 
}

</script>

<style scoped>
.input {
  @apply w-full border px-3 py-2 rounded mb-2 text-sm;
}
</style>
