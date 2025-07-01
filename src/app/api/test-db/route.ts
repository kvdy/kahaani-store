import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface DatabaseInfo {
  db_name: string
  db_version: string
}

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Get database info
    const result = await prisma.$queryRaw`SELECT current_database() as db_name, version() as db_version` as DatabaseInfo[]
    
    // Count admin users
    const adminCount = await prisma.admin.count()
    
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      database: result[0],
      adminUsers: adminCount,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: unknown) {
    console.error("Database test failed:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    return NextResponse.json({
      status: "error",
      message: "Database connection failed",
      error: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
    
  } finally {
    await prisma.$disconnect()
  }
}