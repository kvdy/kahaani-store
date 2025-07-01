const jwt = require('jsonwebtoken')

const JWT_SECRET = "kahaani-super-secret-jwt-key-2025"

// Test token from the cookie
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtY2s3eXNiazAwMDAxbHd5eW5uZ21qMXciLCJ1c2VybmFtZSI6ImFkbWluQGthaGFhbmlieXJhbmdhc3V0YS5jb20iLCJlbWFpbCI6ImFkbWluQGthaGFhbmlieXJhbmdhc3V0YS5jb20iLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3NTEzNTg0MjUsImV4cCI6MTc1MTQ0NDgyNX0.BNgFdKm78ZqhFt_-KrZa3FI3Wi3usaebkWO-s2pCbeI"

try {
  const decoded = jwt.verify(token, JWT_SECRET)
  console.log('Token is valid:', decoded)
} catch (error) {
  console.log('Token verification failed:', error.message)
}