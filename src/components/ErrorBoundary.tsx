'use client'

/**
 * Modern Error Boundary (2025 approach)
 * Uses modern React error handling patterns
 */

import { Component, ReactNode } from 'react'

interface ErrorBoundaryState {
	hasError: boolean
	error?: Error
}

interface ErrorBoundaryProps {
	children: ReactNode
	fallback?: ReactNode
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Modern error logging
		console.error('ErrorBoundary caught an error:', error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div className="flex items-center justify-center min-h-screen">
						<div className="text-center">
							<h2 className="text-xl font-semibold text-red-600 mb-2">
								Something went wrong
							</h2>
							<p className="text-gray-600 mb-4">
								We&apos;re sorry, but something unexpected happened.
							</p>
							<button
								onClick={() => this.setState({ hasError: false })}
								className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
							>
								Try again
							</button>
						</div>
					</div>
				)
			)
		}

		return this.props.children
	}
}
