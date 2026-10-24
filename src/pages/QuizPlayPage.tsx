import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getQuiz, type Quiz } from '../api/quizzes'
import styles from './QuizPlayPage.module.css'

const LABELS = ['A', 'B', 'C', 'D']
const PASS_PERCENT = 50

type Phase = 'question' | 'result' | 'review'

export function QuizPlayPage() {
  const { id = '' } = useParams()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [phase, setPhase] = useState<Phase>('question')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showCorrect, setShowCorrect] = useState(false)

  useEffect(() => {
    getQuiz(id)
      .then(setQuiz)
      .catch(() => setNotFound(true))
  }, [id])

  const questions = quiz?.questions ?? []
  const question = questions[index]
  const selected = answers[index]
  const isLast = index === questions.length - 1

  function select(option: string) {
    setAnswers((current) => {
      const next = [...current]
      next[index] = option
      return next
    })
  }

  function goNext() {
    if (!selected) return
    if (isLast) setPhase('result')
    else setIndex(index + 1)
  }

  function goBack() {
    if (index > 0) setIndex(index - 1)
  }

  function restart() {
    setAnswers([])
    setIndex(0)
    setShowCorrect(false)
    setPhase('question')
  }

  // Keys 1-4 pick an answer, Enter goes to the next question
  useEffect(() => {
    if (phase !== 'question' || !question) return
    function handleKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
      const option = question.question_options[Number(event.key) - 1]
      if (option) select(option)
      if (event.key === 'Enter' && !(event.target instanceof HTMLButtonElement)) goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  if (notFound) {
    return (
      <section className={styles.center}>
        <h1>Quiz nicht gefunden.</h1>
        <Link to="/library" className="btn btn-primary">
          Zur Bibliothek
        </Link>
      </section>
    )
  }

  if (!quiz || !question) {
    return <div className={styles.loading} aria-busy="true" aria-label="Quiz wird geladen" />
  }

  const correctCount = questions.filter((q, i) => answers[i] === q.answer).length
  const percent = Math.round((correctCount / questions.length) * 1000) / 10

  if (phase === 'result') {
    return (
      <section className={styles.result}>
        <p className={styles.meta}>Quiz abgeschlossen</p>
        <p className={styles.score}>
          {correctCount}
          <span>/{questions.length}</span>
        </p>
        <h1>{percent >= PASS_PERCENT ? 'Stark, das sitzt!' : 'Noch nicht ganz. Versuch es nochmal.'}</h1>
        <p className={styles.muted}>{percent.toLocaleString('de-DE')} % richtig</p>
        <div className={styles.actions}>
          <button type="button" className="btn btn-primary" onClick={() => setPhase('review')}>
            Antworten ansehen
          </button>
          <button type="button" className="btn btn-ghost btn-large" onClick={restart}>
            Nochmal spielen
          </button>
        </div>
      </section>
    )
  }

  if (phase === 'review') {
    return (
      <section className={styles.review}>
        <div className={styles.reviewHead}>
          <div>
            <p className={styles.meta}>{quiz.title}</p>
            <h1>Deine Antworten</h1>
          </div>
          <p className={styles.summary}>
            <span className={styles.right}>{correctCount} richtig</span>
            <span className={styles.wrong}>{questions.length - correctCount} falsch</span>
          </p>
        </div>

        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={showCorrect}
            onChange={(event) => setShowCorrect(event.target.checked)}
          />
          Richtige Lösungen anzeigen
        </label>

        <ol className={styles.reviewList}>
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.answer
            return (
              <li key={q.id} className={styles.reviewItem}>
                <p className={styles.reviewQuestion}>{q.question_title}</p>
                <p className={isCorrect ? styles.right : styles.wrong}>
                  <span className={styles.mark}>{isCorrect ? 'Richtig' : 'Falsch'}</span>
                  {answers[i]}
                </p>
                {showCorrect && !isCorrect && (
                  <p className={styles.right}>
                    <span className={styles.mark}>Lösung</span>
                    {q.answer}
                  </p>
                )}
              </li>
            )
          })}
        </ol>

        <div className={styles.actions}>
          <Link to={`/quiz/${quiz.id}`} className="btn btn-ghost btn-large">
            Zur Quiz-Übersicht
          </Link>
          <button type="button" className="btn btn-primary" onClick={restart}>
            Nochmal spielen
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.player}>
      <div className={styles.top}>
        <span>{quiz.title}</span>
        <span>
          {String(index + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
        </span>
      </div>
      <div
        className={styles.steps}
        role="progressbar"
        aria-label="Fortschritt"
        aria-valuemin={1}
        aria-valuemax={questions.length}
        aria-valuenow={index + 1}
      >
        {questions.map((q, i) => (
          <span key={q.id} className={i <= index ? styles.stepDone : undefined} />
        ))}
      </div>

      <h1 className={styles.question}>{question.question_title}</h1>

      <div className={styles.options}>
        {question.question_options.map((option, i) => (
          <button
            key={option}
            type="button"
            className={option === selected ? `${styles.option} ${styles.selected}` : styles.option}
            aria-pressed={option === selected}
            onClick={() => select(option)}
          >
            <span className={styles.optionLabel}>{LABELS[i]}</span>
            {option}
          </button>
        ))}
      </div>

      <div className={styles.nav}>
        <button type="button" className="btn btn-ghost btn-large" onClick={goBack} disabled={index === 0}>
          Zurück
        </button>
        <span className={styles.hint}>Tasten 1 bis 4 zum Antworten</span>
        <button type="button" className="btn btn-primary" onClick={goNext} disabled={!selected}>
          {isLast ? 'Auswerten' : 'Weiter'}
        </button>
      </div>
    </section>
  )
}
