import AnimatedBackground from '@/components/AnimatedBackground'
import AnimatedHeader from '@/components/AnimatedHeader'
import { CommitValidator } from '@/components/CommitValidator'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Validator() {
	return (
		<ProtectedRoute>
			<Layout>
				<AnimatedBackground>
					<div className="container relative max-w-6xl px-4 py-16 mx-auto">
						<AnimatedHeader
							badge="Validation Tool"
							title="Commit Message Validator"
							description="Validate your commit messages against conventional commit standards"
						/>
						<div className="animate-slide-up">
							<CommitValidator />
						</div>
					</div>
				</AnimatedBackground>
			</Layout>
		</ProtectedRoute>
	)
}
