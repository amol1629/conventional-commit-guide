'use client'

import NextAuthGitHubButton from '@/components/NextAuthGitHubButton'
import NextAuthGoogleButton from '@/components/NextAuthGoogleButton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
// import { useTheme } from 'next-themes' // Removed - light theme is enforced globally
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { isLoginEnabled } from '@/config/auth.config'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()
	const { login } = useAuth()
	// const { setTheme } = useTheme() // Removed - light theme is enforced globally

	// Redirect to home if login is disabled
	useEffect(() => {
		if (!isLoginEnabled()) {
			router.replace('/home')
		}
	}, [router])

	// Theme is now enforced globally as light mode

	// Don't render login form if login is disabled
	if (!isLoginEnabled()) {
		return null
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			})

			const result = await response.json()

			if (result.success) {
				// Use AuthContext to update state
				login(result.user, result.token)

				// Redirect to home page
				router.push('/home')
			} else {
				setError(result.error || 'Login failed')
			}
		} catch {
			setError('Network error. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="relative flex items-center justify-center min-h-screen p-2 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 sm:p-4">
			{/* Modern animated background */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Floating geometric shapes */}
				<div className="absolute w-6 h-6 rounded-full top-10 left-10 bg-gradient-to-br from-blue-400 to-blue-600 opacity-20 animate-pulse"></div>
				<div className="absolute w-8 h-8 rounded-full top-20 right-20 bg-gradient-to-br from-purple-400 to-pink-500 opacity-15 animate-bounce"></div>
				<div className="absolute w-4 h-4 rounded-full opacity-25 bottom-20 left-20 bg-gradient-to-br from-green-400 to-emerald-500 animate-ping"></div>
				<div className="absolute w-10 h-10 rounded-full bottom-10 right-10 bg-gradient-to-br from-orange-400 to-red-500 opacity-10 animate-pulse"></div>
				<div className="absolute w-6 h-6 rounded-full top-1/2 left-1/4 bg-gradient-to-br from-indigo-400 to-blue-500 opacity-20 animate-bounce"></div>
				<div className="absolute w-5 h-5 rounded-full top-1/3 right-1/4 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-15 animate-ping"></div>

				{/* Modern grid pattern */}
				<div className="absolute inset-0 opacity-30">
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/20 to-transparent"></div>
				</div>
			</div>

			{/* Main card container with modern glass effect */}
			<div className="relative z-10 w-full max-w-6xl overflow-hidden border shadow-2xl bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border-white/20">
				<div className="flex flex-col lg:flex-row min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
					{/* Left Panel - Modern Promotional Section - Hidden on mobile */}
					<div className="relative flex-1 hidden overflow-hidden lg:flex bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
						{/* Modern gradient orbs */}
						<div className="absolute w-32 h-32 rounded-full top-1/4 left-1/4 bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-xl"></div>
						<div className="absolute w-40 h-40 rounded-full bottom-1/4 right-1/4 bg-gradient-to-br from-green-400/20 to-blue-500/20 blur-xl"></div>
						<div className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-white/30 to-blue-100/30 opacity-40"></div>

						{/* Content with modern typography */}
						<div className="relative z-10 flex flex-col justify-center h-full p-16">
							<div className="mb-8">
								<div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-700 rounded-full bg-blue-100/50">
									{getFontAwesomeIcon('Rocket', 'w-4 h-4 mr-2')}
									New Platform
								</div>
								<h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900">
									Master Git with{' '}
									<span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
										Conventional Commits
									</span>
								</h1>
								<p className="mb-8 text-xl leading-relaxed text-gray-600">
									Learn professional Git practices with our interactive platform
									and build better development workflows.
								</p>
							</div>

							{/* 3D Git/Development Illustration */}
							<div className="relative">
								{/* Monitor showing Git interface */}
								<div className="relative w-48 h-32 mx-auto bg-gray-200 rounded-lg shadow-lg">
									{/* Screen */}
									<div className="absolute bg-white rounded-md shadow-inner inset-2">
										{/* Terminal/Code Editor UI */}
										<div className="flex items-center p-2 text-xs text-white bg-gray-800 border-b">
											<div className="flex space-x-1">
												<div className="w-3 h-3 bg-red-400 rounded-full"></div>
												<div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
												<div className="w-3 h-3 bg-green-400 rounded-full"></div>
											</div>
											<div className="flex items-center flex-1 h-4 px-2 mx-2 text-xs bg-gray-700 rounded">
												<span className="text-green-400">$</span>
											</div>
										</div>

										{/* Git commit message example */}
										<div className="p-2">
											<div className="relative p-3 bg-green-500 rounded-lg shadow-lg">
												<div className="absolute w-3 h-3 bg-black rounded-full -top-1 -left-1"></div>
												<div className="space-y-1">
													<div className="w-3/4 h-1 bg-white rounded"></div>
													<div className="w-1/2 h-1 bg-white rounded"></div>
													<div className="w-2/3 h-1 bg-white rounded"></div>
												</div>
												<div className="w-1/3 h-2 mt-2 bg-blue-500 rounded"></div>
											</div>
										</div>
									</div>
									{/* Monitor stand */}
									<div className="absolute w-16 h-2 transform -translate-x-1/2 bg-gray-200 rounded -bottom-2 left-1/2"></div>
								</div>

								{/* Keyboard */}
								<div className="absolute w-32 h-8 transform -translate-x-1/2 bg-white rounded shadow-lg top-20 left-1/2"></div>

								{/* Git branch indicator */}
								<div className="absolute w-6 h-6 bg-white rounded-full shadow-lg top-16 right-1/3">
									<div className="absolute w-4 h-4 bg-green-400 rounded-full top-1 left-1"></div>
								</div>

								{/* Floating commit cards with icons */}
								<div className="absolute flex items-center justify-center w-16 h-12 bg-white rounded shadow-lg -top-4 -right-4">
									{getFontAwesomeIcon('CheckCircle', 'w-4 h-4 text-green-500')}
								</div>
								<div className="absolute flex items-center justify-center w-16 h-12 bg-white rounded shadow-lg -top-2 -right-2 opacity-80">
									{getFontAwesomeIcon('Code', 'w-4 h-4 text-blue-500')}
								</div>

								{/* Git workflow elements with icons */}
								<div className="absolute flex space-x-1 top-8 -left-8">
									<div className="flex items-center justify-center w-6 h-6 rounded-full shadow-lg bg-gradient-to-br from-green-400 to-green-600">
										{getFontAwesomeIcon('CheckCircle', 'w-3 h-3 text-white')}
									</div>
									<div className="flex items-center justify-center w-6 h-6 rounded-full shadow-lg bg-gradient-to-br from-blue-400 to-blue-600">
										{getFontAwesomeIcon('Code', 'w-3 h-3 text-white')}
									</div>
									<div className="flex items-center justify-center w-6 h-6 rounded-full shadow-lg bg-gradient-to-br from-orange-400 to-orange-600">
										{getFontAwesomeIcon('Rocket', 'w-3 h-3 text-white')}
									</div>
									<div className="flex items-center justify-center w-6 h-6 rounded-full shadow-lg bg-gradient-to-br from-purple-400 to-purple-600">
										{getFontAwesomeIcon('Star', 'w-3 h-3 text-white')}
									</div>
								</div>

								{/* Git branch symbol */}
								<div className="absolute flex items-center justify-center w-8 h-8 bg-white rounded shadow-lg -bottom-4 -right-8">
									{getFontAwesomeIcon(
										'GitBranch',
										'w-5 h-5 text-transparent bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text',
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Right Panel - Modern Login Form - Full width on mobile */}
					<div className="relative flex-1 w-full bg-white/90 backdrop-blur-sm">
						{/* Modern floating elements */}
						<div className="absolute w-12 h-12 top-20 right-8 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl opacity-60 animate-pulse"></div>
						<div className="absolute w-6 h-6 rounded-full bottom-32 right-12 bg-gradient-to-br from-green-400/30 to-blue-500/30 animate-bounce"></div>
						<div className="absolute w-8 h-8 rounded-full top-40 right-4 bg-gradient-to-br from-purple-400/20 to-pink-500/20 opacity-40 animate-ping"></div>

						{/* Content with responsive spacing */}
						<div className="flex flex-col justify-center h-full p-4 sm:p-8 lg:p-16">
							{/* Modern top navigation - Responsive */}
							<div className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-12">
								<div className="flex items-center space-x-2 sm:space-x-3">
									<div className="w-3 h-3 rounded-full shadow-lg sm:w-4 sm:h-4 bg-gradient-to-r from-blue-500 to-purple-600"></div>
									<span className="text-xs font-medium text-gray-600 sm:text-sm">
										Not a member?
									</span>
									<Link href="/auth/signup">
										<Button className="px-3 py-2 text-xs font-semibold text-white transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 sm:px-6 sm:py-3 sm:rounded-xl sm:text-sm hover:shadow-xl hover:scale-105">
											<span className="hidden xs:inline">Sign up now</span>
											<span className="xs:hidden">Sign up</span>
										</Button>
									</Link>
								</div>
								<div className="text-lg sm:text-2xl">
									{getFontAwesomeIcon(
										'Rocket',
										'w-6 h-6 sm:w-8 sm:h-8 text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text',
									)}
								</div>
							</div>

							{/* Modern login form header - Responsive */}
							<div className="mb-6 sm:mb-8 lg:mb-10">
								<h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl sm:mb-3">
									Welcome Back
									<span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
										.
									</span>
								</h2>
								<p className="text-sm text-gray-600 sm:text-base lg:text-lg">
									Enter your credentials to continue
								</p>
							</div>

							{/* Error message */}
							{error && (
								<Alert className="mb-4 border-red-200 bg-red-50">
									<AlertDescription className="text-red-800">
										{error}
									</AlertDescription>
								</Alert>
							)}

							{/* Modern login form - Responsive */}
							<form
								onSubmit={handleSubmit}
								className="space-y-4 sm:space-y-6 lg:space-y-8"
							>
								<div>
									<Label
										htmlFor="email"
										className="block mb-2 text-xs font-semibold text-gray-700 sm:text-sm sm:mb-3"
									>
										Email Address
									</Label>
									<div className="relative group">
										<div className="absolute transition-colors transform -translate-y-1/2 left-3 sm:left-4 top-1/2 ">
											{getFontAwesomeIcon(
												'Envelope',
												'w-4 h-4 pt-1 sm:w-5 sm:h-5 text-gray-400',
											)}
										</div>
										<Input
											id="email"
											type="email"
											placeholder="Enter your email address"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											className="h-10 pl-10 text-sm transition-all duration-300 border-2 border-gray-200 rounded-lg sm:pl-12 sm:h-12 lg:h-14 sm:rounded-xl sm:text-base lg:text-lg focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-blue-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:ring-offset-0 [&:focus-visible]:outline-none [&:focus-visible]:ring-0 [&:focus-visible]:ring-offset-0"
											style={{ outline: 'none', boxShadow: 'none' }}
											disabled={isLoading}
										/>
									</div>
								</div>

								<div>
									<div className="flex items-center justify-between mb-2 sm:mb-3">
										<Label
											htmlFor="password"
											className="text-xs font-semibold text-gray-700 sm:text-sm"
										>
											Password
										</Label>
										<Link
											href="#"
											className="text-xs font-medium text-blue-600 transition-colors sm:text-sm hover:text-blue-700"
										>
											Forgot password?
										</Link>
									</div>
									<div className="relative group">
										<div className="absolute transition-colors transform -translate-y-1/2 left-3 sm:left-4 top-1/2">
											{getFontAwesomeIcon(
												'Lock',
												'w-4 h-4 sm:w-5 pt-1 sm:h-5 text-gray-400',
											)}
										</div>
										<Input
											id="password"
											type="password"
											placeholder="Enter your password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											required
											className="h-10 pl-10 text-sm transition-all duration-300 border-2 border-gray-200 rounded-lg sm:pl-12 sm:h-12 lg:h-14 sm:rounded-xl sm:text-base lg:text-lg focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-blue-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 [&:focus]:outline-none [&:focus]:ring-0 [&:focus]:ring-offset-0 [&:focus-visible]:outline-none [&:focus-visible]:ring-0 [&:focus-visible]:ring-offset-0"
											style={{ outline: 'none', boxShadow: 'none' }}
											disabled={isLoading}
										/>
									</div>
								</div>

								<Button
									type="submit"
									className="w-full h-12 sm:h-14 lg:h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
									disabled={isLoading}
								>
									{isLoading ? (
										<div className="flex items-center gap-2 sm:gap-3">
											<div className="w-4 h-4 border-2 border-white rounded-full sm:w-5 sm:h-5 border-t-transparent animate-spin" />
											<span className="text-sm sm:text-base lg:text-lg">
												Signing In...
											</span>
										</div>
									) : (
										<div className="flex items-center gap-2 sm:gap-3">
											{getFontAwesomeIcon('Rocket', 'w-4 h-4 sm:w-5 sm:h-5')}
											<span className="text-sm sm:text-base lg:text-lg">
												Sign In
											</span>
										</div>
									)}
								</Button>
							</form>

							{/* Social login section - Responsive */}
							<div className="mt-4 sm:mt-6 lg:mt-8">
								<div className="relative mb-4 sm:mb-6">
									<div className="absolute inset-0 flex items-center">
										<span className="w-full border-t border-gray-200"></span>
									</div>
									<div className="relative flex justify-center text-xs sm:text-sm">
										<span className="px-3 font-medium text-gray-500 bg-white sm:px-4">
											Or continue with
										</span>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
									<NextAuthGoogleButton
										className="h-12 sm:h-14 sm:rounded-xl"
										disabled={isLoading}
									/>
									<NextAuthGitHubButton
										className="h-12 sm:h-14 sm:rounded-xl"
										disabled={isLoading}
									/>
								</div>
							</div>

							{/* Floating decorative elements with icons */}
							{/* <div className="absolute flex items-center justify-center w-12 h-12 transform rounded-lg top-1/2 right-8 bg-gradient-to-br from-blue-100 to-purple-100 rotate-12 opacity-60">
								{getFontAwesomeIcon('Code', 'w-6 h-6 text-blue-500')}
							</div> */}
							<div className="absolute flex items-center justify-center w-8 h-8 rounded-full top-1/4 right-4 bg-gradient-to-br from-green-100 to-blue-100 opacity-70 animate-pulse">
								{getFontAwesomeIcon('CheckCircle', 'w-4 h-4 text-green-500')}
							</div>
							<div className="absolute flex items-center justify-center w-6 h-6 rounded-full bottom-1/4 right-6 bg-gradient-to-br from-purple-100 to-pink-100 opacity-60">
								{getFontAwesomeIcon('Star', 'w-3 h-3 text-purple-500')}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
