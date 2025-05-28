<template>
  <div
    v-if="open"
    id="modal-overlay"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40"
  >
    <div id="modal-novo-processo" class="bg-white rounded-xl shadow-lg w-[400px] max-w-full p-7">
      <div class="mb-5">
        <h2 class="text-lg text-neutral-900">Novo Processo</h2>
      </div>
      <form @submit.prevent="submit" class="space-y-4">
        <div>
          <label class="block text-sm text-neutral-500 mb-1">Número do Processo</label>
          <input
            v-model="form.numeroProcesso"
            type="text"
            class="w-full border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-300 text-neutral-900"
            placeholder="Digite o número"
            required
          />
        </div>
        <div>
          <label class="block text-sm text-neutral-500 mb-1">Tema</label>
          <select
            v-model="form.tema"
            class="w-full border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-300 text-neutral-900"
            required
          >
            <option disabled value="">Selecione o tema</option>
            <option>CÍVEL</option>
            <option>PENAL</option>
            <option>TRABALHISTA</option>
            <option>SAÚDE</option>
            <option>ADMINISTRATIVO</option>
            <option>TRIBUTÁRIO</option>
            <option>PREVIDENCIÁRIO</option>
            <option>CONSUMIDOR</option>
            <option>FAMÍLIA</option>
            <option>AMBIENTAL</option>
            <option>EXECUÇÃO FISCAL</option>
            <option>EMPRESARIAL</option>
            <option>ELEITORAL</option>
            <option>IMOBILIÁRIO</option>
            <option>MILITAR</option>
            <option>DIGITAL</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-neutral-500 mb-1">Data de abertura</label>
          <div class="relative">
            <input
              v-model="form.dataDistribuicao"
              type="date"
              class="w-full border border-neutral-200 rounded-md px-3 py-2 pr-9 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-300 text-neutral-900"
              required
            />
            <span
              class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"
            >
              <i class="fa-regular fa-calendar"></i>
            </span>
          </div>
        </div>
        <div>
          <label class="block text-sm text-neutral-500 mb-1">Responsável</label>
          <select
            v-model="form.responsavel"
            class="w-full border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-300 text-neutral-900"
            required
          >
            <option disabled value="">Selecione o responsável</option>
            <option>LOURIVAL</option>
            <option>NAIRA</option>
            <option>NATÁLIA</option>
            <option>JUSSARA</option>
            <option>LEISI</option>
            <option>JORDAM</option>
            <option>RAQUEL</option>
            <option>FERNANDA</option>
            <option>VANUCE</option>
          </select>
        </div>

        <div class="flex space-x-2">
          <div class="w-1/2">
            <label class="block text-sm text-neutral-500 mb-1">Status</label>
            <select
              v-model="form.status"
              class="w-full border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-300 text-neutral-900"
              required
            >
              <option>Aberto</option>
              <option>Em andamento</option>
              <option>Para revisão</option>
              <option>Concluído</option>
            </select>
          </div>
          <div class="w-1/2">
            <label class="block text-sm text-neutral-500 mb-1">Data status</label>
            <div class="relative">
              <input
                v-model="form.ultimaAtualizacao"
                type="date"
                class="w-full border border-neutral-200 rounded-md px-3 py-2 pr-9 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-300 text-neutral-900"
                required
              />
              <span
                class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"
              >
                <i class="fa-regular fa-calendar"></i>
              </span>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm text-neutral-500 mb-1">Anexo</label>
          <div class="flex items-center space-x-3">
            <input
              type="file"
              accept=".pdf"
              name="pdf"
              @change="handlePdf"
              class="cursor-pointer border border-neutral-300 rounded-md px-3 py-1 text-sm file:bg-neutral-100 file:border-0 file:mr-2 file:rounded file:px-3 file:py-1 file:text-neutral-700"
              required
            />
            <span class="text-xs text-neutral-500 truncate">
              {{ arquivoPdf?.name || 'Nenhum arquivo escolhido' }}
            </span>
          </div>
        </div>
        <div>
          <label class="block text-sm text-neutral-500 mb-1">Comentários</label>
          <textarea
            v-model="form.comentarios"
            rows="3"
            class="w-full border border-neutral-200 rounded-md px-3 py-2 bg-neutral-50 focus:outline-none focus:ring-1 focus:ring-neutral-300 text-neutral-900"
            placeholder="Observações, detalhes relevantes etc."
          ></textarea>
        </div>
        <div class="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="text-neutral-500 px-4 py-2 rounded-md hover:bg-neutral-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-neutral-900 text-white px-5 py-2 rounded-md hover:bg-neutral-800"
          >
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
  ultimaAtualizacao: '',
  comentarios: '',
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

    const markdown = await pdfToMarkdown(arquivoPdf.value)
    const payload = {
      ...form.value,
      markdown,
    }

    const res = await fetch('http://localhost:5000/triagem/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Erro ao enviar dados')
    }

    form.value = {
      numeroProcesso: '',
      tema: '',
      dataDistribuicao: '',
      responsavel: '',
      status: 'Em andamento',
      ultimaAtualizacao: '',
      comentarios: '',
    }
    arquivoPdf.value = null

    emit('added')
    emit('close')
  } catch (err) {
    alert('Erro ao salvar processo e markdown.')
  }
}
</script>
