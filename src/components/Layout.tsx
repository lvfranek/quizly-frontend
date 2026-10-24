import { Link, Outlet, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { useToast } from '../toast/ToastContext'
import styles from './Layout.module.css'

/** Page frame with header and footer. `loggedIn` shows the logout button. */
export function Layout({ loggedIn = false }: { loggedIn?: boolean }) {
  const navigate = useNavigate()
  const showToast = useToast()

  async function handleLogout() {
    try {
      await logout()
      showToast('success', 'Du bist abgemeldet.')
    } catch {
      showToast('error', 'Abmelden hat nicht geklappt.')
    }
    navigate('/login')
  }

  return (
    <>
      <header className={styles.header}>
        <Link to={loggedIn ? '/library' : '/login'} className={styles.logo}>
          quizly<em>.</em>
        </Link>
        {loggedIn && (
          <button type="button" className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <nav className={styles.legal}>
          <Link to="/legal-notice">Impressum</Link>
          <Link to="/privacy">Datenschutz</Link>
        </nav>
        <span>Entwickelt im Rahmen des Weiterbildungsprogramms der Developer Akademie GmbH.</span>
      </footer>
    </>
  )
}
