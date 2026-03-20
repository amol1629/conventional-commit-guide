'use client'

import {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useState,
} from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GIT_COMMANDS } from '@/constants/git-commands'
import { GITHUB_FEATURES } from '@/constants/github-features'
import { WORKFLOWS } from '@/constants/workflows'
import { GIT_GUIDE_CONTENT } from '@/content/git-guide-content'
import { useTranslation } from '@/hooks/useTranslation'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import type { GitCommand } from '@/types'
import { BestPracticesSection } from './git-guide/BestPracticesSection'
import { GitCommandsSection } from './git-guide/GitCommandsSection'
import { GitHubFeaturesSection } from './git-guide/GitHubFeaturesSection'
import { WorkflowsSection } from './git-guide/WorkflowsSection'

const TAB_OPTIONS = [
	{ value: 'git-basics', key: 'tabs_git_basics' },
	{ value: 'github-features', key: 'tabs_github_features' },
	{ value: 'workflows', key: 'tabs_workflows' },
	{ value: 'best-practices', key: 'tabs_best_practices' },
] as const

const pdfStyles = StyleSheet.create({
	page: {
		padding: 26,
		fontFamily: 'Helvetica',
		fontSize: 10,
		lineHeight: 1.4,
	},
	header: {
		backgroundColor: '#0f172a',
		padding: 16,
		borderRadius: 12,
		marginBottom: 18,
	},
	headerTitle: {
		color: '#ffffff',
		fontSize: 20,
		fontWeight: 800,
	},
	headerSubtitle: {
		color: '#cbd5e1',
		fontSize: 11,
		marginTop: 6,
		lineHeight: 1.35,
	},
	sectionHeader: {
		paddingVertical: 8,
		paddingHorizontal: 10,
		borderRadius: 10,
		marginBottom: 10,
	},
	sectionHeaderText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: 800,
	},
	card: {
		borderWidth: 1,
		borderColor: '#e5e7eb',
		borderRadius: 12,
		padding: 12,
		backgroundColor: '#ffffff',
		marginBottom: 12,
	},
	cardTitle: {
		color: '#0f172a',
		fontSize: 12,
		fontWeight: 800,
		marginBottom: 4,
	},
	cardText: {
		color: '#111827',
		fontSize: 10,
		lineHeight: 1.35,
		marginBottom: 6,
	},
	subTitle: {
		color: '#374151',
		fontSize: 10,
		fontWeight: 700,
		marginTop: 8,
		marginBottom: 4,
	},
	mutedText: {
		color: '#6b7280',
		fontSize: 10,
		lineHeight: 1.35,
		marginBottom: 6,
	},
	codeBlock: {
		backgroundColor: '#f3f4f6',
		borderRadius: 10,
		padding: 8,
		fontFamily: 'Courier',
		fontSize: 9,
		color: '#111827',
		marginBottom: 6,
	},
	bulletRow: {
		flexDirection: 'row',
		marginBottom: 3,
	},
	bulletDot: {
		width: 10,
		color: '#4f46e5',
		fontSize: 10,
	},
	bulletText: {
		flex: 1,
		color: '#111827',
		fontSize: 10,
		lineHeight: 1.35,
	},
	dotColorAccent: {
		color: '#0ea5e9',
	},
})

const pdfHexFromColorName = (name: string): string => {
	switch (name) {
		case 'blue':
			return '#2563eb'
		case 'emerald':
			return '#059669'
		case 'orange':
			return '#f97316'
		case 'purple':
			return '#7c3aed'
		case 'red':
			return '#ef4444'
		case 'green':
			return '#22c55e'
		case 'indigo':
			return '#4f46e5'
		case 'cyan':
			return '#06b6d4'
		default:
			return '#3b82f6'
	}
}

const BulletList = ({ items }: { items: string[] }) => (
	<View>
		{items.map((item, idx) => (
			<View key={`${idx}-${item}`} style={pdfStyles.bulletRow}>
				<Text style={pdfStyles.bulletDot}>•</Text>
				<Text style={pdfStyles.bulletText}>{item}</Text>
			</View>
		))}
	</View>
)

