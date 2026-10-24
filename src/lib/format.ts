const DAY_MS = 24 * 60 * 60 * 1000

/** "Heute", "Gestern", "Vor 3 Tagen" or a short date. */
export function formatRelativeDay(isoDate: string) {
  const date = new Date(isoDate)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const startOfDate = new Date(date)
  startOfDate.setHours(0, 0, 0, 0)

  const days = Math.round((startOfToday.getTime() - startOfDate.getTime()) / DAY_MS)
  if (days <= 0) return 'Heute'
  if (days === 1) return 'Gestern'
  if (days < 7) return `Vor ${days} Tagen`
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/** Seconds as "00:14". */
export function formatSeconds(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
