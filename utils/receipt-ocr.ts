'use client'

/**
 * Browser-based OCR using Tesseract.js.
 *
 * Tesseract downloads ~10 MB of worker + language data on first use, then
 * caches it in the browser (IndexedDB). After the first download the feature
 * works fully offline — no additional requests are made.
 */

export async function extractTextFromImage(
  imageFile: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Dynamic import keeps Tesseract out of the main bundle (SSR-safe)
  const { createWorker } = await import('tesseract.js')

  const worker = await createWorker('eng', 1, {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100))
      }
    },
  })

  try {
    const {
      data: { text },
    } = await worker.recognize(imageFile)
    return text
  } finally {
    await worker.terminate()
  }
}
