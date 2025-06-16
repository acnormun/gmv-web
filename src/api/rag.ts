// src/api/rag.ts
// API TypeScript para comunicação com o sistema RAG

import { ref, readonly } from 'vue'

// ==========================================
// 🔧 INTERFACES E TIPOS
// ==========================================

export interface RAGQueryRequest {
  query: string
  k?: number
}

export interface RAGSearchRequest {
  query: string
  filters?: {
    tema?: string
    status?: string
    responsavel?: string
    suspeitos?: string
  }
  k?: number
}

export interface RAGChunk {
  chunk_id: number
  content: string
  similarity: number
  metadata: {
    document_id: string
    chunk_id: number
    tema: string
    status: string
    suspeitos: string[]
    data_distribuicao: string
  }
}

export interface RAGResult {
  query: string
  response: string
  retrieved_chunks: RAGChunk[]
  confidence_score: number
  strategy_used: string
  processing_time: number
  filters_applied?: any
  original_query?: string
}

export interface RAGStatus {
  available: boolean
  initialized: boolean
  statistics?: RAGStatistics
  error?: string
}

export interface RAGStatistics {
  total_documents: number
  total_chunks: number
  cache_size: number
  is_initialized: boolean
  status_distribution: Record<string, number>
  tema_distribution: Record<string, number>
  top_suspeitos: Record<string, number>
  system_info?: {
    rag_available: boolean
    rag_initialized: boolean
    paths: {
      triagem: string
      processos: string
      dat: string
    }
  }
}

export interface RAGSuggestion {
  type: 'factual' | 'analytical' | 'opinion' | 'contextual'
  query: string
  category: string
}

export interface RAGSuggestionsResponse {
  suggestions: RAGSuggestion[]
  total_suggestions: number
  based_on_data: {
    total_documents: number
    unique_themes: number
    unique_status: number
  }
}

export interface RAGHealthStatus {
  status: 'healthy' | 'unhealthy' | 'error'
  rag_available: boolean
  rag_initialized: boolean
  timestamp: string
  documents_loaded?: number
  chunks_processed?: number
  cache_size?: number
  error?: string
}

export interface ProcessAnalysis {
  processo: string
  analise: RAGResult
  timestamp: string
}

export interface DashboardInsights {
  insights: Array<{
    question: string
    insight: string
    confidence: number
    strategy: string
  }>
  statistics: RAGStatistics
  rag_available: boolean
  generated_at: string
}

// ==========================================
// 🌐 CONFIGURAÇÃO DA API
// ==========================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export class RAGAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message)
    this.name = 'RAGAPIError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
    throw new RAGAPIError(
      errorData.error || `Erro HTTP ${response.status}`,
      response.status,
      errorData
    )
  }
  return response.json()
}

// ==========================================
// 🎯 FUNÇÕES DA API RAG
// ==========================================

/**
 * Verifica o status do sistema RAG
 */
export async function getRAGStatus(): Promise<RAGStatus> {
  const response = await fetch(`${API_BASE}/rag/status`)
  return handleResponse<RAGStatus>(response)
}

/**
 * Executa uma consulta básica no RAG
 */
export async function queryRAG(request: RAGQueryRequest): Promise<RAGResult> {
  const response = await fetch(`${API_BASE}/rag/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  })
  return handleResponse<RAGResult>(response)
}

/**
 * Executa uma busca avançada com filtros
 */
export async function searchRAG(request: RAGSearchRequest): Promise<RAGResult> {
  const response = await fetch(`${API_BASE}/rag/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  })
  return handleResponse<RAGResult>(response)
}

/**
 * Obtém estatísticas detalhadas do sistema RAG
 */
export async function getRAGStatistics(): Promise<RAGStatistics> {
  const response = await fetch(`${API_BASE}/rag/statistics`)
  return handleResponse<RAGStatistics>(response)
}

/**
 * Obtém sugestões de consultas
 */
export async function getRAGSuggestions(): Promise<RAGSuggestionsResponse> {
  const response = await fetch(`${API_BASE}/rag/suggestions`)
  return handleResponse<RAGSuggestionsResponse>(response)
}

/**
 * Reinicializa o sistema RAG
 */
