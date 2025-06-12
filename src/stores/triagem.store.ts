// src/stores/useTriagemStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProcessos, type Processo } from '@/api/triagem'

export const useTriagemStore = defineStore('triagem', () => {
  const processos = ref<Processo[]>([])
  const processoSelecionado = ref<Processo | null>(null)

  async function carregarProcessos() {
    const data = await getProcessos().then(r => {
      r.forEach(item => {
        if(item.suspeitos === 'nan') item.suspeitos = ''
      })
      return r
    })
    processos.value = data
  }

  function filtrar(filtros: Record<string, any>) {
    return processos.value.filter((proc) => {
      return (
        (!filtros.numeroProcesso || proc.numeroProcesso.includes(filtros.numeroProcesso)) &&
        (!filtros.tema?.length || filtros.tema.includes(proc.tema)) &&
        (!filtros.dataDistribuicao || proc.dataDistribuicao === filtros.dataDistribuicao) &&
        (!filtros.responsavel ||
          proc.responsavel.toLowerCase().includes(filtros.responsavel.toLowerCase())) &&
        (!filtros.status || proc.status === filtros.status) &&
        (!filtros.ultimaAtualizacao || proc.ultimaAtualizacao === filtros.ultimaAtualizacao)
      )
    })
  }

  function selecionarProcesso(processo: Processo) {
    processoSelecionado.value = { ...processo }
  }

  function limparSelecionado() {
    processoSelecionado.value = null
  }

  return {
    processos,
    processoSelecionado,
    carregarProcessos,
    filtrar,
    selecionarProcesso,
    limparSelecionado,
  }
})
