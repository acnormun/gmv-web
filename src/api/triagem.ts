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

export async function addProcesso(processo: Processo): Promise<void> {
  const res = await fetch(`${API_BASE}/triagem`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(processo)
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao adicionar processo')
  }
}
