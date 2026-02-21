'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export default function TestEmailPage() {
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [result, setResult] = useState<{
		success: boolean
		message: string
	} | null>(null)

	const handleTestEmail = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setResult(null)

		try {
			// Use Resend-specific test endpoint
			const response = await fetch('/api/test-resend', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, name }),
			})

			const data = await response.json()
			setResult({
				success: data.success,
				message: data.success ? data.message : data.error || 'Unknown error',
			})
		} catch {
			setResult({
				success: false,
				message: 'Network error. Please try again.',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleCheckConfig = async () => {
		setIsLoading(true)
		setResult(null)

		try {
			const response = await fetch('/api/test-resend')
			const data = await response.json()
			setResult({
				success: data.success,
				message: data.message,
			})
		} catch {
			setResult({
				success: false,
				message: 'Failed to check Resend configuration',
			})
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
				<div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
					<h1 className="text-2xl font-bold text-center mb-6">
						Resend Email Testing
					</h1>

					<form onSubmit={handleTestEmail} className="space-y-4">
						<div>
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="Enter your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div>
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className="flex gap-2">
							<Button type="submit" className="flex-1" disabled={isLoading}>
								{isLoading ? 'Sending...' : 'Send Test Email'}
							</Button>

							<Button
								type="button"
								variant="outline"
								onClick={handleCheckConfig}
								disabled={isLoading}
							>
								Check Config
							</Button>
						</div>
					</form>

					{result && (
						<Alert
							className={`mt-4 ${
								result.success
									? 'border-green-200 bg-green-50'
									: 'border-red-200 bg-red-50'
							}`}
						>
							<AlertDescription
								className={result.success ? 'text-green-800' : 'text-red-800'}
							>
								{result.message}
							</AlertDescription>
						</Alert>
					)}

					<div className="mt-6 text-sm text-gray-600">
						<h3 className="font-semibold mb-2">Resend Setup Instructions:</h3>
						<ol className="list-decimal list-inside space-y-1">
							<li>✅ Resend API key is already configured</li>
							<li>✅ Using onboarding@resend.dev as sender</li>
							<li>✅ Ready to send welcome emails on signup</li>
						</ol>
						<div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
							<p className="text-green-800 text-sm">
								<strong>Status:</strong> Resend is configured and ready to use!
							</p>
						</div>
					</div>
				</div>
			</div>
		</ProtectedRoute>
	)
}
