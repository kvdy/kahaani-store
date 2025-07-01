const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const bcrypt = require('bcryptjs')

// Production database URL from environment
const PRODUCTION_DB_URL = process.env.PRODUCTION_DATABASE_URL || process.env.DATABASE_URL

if (!PRODUCTION_DB_URL) {
  console.error('❌ Please set PRODUCTION_DATABASE_URL environment variable')
  console.log('\nUsage:')
  console.log('PRODUCTION_DATABASE_URL="your-vercel-db-url" node scripts/migrate-to-production.js')
  process.exit(1)
}

// Create Prisma client for production
const prodPrisma = new PrismaClient({
  datasources: {
    db: {
      url: PRODUCTION_DB_URL
    }
  }
})

async function migrateToProduction() {
  try {
    console.log('🚀 Starting database migration to production...')
    console.log('Production DB:', PRODUCTION_DB_URL.replace(/\/\/.*@/, '//***:***@'))
    
    // Connect to production database
    await prodPrisma.$connect()
    console.log('✅ Connected to production database')
    
    // Read exported data
    if (!fs.existsSync('database_export.json')) {
      console.error('❌ database_export.json not found. Run export-data.js first.')
      return
    }
    
    const exportData = JSON.parse(fs.readFileSync('database_export.json', 'utf8'))
    console.log('📁 Loaded export data from:', exportData.exportedAt)
    
    // Migrate Admins
    console.log('\n👑 Migrating admin users...')
    for (const admin of exportData.admins) {
      try {
        const existingAdmin = await prodPrisma.admin.findUnique({
          where: { email: admin.email }
        })
        
        if (existingAdmin) {
          console.log(`⚠️  Admin ${admin.email} already exists, skipping`)
        } else {
          await prodPrisma.admin.create({
            data: {
              username: admin.username,
              email: admin.email,
              password: admin.password, // Already hashed
              name: admin.name,
              role: admin.role,
              isActive: admin.isActive
            }
          })
          console.log(`✅ Created admin: ${admin.email}`)
        }
      } catch (error) {
        console.error(`❌ Failed to create admin ${admin.email}:`, error.message)
      }
    }
    
    // Migrate Regular Users (if any)
    if (exportData.users.length > 0) {
      console.log('\n👥 Migrating regular users...')
      for (const user of exportData.users) {
        try {
          const existingUser = await prodPrisma.user.findFirst({
            where: {
              OR: [
                { email: user.email },
                { phone: user.phone }
              ]
            }
          })
          
          if (existingUser) {
            console.log(`⚠️  User ${user.email || user.phone} already exists, skipping`)
          } else {
            await prodPrisma.user.create({
              data: {
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                image: user.image,
                phone: user.phone,
                role: user.role,
                isActive: user.isActive
              }
            })
            console.log(`✅ Created user: ${user.email || user.phone}`)
          }
        } catch (error) {
          console.error(`❌ Failed to create user:`, error.message)
        }
      }
    }
    
    // Verify migration
    console.log('\n🔍 Verifying migration...')
    const prodAdmins = await prodPrisma.admin.findMany()
    const prodUsers = await prodPrisma.user.findMany()
    
    console.log(`✅ Production database now has:`)
    console.log(`   - ${prodAdmins.length} admin users`)
    console.log(`   - ${prodUsers.length} regular users`)
    
    // Test admin login
    const testAdmin = await prodPrisma.admin.findUnique({
      where: { email: 'admin@kahaanibyrangasuta.com' }
    })
    
    if (testAdmin) {
      const passwordMatch = await bcrypt.compare('k@haani202101', testAdmin.password)
      console.log(`🔐 Admin login test: ${passwordMatch ? '✅ PASS' : '❌ FAIL'}`)
    }
    
    console.log('\n🎉 Migration completed successfully!')
    console.log('\n🌐 Your production app should now be fully functional at:')
    console.log('https://your-app-name.vercel.app/admin/login')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await prodPrisma.$disconnect()
  }
}

migrateToProduction()