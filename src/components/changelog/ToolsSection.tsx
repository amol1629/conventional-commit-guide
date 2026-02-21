'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { CHANGELOG_TEMPLATES } from '@/constants/changelog-data'
import { CHANGELOG_CONTENT } from '@/content/changelog-content'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import Link from 'next/link'

export function ToolsSection() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					{getFontAwesomeIcon('Zap', 'w-5 h-5')}
					Changelog Generation Tools
				</CardTitle>
				<CardDescription>
					Professional tools for generating changelogs from Git history
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid gap-4 md:grid-cols-3">
					{Object.entries(CHANGELOG_TEMPLATES).map(([key, tool]) => (
						<Card key={key} className="transition-shadow hover:shadow-md">
							<CardHeader className="flex flex-row items-center p-4 space-x-4">
								<div className="flex items-center justify-center w-10 h-10 text-blue-600 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-400">
									{tool.icon}
								</div>
								<div>
									<CardTitle className="text-lg">{tool.name}</CardTitle>
									<CardDescription>{tool.description}</CardDescription>
								</div>
							</CardHeader>
							<CardContent className="p-4 pt-0">
								<ul className="pl-5 mb-4 space-y-1 text-sm list-disc text-muted-foreground">
									{tool.features.map((feature, index) => (
										<li key={index}>{feature}</li>
									))}
								</ul>
								<Button variant="outline" size="sm" asChild>
									<Link
										href={tool.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										{getFontAwesomeIcon('ArrowRight', 'w-4 h-4 mr-2')}
										Visit
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="p-6 rounded-lg bg-muted">
					<h3 className="mb-3 font-semibold">Quick Setup with git-cliff</h3>
					<div className="space-y-2">
						<pre className="p-3 font-mono text-sm rounded bg-background">
							{CHANGELOG_CONTENT.gitCliffSetup}
						</pre>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
