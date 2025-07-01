const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Testing authentication...')
    
    const admin = await prisma.admin.findUnique({
      where: { username: 'admin@kahaanibyrangasuta.com', isActive: true }
    })
    
    if (!admin) {
      console.log('Admin not found!')
      return
    }
    
    console.log('Admin found:', admin.username)
    
    const isValidPassword = await bcrypt.compare('k@haani202101', admin.password)
    console.log('Password valid:', isValidPassword)
    
    if (isValidPassword) {
      console.log('Authentication should work!')
    } else {
      console.log('Password mismatch!')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()