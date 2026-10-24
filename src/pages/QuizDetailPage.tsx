import { Link, useParams } from 'react-router-dom'

// Placeholder until the quiz detail page is built in the next step
export function QuizDetailPage() {
  const { id } = useParams()
  return (
    <section>
      <h1 style={{ margin: 0 }}>Quiz {id}</h1>
      <p style={{ color: 'var(--text-muted)' }}>Die Detailseite kommt im nächsten Schritt.</p>
      <Link to="/library">Zur Bibliothek</Link>
    </section>
  )
}
