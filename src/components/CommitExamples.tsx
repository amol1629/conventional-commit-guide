'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import toast from 'react-hot-toast'
import { useMemo, useState } from 'react'

const EXAMPLES = {
	feat: [
		{
			commit: 'feat(auth): add OAuth2 login support',
			description: 'Simple feature addition',
			project: 'React App',
		},
		{
			commit: 'feat(api)!: implement new REST API endpoints',
			description: 'Breaking change feature',
			project: 'Node.js API',
		},
		{
			commit:
				'feat(ui): add dark mode toggle\n\n- Add theme provider\n- Update all components\n- Add persistence',
			description: 'Feature with detailed body',
			project: 'Next.js App',
		},
	],
	fix: [
		{
			commit: 'fix: resolve memory leak in data processing',
			description: 'Bug fix without scope',
			project: 'Data Pipeline',
		},
		{
			commit: 'fix(ui): correct button alignment on mobile',
			description: 'UI bug fix',
			project: 'Mobile App',
		},
		{
			commit: 'fix(api): handle null values in user endpoint\n\nCloses #123',
			description: 'Bug fix with issue reference',
			project: 'Express API',
		},
	],
	docs: [
		{
			commit: 'docs: update README with installation steps',
			description: 'Documentation update',
			project: 'Open Source Library',
		},
		{
			commit: 'docs(api): add JSDoc comments to all endpoints',
			description: 'API documentation',
			project: 'REST API',
		},
	],
	refactor: [
		{
			commit: 'refactor: extract user validation logic',
			description: 'Code refactoring',
			project: 'User Service',
		},
		{
			commit: 'refactor(components): simplify prop interfaces',
			description: 'Component refactoring',
			project: 'React Components',
		},
	],
	perf: [
		{
			commit: 'perf: optimize database queries',
			description: 'Performance improvement',
			project: 'Database Layer',
		},
		{
			commit: 'perf(ui): lazy load images in gallery',
			description: 'UI performance optimization',
			project: 'Image Gallery',
		},
	],
	test: [
		{
			commit: 'test: add unit tests for user service',
			description: 'Adding tests',
			project: 'Test Suite',
		},
		{
			commit: 'test(integration): add API endpoint tests',
			description: 'Integration tests',
			project: 'API Testing',
		},
	],
	chore: [
		{
			commit: 'chore: update dependencies to latest versions',
			description: 'Dependency updates',
			project: 'Package Management',
		},
		{
			commit: 'chore(ci): update GitHub Actions workflow',
			description: 'CI/CD updates',
			project: 'CI Pipeline',
		},
	],
}

export function CommitExamples() {
	const [activeTab, setActiveTab] = useState<string>('feat')
	const [dropdownOpen, setDropdownOpen] = useState(false)

	const copyToClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text)
		toast.success('Copied to clipboard!\nCommit message copied successfully!')
	}

	const tabs = useMemo(
		() =>
			Object.entries(EXAMPLES).map(([type, examples]) => ({
				value: type,
				label: type,
				content: (
					<div className="grid gap-4">
						{examples.map((example, index) => (
							<Card
								key={index}
								className="transition-shadow hover:shadow-md"
							>
								<CardHeader>
									<div className="flex items-start justify-between">
										<div className="space-y-1">
											<CardTitle className="font-mono text-lg">
												{example.commit.split('\n')[0]}
											</CardTitle>
											<CardDescription>{example.description}</CardDescription>
										</div>
										<div className="flex gap-2">
											<Badge variant="secondary">{example.project}</Badge>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => copyToClipboard(example.commit)}
											>
												{getFontAwesomeIcon('Copy', 'w-4 h-4')}
											</Button>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<pre className="p-4 font-mono text-sm whitespace-pre-wrap rounded-lg bg-muted">
										{example.commit}
									</pre>
								</CardContent>
							</Card>
						))}
					</div>
				),
			})),
		[],
	)

	return (
		<div className="max-w-6xl mx-auto space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-4xl font-bold text-foreground">
					Real-World Examples
				</h1>
				<p className="text-lg text-muted-foreground">
					Learn from actual commit messages used in popular open source projects
				</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				{/* Desktop Tabs - Hidden on md, visible on lg+ */}
				<div className="hidden lg:block">
					<TabsList className="grid w-full rounded-full grid-cols-4 lg:grid-cols-8">
						{tabs.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="rounded-full hover:bg-accent hover:text-accent-foreground transition-colors text-xs"
							>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				{/* Mobile/Tablet Dropdown - Visible on md and below, hidden on lg+ */}
				<div className="flex justify-end lg:hidden">
					<DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
						<DropdownMenuTrigger asChild>
							<button
								className="flex items-center justify-between gap-2 min-w-[240px] sm:min-w-[260px] px-4 py-2.5 rounded-full border border-border text-foreground text-sm font-medium transition-all duration-200 bg-purple-50 hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm dark:hover:bg-blue-950/30 dark:hover:border-blue-800/50 focus-visible:ring-2 focus-visible:ring-blue-500/20"
								aria-label="Select examples category"
							>
								<span>{tabs.find((t) => t.value === activeTab)?.label ?? 'feat'}</span>
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
							{tabs.map((tab) => (
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
										<span>{tab.label}</span>
										{activeTab === tab.value &&
											getFontAwesomeIcon(
												'Check',
												'ml-auto h-4 w-4 opacity-80',
											)}
									</span>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{tabs.map((tab) => (
					<TabsContent key={tab.value} value={tab.value} className="space-y-4">
						{tab.content}
					</TabsContent>
				))}
			</Tabs>

			{/* Best Practices */}
			<Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-800">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<span>💡</span>
						Best Practices
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<h4 className="mb-2 font-semibold">✅ Do&apos;s</h4>
							<ul className="space-y-1 text-sm text-muted-foreground">
								<li>
									• Use imperative mood (&quot;add&quot; not &quot;added&quot;)
								</li>
								<li>• Keep the subject line under 50 characters</li>
								<li>• Capitalize the first letter of the subject</li>
								<li>• Don&apos;t end the subject with a period</li>
								<li>• Use the body to explain what and why</li>
							</ul>
						</div>
						<div>
							<h4 className="mb-2 font-semibold">❌ Don&apos;ts</h4>
							<ul className="space-y-1 text-sm text-muted-foreground">
								<li>• Don&apos;t use vague descriptions</li>
								<li>• Don&apos;t mix multiple changes in one commit</li>
								<li>
									• Don&apos;t use past tense (&quot;fixed&quot; not
									&quot;fix&quot;)
								</li>
								<li>• Don&apos;t make the subject too long</li>
								<li>• Don&apos;t forget to reference issues/PRs</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
