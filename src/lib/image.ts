/**
 * Redimensiona uma imagem do lado do cliente para no máximo `maxSize` (px),
 * comprimida como JPEG. Mantém proporção. Retorna um Blob.
 *
 * Uso típico: avatar 512x512 antes de subir para Storage, para reduzir banda
 * e custo de storage, sem perder qualidade visível em listagens.
 */
export async function resizeImage(
  file: File,
  maxSize = 512,
  quality = 0.85,
): Promise<Blob> {
  const img = await loadImage(file)
  const { width, height } = scaleToFit(img.width, img.height, maxSize)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D não disponível')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, width, height)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('Falha ao codificar imagem'))),
      'image/jpeg',
      quality,
    )
  })
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Não foi possível ler a imagem'))
    }
    img.src = url
  })
}

function scaleToFit(w: number, h: number, max: number) {
  if (w <= max && h <= max) return { width: w, height: h }
  const ratio = Math.min(max / w, max / h)
  return {
    width: Math.round(w * ratio),
    height: Math.round(h * ratio),
  }
}
