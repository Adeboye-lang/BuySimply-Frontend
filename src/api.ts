const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface LoginCredentials {
  email: string
  password: string
}

interface LoginResponse {
  access_token: string
  user: {
    id: number
    name: string
    email: string
    role: string
  }
}

export const apiClient = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    return response.json()
  },

  logout: async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  },

  getLoans: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/loans`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch loans')
    }

    return response.json()
  },
}
