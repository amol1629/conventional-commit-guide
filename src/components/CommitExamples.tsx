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
import { ExamplesTabs } from '@/components/ui/custom-tabs'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import toast from 'react-hot-toast'

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
	const copyToClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text)
		toast.success('Copied to clipboard!\nCommit message copied successfully!')
	}

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

			<ExamplesTabs
				defaultValue="feat"
				tabs={Object.entries(EXAMPLES).map(([type, examples]) => ({
					value: type,
					label: type,
					content: (
						<div className="grid gap-4">
							{examples.map((example, index) => (
								<Card key={index} className="transition-shadow hover:shadow-md">
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
				}))}
			/>

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
