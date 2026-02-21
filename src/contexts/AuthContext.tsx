'use client'

import { AuthState, AuthUser } from '@/types/auth'
import { useSession } from 'next-auth/react'
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext<{
	authState: AuthState
	login: (user: AuthUser, token: string) => void
	logout: () => void
	updateUser: (user: AuthUser) => void
} | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
	const { data: session, status } = useSession()
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: true,
		error: null,
	})
	const welcomeShownRef = useRef(false)
	const lastSessionIdRef = useRef<string | null>(null)

	// Handle NextAuth session changes
	useEffect(() => {
		if (status === 'loading') {
			setAuthState((prev) => ({ ...prev, isLoading: true }))
			return
		}

		if (session?.user) {
			// Convert NextAuth session to our AuthUser format
			const sessionUser = session.user as {
				id?: string
				email?: string
				name?: string
				image?: string
			}
			const authUser: AuthUser = {
				id: sessionUser.id || sessionUser.email || '',
				email: sessionUser.email || '',
				name: sessionUser.name || '',
				avatar: sessionUser.image || '',
			}

			setAuthState({
				user: authUser,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			})

			// Show welcome message only for new sessions (not on page refresh)
			const currentSessionId = sessionUser.id || sessionUser.email || ''
			const storedSessionId = sessionStorage.getItem('last_session_id')
			const isNewSession = storedSessionId !== currentSessionId

			if (isNewSession && currentSessionId) {
				const getGreeting = () => {
					const hour = new Date().getHours()
					if (hour < 12) return 'Good morning'
					if (hour < 18) return 'Good afternoon'
					return 'Good evening'
				}

				toast.success(
					`${getGreeting()}! ${authUser.name}! 👋\n Ready to create some amazing commits?`,
					{
						duration: 4000,
					},
				)

				// Update session tracking in sessionStorage
				sessionStorage.setItem('last_session_id', currentSessionId)
				lastSessionIdRef.current = currentSessionId
				welcomeShownRef.current = true
			}
		} else {
			// Check for existing JWT authentication
			const checkJwtAuth = async () => {
				try {
					const token = localStorage.getItem('auth_token')
					const userStr = localStorage.getItem('user')

					if (token && userStr) {
						// Verify token with server
						const response = await fetch('/api/auth/verify', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ token }),
						})

						let result
						try {
							result = await response.json()
						} catch (jsonError) {
							console.error('JSON parsing error:', jsonError)
							// Clear invalid token
							localStorage.removeItem('auth_token')
							localStorage.removeItem('user')
							setAuthState({
								user: null,
								isAuthenticated: false,
								isLoading: false,
								error: 'Invalid authentication data',
							})
							return
						}

						if (result.success && result.user) {
							setAuthState({
								user: result.user,
								isAuthenticated: true,
								isLoading: false,
								error: null,
							})
						} else {
							// Invalid token, clear storage
							localStorage.removeItem('auth_token')
							localStorage.removeItem('user')
							setAuthState({
								user: null,
								isAuthenticated: false,
								isLoading: false,
								error: null,
							})
						}
					} else {
						setAuthState({
							user: null,
							isAuthenticated: false,
							isLoading: false,
							error: null,
						})
					}
				} catch (error) {
					console.error('Auth check error:', error)
					setAuthState({
						user: null,
						isAuthenticated: false,
						isLoading: false,
						error: 'Authentication check failed',
					})
				}
			}

			checkJwtAuth()
		}
	}, [session, status])

	// Idle logout functionality - 60 minutes of inactivity
	const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const IDLE_TIMEOUT = 60 * 60 * 1000 // 60 minutes in milliseconds

	const logout = useCallback(async () => {
		// Clear idle timer
		if (idleTimeoutRef.current) {
			clearTimeout(idleTimeoutRef.current)
			idleTimeoutRef.current = null
		}

		// Clear JWT authentication
		localStorage.removeItem('auth_token')
		localStorage.removeItem('user')

		// Clear session tracking
		sessionStorage.removeItem('last_session_id')

		// Sign out from NextAuth if there's a session
		if (session) {
			const { signOut } = await import('next-auth/react')
			await signOut({ redirect: false })
		}

		setAuthState({
			user: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
		})

		// Reset welcome flag and session tracking for next login
		welcomeShownRef.current = false
		lastSessionIdRef.current = null
	}, [session])

	const resetIdleTimer = useCallback(() => {
		if (idleTimeoutRef.current) {
			clearTimeout(idleTimeoutRef.current)
		}

		if (authState.isAuthenticated) {
			idleTimeoutRef.current = setTimeout(() => {
				// User has been idle for 60 minutes, log them out
				toast.error('You have been logged out due to inactivity', {
					duration: 5000,
				})
				logout()
			}, IDLE_TIMEOUT)
		}
	}, [authState.isAuthenticated, IDLE_TIMEOUT, logout])

	// Track user activity
	useEffect(() => {
		if (!authState.isAuthenticated) return

		const events = [
			'mousedown',
			'mousemove',
			'keypress',
			'scroll',
			'touchstart',
			'click',
		]

		const handleActivity = () => {
			resetIdleTimer()
		}

		// Add event listeners
		events.forEach((event) => {
			document.addEventListener(event, handleActivity, true)
		})

		// Initialize the timer
		resetIdleTimer()

		// Cleanup
		return () => {
			events.forEach((event) => {
				document.removeEventListener(event, handleActivity, true)
			})
			if (idleTimeoutRef.current) {
				clearTimeout(idleTimeoutRef.current)
			}
		}
	}, [authState.isAuthenticated, resetIdleTimer])

	const login = (user: AuthUser, token: string) => {
		localStorage.setItem('auth_token', token)
		localStorage.setItem('user', JSON.stringify(user))
		setAuthState({
			user,
			isAuthenticated: true,
			isLoading: false,
			error: null,
		})

		// Show welcome toast
		const getGreeting = () => {
			const hour = new Date().getHours()
			if (hour < 12) return 'Good morning'
			if (hour < 18) return 'Good afternoon'
			return 'Good evening'
		}

		toast.success(
			`Welcome back, ${
				user.name
			}! 👋\n${getGreeting()}! Ready to create some amazing commits?`,
			{
				duration: 4000,
			},
		)
	}

	const updateUser = (user: AuthUser) => {
		localStorage.setItem('user', JSON.stringify(user))
		setAuthState((prev) => ({
			...prev,
			user,
		}))
	}

	return (
		<AuthContext.Provider value={{ authState, login, logout, updateUser }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
