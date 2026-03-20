'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { GIT_GUIDE_CONTENT } from '@/content/git-guide-content'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { useState } from 'react'
import toast from 'react-hot-toast'

export function BestPracticesSection() {
	const { bestPractices } = GIT_GUIDE_CONTENT
	const [copiedText, setCopiedText] = useState<string | null>(null)

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedText(text)
			toast.success('Copied to clipboard!')
			setTimeout(() => setCopiedText(null), 2000)
		} catch (error) {
			toast.error('Failed to copy to clipboard')
		}
	}

	// Helper function to extract and copy git commands from text
	const extractGitCommand = (text: string): string | null => {
		const gitMatch = text.match(/git\s+[\w\s-]+|`([^`]+)`/)
		return gitMatch ? (gitMatch[1] || gitMatch[0]) : null
	}

	return (
		<div className="grid gap-6">
			<Card className="overflow-hidden transition-all duration-300 ease-linear hover:border-l-4 hover:border-l-cyan-500 hover:shadow-lg  hover:dark:from-cyan-900/20 hover:dark:to-blue-900/20">
				<CardHeader>
					<CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
						<div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 border-2 border-blue-200 dark:border-blue-800 shadow-md hover:shadow-lg transition-all">
							{getFontAwesomeIcon('GitCommit', 'w-6 h-6 text-blue-600 dark:text-blue-400')}
						</div>
						{bestPractices.commit.title}
					</CardTitle>
					<CardDescription className="text-lg text-gray-600 dark:text-gray-300">
						{bestPractices.commit.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-4">
							<h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2 text-lg">

								Do&apos;s
							</h4>
							<ul className="space-y-2.5 text-base">
								{bestPractices.commit.dos.map((item, index) => {
									const gitCommand = extractGitCommand(item)
									return (
										<li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 group relative">
											{getFontAwesomeIcon(
												'Check',
												'w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0',
											)}
											<span className="leading-relaxed flex-1">{item}</span>
											{gitCommand && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => copyToClipboard(gitCommand)}
													className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
													title="Copy command"
												>
													{copiedText === gitCommand
														? getFontAwesomeIcon('Check', 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400')
														: getFontAwesomeIcon('Copy', 'w-3.5 h-3.5 text-gray-500 dark:text-gray-400')}
												</Button>
											)}
										</li>
									)
								})}
							</ul>
						</div>
						<div className="space-y-4">
							<h4 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2 text-lg">

								Don&apos;ts
							</h4>
							<ul className="space-y-2.5 text-base">
								{bestPractices.commit.donts.map((item, index) => {
									const gitCommand = extractGitCommand(item)
									return (
										<li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 group relative">
											{getFontAwesomeIcon(
												'AlertTriangle',
												'w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0',
											)}
											<span className="leading-relaxed flex-1">{item}</span>
											{gitCommand && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => copyToClipboard(gitCommand)}
													className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
													title="Copy command"
												>
													{copiedText === gitCommand
														? getFontAwesomeIcon('Check', 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400')
														: getFontAwesomeIcon('Copy', 'w-3.5 h-3.5 text-gray-500 dark:text-gray-400')}
												</Button>
											)}
										</li>
									)
								})}
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="overflow-hidden transition-all duration-300 ease-linear hover:border-l-4 hover:border-l-cyan-500 hover:shadow-lg  hover:dark:from-cyan-900/20 hover:dark:to-blue-900/20">
				<CardHeader>
					<CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
						<div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-blue-900/30 border-2 border-purple-200 dark:border-purple-800 shadow-md hover:shadow-lg transition-all">
							{getFontAwesomeIcon('GitBranch', 'w-6 h-6 text-purple-600 dark:text-purple-400')}
						</div>
						{bestPractices.branching.title}
					</CardTitle>
					<CardDescription className="text-lg text-gray-600 dark:text-gray-300">
						{bestPractices.branching.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-4">
							<h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2 text-lg">

								Best Practices
							</h4>
							<ul className="space-y-2.5 text-base">
								{bestPractices.branching.bestPractices.map((item, index) => {
									const gitCommand = extractGitCommand(item)
									return (
										<li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 group relative">
											{getFontAwesomeIcon(
												'Star',
												'w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0',
											)}
											<span className="leading-relaxed flex-1">{item}</span>
											{gitCommand && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => copyToClipboard(gitCommand)}
													className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
													title="Copy command"
												>
													{copiedText === gitCommand
														? getFontAwesomeIcon('Check', 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400')
														: getFontAwesomeIcon('Copy', 'w-3.5 h-3.5 text-gray-500 dark:text-gray-400')}
												</Button>
											)}
										</li>
									)
								})}
							</ul>
						</div>
						<div className="space-y-4">
							<h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 text-lg">

								Pro Tips
							</h4>
							<ul className="space-y-2.5 text-base">
								{bestPractices.branching.proTips.map((item, index) => {
									const gitCommand = extractGitCommand(item)
									return (
										<li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 group relative">
											{getFontAwesomeIcon(
												'Lightbulb',
												'w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0',
											)}
											<span className="leading-relaxed flex-1">{item}</span>
											{gitCommand && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => copyToClipboard(gitCommand)}
													className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
													title="Copy command"
												>
													{copiedText === gitCommand
														? getFontAwesomeIcon('Check', 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400')
														: getFontAwesomeIcon('Copy', 'w-3.5 h-3.5 text-gray-500 dark:text-gray-400')}
												</Button>
											)}
										</li>
									)
								})}
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="overflow-hidden transition-all duration-300 ease-linear hover:border-l-4 hover:border-l-cyan-500 hover:shadow-lg  hover:dark:from-cyan-900/20 hover:dark:to-blue-900/20">
				<CardHeader>
					<CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
						<div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 border-2 border-emerald-200 dark:border-emerald-800 shadow-md hover:shadow-lg transition-all">
							{getFontAwesomeIcon('Users', 'w-6 h-6 text-emerald-600 dark:text-emerald-400')}
						</div>
						{bestPractices.collaboration.title}
					</CardTitle>
					<CardDescription className="text-lg text-gray-600 dark:text-gray-300">
						{bestPractices.collaboration.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-4">
							<h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2 text-lg">

								Collaboration Best Practices
							</h4>
							<ul className="space-y-2.5 text-base">
								{bestPractices.collaboration.bestPractices.map(
									(item, index) => {
										const gitCommand = extractGitCommand(item)
										return (
											<li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 group relative">
												{getFontAwesomeIcon(
													'CheckCircle',
													'w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0',
												)}
												<span className="leading-relaxed flex-1">{item}</span>
												{gitCommand && (
													<Button
														variant="ghost"
														size="sm"
														onClick={() => copyToClipboard(gitCommand)}
														className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
														title="Copy command"
													>
														{copiedText === gitCommand
															? getFontAwesomeIcon('Check', 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400')
															: getFontAwesomeIcon('Copy', 'w-3.5 h-3.5 text-gray-500 dark:text-gray-400')}
													</Button>
												)}
											</li>
										)
									},
								)}
							</ul>
						</div>
						<div className="space-y-4">
							<h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 text-lg">

								Team Tips
							</h4>
							<ul className="space-y-2.5 text-base">
								{bestPractices.collaboration.teamTips.map((item, index) => {
									const gitCommand = extractGitCommand(item)
									return (
										<li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 group relative">
											{getFontAwesomeIcon(
												'Lightbulb',
												'w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0',
											)}
											<span className="leading-relaxed flex-1">{item}</span>
											{gitCommand && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => copyToClipboard(gitCommand)}
													className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
													title="Copy command"
												>
													{copiedText === gitCommand
														? getFontAwesomeIcon('Check', 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400')
														: getFontAwesomeIcon('Copy', 'w-3.5 h-3.5 text-gray-500 dark:text-gray-400')}
												</Button>
											)}
										</li>
									)
								})}
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="overflow-hidden transition-all duration-300 ease-linear hover:border-l-4 hover:border-l-cyan-500 hover:shadow-lg  hover:dark:from-cyan-900/20 hover:dark:to-blue-900/20">
				<CardHeader>
					<CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
						<div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-red-900/30 dark:via-pink-900/30 dark:to-orange-900/30 border-2 border-red-200 dark:border-red-800 shadow-md hover:shadow-lg transition-all">
							{getFontAwesomeIcon('Shield', 'w-6 h-6 text-red-600 dark:text-red-400')}
						</div>
						{bestPractices.security.title}
					</CardTitle>
					<CardDescription className="text-lg text-gray-600 dark:text-gray-300">
						{bestPractices.security.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-4">
							<h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2 text-lg">

								Security Essentials
							</h4>
							<ul className="space-y-2.5 text-base">
								{bestPractices.security.essentials.map((item, index) => {
									const gitCommand = extractGitCommand(item)
									return (
										<li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 group relative">
											{getFontAwesomeIcon(
												'CheckCircle',
												'w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0',
											)}
											<span className="leading-relaxed flex-1">{item}</span>
											{gitCommand && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => copyToClipboard(gitCommand)}
													className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
													title="Copy command"
												>
													{copiedText === gitCommand
														? getFontAwesomeIcon('Check', 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400')
														: getFontAwesomeIcon('Copy', 'w-3.5 h-3.5 text-gray-500 dark:text-gray-400')}
												</Button>
											)}
										</li>
									)
								})}
							</ul>
						</div>
						<div className="space-y-4">
							<h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 text-lg">

								Advanced Security
							</h4>
							<ul className="space-y-2.5 text-base">
								{bestPractices.security.advanced.map((item, index) => {
									const gitCommand = extractGitCommand(item)
									return (
										<li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 group relative">
											{getFontAwesomeIcon(
												'Key',
												'w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0',
											)}
											<span className="leading-relaxed flex-1">{item}</span>
											{gitCommand && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => copyToClipboard(gitCommand)}
													className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
													title="Copy command"
												>
													{copiedText === gitCommand
														? getFontAwesomeIcon('Check', 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400')
														: getFontAwesomeIcon('Copy', 'w-3.5 h-3.5 text-gray-500 dark:text-gray-400')}
												</Button>
											)}
										</li>
									)
								})}
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="overflow-hidden transition-all duration-300 ease-linear hover:border-l-4 hover:border-l-cyan-500 hover:shadow-lg  hover:dark:from-cyan-900/20 hover:dark:to-blue-900/20"	>
				<CardHeader>
					<CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
						<div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-orange-900/30 dark:via-yellow-900/30 dark:to-amber-900/30 border-2 border-orange-200 dark:border-orange-800 shadow-md hover:shadow-lg transition-all">
							{getFontAwesomeIcon('Zap', 'w-6 h-6 text-orange-600 dark:text-orange-400')}
						</div>
						{bestPractices.performance.title}
					</CardTitle>
					<CardDescription className="text-lg text-gray-600 dark:text-gray-300">
						{bestPractices.performance.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">
					<div className="grid gap-5 md:grid-cols-2">
						<div className="space-y-4">
							<h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-2 text-lg">

								Performance Tips
							</h4>
							<ul className="space-y-2.5 text-base">
								{bestPractices.performance.performanceTips.map(
									(item, index) => {
										const gitCommand = extractGitCommand(item)
										return (
											<li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 group relative">
												{getFontAwesomeIcon(
													'CheckCircle',
													'w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0',
												)}
												<span className="leading-relaxed flex-1">{item}</span>
												{gitCommand && (
													<Button
														variant="ghost"
														size="sm"
														onClick={() => copyToClipboard(gitCommand)}
														className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
														title="Copy command"
													>
														{copiedText === gitCommand
															? getFontAwesomeIcon('Check', 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400')
															: getFontAwesomeIcon('Copy', 'w-3.5 h-3.5 text-gray-500 dark:text-gray-400')}
													</Button>
												)}
											</li>
										)
									},
								)}
							</ul>
						</div>
						<div className="space-y-4">
							<h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 text-lg">
								{getFontAwesomeIcon(
									'Wrench',
									'w-5 h-5 text-blue-600 dark:text-blue-400',
								)}
								Tools & Automation
							</h4>
							<ul className="space-y-2.5 text-base">
								{bestPractices.performance.tools.map((item, index) => {
									const gitCommand = extractGitCommand(item)
									return (
										<li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 group relative">
											{getFontAwesomeIcon(
												'Lightbulb',
												'w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0',
											)}
											<span className="leading-relaxed flex-1">{item}</span>
											{gitCommand && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => copyToClipboard(gitCommand)}
													className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
													title="Copy command"
												>
													{copiedText === gitCommand
														? getFontAwesomeIcon('Check', 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400')
														: getFontAwesomeIcon('Copy', 'w-3.5 h-3.5 text-gray-500 dark:text-gray-400')}
												</Button>
											)}
										</li>
									)
								})}
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
