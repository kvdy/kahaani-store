import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Set expiration to 5 minutes from now
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    // Delete any existing OTP for this phone
    await prisma.otpCode.deleteMany({
      where: { phone }
    })

    // Create new OTP
    await prisma.otpCode.create({
      data: {
        phone,
        code: otp,
        expiresAt
      }
    })

    // TODO: Send OTP via SMS service (Twilio, etc.)
    console.log(`OTP for ${phone}: ${otp}`) // For development only

    return NextResponse.json({
      message: "OTP sent successfully",
      // Remove this in production
      otp: process.env.NODE_ENV === "development" ? otp : undefined
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    )
  }
}