export async function reinitializeRAG(): Promise<{ success: boolean; message: string; statistics?: RAGStatistics }> {
  const response = await fetch(`${API_BASE}/rag/reinitialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return handleResponse(response)
}

/**
 * Verifica a saúde do sistema RAG
 */
export async function getRAGHealth(): Promise<RAGHealthStatus> {
  const response = await fetch(`${API_BASE}/rag/health`)
  return handleResponse<RAGHealthStatus>(response)
}

/**
 * Analisa um processo específico usando RAG
 */
export async function analyzeProcess(numeroProcesso: string): Promise<ProcessAnalysis> {
  const response = await fetch(`${API_BASE}/triagem/${numeroProcesso}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return handleResponse<ProcessAnalysis>(response)
}

/**
 * Obtém insights para o dashboard
 */
export async function getDashboardInsights(): Promise<DashboardInsights> {
  const response = await fetch(`${API_BASE}/dashboard/insights`)
  return handleResponse<DashboardInsights>(response)
}

// ==========================================
// 🔧 FUNÇÕES UTILITÁRIAS
// ==========================================

/**
 * Formata a confiança como porcentagem
 */
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`
}

/**
 * Formata o tempo de processamento
 */
export function formatProcessingTime(time: number): string {
  if (time < 1) {
    return `${(time * 1000).toFixed(0)}ms`
  }
  return `${time.toFixed(2)}s`
}

/**
 * Obtém a cor da estratégia para UI
 */
export function getStrategyColor(strategy: string): string {
  const colors = {
    factual: 'blue',
    analytical: 'green',
    contextual: 'purple',
    opinion: 'orange',
    default: 'gray'
  }
  return colors[strategy as keyof typeof colors] || colors.default
}

/**
 * Obtém a descrição da estratégia
 */
export function getStrategyDescription(strategy: string): string {
  const descriptions = {
    factual: 'Busca informações específicas e objetivas',
    analytical: 'Realiza análises comparativas e estatísticas',
    contextual: 'Considera contexto e metadados relevantes',
    opinion: 'Identifica padrões e tendências',
    default: 'Estratégia não identificada'
  }
  return descriptions[strategy as keyof typeof descriptions] || descriptions.default
}

/**
 * Valida se uma consulta é válida
 */
export function validateQuery(query: string): { valid: boolean; error?: string } {
  if (!query || query.trim().length === 0) {
    return { valid: false, error: 'Consulta não pode estar vazia' }
  }
  
  if (query.trim().length < 3) {
    return { valid: false, error: 'Consulta deve ter pelo menos 3 caracteres' }
  }
  
  if (query.length > 1000) {
    return { valid: false, error: 'Consulta muito longa (máximo 1000 caracteres)' }
  }
  
  return { valid: true }
}

/**
 * Cria uma consulta formatada com filtros
 */
export function buildFilteredQuery(baseQuery: string, filters: RAGSearchRequest['filters']): string {
  if (!filters) return baseQuery
  
  const filterParts: string[] = []
  
  if (filters.tema) {
    filterParts.push(`tema: ${filters.tema}`)
  }
  
  if (filters.status) {
    filterParts.push(`status: ${filters.status}`)
  }
  
  if (filters.responsavel) {
    filterParts.push(`responsável: ${filters.responsavel}`)
  }
  
  if (filters.suspeitos) {
    filterParts.push(`suspeitos: ${filters.suspeitos}`)
  }
  
  if (filterParts.length === 0) return baseQuery
  
  return `${baseQuery} considerando ${filterParts.join(', ')}`
}

/**
 * Extrai palavras-chave de uma consulta
 */
export function extractKeywords(query: string): string[] {
  // Remove pontuação e converte para minúsculas
  const cleaned = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Remove palavras muito comuns
  const stopWords = new Set([
    'a', 'o', 'e', 'de', 'da', 'do', 'em', 'para', 'com', 'que', 'por',
    'qual', 'quais', 'como', 'quando', 'onde', 'porque', 'se', 'mais',
    'menos', 'muito', 'pouco', 'sobre', 'entre', 'sem', 'mas', 'ou'
  ])
  
  return cleaned
    .split(' ')
    .filter(word => word.length > 2 && !stopWords.has(word))
    .slice(0, 10) // Máximo 10 palavras-chave
}

/**
 * Sugere consultas relacionadas baseadas em palavras-chave
 */
export function suggestRelatedQueries(keywords: string[]): string[] {
  const templates = [
    'Quais processos envolvem {keyword}?',
    'Analise os casos relacionados a {keyword}',
    'Mostre estatísticas sobre {keyword}',
    'Compare processos com {keyword}',
    'Identifique padrões em {keyword}'
  ]
  
  const suggestions: string[] = []
  
  keywords.slice(0, 3).forEach(keyword => {
    const template = templates[Math.floor(Math.random() * templates.length)]
    suggestions.push(template.replace('{keyword}', keyword))
  })
  
  return suggestions
}

// ==========================================
// 🎯 HOOK COMPOSABLE PARA VUE
// ==========================================

/**
 * Composable para usar o RAG no Vue
 */
export function useRAG() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const status = ref<RAGStatus | null>(null)
  const statistics = ref<RAGStatistics | null>(null)
  
  const checkStatus = async () => {
    try {
      isLoading.value = true
      error.value = null
      status.value = await getRAGStatus()
      
      if (status.value.statistics) {
        statistics.value = status.value.statistics
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro desconhecido'
    } finally {
      isLoading.value = false
    }
  }
  
  const query = async (queryRequest: RAGQueryRequest): Promise<RAGResult | null> => {
    try {
      isLoading.value = true
      error.value = null
      
      const validation = validateQuery(queryRequest.query)
      if (!validation.valid) {
        throw new Error(validation.error)
      }
      
      return await queryRAG(queryRequest)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro na consulta'
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  const search = async (searchRequest: RAGSearchRequest): Promise<RAGResult | null> => {
    try {
      isLoading.value = true
      error.value = null
      
      const validation = validateQuery(searchRequest.query)
      if (!validation.valid) {
        throw new Error(validation.error)
      }
      
      return await searchRAG(searchRequest)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro na busca'
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    status: readonly(status),
    statistics: readonly(statistics),
    checkStatus,
    query,
    search
  }
}

// ==========================================
// 🔄 EXPORT DEFAULT
// ==========================================

export default {
  // API Functions
  getRAGStatus,
  queryRAG,
  searchRAG,
  getRAGStatistics,
  getRAGSuggestions,
  reinitializeRAG,
  getRAGHealth,
  analyzeProcess,
  getDashboardInsights,
  
  // Utility Functions
  formatConfidence,
  formatProcessingTime,
  getStrategyColor,
  getStrategyDescription,
  validateQuery,
  buildFilteredQuery,
  extractKeywords,
  suggestRelatedQueries,
  
  // Vue Composable
  useRAG,
  
  // Error Class
  RAGAPIError
}