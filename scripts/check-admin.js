const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Checking admin users...')
    
    const admins = await prisma.admin.findMany()
    console.log('All admins:', JSON.stringify(admins, null, 2))
    
    // Test authentication lookup
    const adminByUsername = await prisma.admin.findUnique({
      where: { username: 'admin@kahaanibyrangasuta.com', isActive: true }
    })
    console.log('Admin found by username:', adminByUsername ? 'Yes' : 'No')
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()