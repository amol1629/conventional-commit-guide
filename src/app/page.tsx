'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { isAuthRequired } from '@/config/auth.config'

export default function Home() {
	const { authState } = useAuth()
	const router = useRouter()

	useEffect(() => {
		// Only redirect after authentication check is complete
		if (!authState.isLoading) {
			console.log('Auth state:', {
				isAuthenticated: authState.isAuthenticated,
				user: authState.user,
			})

			if (authState.isAuthenticated) {
				console.log('User is authenticated, redirecting to /home')
				router.push('/home')
			} else if (isAuthRequired()) {
				console.log('User is not authenticated, redirecting to /auth/login')
				// Force redirect to login if not authenticated and auth is required
				router.push('/auth/login')
			} else {
				console.log('Auth not required, redirecting to /home')
				// If auth is not required, redirect to home
				router.push('/home')
			}
		}
	}, [authState.isLoading, authState.isAuthenticated, authState.user, router])

	// Show loading while checking authentication
	if (authState.isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<LoadingSpinner
					size="lg"
					variant="default"
					text="Checking authentication..."
				/>
			</div>
		)
	}

	// Show loading while redirecting
	return (
		<div className="flex items-center justify-center min-h-screen">
			<LoadingSpinner size="lg" variant="default" text="Redirecting..." />
		</div>
	)
}
