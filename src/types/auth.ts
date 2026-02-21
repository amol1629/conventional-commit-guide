export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date
  lastActive: Date
}

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  token?: string
  error?: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
