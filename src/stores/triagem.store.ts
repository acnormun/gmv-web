// src/stores/useTriagemStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProcessos, type Processo } from '@/api/triagem'

export const useTriagemStore = defineStore('triagem', () => {
  const processos = ref<Processo[]>([])
  const processoSelecionado = ref<Processo | null>(null)

  async function carregarProcessos() {
  const data = await getProcessos().then((result) =>
    result.map((item) => {
      try {
        if (typeof item.suspeitos === 'string') {
          item.suspeitos = JSON.parse(item.suspeitos.replace(/'/g, '"'));
        }
      } catch (e) {
        console.warn('Erro ao parsear suspeitos:', item.suspeitos, e);
        item.suspeitos = []; // fallback seguro
      }
      return item;
    })
  );
  console.log('DATA: ', data);
  processos.value = data;
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
