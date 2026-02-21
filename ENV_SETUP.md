# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in your project root (`git-nextjs/.env.local`) with the following content:

```bash
# Email Configuration
# Gmail SMTP Settings (Recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database Configuration (if using database)
# DATABASE_URL=your-database-url

# Authentication Configuration (if using NextAuth)
# NEXTAUTH_SECRET=your-nextauth-secret
# NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Development Configuration
NODE_ENV=development
```

## Gmail Setup Instructions

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Enable 2-Factor Authentication if not already enabled

### Step 2: Generate App Password

1. In Google Account settings, go to Security
2. Under "2-Step Verification", click on "App passwords"
3. Select "Mail" as the app
4. Generate a new app password
5. Copy this password and use it as `SMTP_PASS` in your `.env.local`

### Step 3: Update Your .env.local

Replace the placeholder values:

- `your-email@gmail.com` → Your actual Gmail address
- `your-app-password` → The app password you generated

## 🆓 Free Email Services (Recommended)

### 🥇 Resend (3,000 emails/month FREE - Best for Developers)

```bash
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your-resend-api-key
```

**Setup**: Sign up at resend.com → Get API key → Use as SMTP_PASS

### 📧 Brevo (300 emails/day FREE - 9,000/month)

```bash
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email
SMTP_PASS=your-brevo-smtp-key
```

**Setup**: Sign up at brevo.com → SMTP Settings → Generate SMTP key

### 📬 Mailjet (6,000 emails/month FREE)

```bash
SMTP_HOST=in-v3.mailjet.com
SMTP_PORT=587
SMTP_USER=your-mailjet-api-key
SMTP_PASS=your-mailjet-secret-key
```

**Setup**: Sign up at mailjet.com → API Keys → Use both keys

### ⚡ Elastic Email (100 emails/day FREE)

```bash
SMTP_HOST=smtp.elasticemail.com
SMTP_PORT=587
SMTP_USER=your-elastic-email
SMTP_PASS=your-elastic-api-key
```

**Setup**: Sign up at elasticemail.com → API Keys → Generate key

### 🚀 MailerSend (3,000 emails/month FREE)

```bash
SMTP_HOST=smtp.mailersend.net
SMTP_PORT=587
SMTP_USER=your-mailersend-email
SMTP_PASS=your-mailersend-smtp-token
```

**Setup**: Sign up at mailersend.com → SMTP → Generate token

## Other Email Services

### SendGrid (100 emails/day FREE)

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Mailgun (5,000 emails/month FREE)

```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

### Outlook/Hotmail

```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

## Testing Your Configuration

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/test-email`
3. Enter your email and name
4. Click "Send Test Email"
5. Check your inbox for the welcome email

## Google OAuth Setup Instructions

### Step 1: Create Google OAuth Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret

### Step 2: Update Your .env.local

Replace the placeholder values:

- `your-google-client-id` → Your actual Google Client ID
- `your-google-client-secret` → Your actual Google Client Secret

### Step 3: Test Google OAuth

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000/auth/login`
3. Click the "Google" button
4. Complete the Google authentication flow
5. You should be redirected to the home page after successful authentication

## Security Notes

- Never commit `.env.local` to version control
- Use app passwords instead of your main password
- Keep your email credentials secure
- Use different credentials for development and production
- Keep your Google OAuth credentials secure
- Use HTTPS in production for OAuth redirects
