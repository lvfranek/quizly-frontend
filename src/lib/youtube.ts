/** Reads the video id from youtube.com/watch?v=, youtu.be/ and /shorts/ links. */
export function getYouTubeId(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.endsWith('youtu.be')) return parsed.pathname.slice(1) || null
    const fromQuery = parsed.searchParams.get('v')
    if (fromQuery) return fromQuery
    const match = parsed.pathname.match(/^\/(?:shorts|embed)\/([^/]+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

/** Privacy-friendly embed URL (no cookies until the video is played). */
export function getEmbedUrl(url: string) {
  const id = getYouTubeId(url)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}
