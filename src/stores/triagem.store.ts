// src/stores/useTriagemStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProcessos, type Processo } from '@/api/triagem'

export const useTriagemStore = defineStore('triagem', () => {
  const processos = ref<Processo[]>([])

  async function carregarProcessos() {
    const data = await getProcessos()
    processos.value = data
  }

  function filtrar(filtros: Record<string, string>) {
    return processos.value.filter(proc => {
      return (
        (!filtros.numeroProcesso || proc.numeroProcesso.includes(filtros.numeroProcesso)) &&
        (!filtros.tema || proc.tema.toLowerCase().includes(filtros.tema.toLowerCase())) &&
        (!filtros.dataDistribuicao || proc.dataDistribuicao === filtros.dataDistribuicao) &&
        (!filtros.responsavel || proc.responsavel.toLowerCase().includes(filtros.responsavel.toLowerCase())) &&
        (!filtros.status || proc.status === filtros.status) &&
        (!filtros.ultimaAtualizacao || proc.ultimaAtualizacao === filtros.ultimaAtualizacao)
      )
    })
  }

  return { processos, carregarProcessos, filtrar }
})
