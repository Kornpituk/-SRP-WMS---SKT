// utils/pdfToImages.js

import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString()

export async function pdfToImages(pdfUrl, scale = 2) {
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise
  const imageUrls = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    canvas.height = viewport.height
    canvas.width = viewport.width
    await page.render({ canvasContext: context, viewport }).promise
    imageUrls.push(canvas.toDataURL('image/jpeg'))
  }

  return imageUrls
}
