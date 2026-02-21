'use client'

import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { isAuthRequired } from '@/config/auth.config'

interface ProtectedRouteProps {
	children: React.ReactNode
	fallback?: React.ReactNode
}

export default function ProtectedRoute({
	children,
	fallback,
}: ProtectedRouteProps) {
	const { authState } = useAuth()
	const router = useRouter()
	const [isRedirecting, setIsRedirecting] = useState(false)

	useEffect(() => {
		// Only redirect if auth is required, we're not already redirecting, and not authenticated
		if (
			isAuthRequired() &&
			!authState.isLoading &&
			!authState.isAuthenticated &&
			!isRedirecting
		) {
			console.log(
				'ProtectedRoute: User not authenticated, redirecting to login',
			)
			setIsRedirecting(true)
			router.replace('/auth/login')
		}
	}, [authState.isLoading, authState.isAuthenticated, router, isRedirecting])

	// Show loading only if AuthContext is loading
	if (authState.isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="w-8 h-8 mx-auto mb-4 border-b-2 border-blue-500 rounded-full animate-spin"></div>
					<p className="text-gray-600 dark:text-gray-400">Loading...</p>
				</div>
			</div>
		)
	}

	// Show loading if redirecting
	if (isRedirecting) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="w-8 h-8 mx-auto mb-4 border-b-2 border-blue-500 rounded-full animate-spin"></div>
					<p className="text-gray-600 dark:text-gray-400">
						Redirecting to login...
					</p>
				</div>
			</div>
		)
	}

	// Double-check authentication before rendering (only if auth is required)
	if (
		isAuthRequired() &&
		(!authState.isAuthenticated || !authState.user)
	) {
		console.log('ProtectedRoute: Access denied - not authenticated or no user')
		return (
			fallback || (
				<div className="flex items-center justify-center min-h-screen">
					<Card className="w-96">
						<CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
							<div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl">
								{getFontAwesomeIcon('Lock', 'w-8 h-8 text-white')}
							</div>
							<div className="text-center">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
									Access Denied
								</h2>
								<p className="text-gray-600 dark:text-gray-400">
									Please sign in to continue
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			)
		)
	}

	return <>{children}</>
}
