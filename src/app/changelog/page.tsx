import AnimatedBackground from '@/components/AnimatedBackground'
import AnimatedHeader from '@/components/AnimatedHeader'
import { ChangelogGenerator } from '@/components/ChangelogGenerator'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Changelog() {
	return (
		<ProtectedRoute>
			<Layout>
				<AnimatedBackground>
					<div className="container relative max-w-6xl px-4 py-16 mx-auto">
						<AnimatedHeader
							badge="Documentation Tool"
							title="Changelog Generator"
							description="Generate beautiful changelogs from your conventional commit history"
						/>
						<div className="animate-slide-up">
							<ChangelogGenerator />
						</div>
					</div>
				</AnimatedBackground>
			</Layout>
		</ProtectedRoute>
	)
}