export type GitGitHubGuideHandle = {
	downloadPdf: () => Promise<void>
}

export const GitGitHubGuide = forwardRef<GitGitHubGuideHandle, object>(
	function GitGitHubGuide(_, ref) {
	const { t } = useTranslation(['common', 'git-guide'])
	const [activeTab, setActiveTab] = useState('git-basics')
	const [dropdownOpen, setDropdownOpen] = useState(false)
	const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

	const 	getTabLabel = (key: string) => t(`git-guide:${key}`)

	const downloadPdf = useCallback(async () => {
		if (isDownloadingPdf) return
		setIsDownloadingPdf(true)

		try {
			const numberList = (items: string[], accent = '#4f46e5') => (
				<View>
					{items.map((item, idx) => (
						<View key={`${idx}-${item}`} style={pdfStyles.bulletRow}>
							<Text style={[pdfStyles.bulletDot, { color: accent }]}>
								{idx + 1}.
							</Text>
							<Text style={pdfStyles.bulletText}>{item}</Text>
						</View>
					))}
				</View>
			)

			const doc = (
				<Document>
					<Page size="A4" style={pdfStyles.page}>
						<View style={pdfStyles.header}>
							<Text style={pdfStyles.headerTitle}>
								{GIT_GUIDE_CONTENT.hero.title}
							</Text>
							<Text style={pdfStyles.headerSubtitle}>
								{GIT_GUIDE_CONTENT.hero.description}
							</Text>
						</View>

						<View>
							<View
								style={[
									pdfStyles.sectionHeader,
									{ backgroundColor: '#2563eb' },
								]}
							>
								<Text style={pdfStyles.sectionHeaderText}>
									{GIT_GUIDE_CONTENT.tabs.gitBasics}
								</Text>
							</View>

							{(Object.entries(GIT_COMMANDS) as Array<[string, GitCommand[]]>).map(
								([category, commandList]) => (
								<View key={category} style={pdfStyles.card}>
									<Text style={pdfStyles.cardTitle}>
										{category === 'basic'
											? 'Basic Commands'
											: category === 'advanced'
												? 'Advanced Commands'
												: 'Workflow Commands'}
									</Text>

									{commandList.map((cmd, idx) => (
										<View key={`${cmd.command}-${idx}`}>
											<Text style={pdfStyles.subTitle}>{cmd.command}</Text>
											<Text style={pdfStyles.cardText}>{cmd.description}</Text>

											{!!cmd.example && (
												<Text style={pdfStyles.codeBlock}>{cmd.example}</Text>
											)}

											<Text style={pdfStyles.cardText}>{cmd.details}</Text>

											{!!cmd.useCases?.length && (
												<View>
													<Text style={pdfStyles.subTitle}>Use Cases</Text>
													<BulletList items={cmd.useCases} />
												</View>
											)}

											{!!cmd.options?.length && (
												<View>
													<Text style={pdfStyles.subTitle}>Options</Text>
													<BulletList items={cmd.options} />
												</View>
											)}
										</View>
									))}
								</View>
							))}

							<View
								style={[
									pdfStyles.sectionHeader,
									{ backgroundColor: '#7c3aed' },
								]}
							>
								<Text style={pdfStyles.sectionHeaderText}>
									{GIT_GUIDE_CONTENT.tabs.githubFeatures}
								</Text>
							</View>

							{GITHUB_FEATURES.map((feature, idx) => {
								const hex = pdfHexFromColorName(feature.color)
								return (
									<View
										key={`${feature.name}-${idx}`}
										style={[
											pdfStyles.card,
											{ borderColor: hex },
										]}
									>
										<Text style={[pdfStyles.cardTitle, { color: hex }]}>
											{feature.name}
										</Text>
										<Text style={pdfStyles.cardText}>{feature.description}</Text>
										<Text style={pdfStyles.mutedText}>{feature.details}</Text>

										<Text style={pdfStyles.subTitle}>Benefits</Text>
										<BulletList items={feature.benefits} />

										<Text style={pdfStyles.subTitle}>Use Cases</Text>
										<BulletList items={feature.useCases} />

										<Text style={pdfStyles.subTitle}>Best Practices</Text>
										<BulletList items={feature.bestPractices} />
									</View>
								)
							})}

							<View
								style={[
									pdfStyles.sectionHeader,
									{ backgroundColor: '#06b6d4' },
								]}
							>
								<Text style={pdfStyles.sectionHeaderText}>
									{GIT_GUIDE_CONTENT.tabs.workflows}
								</Text>
							</View>

							{WORKFLOWS.map((workflow, idx) => (
								<View key={`${workflow.name}-${idx}`} style={pdfStyles.card}>
									<Text style={pdfStyles.cardTitle}>{workflow.name}</Text>
									<Text style={pdfStyles.cardText}>{workflow.description}</Text>
									<Text style={pdfStyles.mutedText}>{workflow.details}</Text>

									<Text style={pdfStyles.subTitle}>Steps</Text>
									{numberList(workflow.steps, '#0ea5e9')}

									<Text style={pdfStyles.subTitle}>Pros</Text>
									<BulletList items={workflow.pros} />

									<Text style={pdfStyles.subTitle}>Cons</Text>
									<BulletList items={workflow.cons} />

									<Text style={pdfStyles.subTitle}>Use Cases</Text>
									<BulletList items={workflow.useCases} />

									<Text style={pdfStyles.subTitle}>Best Practices</Text>
									<BulletList items={workflow.bestPractices} />
								</View>
							))}

							<View
								style={[
									pdfStyles.sectionHeader,
									{ backgroundColor: '#ef4444' },
								]}
							>
								<Text style={pdfStyles.sectionHeaderText}>
									{GIT_GUIDE_CONTENT.tabs.bestPractices}
								</Text>
							</View>

							{(Object.entries(GIT_GUIDE_CONTENT.bestPractices) as Array<
								[string, unknown]
							>).map(([key, group]) => {
								const base = group as { title: string; description: string }

								return (
									<View key={key} style={pdfStyles.card}>
										<Text style={pdfStyles.cardTitle}>{base.title}</Text>
										<Text style={pdfStyles.cardText}>
											{base.description}
										</Text>

										{key === 'commit' && (
											<View>
												<Text style={pdfStyles.subTitle}>Do&apos;s</Text>
												<BulletList
													items={(group as { dos: string[] }).dos}
												/>
												<Text style={pdfStyles.subTitle}>Don&apos;ts</Text>
												<BulletList
													items={(group as { donts: string[] }).donts}
												/>
											</View>
										)}

										{key === 'branching' && (
											<View>
												<Text style={pdfStyles.subTitle}>Best Practices</Text>
												<BulletList
													items={(group as { bestPractices: string[] }).bestPractices}
												/>
												<Text style={pdfStyles.subTitle}>Pro Tips</Text>
												<BulletList
													items={(group as { proTips: string[] }).proTips}
												/>
											</View>
										)}

										{key === 'collaboration' && (
											<View>
												<Text style={pdfStyles.subTitle}>Best Practices</Text>
												<BulletList
													items={(group as { bestPractices: string[] }).bestPractices}
												/>
												<Text style={pdfStyles.subTitle}>Team Tips</Text>
												<BulletList
													items={(group as { teamTips: string[] }).teamTips}
												/>
											</View>
										)}

										{key === 'security' && (
											<View>
												<Text style={pdfStyles.subTitle}>
													Security Essentials
												</Text>
												<BulletList
													items={(group as { essentials: string[] }).essentials}
												/>
												<Text style={pdfStyles.subTitle}>
													Advanced Security
												</Text>
												<BulletList
													items={(group as { advanced: string[] }).advanced}
												/>
											</View>
										)}

										{key === 'performance' && (
											<View>
												<Text style={pdfStyles.subTitle}>
													Performance Tips
												</Text>
												<BulletList
													items={
														(group as { performanceTips: string[] }).performanceTips
													}
												/>
												<Text style={pdfStyles.subTitle}>Tools</Text>
												<BulletList
													items={(group as { tools: string[] }).tools}
												/>
											</View>
										)}
									</View>
								)
							})}
						</View>
					</Page>
				</Document>
			)

			const blob = await pdf(doc).toBlob()
			const url = URL.createObjectURL(blob)
			const anchor = document.createElement('a')
			anchor.href = url
			anchor.download = 'git-guide.pdf'
			anchor.click()
			setTimeout(() => URL.revokeObjectURL(url), 1000)
		} catch (error) {
			console.error('PDF generation failed:', error)
			alert('Failed to generate PDF. Please try again.')
		} finally {
			setIsDownloadingPdf(false)
		}
	}, [isDownloadingPdf])

	useImperativeHandle(ref, () => ({ downloadPdf }), [downloadPdf])

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			<div className="space-y-4 text-center">
				<div className="flex justify-center mb-4">
					{/* <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl">
						{getFontAwesomeIcon('Github', 'w-8 h-8 text-white')}
					</div> */}
				</div>
				{/* <h1 className="text-5xl font-bold text-foreground">
					{t('git-guide:hero_title')}
				</h1>
				<p className="max-w-3xl mx-auto text-xl text-muted-foreground">
					{t('git-guide:hero_description')}
				</p> */}
			</div>

			<div>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				{/* Desktop Tabs - Hidden on md, visible on lg+ */}
				<div className="hidden lg:block">
					<TabsList className="grid w-full grid-cols-4 rounded-full">
						{TAB_OPTIONS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								className="transition-colors rounded-full hover:bg-accent hover:text-accent-foreground"
								value={tab.value}
							>
								{getTabLabel(tab.key)}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				{/* Mobile/Tablet Dropdown - Visible on md and below, hidden on lg+ */}
				<div className="flex justify-end lg:hidden">
					<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
						<DropdownMenuTrigger
							asChild
							className="outline-none"
						>
							<button
								className="flex items-center justify-between gap-2 min-w-[240px] sm:min-w-[260px] px-4 py-2.5 rounded-full border border-border  text-foreground text-sm font-medium transition-all duration-200 bg-purple-50 hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm dark:hover:bg-blue-950/30 dark:hover:border-blue-800/50 focus-visible:ring-2 focus-visible:ring-blue-500/20"
								aria-label="Select tab"
							>
								<span>
									{getTabLabel(
										TAB_OPTIONS.find((tab) => tab.value === activeTab)?.key ||
											'tabs_git_basics',
									)}
								</span>
								<span
									className={`text-muted-foreground transition-transform duration-200 ${
										dropdownOpen ? 'rotate-180' : ''
									}`}
								>
									{getFontAwesomeIcon('ChevronDown', 'w-4 h-4')}
								</span>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="min-w-[240px] bg-purple-50 sm:min-w-[260px] mt-2 rounded-lg border border-border bg-popover p-1.5 shadow-lg ring-1 ring-black/5 dark:ring-white/5 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
						>
							{TAB_OPTIONS.map((tab) => (
								<DropdownMenuItem
									key={tab.value}
									onClick={() => {
										setActiveTab(tab.value)
										setDropdownOpen(false)
									}}
									className={`cursor-pointer rounded-full px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:bg-blue-50 focus:text-blue-700 dark:focus:bg-blue-950/40 dark:focus:text-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 ${
										activeTab === tab.value
											? 'bg-blue-100 text-blue-800 font-medium dark:bg-blue-900/50 dark:text-blue-200'
											: 'text-foreground'
									}`}
								>
									<span className="flex items-center w-full gap-2">
										<span>{getTabLabel(tab.key)}</span>
										{activeTab === tab.value &&
											getFontAwesomeIcon('Check', 'ml-auto h-4 w-4 opacity-80')}
									</span>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<TabsContent value="git-basics" className="space-y-6">
					<GitCommandsSection commands={GIT_COMMANDS} />
				</TabsContent>

				<TabsContent value="github-features" className="space-y-6">
					<GitHubFeaturesSection features={GITHUB_FEATURES} />
				</TabsContent>

				<TabsContent value="workflows" className="space-y-6">
					<WorkflowsSection workflows={WORKFLOWS} />
				</TabsContent>

				<TabsContent value="best-practices" className="space-y-6">
					<BestPracticesSection />
				</TabsContent>
			</Tabs>
			</div>
		</div>
	)
	},
)
