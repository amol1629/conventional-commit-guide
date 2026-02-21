'use client'

import { useState } from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GIT_COMMANDS } from '@/constants/git-commands'
import { GITHUB_FEATURES } from '@/constants/github-features'
import { WORKFLOWS } from '@/constants/workflows'
import { useTranslation } from '@/hooks/useTranslation'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
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

export function GitGitHubGuide() {
	const { t } = useTranslation(['common', 'git-guide'])
	const [activeTab, setActiveTab] = useState('git-basics')
	const [dropdownOpen, setDropdownOpen] = useState(false)

	const getTabLabel = (key: string) => t(`git-guide:${key}`)

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
								className="flex items-center justify-between gap-2 min-w-[240px] sm:min-w-[260px] px-4 py-2.5 rounded-lg border border-border  text-foreground text-sm font-medium transition-all duration-200 bg-purple-50 hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm dark:hover:bg-blue-950/30 dark:hover:border-blue-800/50 focus-visible:ring-2 focus-visible:ring-blue-500/20"
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
									className={`cursor-pointer rounded-md px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:bg-blue-50 focus:text-blue-700 dark:focus:bg-blue-950/40 dark:focus:text-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 ${
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
	)
}
