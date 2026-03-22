export function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  if (!text) return 0

  const koreanChars = (text.match(/[가-힣]/g) || []).length
  const nonKorean = text.replace(/[가-힣]/g, ' ').replace(/\s+/g, ' ').trim()
  const englishWords = nonKorean ? nonKorean.split(/\s+/).filter(Boolean).length : 0

  const koreanMinutes = koreanChars / 500
  const englishMinutes = englishWords / 200

  return Math.max(1, Math.round(koreanMinutes + englishMinutes))
}
