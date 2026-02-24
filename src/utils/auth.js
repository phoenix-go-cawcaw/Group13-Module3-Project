const AUTH_KEY = 'group13-authenticated'

export function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === 'true'
}

export function setAuthenticated() {
  localStorage.setItem(AUTH_KEY, 'true')
}

export function clearAuthenticated() {
  localStorage.removeItem(AUTH_KEY)
}
