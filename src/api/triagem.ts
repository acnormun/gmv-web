export interface Processo {
  numeroProcesso: string
  tema: string
  dataDistribuicao: string
  responsavel: string
  status: string
  ultimaAtualizacao: string
}

const API_BASE = 'http://localhost:5000'

export async function getProcessos(): Promise<Processo[]> {
  const res = await fetch(`${API_BASE}/triagem`)
  if (!res.ok) {
    throw new Error('Erro ao buscar processos')
  }
  return await res.json()
}
