const API_URL = 'http://localhost:4000'

export const login = async (username: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }

  const data = await res.json()
  localStorage.setItem('token', data.token)
  localStorage.setItem('username', data.username)
  localStorage.setItem('role', data.role)
  return data
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('role')
  window.location.href = '/login'
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}