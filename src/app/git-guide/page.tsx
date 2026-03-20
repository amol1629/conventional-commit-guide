'use client'

import { useRef } from 'react'
import AnimatedBackground from '@/components/AnimatedBackground'
import AnimatedHeader from '@/components/AnimatedHeader'
import {
	type GitGitHubGuideHandle,
	GitGitHubGuide,
} from '@/components/GitGitHubGuide'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function GitGuide() {
	const guideRef = useRef<GitGitHubGuideHandle | null>(null)

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
						<div className="flex justify-end mb-6">
							<button
								type="button"
								onClick={() => guideRef.current?.downloadPdf()}
								className="px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition-opacity"
							>
								Download PDF
							</button>
						</div>
						<div className="animate-slide-up">
							<GitGitHubGuide ref={guideRef} />
						</div>
					</div>
				</AnimatedBackground>
			</Layout>
		</ProtectedRoute>
	)
}
