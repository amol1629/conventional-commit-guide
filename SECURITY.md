# 🔐 Security Best Practices

This document outlines security best practices for the Conventional Git Commits application, including secret generation, environment configuration, and production deployment.

## 🚀 Quick Start

### Generate Secure Secrets

```bash
# Generate all required secrets
npm run security:generate

# Generate specific secret types
node scripts/generate-secrets.js --type nextauth --length 48
node scripts/generate-secrets.js --type jwt --length 64

# Generate environment template
npm run security:template
```

### Validate Security Configuration

```bash
# Validate current environment
npm run security:validate

# Check via API
curl http://localhost:3000/api/security/validate?action=validate
```

## 🔑 Secret Generation

### Automatic Generation

Our security utilities use `crypto.randomBytes()` for cryptographically secure secret generation:

```bash
# Generate all secrets
npm run security:generate

# Output example:
NEXTAUTH_SECRET=abc123...xyz789
JWT_SECRET=def456...uvw012
ENCRYPTION_KEY=ghi789...rst345
SESSION_SECRET=jkl012...mno678
```

### Manual Generation

For manual generation using OpenSSL (as requested):

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32

# Generate longer secrets (64 bytes)
openssl rand -base64 64
```

### Security Requirements

- **Minimum Length**: 32 characters (256 bits)
- **Algorithm**: Cryptographically secure random generation
- **Entropy**: High entropy with character diversity
- **Uniqueness**: Each secret must be unique
- **Rotation**: Rotate every 90 days

## 🛡️ Environment Security

### Required Environment Variables

```bash
# Authentication Secrets
NEXTAUTH_SECRET=your-cryptographically-secure-secret
JWT_SECRET=your-cryptographically-secure-secret

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database Configuration
MONGODB_URI=your-mongodb-connection-string

# Email Configuration
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your-resend-api-key

# App Configuration
NEXTAUTH_URL=https://conventional-git-commits.vercel.app
NEXT_PUBLIC_APP_URL=https://conventional-git-commits.vercel.app
NODE_ENV=production
```

### Security Validation

Our application includes automatic security validation:

```typescript
// Automatic validation on startup
import { validateSecurityOnStartup } from '@/lib/security'
validateSecurityOnStartup()
```

**Validation Checks:**

- ✅ Secret strength and length
- ✅ No default/weak values
- ✅ Production environment checks
- ✅ HTTPS enforcement
- ✅ Database security

## 🏭 Production Deployment

### Vercel Environment Variables

Add these to your Vercel dashboard → Project Settings → Environment Variables:

```bash
# Critical Secrets (Generated)
NEXTAUTH_SECRET=generated-secure-secret-32-chars
JWT_SECRET=generated-secure-secret-32-chars

# OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database
MONGODB_URI=your-production-mongodb-uri

# Email Service
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your-resend-api-key

# App URLs
NEXTAUTH_URL=https://conventional-git-commits.vercel.app
NEXT_PUBLIC_APP_URL=https://conventional-git-commits.vercel.app
NODE_ENV=production
```

### OAuth App Configuration

#### Google OAuth

1. **Google Cloud Console**: https://console.cloud.google.com/
2. **APIs & Services → Credentials**
3. **Update Authorized redirect URIs**:
   ```
   https://conventional-git-commits.vercel.app/api/auth/callback/google
   ```

#### GitHub OAuth

1. **GitHub Settings**: https://github.com/settings/developers
2. **New OAuth App**:
   ```
   Application name: Conventional Git Commits
   Homepage URL: https://conventional-git-commits.vercel.app
   Authorization callback URL: https://conventional-git-commits.vercel.app/api/auth/callback/github
   ```

## 🔒 Security Best Practices

### 1. Secret Management

- **Never commit secrets** to version control
- **Use different secrets** for development and production
- **Rotate secrets regularly** (every 90 days)
- **Store in environment variables**, not code
- **Use secrets management services** in production

### 2. Environment Security

- **Use HTTPS** for all production URLs
- **Enable MongoDB authentication**
- **Use environment-specific database names**
- **Enable MongoDB SSL/TLS**
- **Set up proper CORS policies**

### 3. Application Security

- **Enable rate limiting** for API endpoints
- **Set up proper logging and monitoring**
- **Enable 2FA** for all service accounts
- **Monitor for suspicious activity**
- **Regular security audits**

### 4. Email Security

- **Use dedicated email services** (Resend, SendGrid)
- **Enable email authentication** (SPF, DKIM, DMARC)
- **Monitor email delivery**
- **Set up email rate limiting**

## 🛠️ Security Tools

### API Endpoints

```bash
# Validate security configuration
GET /api/security/validate?action=validate

# Generate new secrets
GET /api/security/validate?action=generate

# Get security recommendations
GET /api/security/validate?action=recommendations

# Generate configuration template
GET /api/security/validate?action=template
```

### CLI Commands

```bash
# Generate all secrets
npm run security:generate

# Validate current configuration
npm run security:validate

# Generate environment template
npm run security:template

# Generate specific secret
node scripts/generate-secrets.js --type nextauth --length 48
```

### Security Utilities

```typescript
import {
	generateSecureSecret,
	generateAllSecrets,
	validateEnvironmentSecurity,
	getSecurityRecommendations,
	generateSecureConfigTemplate,
} from '@/lib/security'

// Generate single secret
const secret = generateSecureSecret(32)

// Generate all secrets
const secrets = generateAllSecrets()

// Validate environment
const validation = validateEnvironmentSecurity()

// Get recommendations
const recommendations = getSecurityRecommendations()
```

## 🚨 Security Checklist

### Development

- [ ] Generate secure secrets using `npm run security:generate`
- [ ] Never commit `.env.local` to version control
- [ ] Use different secrets for development and production
- [ ] Validate security with `npm run security:validate`

### Production

- [ ] Set all environment variables in Vercel
- [ ] Configure OAuth apps with production URLs
- [ ] Use HTTPS for all URLs
- [ ] Enable MongoDB authentication
- [ ] Set up email service (Resend recommended)
- [ ] Monitor for security issues
- [ ] Regular secret rotation

### Ongoing

- [ ] Rotate secrets every 90 days
- [ ] Monitor application logs
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Monitor for suspicious activity

## 📚 Additional Resources

- [NextAuth.js Security](https://next-auth.js.org/configuration/options#security)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)
- [OAuth 2.0 Security](https://tools.ietf.org/html/rfc6749)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)

## 🆘 Security Issues

If you discover a security issue:

1. **Do not** create a public issue
2. **Email** security concerns to: security@your-domain.com
3. **Include** detailed information about the issue
4. **Wait** for acknowledgment before public disclosure

---

**Remember**: Security is an ongoing process, not a one-time setup. Regular audits and updates are essential for maintaining a secure application.
