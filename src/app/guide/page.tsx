import AnimatedBackground from '@/components/AnimatedBackground'
import AnimatedHeader from '@/components/AnimatedHeader'
import { CommitGuide } from '@/components/CommitGuide'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Guide() {
	return (
		<ProtectedRoute>
			<Layout>
				<AnimatedBackground>
					<div className="container relative max-w-6xl px-4 py-16 mx-auto">
						<AnimatedHeader
							badge="Learning Center"
							title="Conventional Commits Guide"
							description="Master the art of writing clear, consistent commit messages that improve your development workflow"
						/>
						<div className="animate-slide-up">
							<CommitGuide />
						</div>
					</div>
				</AnimatedBackground>
			</Layout>
		</ProtectedRoute>
	)
}
