'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { GIT_GUIDE_CONTENT } from '@/content/git-guide-content'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

export function BestPracticesSection() {
	const { bestPractices } = GIT_GUIDE_CONTENT

	return (
		<div className="grid gap-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						{getFontAwesomeIcon('GitCommit', 'w-6 h-6 text-blue-500')}
						{bestPractices.commit.title}
					</CardTitle>
					<CardDescription className="text-base">
						{bestPractices.commit.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-3">
							<h4 className="font-semibold text-green-600 dark:text-green-400">
								{getFontAwesomeIcon(
									'CheckCircle',
									'w-4 h-4 text-green-500 mt-0.5 flex-shrink-0',
								)}{' '}
								Do&apos;s
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.commit.dos.map((item, index) => (
									<li key={index} className="flex items-start gap-2">
										{getFontAwesomeIcon(
											'Check',
											'w-4 h-4 text-green-500 mt-0.5 flex-shrink-0',
										)}
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-red-600 dark:text-red-400">
								{getFontAwesomeIcon(
									'CircleXmark',
									'w-4 h-4 text-red-500 mt-0.5 flex-shrink-0',
								)}{' '}
								Don&apos;ts
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.commit.donts.map((item, index) => (
									<li key={index} className="flex items-start gap-2">
										{getFontAwesomeIcon(
											'AlertTriangle',
											'w-4 h-4 text-red-500 mt-0.5 flex-shrink-0',
										)}
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						{getFontAwesomeIcon('GitBranch', 'w-6 h-6 text-purple-500')}
						{bestPractices.branching.title}
					</CardTitle>
					<CardDescription className="text-base">
						{bestPractices.branching.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-3">
							<h4 className="font-semibold text-green-600 dark:text-green-400">
								✅ Best Practices
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.branching.bestPractices.map((item, index) => (
									<li key={index} className="flex items-start gap-2">
										{getFontAwesomeIcon(
											'CheckCircle',
											'w-4 h-4 text-green-500 mt-0.5 flex-shrink-0',
										)}
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-blue-600 dark:text-blue-400">
								💡 Pro Tips
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.branching.proTips.map((item, index) => (
									<li key={index} className="flex items-start gap-2">
										{getFontAwesomeIcon(
											'Lightbulb',
											'w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0',
										)}
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						{getFontAwesomeIcon('Users', 'w-6 h-6 text-emerald-500')}
						{bestPractices.collaboration.title}
					</CardTitle>
					<CardDescription className="text-base">
						{bestPractices.collaboration.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-3">
							<h4 className="font-semibold text-green-600 dark:text-green-400">
								✅ Collaboration Best Practices
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.collaboration.bestPractices.map(
									(item, index) => (
										<li key={index} className="flex items-start gap-2">
											{getFontAwesomeIcon(
												'CheckCircle',
												'w-4 h-4 text-green-500 mt-0.5 flex-shrink-0',
											)}
											<span>{item}</span>
										</li>
									),
								)}
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-blue-600 dark:text-blue-400">
								💡 Team Tips
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.collaboration.teamTips.map((item, index) => (
									<li key={index} className="flex items-start gap-2">
										{getFontAwesomeIcon(
											'Lightbulb',
											'w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0',
										)}
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						{getFontAwesomeIcon('Shield', 'w-6 h-6 text-red-500')}
						{bestPractices.security.title}
					</CardTitle>
					<CardDescription className="text-base">
						{bestPractices.security.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-3">
							<h4 className="font-semibold text-green-600 dark:text-green-400">
								✅ Security Essentials
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.security.essentials.map((item, index) => (
									<li key={index} className="flex items-start gap-2">
										{getFontAwesomeIcon(
											'CheckCircle',
											'w-4 h-4 text-green-500 mt-0.5 flex-shrink-0',
										)}
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-blue-600 dark:text-blue-400">
								🔒 Advanced Security
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.security.advanced.map((item, index) => (
									<li key={index} className="flex items-start gap-2">
										{getFontAwesomeIcon(
											'Key',
											'w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0',
										)}
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						{getFontAwesomeIcon('Zap', 'w-6 h-6 text-orange-500')}
						{bestPractices.performance.title}
					</CardTitle>
					<CardDescription className="text-base">
						{bestPractices.performance.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-3">
							<h4 className="font-semibold text-green-600 dark:text-green-400">
								⚡ Performance Tips
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.performance.performanceTips.map(
									(item, index) => (
										<li key={index} className="flex items-start gap-2">
											{getFontAwesomeIcon(
												'CheckCircle',
												'w-4 h-4 text-green-500 mt-0.5 flex-shrink-0',
											)}
											<span>{item}</span>
										</li>
									),
								)}
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-blue-600 dark:text-blue-400">
								🛠️ Tools & Automation
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.performance.tools.map((item, index) => (
									<li key={index} className="flex items-start gap-2">
										{getFontAwesomeIcon(
											'Wrench',
											'w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0',
										)}
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
