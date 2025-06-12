<template>
  <main class="h-screen flex flex-col bg-neutral-50">
    <div class="container mx-auto py-6 flex-1 flex flex-col">
      <!-- Header -->
      <div class="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-xl font-semibold text-neutral-900">Assistente de IA</h1>
            <p class="text-sm text-neutral-500">
              Converse com nossa IA para análise de processos e documentos
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              @click="limparConversa"
              class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-neutral-50 transition-colors"
            >
              <img src="../assets/trash-solid.svg" class="h-4 w-4" alt="Limpar" />
              <span>Limpar Chat</span>
            </button>
            <button
              @click="exportarConversa"
              class="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-neutral-50 transition-colors"
            >
              <img src="../assets/download-solid.svg" class="h-4 w-4" alt="Exportar" />
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
          <div v-if="mensagens.length === 0" class="text-center py-12">
            <div
              class="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <img src="../assets/robot-solid.svg" class="w-8 h-8 text-neutral-400" />
            </div>
            <h3 class="text-lg font-medium text-neutral-900 mb-2">Bem-vindo ao Assistente de IA</h3>
            <p class="text-neutral-600 max-w-md mx-auto">
              Faça perguntas sobre processos, peça análises de documentos ou solicite relatórios.
              Estou aqui para ajudar!
            </p>
            <div class="mt-6 flex flex-wrap justify-center gap-2">
              <button
                v-for="sugestao in sugestoes"
                :key="sugestao"
                @click="enviarSugestao(sugestao)"
                class="px-3 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
              >
                {{ sugestao }}
              </button>
            </div>
          </div>
          <div
            v-for="(mensagem, index) in mensagens"
            :key="index"
            class="flex gap-4"
            :class="mensagem.tipo === 'usuario' ? 'justify-end' : 'justify-start'"
          >
            <div
              v-if="mensagem.tipo === 'ia'"
              class="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <img src="../assets/robot-solid.svg" class="w-4 h-4 text-neutral-600" />
            </div>

            <!-- Message Bubble -->
            <div
              class="max-w-3xl rounded-lg px-4 py-3"
              :class="
                mensagem.tipo === 'usuario'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 text-neutral-900'
              "
            >
              <div
                class="prose prose-sm max-w-none"
                v-html="formatarMensagem(mensagem.conteudo)"
              ></div>
              <div
                class="text-xs mt-2 opacity-70"
                :class="mensagem.tipo === 'usuario' ? 'text-neutral-300' : 'text-neutral-500'"
              >
                {{ formatarHorario(mensagem.timestamp) }}
              </div>
            </div>
            <div
              v-if="mensagem.tipo === 'usuario'"
              class="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <img src="../assets/user-solid.svg" class="w-4 h-4 text-white" />
            </div>
          </div>
          <div v-if="carregando" class="flex gap-4 justify-start">
            <div
              class="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <img src="../assets/robot-solid.svg" class="w-4 h-4 text-neutral-600" />
            </div>
            <div class="bg-neutral-100 rounded-lg px-4 py-3">
              <div class="flex space-x-1">
                <div class="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                <div
                  class="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style="animation-delay: 0.1s"
                ></div>
                <div
                  class="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style="animation-delay: 0.2s"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="border-t border-neutral-200 p-4">
          <form @submit.prevent="enviarMensagem" class="flex gap-3">
            <div class="flex-1 relative">
              <textarea
                v-model="novaMensagem"
                @keydown.enter.prevent="enviarMensagem"
                @keydown.shift.enter.prevent="novaMensagem += '\n'"
                placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"
                class="w-full border border-neutral-200 rounded-md px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-1 focus:ring-neutral-300"
                rows="1"
                style="min-height: 44px; max-height: 120px"
                :disabled="carregando"
              ></textarea>
              <button
                type="button"
                @click="anexarArquivo"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                title="Anexar arquivo"
              >
                <img src="../assets/paperclip-solid.svg" class="w-4 h-4" />
              </button>
            </div>
            <button
              type="submit"
              :disabled="!novaMensagem.trim() || carregando"
              class="px-4 py-3 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <img
                src="../assets/paper-plane-solid.svg"
                class="w-4 h-4"
                :class="carregando && 'animate-pulse'"
              />
              <span class="hidden sm:inline">{{ carregando ? 'Enviando...' : 'Enviar' }}</span>
            </button>
          </form>

          <input
            ref="fileInput"
            type="file"
            @change="processarArquivo"
            accept=".pdf,.doc,.docx,.txt"
            class="hidden"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

