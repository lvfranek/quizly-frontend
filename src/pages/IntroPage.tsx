import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RobotLogo } from '../components/RobotLogo'
import styles from './IntroPage.module.css'

const GREETING = 'Hey, willkommen bei Quizly! Mach aus jedem YouTube-Video ein Quiz.'
const WINK_MS = 2000
const TYPE_MS = 40

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Start page: the robot winks, then types a greeting, then the buttons appear. */
export function IntroPage() {
  const [reduced] = useState(prefersReducedMotion)
  const [talking, setTalking] = useState(reduced)
  const [typed, setTyped] = useState(reduced ? GREETING.length : 0)
  const done = typed >= GREETING.length

  useEffect(() => {
    if (reduced) return
    const timer = setTimeout(() => setTalking(true), WINK_MS)
    return () => clearTimeout(timer)
  }, [reduced])

  useEffect(() => {
    if (!talking || done) return
    const timer = setTimeout(() => setTyped((n) => n + 1), TYPE_MS)
    return () => clearTimeout(timer)
  }, [talking, done, typed])

  return (
    <section className={styles.intro}>
      <h1 className={styles.srOnly}>{GREETING}</h1>
      <p className={styles.bubble} data-visible={talking} aria-hidden="true">
        {GREETING.slice(0, typed)}
      </p>

      <RobotLogo size={160} animated />

      <div className={styles.actions} data-visible={done}>
        <Link to="/login" className="btn btn-primary">
          Anmelden
        </Link>
        <Link to="/register" className="btn btn-ghost btn-large">
          Registrieren
        </Link>
      </div>
    </section>
  )
}
