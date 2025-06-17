export interface User {
  id: string
  email: string
  name?: string
  username?: string
  image?: string
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  id: string
  sessionToken: string
  userId: string
  expires: Date
  user?: User
}

export interface Account {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string
  access_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  session_state?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  password: string
  name?: string
  username?: string
}