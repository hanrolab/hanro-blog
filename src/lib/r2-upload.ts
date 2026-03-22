export async function uploadImageToR2(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'blog')

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('Upload API error:', res.status, data)
    throw new Error(data.error || `Upload failed (${res.status})`)
  }

  return data.url
}
