'use client'

/**
 * Modern Loading Spinner (2025 approach)
 * Uses modern CSS animations, gradients, and accessibility features
 */

interface LoadingSpinnerProps {
	size?: 'sm' | 'md' | 'lg' | 'xl'
	variant?: 'default' | 'dots' | 'pulse' | 'wave' | 'bounce'
	className?: string
	text?: string
}

export function LoadingSpinner({
	size = 'md',
	variant = 'default',
	className = '',
	text,
}: LoadingSpinnerProps) {
	const sizeClasses = {
		sm: 'h-4 w-4',
		md: 'h-8 w-8',
		lg: 'h-12 w-12',
		xl: 'h-16 w-16',
	}

	const renderSpinner = () => {
		switch (variant) {
			case 'dots':
				return (
					<div className="flex space-x-1">
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce`}
								style={{
									width:
										size === 'sm'
											? '6px'
											: size === 'md'
											? '8px'
											: size === 'lg'
											? '10px'
											: '12px',
									height:
										size === 'sm'
											? '6px'
											: size === 'md'
											? '8px'
											: size === 'lg'
											? '10px'
											: '12px',
									animationDelay: `${i * 0.1}s`,
								}}
							/>
						))}
					</div>
				)

			case 'pulse':
				return (
					<div className="relative">
						<div
							className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse ${sizeClasses[size]}`}
						/>
						<div
							className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-ping opacity-75 ${sizeClasses[size]}`}
						/>
					</div>
				)

			case 'wave':
				return (
					<div className="flex space-x-1">
						{[0, 1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"
								style={{
									width:
										size === 'sm'
											? '3px'
											: size === 'md'
											? '4px'
											: size === 'lg'
											? '5px'
											: '6px',
									height:
										size === 'sm'
											? '12px'
											: size === 'md'
											? '16px'
											: size === 'lg'
											? '20px'
											: '24px',
									animationDelay: `${i * 0.1}s`,
									animationDuration: '1s',
								}}
							/>
						))}
					</div>
				)

			case 'bounce':
				return (
					<div className="flex space-x-1">
						{[0, 1, 2].map((i) => (
							<div
								key={i}
								className={`bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce ${sizeClasses[size]}`}
								style={{
									animationDelay: `${i * 0.2}s`,
								}}
							/>
						))}
					</div>
				)

			default:
				return (
					<div className="relative">
						<div
							className={`animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700 ${sizeClasses[size]}`}
						>
							<div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500 animate-spin" />
						</div>
						<div
							className={`absolute inset-0 rounded-full border-2 border-transparent border-b-green-500 border-l-pink-500 animate-spin`}
							style={{
								animationDirection: 'reverse',
								animationDuration: '1.5s',
							}}
						/>
					</div>
				)
		}
	}

	return (
		<div
			className={`flex flex-col items-center justify-center space-y-3 ${className}`}
			role="status"
			aria-label="Loading"
		>
			{renderSpinner()}
			{text && (
				<p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
					{text}
				</p>
			)}
			<span className="sr-only">Loading...</span>
		</div>
	)
}

// Additional modern loading components
export function LoadingDots({ className = '' }: { className?: string }) {
	return (
		<div className={`flex items-center space-x-1 ${className}`}>
			{[0, 1, 2].map((i) => (
				<div
					key={i}
					className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"
					style={{ animationDelay: `${i * 0.1}s` }}
				/>
			))}
		</div>
	)
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
	return (
		<div className={`animate-pulse ${className}`}>
			<div className="space-y-3">
				<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
				<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
				<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
			</div>
		</div>
	)
}

export function LoadingCard({ className = '' }: { className?: string }) {
	return (
		<div className={`animate-pulse ${className}`}>
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
				<div className="flex items-center space-x-4">
					<div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
					<div className="space-y-2 flex-1">
						<div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
						<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
					</div>
				</div>
				<div className="mt-4 space-y-2">
					<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
					<div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
				</div>
			</div>
		</div>
	)
}
