import { validateSecurityOnStartup } from '@/lib/security'
import { databaseService } from '@/services/database.service'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise from './mongodb'

// Validate security configuration on startup
validateSecurityOnStartup()

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		}),
	],
	adapter: MongoDBAdapter(clientPromise),
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider === 'google' || account?.provider === 'github') {
				try {
					// Check if user exists in our database
					const existingUser = await databaseService.getUser(user.email!)

					if (!existingUser) {
						// Create new user in our database
						const userId = `${account.provider}_${Date.now()}`
						await databaseService.createUser(
							userId,
							user.email!,
							user.name!,
							'', // No password for OAuth users
							user.image || undefined,
							account.provider, // OAuth provider
							user.id, // OAuth user ID from NextAuth
						)
					}
				} catch (error) {
					console.error(`Error during ${account.provider} sign in:`, error)
					return false
				}
			}
			return true
		},
		async session({ session, token }) {
			if (session.user) {
				// Get user from our database
				const user = await databaseService.getUser(session.user.email!)
				if (user) {
					;(session.user as { id: string }).id = user._id!.toString()
					session.user.name = user.name
					session.user.email = user.email
					session.user.image = user.avatar
				} else {
					// If user doesn't exist in our database, use the token ID
					;(session.user as { id: string }).id =
						(token.id as string) || session.user.email || ''
				}
			}
			return session
		},
		async jwt({ token, user }) {
			if (user && 'id' in user) {
				token.id = user.id
			}
			return token
		},
	},
	pages: {
		signIn: '/auth/login',
	},
	session: {
		strategy: 'jwt',
	},
	secret: process.env.NEXTAUTH_SECRET,
}
