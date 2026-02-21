import AnimatedBackground from '@/components/AnimatedBackground'
import AnimatedHeader from '@/components/AnimatedHeader'
import { CommitExamples } from '@/components/CommitExamples'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Examples() {
	return (
		<ProtectedRoute>
			<Layout>
				<AnimatedBackground>
					<div className="container relative max-w-6xl px-4 py-16 mx-auto">
						<AnimatedHeader
							badge="Learning Examples"
							title="Commit Message Examples"
							description="Explore real-world examples of conventional commit messages from top open source projects"
						/>
						<div className="animate-slide-up">
							<CommitExamples />
						</div>
					</div>
				</AnimatedBackground>
			</Layout>
		</ProtectedRoute>
	)
}
