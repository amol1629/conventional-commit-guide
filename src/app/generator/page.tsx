import AnimatedBackground from '@/components/AnimatedBackground'
import AnimatedHeader from '@/components/AnimatedHeader'
import { CommitGenerator } from '@/components/CommitGenerator'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { isAuthRequired } from '@/config/auth.config'

export default async function Generator() {
	// Only check session if auth is required
	if (isAuthRequired()) {
		const session = await getServerSession(authOptions)

		if (!session) {
			redirect('/auth/login')
		}
	}

	return (
		<ProtectedRoute>
			<Layout>
				<AnimatedBackground>
					<div className="container relative max-w-6xl px-4 py-16 mx-auto">
						<AnimatedHeader
							badge="AI-Powered Tool"
							title="Commit Message Generator"
							description="Generate perfect conventional commit messages with our intelligent AI-powered tool"
						/>
						<div className="animate-slide-up">
							<CommitGenerator />
						</div>
					</div>
				</AnimatedBackground>
			</Layout>
		</ProtectedRoute>
	)
}
