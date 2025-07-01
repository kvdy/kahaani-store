const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function exportData() {
  try {
    console.log('📊 Exporting database data...')
    
    // Export admin users
    const admins = await prisma.admin.findMany()
    console.log(`Found ${admins.length} admin users`)
    
    // Export regular users (if any)
    const users = await prisma.user.findMany()
    console.log(`Found ${users.length} regular users`)
    
    // Export OTP codes (active ones)
    const otpCodes = await prisma.otpCode.findMany({
      where: {
        expiresAt: {
          gt: new Date()
        }
      }
    })
    console.log(`Found ${otpCodes.length} active OTP codes`)
    
    // Create export object
    const exportData = {
      admins,
      users,
      otpCodes,
      exportedAt: new Date().toISOString()
    }
    
    // Write to file
    fs.writeFileSync('database_export.json', JSON.stringify(exportData, null, 2))
    console.log('✅ Data exported to database_export.json')
    
    // Show summary
    console.log('\n📋 Export Summary:')
    console.log(`- Admins: ${admins.length}`)
    console.log(`- Users: ${users.length}`)
    console.log(`- Active OTP codes: ${otpCodes.length}`)
    
  } catch (error) {
    console.error('❌ Export failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportData()