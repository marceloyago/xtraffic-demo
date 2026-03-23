import { DEMO_USER } from './mock-data'

export function login(email: string, password: string): boolean {
  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('xtraffic_demo_user', JSON.stringify(DEMO_USER))
    }
    return true
  }
  return false
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('xtraffic_demo_user')
  }
}

export function getUser() {
  if (typeof window === 'undefined') return null
  const s = localStorage.getItem('xtraffic_demo_user')
  return s ? JSON.parse(s) : null
}

export function isLoggedIn(): boolean {
  return !!getUser()
}
