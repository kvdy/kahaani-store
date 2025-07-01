const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Creating admin user...')
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('k@haani202101', 12)
    
    // Create admin user
    const admin = await prisma.admin.upsert({
      where: { email: 'admin@kahaanibyrangasuta.com' },
      update: {
        password: hashedPassword,
        isActive: true
      },
      create: {
        username: 'admin@kahaanibyrangasuta.com',
        email: 'admin@kahaanibyrangasuta.com',
        password: hashedPassword,
        name: 'Kahaani Admin',
        role: 'SUPER_ADMIN',
        isActive: true
      }
    })
    
    console.log('Admin user created successfully:', {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()