import { jwtVerify, SignJWT } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "kahaani-super-secret-jwt-key-2025"
)

export interface AdminPayload {
  id: string
  username: string
  email: string
  role: string
}

export async function verifyAdminTokenEdge(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as AdminPayload
  } catch (error) {
    console.log("Edge JWT verification failed:", error)
    return null
  }
}

export async function signAdminTokenEdge(admin: AdminPayload): Promise<string> {
  return await new SignJWT(admin)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET)
}