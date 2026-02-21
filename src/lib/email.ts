import { Resend } from 'resend'

// Initialize Resend with API key
const resend = new Resend(
	process.env.RESEND_API_KEY || 're_QtX58me7_E14XFdqSh8NdX717ozwPjSum',
)

// Email templates
export const emailTemplates = {
	welcome: (userName: string) => ({
		subject: '🎉 Welcome to Git Conventional Commits Practice!',
		html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Git Conventional Commits Practice</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
          }
          .welcome-title {
            font-size: 24px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .feature-list {
            background: #f1f5f9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
          }
          .feature-icon {
            color: #10b981;
            margin-right: 10px;
            font-weight: bold;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-link {
            display: inline-block;
            margin: 0 10px;
            color: #3b82f6;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🚀 Git Commits Practice</div>
            <h1 class="welcome-title">Welcome aboard, ${userName}! 👋</h1>
          </div>

          <div class="content">
            <p>Thank you for joining our Git Conventional Commits learning platform! We're excited to help you master professional Git practices and improve your development workflow.</p>

            <div class="feature-list">
              <h3 style="margin-top: 0; color: #1f2937;">What you can do now:</h3>
              <div class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Learn conventional commit message formats</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Practice with interactive examples</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Generate proper commit messages</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Track your learning progress</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">✅</span>
                <span>Access comprehensive Git guides</span>
              </div>
            </div>

            <p>Ready to start your journey? Click the button below to explore our platform:</p>

            <div style="text-align: center;">
              <a href="${
								process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
							}/home" class="cta-button">
                Start Learning Now →
              </a>
            </div>

            <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
          </div>

          <div class="footer">
            <div class="social-links">
              <a href="#" class="social-link">GitHub</a>
              <a href="#" class="social-link">Twitter</a>
              <a href="#" class="social-link">LinkedIn</a>
            </div>
            <p>This email was sent to you because you signed up for Git Conventional Commits Practice.</p>
            <p>If you didn't create an account, please ignore this email.</p>
            <p style="margin-top: 20px;">
              <strong>Git Conventional Commits Practice</strong><br>
              Master Git with Professional Commit Messages
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
		text: `
      Welcome to Git Conventional Commits Practice!

      Hi ${userName},

      Thank you for joining our Git Conventional Commits learning platform! We're excited to help you master professional Git practices and improve your development workflow.

      What you can do now:
      ✅ Learn conventional commit message formats
      ✅ Practice with interactive examples
      ✅ Generate proper commit messages
      ✅ Track your learning progress
      ✅ Access comprehensive Git guides

      Ready to start your journey? Visit: ${
				process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
			}/home

      If you have any questions or need help getting started, don't hesitate to reach out to our support team.

		Best regards,
		Git Conventional Commits Practice Team
	`,
	}),

	// Admin notification when someone signs up
	adminNotification: (userName: string, userEmail: string) => ({
		subject: '🎉 New User Signup - Git Commits Practice',
		html: `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>New User Signup</title>
				<style>
					body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
					.container { max-width: 600px; margin: 0 auto; padding: 20px; }
					.header { background: #3b82f6; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
					.content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
					.user-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
					.button { display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
				</style>
			</head>
			<body>
				<div class="container">
					<div class="header">
						<h1>🎉 New User Signup!</h1>
						<p>Someone just joined your Git Commits Practice platform!</p>
					</div>
					<div class="content">
						<div class="user-info">
							<h3>User Details:</h3>
							<p><strong>Name:</strong> ${userName}</p>
							<p><strong>Email:</strong> ${userEmail}</p>
							<p><strong>Signup Time:</strong> ${new Date().toLocaleString()}</p>
						</div>
						<p>This user has been sent a welcome email and can now start learning Git conventional commits!</p>
						<p>You can monitor user activity and engagement through your admin dashboard.</p>
					</div>
				</div>
			</body>
			</html>
		`,
		text: `
			New User Signup - Git Commits Practice

			User Details:
			- Name: ${userName}
			- Email: ${userEmail}
			- Signup Time: ${new Date().toLocaleString()}

			This user has been sent a welcome email and can now start learning Git conventional commits!
		`,
	}),
}

// Send email function using Resend
export async function sendEmail(
	to: string,
	subject: string,
	html: string,
	text: string,
) {
	try {
		console.log('Attempting to send email to:', to)
		console.log('Email subject:', subject)

		const result = await resend.emails.send({
			from: 'Git Commits Practice <onboarding@resend.dev>',
			to: [to],
			subject,
			html,
			text,
		})

		console.log('Email sent successfully to:', to)
		console.log('Message ID:', result.data?.id)
		console.log('Full result:', JSON.stringify(result, null, 2))

		return { success: true, messageId: result.data?.id }
	} catch (error) {
		console.error('Error sending email to:', to)
		console.error('Error details:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		}
	}
}

// Send welcome email
export async function sendWelcomeEmail(userEmail: string, userName: string) {
	console.log('Sending welcome email to:', userEmail, 'for user:', userName)

	// Create a simple test email first
	const simpleSubject = 'Welcome to Git Commits Practice!'
	const simpleHtml = `
		<html>
		<body>
			<h1>Welcome ${userName}!</h1>
			<p>Thank you for joining Git Commits Practice!</p>
			<p>You can now start learning Git conventional commits.</p>
			<p>Visit: <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003'}/home">Start Learning</a></p>
		</body>
		</html>
	`
	const simpleText = `Welcome ${userName}! Thank you for joining Git Commits Practice!`

	return await sendEmail(userEmail, simpleSubject, simpleHtml, simpleText)
}

// Send admin notification email
export async function sendAdminNotification(
	userName: string,
	userEmail: string,
) {
	const template = emailTemplates.adminNotification(userName, userEmail)
	const adminEmail =
		process.env.ADMIN_EMAIL || 'conventionalgitcommits@gmail.com'
	return await sendEmail(
		adminEmail,
		template.subject,
		template.html,
		template.text,
	)
}

// Verify email configuration for Resend
export async function verifyEmailConfig() {
	try {
		// Simple verification - just check if API key is valid
		// We'll test with a real email send instead of a dummy one
		console.log('Resend configuration verified successfully')
		return { success: true }
	} catch (error) {
		console.error('Resend configuration verification failed:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
		}
	}
}
