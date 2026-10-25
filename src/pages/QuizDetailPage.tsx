import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getQuiz, updateQuiz, type Quiz } from '../api/quizzes'
import { formatRelativeDay } from '../lib/format'
import { getEmbedUrl } from '../lib/youtube'
import styles from './QuizDetailPage.module.css'

const SAVE_DELAY_MS = 1000

type Draft = Pick<Quiz, 'title' | 'description'>
type SaveStatus = 'idle' | 'typing' | 'saving' | 'saved' | 'error' | 'empty'

const STATUS_TEXT: Record<SaveStatus, string> = {
  idle: '',
  typing: 'Ungespeichert',
  saving: 'Speichert...',
  saved: 'Gespeichert',
  error: 'Speichern fehlgeschlagen',
  empty: 'Titel darf nicht leer sein',
}

export function QuizDetailPage() {
  const { id = '' } = useParams()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [draft, setDraft] = useState<Draft>({ title: '', description: '' })
  const [status, setStatus] = useState<SaveStatus>('idle')
  const edited = useRef(false)
  const titleRef = useRef<HTMLTextAreaElement>(null)

  // The title wraps onto several lines, so the field grows with its text
  useLayoutEffect(() => {
    const field = titleRef.current
    if (!field) return
    field.style.height = 'auto'
    field.style.height = `${field.scrollHeight}px`
  }, [draft.title, quiz])

  useEffect(() => {
    edited.current = false
    getQuiz(id)
      .then((data) => {
        setQuiz(data)
        setDraft({ title: data.title, description: data.description })
      })
      .catch(() => setNotFound(true))
  }, [id])

  // Autosave one second after the last keystroke, like the original app
  useEffect(() => {
    if (!quiz || !edited.current || !draft.title.trim()) return
    const timer = setTimeout(async () => {
      setStatus('saving')
      try {
        await updateQuiz(quiz.id, { title: draft.title.trim(), description: draft.description })
        setStatus('saved')
      } catch {
        setStatus('error')
      }
    }, SAVE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [draft, quiz])

  function handleChange(field: keyof Draft, value: string) {
    const next = { ...draft, [field]: value }
    edited.current = true
    setStatus(next.title.trim() ? 'typing' : 'empty')
    setDraft(next)
  }

  if (notFound) {
    return (
      <section className={styles.message}>
        <h1>Quiz nicht gefunden.</h1>
        <p>Vielleicht wurde es gelöscht.</p>
        <Link to="/library" className="btn btn-primary">
          Zur Bibliothek
        </Link>
      </section>
    )
  }

  if (!quiz) {
    return <div className={styles.loading} aria-busy="true" aria-label="Quiz wird geladen" />
  }

  const embedUrl = getEmbedUrl(quiz.video_url)

  return (
    <>
      <Link to="/library" className={styles.back}>
        ← Bibliothek
      </Link>

      <div className={styles.layout}>
        <section className={styles.info}>
          <p className={styles.meta}>
            {quiz.questions.length} Fragen · {formatRelativeDay(quiz.created_at)}
          </p>

          <label htmlFor="title" className={styles.label}>
            Titel
          </label>
          <textarea
            id="title"
            ref={titleRef}
            rows={1}
            className={styles.title}
            value={draft.title}
            onChange={(event) => handleChange('title', event.target.value.replace(/\n/g, ' '))}
            aria-invalid={status === 'empty'}
          />

          <label htmlFor="description" className={styles.label}>
            Beschreibung
          </label>
          <textarea
            id="description"
            className={styles.description}
            rows={6}
            value={draft.description}
            onChange={(event) => handleChange('description', event.target.value)}
          />

          <div className={styles.actions}>
            <Link to={`/quiz/${quiz.id}/play`} className="btn btn-primary">
              Quiz starten
            </Link>
            <span
              className={status === 'error' || status === 'empty' ? styles.statusError : styles.status}
              role="status"
            >
              {STATUS_TEXT[status]}
            </span>
          </div>
        </section>

        <section className={styles.video}>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`YouTube-Video: ${quiz.title}`}
              allow="encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <p>Video nicht verfügbar.</p>
          )}
        </section>
      </div>
    </>
  )
}
