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
import { ChangelogEntry } from '@/types'
import {
	generateChangelog,
	getCommitColor,
	getCommitIcon,
} from '@/utils/changelog-generator'
import { copyToClipboard, downloadFile } from '@/utils/clipboard'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { useState } from 'react'

interface ChangelogGeneratorSectionProps {
	commits: ChangelogEntry[]
}

export function ChangelogGeneratorSection({
	commits,
}: ChangelogGeneratorSectionProps) {
	const [generatedChangelog, setGeneratedChangelog] = useState('')
	const [copied, setCopied] = useState(false)

	const handleGenerate = () => {
		const changelog = generateChangelog(commits)
		setGeneratedChangelog(changelog)
	}

	const handleCopy = async () => {
		await copyToClipboard(generatedChangelog)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	const handleDownload = () => {
		downloadFile(generatedChangelog, 'CHANGELOG.md')
	}

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			{/* Commits Input */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{getFontAwesomeIcon('GitCommit', 'w-5 h-5')}
						Conventional Commits
					</CardTitle>
					<CardDescription>
						Your commit history will be used to generate the changelog
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{commits.map((commit, index) => (
						<div key={index} className="p-3 border rounded-lg">
							<div className="flex items-center gap-2 mb-2">
								<span className="text-lg">{getCommitIcon(commit.type)}</span>
								<Badge className={getCommitColor(commit.type)}>
									{commit.type}
								</Badge>
								{commit.scope && (
									<Badge variant="outline">{commit.scope}</Badge>
								)}
								{commit.breaking && (
									<Badge variant="destructive">BREAKING</Badge>
								)}
							</div>
							<p className="text-sm font-medium">{commit.message}</p>
							<div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
								<span>{commit.author}</span>
								<span>•</span>
								<span>{commit.date}</span>
								<span>•</span>
								<span className="font-mono">{commit.hash}</span>
							</div>
						</div>
					))}
					<Button onClick={handleGenerate} className="w-full">
						Generate Changelog
					</Button>
				</CardContent>
			</Card>

			{/* Generated Changelog */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{getFontAwesomeIcon('FileText', 'w-5 h-5')}
						Generated Changelog
					</CardTitle>
					<CardDescription>
						Professional changelog generated from your commits
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex gap-2">
						<Button onClick={handleCopy} size="sm">
							{copied
								? getFontAwesomeIcon('CheckCircle', 'w-4 h-4 mr-2')
								: getFontAwesomeIcon('Copy', 'w-4 h-4 mr-2')}
							{copied ? 'Copied!' : 'Copy'}
						</Button>
						<Button onClick={handleDownload} variant="outline" size="sm">
							{getFontAwesomeIcon('Download', 'w-4 h-4 mr-2')}
							Download
						</Button>
					</div>
					<div className="p-4 overflow-y-auto rounded-lg bg-muted max-h-96">
						<pre className="font-mono text-sm whitespace-pre-wrap">
							{generatedChangelog ||
								'Click "Generate Changelog" to create your changelog'}
						</pre>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
