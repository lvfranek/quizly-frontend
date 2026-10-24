// Same rules as the original Quizly frontend

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/

export type Errors<T> = Partial<Record<keyof T, string>>

export function hasErrors<T>(errors: Errors<T>) {
  return Object.values(errors).some(Boolean)
}

export function validateUsername(value: string) {
  return value.trim().length < 3 ? 'Der Name muss mindestens 3 Zeichen haben.' : ''
}

export function validateEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim()) ? '' : 'Bitte eine gültige E-Mail-Adresse eingeben.'
}

export function validateNewPassword(value: string) {
  return PASSWORD_PATTERN.test(value.trim())
    ? ''
    : 'Mindestens 6 Zeichen, je 1 Großbuchstabe, Kleinbuchstabe und Zahl.'
}
