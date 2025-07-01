const { PrismaClient } = require('@prisma/client')

// Use production database URL
const PRODUCTION_DB_URL = process.env.PRODUCTION_DATABASE_URL || process.env.DATABASE_URL

if (!PRODUCTION_DB_URL) {
  console.error('❌ Please set PRODUCTION_DATABASE_URL environment variable')
  console.log('Example: PRODUCTION_DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" node scripts/setup-production-db.js')
  process.exit(1)
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: PRODUCTION_DB_URL
    }
  }
})

async function setupProductionDB() {
  try {
    console.log('🔄 Setting up production database schema...')
    console.log('Database URL:', PRODUCTION_DB_URL.replace(/\/\/.*@/, '//***:***@'))
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Connected to production database')
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    
    console.log(`📊 Found ${tables.length} existing tables`)
    
    if (tables.length === 0) {
      console.log('⚠️  No tables found. You need to run: npx prisma db push')
      console.log('Or run this command with your production DATABASE_URL:')
      console.log(`DATABASE_URL="${PRODUCTION_DB_URL}" npx prisma db push`)
    } else {
      console.log('✅ Database schema appears to be set up')
      tables.forEach(table => console.log(`  - ${table.table_name}`))
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message)
    
    if (error.message.includes('does not exist')) {
      console.log('\n💡 Tip: Make sure your database exists and the URL is correct')
    }
  } finally {
    await prisma.$disconnect()
  }
}

setupProductionDB()