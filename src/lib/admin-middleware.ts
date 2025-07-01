import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { verifyAdminToken, AdminPayload } from "./admin-auth"

export async function getAdminFromRequest(): Promise<AdminPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin-token")?.value
    
    if (!token) {
      return null
    }

    const adminPayload = await verifyAdminToken(token)
    return adminPayload
  } catch (error) {
    console.error("Error verifying admin token:", error)
    return null
  }
}

export async function requireAdmin(): Promise<AdminPayload> {
  const admin = await getAdminFromRequest()
  
  if (!admin) {
    throw new Error("Admin authentication required")
  }
  
  return admin
}