import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?worker'
// @ts-ignore
import TurndownService from 'turndown'

// Linka o worker corretamente para Vite/Webpack
pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker()

/**
 * Converte um arquivo PDF em Markdown
 * @param file Arquivo PDF
 * @returns Texto convertido em Markdown
 */
export async function pdfToMarkdown(file: File): Promise<string> {
  console.log('📥 Iniciando leitura do arquivo PDF...')

  const arrayBuffer = await file.arrayBuffer()
  console.log('✅ Buffer carregado')

  let pdf
  try {
    pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    console.log('✅ Documento PDF carregado:', pdf.numPages, 'páginas')
  } catch (error) {
    console.error('❌ Erro ao carregar PDF:', error)
    throw new Error('Falha ao processar o PDF')
  }

  let text = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map(item => (item as any).str).join(' ')
    text += pageText + '\n\n'
  }

  console.log('✅ Texto extraído. Convertendo para Markdown...')

  const turndown = new TurndownService()
  const markdown = turndown.turndown(text)

  console.log('✅ Conversão para Markdown concluída.')

  return markdown
}