interface Mensagem {
  tipo: 'usuario' | 'ia'
  conteudo: string
  timestamp: Date
  arquivos?: string[]
}

const mensagens = ref<Mensagem[]>([])
const novaMensagem = ref('')
const carregando = ref(false)
const messagesContainer = ref<HTMLElement>()
const fileInput = ref<HTMLInputElement>()

const sugestoes = [
  'Resumir processos em andamento',
  'Analisar documentos pendentes',
  'Gerar relatório mensal',
  'Buscar processos em atraso',
]

async function chamarIA(mensagem: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

  const respostasSimuladas = [
    `Analisando sua solicitação: "${mensagem}"\n\nCom base nos dados disponíveis, aqui está minha análise:\n\n• **Processos identificados**: 15 processos relacionados\n• **Status predominante**: Em andamento\n• **Recomendação**: Revisar processos com mais de 30 dias\n\nPosso fornecer mais detalhes específicos se necessário.`,

    `Entendi sua pergunta sobre: "${mensagem}"\n\n**Resumo executivo:**\n\n1. Situação atual bem mapeada\n2. Alguns pontos de atenção identificados\n3. Sugestões de melhoria disponíveis\n\nGostaria que eu detalhe algum aspecto específico?`,

    `Ótima pergunta! Sobre "${mensagem}":\n\n**Principais insights:**\n• Dados processados com sucesso\n• Padrões interessantes identificados\n• Recomendações práticas geradas\n\nPosso gerar um relatório detalhado se preferir.`,
  ]

  return respostasSimuladas[Math.floor(Math.random() * respostasSimuladas.length)]
}

async function enviarMensagem() {
  if (!novaMensagem.value.trim() || carregando.value) return

  const mensagemUsuario = novaMensagem.value.trim()
  novaMensagem.value = ''

  mensagens.value.push({
    tipo: 'usuario',
    conteudo: mensagemUsuario,
    timestamp: new Date(),
  })

  await rolarParaBaixo()

  carregando.value = true

  try {
    const respostaIA = await chamarIA(mensagemUsuario)

    mensagens.value.push({
      tipo: 'ia',
      conteudo: respostaIA,
      timestamp: new Date(),
    })

    await rolarParaBaixo()
  } catch (error) {
    console.error('Erro ao chamar IA:', error)
    mensagens.value.push({
      tipo: 'ia',
      conteudo: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
      timestamp: new Date(),
    })
  } finally {
    carregando.value = false
  }
}

function enviarSugestao(sugestao: string) {
  novaMensagem.value = sugestao
  enviarMensagem()
}

function anexarArquivo() {
  fileInput.value?.click()
}

function processarArquivo(event: Event) {
  const target = event.target as HTMLInputElement
  const arquivo = target.files?.[0]

  if (arquivo) {
    novaMensagem.value += `\n[Arquivo anexado: ${arquivo.name}]`
  }
}

function limparConversa() {
  if (confirm('Tem certeza que deseja limpar toda a conversa?')) {
    mensagens.value = []
  }
}

function exportarConversa() {
  const conversa = mensagens.value
    .map((m) => `[${formatarHorario(m.timestamp)}] ${m.tipo.toUpperCase()}: ${m.conteudo}`)
    .join('\n\n')

  const blob = new Blob([conversa], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `conversa-ia-${new Date().toISOString().split('T')[0]}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function formatarMensagem(conteudo: string): string {
  return conteudo
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/•/g, '•')
}

function formatarHorario(timestamp: Date): string {
  return timestamp.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function rolarParaBaixo() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(() => {
  const textarea = document.querySelector('textarea')
  if (textarea) {
    textarea.addEventListener('input', function () {
      this.style.height = 'auto'
      this.style.height = Math.min(this.scrollHeight, 120) + 'px'
    })
  }
})
</script>

<style>
.prose {
  @apply text-current;
}

.prose strong {
  @apply font-semibold text-current;
}

.prose em {
  @apply italic text-current;
}
</style>
