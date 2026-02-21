import { databaseService } from '@/services/database.service'
import {
	AuthResponse,
	AuthUser,
	LoginRequest,
	SignupRequest,
} from '@/types/auth'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET =
	process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export class AuthService {
	private static instance: AuthService

	static getInstance(): AuthService {
		if (!AuthService.instance) {
			AuthService.instance = new AuthService()
		}
		return AuthService.instance
	}

	async signup(data: SignupRequest): Promise<AuthResponse> {
		try {
			const { name, email, password, confirmPassword } = data

			// Validation
			if (password !== confirmPassword) {
				return { success: false, error: 'Passwords do not match' }
			}

			if (password.length < 6) {
				return {
					success: false,
					error: 'Password must be at least 6 characters',
				}
			}

			// Check if user already exists
			const existingUser = await databaseService.getUser(email)
			if (existingUser) {
				return { success: false, error: 'User already exists with this email' }
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, 12)

			// Create user using database service
			const userId = email // Use email as userId for simplicity
			const user = await databaseService.createUser(
				userId,
				email,
				name,
				hashedPassword,
			)

			// Generate JWT token
			const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, {
				expiresIn: JWT_EXPIRES_IN,
			})

			const authUser: AuthUser = {
				id: user._id!.toString(),
				email: user.email,
				name: user.name,
				avatar: user.avatar,
			}

			return {
				success: true,
				user: authUser,
				token,
			}
		} catch (error) {
			console.error('Signup error:', error)
			return { success: false, error: 'Internal server error' }
		}
	}

	async login(data: LoginRequest): Promise<AuthResponse> {
		try {
			const { email, password } = data

			// Find user using database service
			const user = await databaseService.getUser(email)
			if (!user) {
				return { success: false, error: 'Invalid email or password' }
			}

			// Check password
			const isPasswordValid = await bcrypt.compare(password, user.password)
			if (!isPasswordValid) {
				return { success: false, error: 'Invalid email or password' }
			}

			// Update last active and login count
			await databaseService.updateUserLastActive(user.userId)

			// Generate JWT token
			const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, {
				expiresIn: JWT_EXPIRES_IN,
			})

			const authUser: AuthUser = {
				id: user._id!.toString(),
				email: user.email,
				name: user.name,
				avatar: user.avatar,
			}

			return {
				success: true,
				user: authUser,
				token,
			}
		} catch (error) {
			console.error('Login error:', error)
			return { success: false, error: 'Internal server error' }
		}
	}

	async verifyToken(token: string): Promise<AuthUser | null> {
		try {
			const decoded = jwt.verify(token, JWT_SECRET) as {
				userId: string
				email: string
			}

			const user = await databaseService.getUser(decoded.email)
			if (!user) {
				return null
			}

			return {
				id: user._id!.toString(),
				email: user.email,
				name: user.name,
				avatar: user.avatar,
			}
		} catch (error) {
			console.error('Token verification error:', error)
			return null
		}
	}

	async getUserById(userId: string): Promise<AuthUser | null> {
		try {
			const user = await databaseService.getUser(userId)
			if (!user) {
				return null
			}

			return {
				id: user._id!.toString(),
				email: user.email,
				name: user.name,
				avatar: user.avatar,
			}
		} catch (error) {
			console.error('Get user error:', error)
			return null
		}
	}
}

export const authService = AuthService.getInstance()
