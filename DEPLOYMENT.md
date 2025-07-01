# Kahaani Store - Vercel Deployment Checklist

## Pre-Deployment ✅

- [ ] **Database Setup**
  - [ ] Create production PostgreSQL database (Neon/Supabase/Railway)
  - [ ] Get connection string with SSL enabled
  - [ ] Test database connection

- [ ] **Environment Variables**
  - [ ] `DATABASE_URL` - PostgreSQL connection string
  - [ ] `NEXTAUTH_URL` - Your Vercel app URL
  - [ ] `NEXTAUTH_SECRET` - Random 32+ character string
  - [ ] `JWT_SECRET` - Secure JWT signing key
  - [ ] `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
  - [ ] `FACEBOOK_CLIENT_ID` & `FACEBOOK_CLIENT_SECRET`
  - [ ] `BREVO_API_KEY` (optional)
  - [ ] `OTP_SERVICE_API_KEY` (optional)

- [ ] **OAuth Configuration**
  - [ ] Google OAuth redirect URI: `https://your-app.vercel.app/api/auth/callback/google`
  - [ ] Facebook OAuth redirect URI: `https://your-app.vercel.app/api/auth/callback/facebook`

## Deployment Process ✅

- [ ] **Code Preparation**
  - [ ] All dependencies installed
  - [ ] Build scripts updated in package.json
  - [ ] vercel.json configuration added
  - [ ] Code committed to Git

- [ ] **Vercel Setup**
  - [ ] Project imported to Vercel
  - [ ] Environment variables configured
  - [ ] Build settings verified

- [ ] **Initial Deployment**
  - [ ] First deployment successful
  - [ ] Database schema deployed
  - [ ] Admin user created

## Post-Deployment Testing ✅

- [ ] **Authentication Flow**
  - [ ] Admin login works: `admin@kahaanibyrangasuta.com`
  - [ ] JWT authentication working
  - [ ] Admin dashboard accessible
  - [ ] Logout functionality working

- [ ] **OAuth Testing**
  - [ ] Google OAuth login
  - [ ] Facebook OAuth login
  - [ ] User session management

- [ ] **Security Verification**
  - [ ] Protected routes redirecting properly
  - [ ] Cookies secure in production
  - [ ] Environment variables not exposed

- [ ] **Performance Check**
  - [ ] Page load times acceptable
  - [ ] Database queries optimized
  - [ ] No build errors or warnings

## Production URLs ✅

- **Application:** `https://your-app-name.vercel.app`
- **Admin Login:** `https://your-app-name.vercel.app/admin/login`
- **Admin Dashboard:** `https://your-app-name.vercel.app/admin/dashboard`
- **User Login:** `https://your-app-name.vercel.app/auth/signin`

## Monitoring & Maintenance ✅

- [ ] **Setup Monitoring**
  - [ ] Vercel Analytics enabled
  - [ ] Error tracking configured
  - [ ] Performance monitoring

- [ ] **Regular Maintenance**
  - [ ] Database backups configured
  - [ ] Security updates scheduled
  - [ ] Performance optimization

## Troubleshooting Common Issues ✅

### Build Failures
```bash
# Clear Vercel cache
vercel build --debug

# Check environment variables
vercel env ls
```

### Database Connection Issues
```bash
# Test connection string locally
npx prisma db push

# Check SSL requirements
# Ensure connection string includes ?sslmode=require
```

### OAuth Issues
- Verify redirect URIs match exactly
- Check client IDs/secrets are correct
- Ensure OAuth apps are in production mode

### Admin Login Issues
- Verify JWT_SECRET is consistent
- Check admin user exists in database
- Confirm middleware is working

## Emergency Rollback ✅

```bash
# Rollback to previous deployment
vercel rollback [deployment-url]

# Or redeploy specific commit
vercel --prod --force
```

---

**Admin Credentials:**
- Email: `admin@kahaanibyrangasuta.com`
- Password: `k@haani202101`

**Support:** Check Vercel dashboard for logs and deployment status.