import { NextRequest, NextResponse } from "next/server"
import { authenticateAdmin } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    const result = await authenticateAdmin(username, password)

    if (!result) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    const response = NextResponse.json({
      message: "Login successful",
      admin: {
        id: result.admin.id,
        username: result.admin.username,
        email: result.admin.email,
        name: result.admin.name,
        role: result.admin.role
      }
    })

    response.cookies.set("admin-token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}