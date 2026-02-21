import AnimatedBackground from '@/components/AnimatedBackground'
import { CTASection } from '@/components/home/CTASection'
import { FeaturesSection } from '@/components/home/FeaturesSection'
import { HeroSection } from '@/components/home/HeroSection'
import { HowItWorksSection } from '@/components/home/HowItWorksSection'
import { WhatIsSection } from '@/components/home/WhatIsSection'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

const page = () => {
	return (
		<ProtectedRoute>
			<Layout>
				{/* Skip to main content link for screen readers */}
				<a href="#main-content" className="skip-link">
					Skip to main content
				</a>
				<AnimatedBackground>
					<main id="main-content overflow-hidden">
						<HeroSection />
						<WhatIsSection />
						<FeaturesSection />
						<HowItWorksSection />
						<CTASection />
					</main>
				</AnimatedBackground>
			</Layout>
		</ProtectedRoute>
	)
}

export default page
