'use client'

import { Card } from '@/components/ui/card'
import { FeatureCard } from '@/components/ui/feature-card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SAMPLE_COMMITS } from '@/constants/changelog-data'
import { useTranslation } from '@/hooks/useTranslation'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChangelogGeneratorSection } from './changelog/ChangelogGeneratorSection'
import { ExamplesSection } from './changelog/ExamplesSection'
import { ToolsSection } from './changelog/ToolsSection'

export function ChangelogGenerator() {
	const { t } = useTranslation(['common', 'changelog'])
	const [commits] = useState(SAMPLE_COMMITS)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return (
			<div className="max-w-6xl mx-auto space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-4xl font-bold text-foreground">
						{t('changelog:hero_title')}
					</h1>
					<p className="text-lg text-muted-foreground">{t('common:loading')}</p>
				</div>
				<div className="grid gap-6 lg:grid-cols-2">
					<Card>
						<div className="p-6">
							<div className="space-y-4 animate-pulse">
								<div className="w-3/4 h-4 rounded bg-muted"></div>
								<div className="w-1/2 h-4 rounded bg-muted"></div>
								<div className="h-20 rounded bg-muted"></div>
							</div>
						</div>
					</Card>
					<Card>
						<div className="p-6">
							<div className="h-32 p-4 rounded-lg animate-pulse bg-muted"></div>
						</div>
					</Card>
				</div>
			</div>
		)
	}

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			<div className="space-y-6 text-center">
				<div className="flex justify-center mb-4">
					<div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl">
						{getFontAwesomeIcon('FileText', 'w-10 h-10 text-white')}
					</div>
				</div>
				<h1 className="text-5xl font-bold text-foreground">
					{t('changelog:hero_title')}
				</h1>
				<p className="max-w-4xl mx-auto text-xl text-muted-foreground">
					{t('changelog:hero_description')}{' '}
					<Link
						href="https://git-cliff.org/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:underline"
					>
						{t('changelog:hero_git_cliff_link')}
					</Link>
				</p>

				{/* What is Changelog Section */}
				<div className="max-w-4xl mx-auto space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<FeatureCard
							variant="blue"
							icon="FileText"
							title={t('changelog:what_is_changelog_title')}
							description={t('changelog:what_is_changelog_description')}
						/>

						<FeatureCard
							variant="green"
							icon="Zap"
							title={t('changelog:why_changelogs_matter_title')}
							description={t('changelog:why_changelogs_matter_description')}
						/>
					</div>

					<div className="grid gap-6 md:grid-cols-3">
						<FeatureCard
							variant="purple"
							icon="Users"
							title={t('changelog:user_benefits_title')}
							description={(() => {
								const benefits = t('changelog:user_benefits_list', {
									returnObjects: true,
								})
								const benefitsArray = Array.isArray(benefits)
									? benefits
									: [
											'Stay informed about new features and bug fixes',
											'Understand breaking changes and migration paths',
											'Track project evolution and stability',
											'Build trust and confidence in the software',
									  ]
								return benefitsArray.join(' • ')
							})()}
						/>

						<FeatureCard
							variant="orange"
							icon="FileText"
							title={t('changelog:developer_benefits_title')}
							description={(() => {
								const benefits = t('changelog:developer_benefits_list', {
									returnObjects: true,
								})
								const benefitsArray = Array.isArray(benefits)
									? benefits
									: [
											'Streamline release notes generation',
											'Improve code review efficiency',
											'Automate versioning and publishing',
											'Maintain a clear and consistent commit history',
									  ]
								return benefitsArray.join(' • ')
							})()}
						/>

						<FeatureCard
							variant="cyan"
							icon="Activity"
							title={t('changelog:project_benefits_title')}
							description={(() => {
								const benefits = t('changelog:project_benefits_list', {
									returnObjects: true,
								})
								const benefitsArray = Array.isArray(benefits)
									? benefits
									: [
											'Enhance project transparency and communication',
											'Facilitate easier onboarding for new contributors',
											'Support automated tooling for releases',
											'Demonstrate active development and maintenance',
									  ]
								return benefitsArray.join(' • ')
							})()}
						/>
					</div>
				</div>
			</div>

			<Tabs defaultValue="generator" className="w-full">
				<TabsList className="grid w-full grid-cols-3 rounded-full">
					<TabsTrigger
						className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
						value="generator"
					>
						{t('changelog:tabs_generator')}
					</TabsTrigger>
					<TabsTrigger
						className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
						value="tools"
					>
						{t('changelog:tabs_tools')}
					</TabsTrigger>
					<TabsTrigger
						className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
						value="examples"
					>
						{t('changelog:tabs_examples')}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="generator" className="mt-6">
					<ChangelogGeneratorSection commits={commits} />
				</TabsContent>

				<TabsContent value="tools" className="mt-6">
					<ToolsSection />
				</TabsContent>

				<TabsContent value="examples" className="mt-6">
					<ExamplesSection />
				</TabsContent>
			</Tabs>
		</div>
	)
}
