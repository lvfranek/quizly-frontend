import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { ApiError } from '../api/client'
import { Field } from '../components/Field'
import { hasErrors, validateUsername, type Errors } from '../lib/validation'
import { useToast } from '../toast/ToastContext'
import styles from './Auth.module.css'

type LoginValues = { username: string; password: string }

function validate(values: LoginValues): Errors<LoginValues> {
  return {
    username: validateUsername(values.username),
    password: values.password.trim() ? '' : 'Bitte Passwort eingeben.',
  }
}

export function LoginPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const [values, setValues] = useState<LoginValues>({ username: '', password: '' })
  const [errors, setErrors] = useState<Errors<LoginValues>>({})
  const [pending, setPending] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  function handleBlur(name: keyof LoginValues) {
    setErrors({ ...errors, [name]: validate(values)[name] })
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    setPending(true)
    try {
      await login(values.username.trim(), values.password.trim())
      navigate('/library')
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Keine Verbindung zum Server.'
      showToast('error', `Login fehlgeschlagen: ${message}`)
    } finally {
      setPending(false)
    }
  }

  return (
    <section className={styles.card}>
      <h1>Willkommen zurück.</h1>
      <p className={styles.lead}>Melde dich an, um deine Quizze zu sehen.</p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Field
          id="username"
          name="username"
          label="Benutzername"
          autoComplete="username"
          value={values.username}
          onChange={handleChange}
          onBlur={() => handleBlur('username')}
          error={errors.username}
        />
        <Field
          id="password"
          name="password"
          type="password"
          label="Passwort"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          onBlur={() => handleBlur('password')}
          error={errors.password}
        />
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Anmelden...' : 'Anmelden'}
        </button>
      </form>

      <p className={styles.switch}>
        Noch kein Konto? <Link to="/register">Registrieren</Link>
      </p>
    </section>
  )
}
