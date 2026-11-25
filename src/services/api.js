const API_BASE = import.meta.env.VITE_API_URL || '/api'

export class ApiError extends Error {
  constructor(message, status, details = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

function buildQuery(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.append(key, String(value))
  })
  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  let response

  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      signal,
      headers: isFormData || body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? body : body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('Server bilan bog‘lanib bo‘lmadi. Keyinroq urinib ko‘ring.', 0)
  }

  let payload
  try {
    payload = await response.json()
  } catch {
    throw new ApiError('Serverdan noto‘g‘ri javob olindi.', response.status)
  }

  if (!response.ok || payload.success === false) {
    throw new ApiError(
      payload.error?.message || 'Amalni bajarishda xatolik yuz berdi.',
      response.status,
      payload.error?.details || [],
    )
  }

  return payload.data
}

export const api = {
  employees: {
    list: (params) => request(`/employees${buildQuery(params)}`),
    get: (id) => request(`/employees/${id}`),
    create: (data) => request('/employees', { method: 'POST', body: data }),
    update: (id, data) => request(`/employees/${id}`, { method: 'PUT', body: data }),
    updateStatus: (id, status) => request(`/employees/${id}/status`, { method: 'PATCH', body: { status } }),
    remove: (id) => request(`/employees/${id}`, { method: 'DELETE' }),
  },
  departments: {
    list: (params) => request(`/departments${buildQuery(params)}`),
    get: (id) => request(`/departments/${id}`),
    create: (data) => request('/departments', { method: 'POST', body: data }),
    update: (id, data) => request(`/departments/${id}`, { method: 'PUT', body: data }),
    remove: (id) => request(`/departments/${id}`, { method: 'DELETE' }),
  },
  positions: {
    list: (params) => request(`/positions${buildQuery(params)}`),
    get: (id) => request(`/positions/${id}`),
    create: (data) => request('/positions', { method: 'POST', body: data }),
    update: (id, data) => request(`/positions/${id}`, { method: 'PUT', body: data }),
    remove: (id) => request(`/positions/${id}`, { method: 'DELETE' }),
  },
  statistics: {
    get: (signal) => request('/statistics', { signal }),
  },
  health: {
    check: () => request('/health'),
  },
}
