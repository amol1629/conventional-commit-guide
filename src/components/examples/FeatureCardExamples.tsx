'use client'

import { FeatureCard } from '@/components/ui/feature-card'

/**
 * Comprehensive examples of FeatureCard usage
 * Shows all built-in variants and custom styling
 */
export function FeatureCardExamples() {
	return (
		<div className="space-y-8">
			{/* Built-in Variants */}
			<div>
				<h2 className="text-2xl font-bold mb-4">Built-in Variants</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
					<FeatureCard
						variant="blue"
						icon="GitCommit"
						title="Blue Variant"
						description="Beautiful blue gradient with purple accent"
					/>

					<FeatureCard
						variant="green"
						icon="CheckCircle"
						title="Green Variant"
						description="Fresh green gradient with blue accent"
					/>

					<FeatureCard
						variant="purple"
						icon="Heart"
						title="Purple Variant"
						description="Rich purple gradient with pink accent"
					/>

					<FeatureCard
						variant="cyan"
						icon="Zap"
						title="Cyan Variant"
						description="Cool cyan gradient with blue accent"
					/>

					<FeatureCard
						variant="orange"
						icon="Lightbulb"
						title="Orange Variant"
						description="Warm orange gradient with yellow accent"
					/>
				</div>
			</div>

			{/* Additional Variants */}
			<div>
				<h2 className="text-2xl font-bold mb-4">Additional Variants</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
					<FeatureCard
						variant="red"
						icon="Heart"
						title="Red Variant"
						description="Bold red gradient with pink accent"
					/>

					<FeatureCard
						variant="indigo"
						icon="Shield"
						title="Indigo Variant"
						description="Deep indigo gradient with purple accent"
					/>

					<FeatureCard
						variant="emerald"
						icon="CheckCircle"
						title="Emerald Variant"
						description="Vibrant emerald gradient with teal accent"
					/>

					<FeatureCard
						variant="pink"
						icon="Star"
						title="Pink Variant"
						description="Soft pink gradient with rose accent"
					/>

					<FeatureCard
						variant="teal"
						icon="BookOpen"
						title="Teal Variant"
						description="Modern teal gradient with cyan accent"
					/>
				</div>
			</div>

			{/* Custom Variants */}
			<div>
				<h2 className="text-2xl font-bold mb-4">Custom Variants</h2>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					<FeatureCard
						variant="custom"
						icon="GitCommit"
						title="Custom Gradient"
						description="Completely custom gradient styling"
						customVariantStyles="border-violet-200 hover:shadow-lg hover:shadow-violet-100 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-fuchsia-900/20 dark:border-violet-800 dark:hover:shadow-lg dark:hover:shadow-violet-800"
						customIconStyles="bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg"
					/>

					<FeatureCard
						variant="custom"
						icon="Shield"
						title="Custom Solid"
						description="Custom solid background with unique styling"
						customVariantStyles="border-slate-200 hover:shadow-lg hover:shadow-slate-100 bg-slate-50 dark:from-slate-900/20 dark:to-slate-800/20 dark:border-slate-800 dark:hover:shadow-lg dark:hover:shadow-slate-800"
						customIconStyles="bg-slate-600 text-white"
					/>

					<FeatureCard
						variant="custom"
						icon="Star"
						title="Custom Rainbow"
						description="Rainbow gradient for special occasions"
						customVariantStyles="border-rainbow-200 hover:shadow-lg hover:shadow-rainbow-100 bg-gradient-to-r from-red-50 via-yellow-50 via-green-50 via-blue-50 via-indigo-50 via-purple-50 to-pink-50 dark:from-red-900/20 dark:via-yellow-900/20 dark:via-green-900/20 dark:via-blue-900/20 dark:via-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 dark:border-rainbow-800 dark:hover:shadow-lg dark:hover:shadow-rainbow-800"
						customIconStyles="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 via-purple-500 to-pink-500 text-white"
					/>
				</div>
			</div>
		</div>
	)
}
