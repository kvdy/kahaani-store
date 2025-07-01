import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

const JWT_SECRET = process.env.JWT_SECRET || "kahaani-super-secret-jwt-key-2025"

export interface AdminPayload {
  id: string
  username: string
  email: string
  role: string
}

export async function signAdminToken(admin: AdminPayload): Promise<string> {
  return jwt.sign(admin, JWT_SECRET, { expiresIn: "24h" })
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminPayload
    return decoded
  } catch (error: any) {
    return null
  }
}

export async function authenticateAdmin(username: string, password: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username, isActive: true }
    })

    if (!admin) {
      return null
    }

    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) {
      return null
    }

    const token = await signAdminToken({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    })

    return { admin, token }
  } catch (error) {
    console.error("Admin authentication error:", error)
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}