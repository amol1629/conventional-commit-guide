import AnimatedBackground from '@/components/AnimatedBackground'
import AnimatedHeader from '@/components/AnimatedHeader'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'

const page = () => {
	return (
		<ProtectedRoute>
			<Layout>
				<AnimatedBackground>
					<div className="container relative max-w-6xl px-4 py-6 mx-auto">
						<AnimatedHeader
							badge="Our Products"
							title="Conventional Commits Tools"
							description="Discover our suite of tools designed to help you master conventional commits"
						/>
						<div className="animate-slide-up">
							<div className="p-6">
								<h1 className="mb-4 text-3xl font-bold text-foreground">
									Products
								</h1>
								<p className="text-muted-foreground">
									This is the products page with the sidebar navigation.
								</p>
							</div>
						</div>
					</div>
				</AnimatedBackground>
			</Layout>
		</ProtectedRoute>
	)
}

export default page
