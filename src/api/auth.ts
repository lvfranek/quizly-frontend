import { request } from './client'

export type User = {
  id: number
  username: string
  email: string
}

export type RegisterData = {
  username: string
  email: string
  password: string
  confirmed_password: string
}

export function login(username: string, password: string) {
  return request<{ detail: string; user: User }>('login/', {
    method: 'POST',
    body: { username, password },
  })
}

export function register(data: RegisterData) {
  return request<{ detail: string }>('register/', { method: 'POST', body: data })
}

export function logout() {
  return request<{ detail: string }>('logout/', { method: 'POST' })
}
