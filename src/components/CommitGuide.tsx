'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BEST_PRACTICES } from '@/constants/best-practices'
import { COMMIT_TYPES } from '@/constants/commit-types'
import { useTranslation } from '@/hooks/useTranslation'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { AdvancedSection } from './commit-guide/AdvancedSection'
import { BestPracticesSection } from './commit-guide/BestPracticesSection'
import { CommitTypesSection } from './commit-guide/CommitTypesSection'
import { ExamplesSection } from './commit-guide/ExamplesSection'

export function CommitGuide() {
	const { t } = useTranslation(['common', 'commit-guide'])

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			<div className="space-y-4 text-center">
				<div className="flex justify-center mb-4">
					<div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
						{getFontAwesomeIcon('BookOpen', 'w-8 h-8 text-white')}
					</div>
				</div>
				<h1 className="text-5xl font-bold text-foreground">
					{t('commit-guide:hero_title')}
				</h1>
				<p className="max-w-3xl mx-auto text-xl text-muted-foreground">
					{t('commit-guide:hero_description')}
				</p>
			</div>

			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="grid w-full grid-cols-5 px-4 rounded-full">
					<TabsTrigger
						className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
						value="overview"
					>
						{t('commit-guide:tabs_overview')}
					</TabsTrigger>
					<TabsTrigger
						className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
						value="types"
					>
						{t('commit-guide:tabs_types')}
					</TabsTrigger>
					<TabsTrigger
						className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
						value="practices"
					>
						{t('commit-guide:tabs_practices')}
					</TabsTrigger>
					<TabsTrigger
						className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
						value="examples"
					>
						{t('commit-guide:tabs_examples')}
					</TabsTrigger>
					<TabsTrigger
						className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
						value="advanced"
					>
						{t('commit-guide:tabs_advanced')}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								{getFontAwesomeIcon('GitCommit', 'w-5 h-5')}
								{t('commit-guide:overview_title')}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground">
								{t('commit-guide:overview_description')}
							</p>
							<div className="p-4 rounded-lg bg-muted">
								<code className="font-mono text-sm">
									{t('commit-guide:overview_format')}
								</code>
							</div>
						</CardContent>
					</Card>

					<div className="grid gap-6 md:grid-cols-2">
						<Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 dark:border-green-800">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
									{getFontAwesomeIcon('CheckCircle', 'w-5 h-5')}
									{t('commit-guide:overview_benefits_title')}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<ul className="space-y-2 text-sm">
									{(() => {
										const benefits = t('commit-guide:overview_benefits_list', {
											returnObjects: true,
										})
										const benefitsArray = Array.isArray(benefits)
											? benefits
											: [
													'Automatically generate CHANGELOGs',
													'Automatically determine version bumps',
													'Communicate the nature of changes to team members',
													'Trigger build and publish processes',
													'Make it easier for people to contribute to your projects',
											  ]
										return benefitsArray.map(
											(benefit: string, index: number) => (
												<li key={index}>• {benefit}</li>
											),
										)
									})()}
								</ul>
							</CardContent>
						</Card>

						<Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-800">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
									{getFontAwesomeIcon('Info', 'w-5 h-5')}
									{t('commit-guide:overview_why_title')}
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<ul className="space-y-2 text-sm">
									{(() => {
										const reasons = t('commit-guide:overview_why_list', {
											returnObjects: true,
										})
										const reasonsArray = Array.isArray(reasons)
											? reasons
											: [
													'Clear and consistent commit history',
													'Better collaboration in teams',
													'Easier debugging and code review',
													'Automated tooling support',
													'Professional development practices',
											  ]
										return reasonsArray.map((reason: string, index: number) => (
											<li key={index}>• {reason}</li>
										))
									})()}
								</ul>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="types" className="space-y-6">
					<CommitTypesSection commitTypes={COMMIT_TYPES} />
				</TabsContent>

				<TabsContent value="practices" className="space-y-6">
					<BestPracticesSection practices={BEST_PRACTICES} />
				</TabsContent>

				<TabsContent value="examples" className="space-y-6">
					<ExamplesSection />
				</TabsContent>

				<TabsContent value="advanced" className="space-y-6">
					<AdvancedSection />
				</TabsContent>
			</Tabs>
		</div>
	)
}
