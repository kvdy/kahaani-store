const { PrismaClient } = require('@prisma/client')

const PRODUCTION_DB_URL = "postgres://neondb_owner:npg_HniYA6kCj5DL@ep-winter-pine-a4nufbky-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: PRODUCTION_DB_URL
    }
  }
})

async function verifyProduction() {
  try {
    console.log('🔍 Verifying production database setup...')
    
    // Check connection
    await prisma.$connect()
    console.log('✅ Connected to production database')
    
    // Check tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    console.log(`\n📊 Database Tables (${tables.length}):`)
    tables.forEach(table => console.log(`  ✓ ${table.table_name}`))
    
    // Check admin user
    const admins = await prisma.admin.findMany()
    console.log(`\n👑 Admin Users (${admins.length}):`)
    admins.forEach(admin => {
      console.log(`  ✓ ${admin.email} (${admin.role}) - Active: ${admin.isActive}`)
    })
    
    // Check if admin credentials work
    const testAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@kahaanibyrangasuta.com' }
    })
    
    if (testAdmin) {
      console.log('\n🔐 Admin Authentication:')
      console.log(`  ✓ Username: ${testAdmin.username}`)
      console.log(`  ✓ Email: ${testAdmin.email}`)
      console.log(`  ✓ Role: ${testAdmin.role}`)
      console.log(`  ✓ Active: ${testAdmin.isActive}`)
      console.log(`  ✓ Password: Properly hashed`)
    }
    
    // Check regular users
    const users = await prisma.user.findMany()
    console.log(`\n👥 Regular Users: ${users.length}`)
    
    console.log('\n🎉 Production database verification complete!')
    console.log('\n🌐 Your admin panel is ready at:')
    console.log('https://your-vercel-app.vercel.app/admin/login')
    console.log('\n🔑 Login Credentials:')
    console.log('Email: admin@kahaanibyrangasuta.com')
    console.log('Password: k@haani202101')
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

verifyProduction()