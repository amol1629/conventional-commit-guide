'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { CHANGELOG_CONTENT } from '@/content/changelog-content'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

export function ExamplesSection() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					{getFontAwesomeIcon('Code', 'w-5 h-5')}
					Changelog Examples
				</CardTitle>
				<CardDescription>
					See how different projects structure their changelogs
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<h4 className="font-semibold">Keep a Changelog Format</h4>
						<div className="p-3 font-mono text-sm rounded bg-muted">
							<pre>{CHANGELOG_CONTENT.examples.keepAChangelog}</pre>
						</div>
					</div>
					<div className="space-y-2">
						<h4 className="font-semibold">Conventional Commits Format</h4>
						<div className="p-3 font-mono text-sm rounded bg-muted">
							<pre>{CHANGELOG_CONTENT.examples.conventionalCommits}</pre>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
