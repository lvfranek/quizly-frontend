import { Link, useParams } from 'react-router-dom'

// Placeholder until the quiz player is built in the next step
export function QuizPlayPage() {
  const { id } = useParams()
  return (
    <section>
      <h1 style={{ margin: 0 }}>Quiz spielen</h1>
      <p style={{ color: 'var(--text-muted)' }}>Kommt im nächsten Schritt.</p>
      <Link to={`/quiz/${id}`}>Zurück</Link>
    </section>
  )
}
