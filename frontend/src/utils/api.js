import { getToken, removeToken } from './auth'

export async function authFetch(url, options = {}) {
  const token = getToken()

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 401) {
    removeToken()
    window.location.href = '/login'
    return null
  }

  return response
}