import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import { ApiError } from '../api/client'
import { Field } from '../components/Field'
import {
  hasErrors,
  validateEmail,
  validateNewPassword,
  validateUsername,
  type Errors,
} from '../lib/validation'
import { useToast } from '../toast/ToastContext'
import styles from './Auth.module.css'

type RegisterValues = {
  username: string
  email: string
  password: string
  confirmed_password: string
  terms: boolean
}

const EMPTY: RegisterValues = {
  username: '',
  email: '',
  password: '',
  confirmed_password: '',
  terms: false,
}

function validate(values: RegisterValues): Errors<RegisterValues> {
  return {
    username: validateUsername(values.username),
    email: validateEmail(values.email),
    password: validateNewPassword(values.password),
    confirmed_password:
      values.confirmed_password.trim() === values.password.trim()
        ? ''
        : 'Die Passwörter stimmen nicht überein.',
    terms: values.terms ? '' : 'Bitte akzeptiere die Datenschutzerklärung.',
  }
}

/** Turns the backend's field errors ({"username": ["..."]}) into one message per field. */
function toFieldErrors(data: unknown): Errors<RegisterValues> {
  if (!data || typeof data !== 'object') return {}
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, Array.isArray(value) ? value.join(' ') : String(value)]),
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const showToast = useToast()
  const [values, setValues] = useState<RegisterValues>(EMPTY)
  const [errors, setErrors] = useState<Errors<RegisterValues>>({})
  const [pending, setPending] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, type, checked, value } = event.target
    const next = { ...values, [name]: type === 'checkbox' ? checked : value }
    setValues(next)
    if (type === 'checkbox') setErrors({ ...errors, terms: validate(next).terms })
  }

  function handleBlur(name: keyof RegisterValues) {
    setErrors({ ...errors, [name]: validate(values)[name] })
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return

    setPending(true)
    try {
      await register({
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password.trim(),
        confirmed_password: values.confirmed_password.trim(),
      })
      showToast('success', 'Konto erstellt. Du kannst dich jetzt anmelden.')
      navigate('/login')
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        setErrors(toFieldErrors(error.data))
        showToast('error', 'Bitte prüfe deine Eingaben.')
      } else {
        showToast('error', 'Registrierung fehlgeschlagen. Bitte später erneut versuchen.')
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <section className={styles.card}>
      <h1>Konto erstellen.</h1>
      <p className={styles.lead}>Danach machst du aus jedem YouTube-Video ein Quiz.</p>

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
          id="email"
          name="email"
          type="email"
          label="E-Mail"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={() => handleBlur('email')}
          error={errors.email}
        />
        <Field
          id="password"
          name="password"
          type="password"
          label="Passwort"
          autoComplete="new-password"
          value={values.password}
          onChange={handleChange}
          onBlur={() => handleBlur('password')}
          error={errors.password}
        />
        <Field
          id="confirmed_password"
          name="confirmed_password"
          type="password"
          label="Passwort wiederholen"
          autoComplete="new-password"
          value={values.confirmed_password}
          onChange={handleChange}
          onBlur={() => handleBlur('confirmed_password')}
          error={errors.confirmed_password}
        />

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            name="terms"
            checked={values.terms}
            onChange={handleChange}
            aria-invalid={Boolean(errors.terms)}
          />
          <span>
            Ich habe die <Link to="/privacy">Datenschutzerklärung</Link> gelesen.
          </span>
        </label>
        {errors.terms && <p className={styles.checkboxError}>{errors.terms}</p>}

        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Wird erstellt...' : 'Registrieren'}
        </button>
      </form>

      <p className={styles.switch}>
        Schon ein Konto? <Link to="/login">Anmelden</Link>
      </p>
    </section>
  )
}
