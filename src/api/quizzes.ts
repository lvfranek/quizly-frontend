import { apiFetch } from './client'

export type Question = {
  id: number
  question_title: string
  question_options: string[]
  answer: string
}

export type Quiz = {
  id: number
  title: string
  description: string
  created_at: string
  updated_at: string
  video_url: string
  questions: Question[]
}

export function getQuizzes() {
  return apiFetch<Quiz[]>('quizzes/')
}

export function getQuiz(id: number | string) {
  return apiFetch<Quiz>(`quizzes/${id}/`)
}

export function createQuiz(url: string) {
  return apiFetch<Quiz>('quizzes/', { method: 'POST', body: { url } })
}

export function updateQuiz(id: number, changes: Pick<Quiz, 'title' | 'description'>) {
  return apiFetch<Quiz>(`quizzes/${id}/`, { method: 'PATCH', body: changes })
}

export function deleteQuiz(id: number) {
  return apiFetch<null>(`quizzes/${id}/`, { method: 'DELETE' })
}
