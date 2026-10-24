import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../api/client'
import { createQuiz, deleteQuiz, getQuizzes, type Quiz } from '../api/quizzes'
import { formatRelativeDay, formatSeconds } from '../lib/format'
import { useToast } from '../toast/ToastContext'
import styles from './LibraryPage.module.css'

const EXPECTED_SECONDS = 30

function getCreateErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return 'Keine Verbindung zum Server.'
  if (error.status === 400) return 'Der Link ist ungültig oder das Video konnte nicht geladen werden.'
  return 'Die KI konnte gerade kein Quiz erstellen. Bitte versuch es noch einmal.'
}

export function LibraryPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null)
  const [url, setUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [creating, setCreating] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    getQuizzes()
      .then(setQuizzes)
      .catch(() => {
        setQuizzes([])
        showToast('error', 'Deine Quizze konnten nicht geladen werden.')
      })
  }, [showToast])

  useEffect(() => {
    if (!creating) return
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [creating])

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    const trimmed = url.trim()
    if (!URL.canParse(trimmed)) {
      setUrlError('Bitte einen vollständigen YouTube-Link einfügen.')
      return
    }

    setUrlError('')
    setElapsed(0)
    setCreating(true)
    try {
      const quiz = await createQuiz(trimmed)
      setUrl('')
      navigate(`/quiz/${quiz.id}`)
    } catch (error) {
      showToast('error', getCreateErrorMessage(error))
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(quiz: Quiz) {
    if (!window.confirm(`„${quiz.title}“ wirklich löschen?`)) return
    try {
      await deleteQuiz(quiz.id)
      setQuizzes((current) => current?.filter((q) => q.id !== quiz.id) ?? null)
      showToast('success', 'Quiz gelöscht.')
    } catch {
      showToast('error', 'Löschen hat nicht geklappt.')
    }
  }

  return (
    <>
      <section className={styles.hero}>
        <h1>Video rein. Quiz raus.</h1>
        <p className={styles.lead}>Füge einen YouTube-Link ein. Die KI schreibt 10 Fragen.</p>

        <form className={styles.create} onSubmit={handleCreate} noValidate>
          <label htmlFor="url" className={styles.srOnly}>
            YouTube-Link
          </label>
          <input
            id="url"
            type="url"
            placeholder="youtube.com/watch?v=..."
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={creating}
            aria-invalid={Boolean(urlError)}
            aria-describedby={urlError ? 'url-error' : undefined}
          />
          <button type="submit" className="btn btn-primary" disabled={creating}>
            {creating ? 'Läuft...' : 'Generieren'}
          </button>
        </form>
        {urlError && (
          <p id="url-error" className={styles.error}>
            {urlError}
          </p>
        )}
      </section>

      <section className={styles.library} aria-labelledby="library-title">
        <h2 id="library-title">Deine Quizze</h2>

        {quizzes === null ? (
          <div className={styles.grid} aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`${styles.card} ${styles.skeleton}`} />
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {creating && (
              <div className={`${styles.card} ${styles.generating}`} role="status">
                <span>Quiz wird generiert...</span>
                <div className={styles.progress}>
                  <span style={{ width: `${Math.min(elapsed / EXPECTED_SECONDS, 0.95) * 100}%` }} />
                </div>
                <small>
                  {formatSeconds(elapsed)} / ~{formatSeconds(EXPECTED_SECONDS)}
                </small>
              </div>
            )}

            {quizzes.map((quiz) => (
              <article key={quiz.id} className={styles.card}>
                <Link to={`/quiz/${quiz.id}`} className={styles.cardLink}>
                  {quiz.title}
                </Link>
                <div className={styles.cardFooter}>
                  <small>
                    {quiz.questions.length} Fragen · {formatRelativeDay(quiz.created_at)}
                  </small>
                  <button
                    type="button"
                    className={styles.delete}
                    onClick={() => handleDelete(quiz)}
                    aria-label={`${quiz.title} löschen`}
                  >
                    Löschen
                  </button>
                </div>
              </article>
            ))}

            {quizzes.length === 0 && !creating && (
              <p className={styles.empty}>Noch keine Quizze. Füge oben deinen ersten YouTube-Link ein.</p>
            )}
          </div>
        )}
      </section>
    </>
  )
}
