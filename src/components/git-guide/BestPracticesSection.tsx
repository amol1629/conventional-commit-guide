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
					<CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-white">
						{getFontAwesomeIcon('GitCommit', 'w-6 h-6 text-blue-600 dark:text-blue-400')}
						{bestPractices.commit.title}
					</CardTitle>
					<CardDescription className="text-base text-gray-600 dark:text-gray-300">
						{bestPractices.commit.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-3">
							<h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
								{getFontAwesomeIcon(
									'CheckCircle',
									'w-5 h-5 text-green-600 dark:text-green-400',
								)}
								Do&apos;s
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.commit.dos.map((item, index) => (
									<li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
										{getFontAwesomeIcon(
											'Check',
											'w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0',
										)}
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
								{getFontAwesomeIcon(
									'CircleXmark',
									'w-5 h-5 text-red-600 dark:text-red-400',
								)}
								Don&apos;ts
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.commit.donts.map((item, index) => (
									<li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
										{getFontAwesomeIcon(
											'AlertTriangle',
											'w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0',
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
					<CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-white">
						{getFontAwesomeIcon('GitBranch', 'w-6 h-6 text-purple-600 dark:text-purple-400')}
						{bestPractices.branching.title}
					</CardTitle>
					<CardDescription className="text-base text-gray-600 dark:text-gray-300">
						{bestPractices.branching.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-3">
							<h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
								{getFontAwesomeIcon(
									'CheckCircle',
									'w-5 h-5 text-green-600 dark:text-green-400',
								)}
								Best Practices
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.branching.bestPractices.map((item, index) => (
									<li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
										{getFontAwesomeIcon(
											'CheckCircle',
											'w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0',
										)}
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
								{getFontAwesomeIcon(
									'Lightbulb',
									'w-5 h-5 text-yellow-600 dark:text-yellow-400',
								)}
								Pro Tips
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.branching.proTips.map((item, index) => (
									<li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
										{getFontAwesomeIcon(
											'Lightbulb',
											'w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0',
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
					<CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-white">
						{getFontAwesomeIcon('Users', 'w-6 h-6 text-emerald-600 dark:text-emerald-400')}
						{bestPractices.collaboration.title}
					</CardTitle>
					<CardDescription className="text-base text-gray-600 dark:text-gray-300">
						{bestPractices.collaboration.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-3">
							<h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
								{getFontAwesomeIcon(
									'CheckCircle',
									'w-5 h-5 text-green-600 dark:text-green-400',
								)}
								Collaboration Best Practices
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.collaboration.bestPractices.map(
									(item, index) => (
										<li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
											{getFontAwesomeIcon(
												'CheckCircle',
												'w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0',
											)}
											<span>{item}</span>
										</li>
									),
								)}
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
								{getFontAwesomeIcon(
									'Lightbulb',
									'w-5 h-5 text-yellow-600 dark:text-yellow-400',
								)}
								Team Tips
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.collaboration.teamTips.map((item, index) => (
									<li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
										{getFontAwesomeIcon(
											'Lightbulb',
											'w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0',
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
					<CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-white">
						{getFontAwesomeIcon('Shield', 'w-6 h-6 text-red-600 dark:text-red-400')}
						{bestPractices.security.title}
					</CardTitle>
					<CardDescription className="text-base text-gray-600 dark:text-gray-300">
						{bestPractices.security.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-3">
							<h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
								{getFontAwesomeIcon(
									'CheckCircle',
									'w-5 h-5 text-green-600 dark:text-green-400',
								)}
								Security Essentials
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.security.essentials.map((item, index) => (
									<li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
										{getFontAwesomeIcon(
											'CheckCircle',
											'w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0',
										)}
										<span>{item}</span>
									</li>
								))}
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
								{getFontAwesomeIcon(
									'Key',
									'w-5 h-5 text-blue-600 dark:text-blue-400',
								)}
								Advanced Security
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.security.advanced.map((item, index) => (
									<li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
										{getFontAwesomeIcon(
											'Key',
											'w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0',
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
					<CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-white">
						{getFontAwesomeIcon('Zap', 'w-6 h-6 text-orange-600 dark:text-orange-400')}
						{bestPractices.performance.title}
					</CardTitle>
					<CardDescription className="text-base text-gray-600 dark:text-gray-300">
						{bestPractices.performance.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-3">
							<h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
								{getFontAwesomeIcon(
									'Zap',
									'w-5 h-5 text-orange-600 dark:text-orange-400',
								)}
								Performance Tips
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.performance.performanceTips.map(
									(item, index) => (
										<li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
											{getFontAwesomeIcon(
												'CheckCircle',
												'w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0',
											)}
											<span>{item}</span>
										</li>
									),
								)}
							</ul>
						</div>
						<div className="space-y-3">
							<h4 className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
								{getFontAwesomeIcon(
									'Wrench',
									'w-5 h-5 text-blue-600 dark:text-blue-400',
								)}
								Tools & Automation
							</h4>
							<ul className="space-y-2 text-sm">
								{bestPractices.performance.tools.map((item, index) => (
									<li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
										{getFontAwesomeIcon(
											'Wrench',
											'w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0',
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
