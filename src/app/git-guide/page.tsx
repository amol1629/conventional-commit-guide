import AnimatedBackground from '@/components/AnimatedBackground'
import AnimatedHeader from '@/components/AnimatedHeader'
import { GitGitHubGuide } from '@/components/GitGitHubGuide'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function GitGuide() {
	return (
		<ProtectedRoute>
			<Layout>
				<AnimatedBackground>
					<div className="container relative max-w-6xl px-4 py-16 mx-auto">
						<AnimatedHeader
							// badge="Git & GitHub Guide"
							title="Master Git and GitHub"
							description="Learn essential Git commands and GitHub features for better version control"
						/>
						<div className="animate-slide-up">
							<GitGitHubGuide />
						</div>
					</div>
				</AnimatedBackground>
			</Layout>
		</ProtectedRoute>
	)
}
