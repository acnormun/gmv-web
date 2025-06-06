
export interface ProcessoForm {
  numeroProcesso: string
  tema: string
  dataDistribuicao: string
  responsavel: string
  status: string
  ultimaAtualizacao: string
  comentarios: string
  markdown?: string
}
export interface Processo extends ProcessoForm {
  suspeitos: Array<string | null> | string
}

const API_BASE = 'http://localhost:5000'

export async function getProcessos(): Promise<Processo[]> {
  const res = await fetch(`${API_BASE}/triagem`)
  if (!res.ok) {
    throw new Error('Erro ao buscar processos')
  }
  return await res.json()
}

export async function addProcesso(processo: ProcessoForm): Promise<void> {
  const res = await fetch(`${API_BASE}/triagem/form`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(processo),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao adicionar processo')
  }
}

export async function updateProcesso(
  numeroAntigo: string,
  processoAtualizado: ProcessoForm,
): Promise<void> {
  const res = await fetch(`${API_BASE}/triagem/${numeroAntigo}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(processoAtualizado),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao atualizar processo')
  }
}

export async function deleteProcesso(numero: string): Promise<void> {
  const res = await fetch(`${API_BASE}/triagem/${numero}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Erro ao excluir processo')
  }
}

export async function getProcesso(numero: number | string) {
  const res = await fetch(`${API_BASE}/triagem/${numero}/dat`, {
    method: 'GET',
  })
  const { base64 } = await res.json()

  const blob = await (await fetch(`data:application/pdf;base64,${base64}`)).blob()
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}
