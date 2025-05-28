<template>
  <div
    v-if="open"
    class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"
  >
    <div class="bg-white p-6 rounded-lg shadow w-[400px]">
      <h2 class="text-lg font-semibold mb-4">Novo Processo</h2>
      <form @submit.prevent="submit">
        <input v-model="form.numeroProcesso" class="input" placeholder="Número do Processo" required />
        <input v-model="form.tema" class="input" placeholder="Tema" required />
        <input v-model="form.dataDistribuicao" type="date" class="input" required />
        <input v-model="form.responsavel" class="input" placeholder="Responsável" required />
        <select v-model="form.status" class="input" required>
          <option>Em andamento</option>
          <option>Concluído</option>
          <option>Arquivado</option>
        </select>
        <input v-model="form.ultimaAtualizacao" type="date" class="input" required />

        <!-- PDF -->
        <input
          type="file"
          accept=".pdf"
          name="pdf"
          @change="handlePdf"
          class="input"
          required
        />

        <div class="flex justify-end mt-4 gap-2">
          <button type="button" @click="$emit('close')" class="text-sm text-neutral-500">
            Cancelar
          </button>
          <button type="submit" class="bg-neutral-900 text-white px-4 py-2 rounded">
            Salvar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { pdfToMarkdown } from '@/utils/pdfToMarkdown'

const emit = defineEmits(['close', 'added'])
defineProps<{ open: boolean }>()

const form = ref({
  numeroProcesso: '',
  tema: '',
  dataDistribuicao: '',
  responsavel: '',
  status: 'Em andamento',
  ultimaAtualizacao: ''
})

const arquivoPdf = ref<File | null>(null)

function handlePdf(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    arquivoPdf.value = target.files[0]
  }
}

async function submit() {
  try {
    if (!arquivoPdf.value) {
      alert('Selecione um arquivo PDF.')
      return
    }

    console.log('pegando o md')
    const markdown = await pdfToMarkdown(arquivoPdf.value)
    console.log('passando aqui')
    const payload = {
      ...form.value,
      markdown
    }

    const res = await fetch('http://localhost:5000/triagem/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Erro ao enviar dados')
    }

    // Reset form
    form.value = {
      numeroProcesso: '',
      tema: '',
      dataDistribuicao: '',
      responsavel: '',
      status: 'Em andamento',
      ultimaAtualizacao: ''
    }
    arquivoPdf.value = null

    emit('added')
    emit('close')
  } catch (err) {
    console.error('Erro ao enviar dados:', err)
    alert('Erro ao salvar processo e markdown.')
  }
}
</script>

<style scoped>
.input {
  @apply w-full border px-3 py-2 rounded mb-2 text-sm;
}
</style>
