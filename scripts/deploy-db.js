const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🚀 Setting up production database...')
    
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: 'admin@kahaanibyrangasuta.com' }
    })
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      return
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('k@haani202101', 12)
    
    // Create admin user
    const admin = await prisma.admin.create({
      data: {
        username: 'admin@kahaanibyrangasuta.com',
        email: 'admin@kahaanibyrangasuta.com',
        password: hashedPassword,
        name: 'Kahaani Admin',
        role: 'SUPER_ADMIN',
        isActive: true
      }
    })
    
    console.log('✅ Admin user created successfully:', {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    })
    
    console.log('🎉 Database setup complete!')
    
  } catch (error) {
    console.error('❌ Error setting up database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()