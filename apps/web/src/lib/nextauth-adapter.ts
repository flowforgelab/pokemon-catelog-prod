import { Pool } from 'pg'
import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from 'next-auth/adapters'

// Direct PostgreSQL adapter for NextAuth
// This avoids Prisma deployment issues on Vercel

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export function PostgreSQLAdapter(): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, 'id'>): Promise<AdapterUser> {
      const { rows } = await pool.query(
        `INSERT INTO "User" (email, name, image, "emailVerified") 
         VALUES ($1, $2, $3, $4) 
         RETURNING id, email, name, image, "emailVerified", "createdAt"`,
        [user.email, user.name, user.image, user.emailVerified]
      )
      return rows[0]
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      const { rows } = await pool.query(
        `SELECT id, email, name, image, "emailVerified" FROM "User" WHERE id = $1`,
        [id]
      )
      return rows[0] || null
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const { rows } = await pool.query(
        `SELECT id, email, name, image, "emailVerified" FROM "User" WHERE email = $1`,
        [email]
      )
      return rows[0] || null
    },

    async getUserByAccount({ providerAccountId, provider }: Pick<AdapterAccount, 'provider' | 'providerAccountId'>): Promise<AdapterUser | null> {
      const { rows } = await pool.query(
        `SELECT u.* FROM "User" u
         JOIN "Account" a ON u.id = a."userId"
         WHERE a.provider = $1 AND a."providerAccountId" = $2`,
        [provider, providerAccountId]
      )
      return rows[0] || null
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>): Promise<AdapterUser> {
      const updates = []
      const values = []
      let paramCount = 1

      if (user.name !== undefined) {
        updates.push(`name = $${paramCount++}`)
        values.push(user.name)
      }
      if (user.email !== undefined) {
        updates.push(`email = $${paramCount++}`)
        values.push(user.email)
      }
      if (user.image !== undefined) {
        updates.push(`image = $${paramCount++}`)
        values.push(user.image)
      }
      if (user.emailVerified !== undefined) {
        updates.push(`"emailVerified" = $${paramCount++}`)
        values.push(user.emailVerified)
      }

      values.push(user.id)

      const { rows } = await pool.query(
        `UPDATE "User" SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      )
      return rows[0]
    },

    async linkAccount(account: AdapterAccount): Promise<AdapterAccount | null | undefined> {
      await pool.query(
        `INSERT INTO "Account" 
         ("userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.refresh_token,
          account.access_token,
          account.expires_at,
          account.token_type,
          account.scope,
          account.id_token,
          account.session_state,
        ]
      )
      return account
    },

    async createSession({ sessionToken, userId, expires }: { sessionToken: string; userId: string; expires: Date }): Promise<AdapterSession> {
      const { rows } = await pool.query(
        `INSERT INTO "Session" ("sessionToken", "userId", expires) 
         VALUES ($1, $2, $3) 
         RETURNING id, "sessionToken", "userId", expires`,
        [sessionToken, userId, expires]
      )
      return rows[0]
    },

    async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const { rows } = await pool.query(
        `SELECT s.*, u.* FROM "Session" s
         JOIN "User" u ON s."userId" = u.id
         WHERE s."sessionToken" = $1`,
        [sessionToken]
      )
      
      if (!rows[0]) return null

      const { id, sessionToken: token, userId, expires, ...userData } = rows[0]
      
      return {
        session: { id, sessionToken: token, userId, expires },
        user: { id: userId, ...userData }
      }
    },

    async updateSession({ sessionToken, ...data }: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>): Promise<AdapterSession | null | undefined> {
      const updates = []
      const values = []
      let paramCount = 1

      if (data.expires !== undefined) {
        updates.push(`expires = $${paramCount++}`)
        values.push(data.expires)
      }
      if (data.userId !== undefined) {
        updates.push(`"userId" = $${paramCount++}`)
        values.push(data.userId)
      }

      values.push(sessionToken)

      const { rows } = await pool.query(
        `UPDATE "Session" SET ${updates.join(', ')} WHERE "sessionToken" = $${paramCount} RETURNING *`,
        values
      )
      return rows[0]
    },

    async deleteSession(sessionToken: string): Promise<void> {
      await pool.query(`DELETE FROM "Session" WHERE "sessionToken" = $1`, [sessionToken])
    },

    async createVerificationToken({ identifier, expires, token }: VerificationToken): Promise<VerificationToken | null | undefined> {
      const { rows } = await pool.query(
        `INSERT INTO "VerificationToken" (identifier, expires, token) 
         VALUES ($1, $2, $3) 
         RETURNING identifier, expires, token`,
        [identifier, expires, token]
      )
      return rows[0]
    },

    async useVerificationToken({ identifier, token }: { identifier: string; token: string }): Promise<VerificationToken | null> {
      const { rows } = await pool.query(
        `DELETE FROM "VerificationToken" 
         WHERE identifier = $1 AND token = $2 
         RETURNING identifier, expires, token`,
        [identifier, token]
      )
      return rows[0] || null
    },

    async deleteUser(userId: string): Promise<void> {
      await pool.query(`DELETE FROM "User" WHERE id = $1`, [userId])
    },

    async unlinkAccount({ providerAccountId, provider }: Pick<AdapterAccount, 'provider' | 'providerAccountId'>): Promise<void> {
      await pool.query(
        `DELETE FROM "Account" WHERE provider = $1 AND "providerAccountId" = $2`,
        [provider, providerAccountId]
      )
    },
  }
}