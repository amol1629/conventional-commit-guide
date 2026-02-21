'use client'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import Link from 'next/link'
import { useState } from 'react'

const CHANGELOG_EXAMPLES = {
	markdown: `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New user authentication system
- Dark mode support

### Changed
- Updated API endpoints structure

### Fixed
- Resolved memory leak in data processing
- Fixed button alignment on mobile devices

## [1.2.0] - 2024-01-15

### Added
- OAuth2 login support
- User profile management
- Email notifications

### Changed
- Improved database query performance
- Updated UI components

### Fixed
- Fixed login validation bug
- Resolved session timeout issues

## [1.1.0] - 2024-01-01

### Added
- Basic user authentication
- API documentation

### Fixed
- Initial security vulnerabilities

## [1.0.0] - 2023-12-01

### Added
- Initial project release
- Core functionality
- Basic documentation`,

	json: `{
  "name": "my-awesome-project",
  "version": "1.2.0",
  "changelog": {
    "1.2.0": {
      "date": "2024-01-15",
      "added": [
        "OAuth2 login support",
        "User profile management",
        "Email notifications"
      ],
      "changed": [
        "Improved database query performance",
        "Updated UI components"
      ],
      "fixed": [
        "Fixed login validation bug",
        "Resolved session timeout issues"
      ]
    },
    "1.1.0": {
      "date": "2024-01-01",
      "added": [
        "Basic user authentication",
        "API documentation"
      ],
      "fixed": [
        "Initial security vulnerabilities"
      ]
    }
  }
}`,

	yaml: `name: my-awesome-project
version: 1.2.0
changelog:
  1.2.0:
    date: 2024-01-15
    added:
      - OAuth2 login support
      - User profile management
      - Email notifications
    changed:
      - Improved database query performance
      - Updated UI components
    fixed:
      - Fixed login validation bug
      - Resolved session timeout issues
  1.1.0:
    date: 2024-01-01
    added:
      - Basic user authentication
      - API documentation
    fixed:
      - Initial security vulnerabilities`,
}

const CHANGELOG_TOOLS = [
	{
		name: 'Conventional Changelog',
		description: 'Generate changelogs from git metadata',
		url: 'https://github.com/conventional-changelog/conventional-changelog',
		features: ['Automated generation', 'Multiple formats', 'Git integration'],
		icon: getFontAwesomeIcon('GitBranch', 'w-5 h-5'),
	},
	{
		name: 'Release Please',
		description: 'Automated release management',
		url: 'https://github.com/googleapis/release-please',
		features: ['Automated releases', 'Version bumping', 'PR generation'],
		icon: getFontAwesomeIcon('Tag', 'w-5 h-5'),
	},
	{
		name: 'Auto Changelog',
		description: 'Simple changelog generator',
		url: 'https://github.com/CookPete/auto-changelog',
		features: ['Simple setup', 'Git integration', 'Custom templates'],
		icon: getFontAwesomeIcon('FileText', 'w-5 h-5'),
	},
	{
		name: 'GitHub Changelog Generator',
		description: 'Generate changelogs from GitHub issues and PRs',
		url: 'https://github.com/github-changelog-generator/github-changelog-generator',
		features: ['GitHub integration', 'Issue tracking', 'PR linking'],
		icon: getFontAwesomeIcon('GitBranch', 'w-5 h-5'),
	},
]

export function ChangelogGuide() {
	const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

	const copyToClipboard = async (text: string, format: string) => {
		await navigator.clipboard.writeText(text)
		setCopiedFormat(format)
		setTimeout(() => setCopiedFormat(null), 2000)
	}

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			<div className="space-y-4 text-center">
				<div className="flex justify-center mb-4">
					<div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl">
						{getFontAwesomeIcon('FileText', 'w-8 h-8 text-white')}
					</div>
				</div>
				<h1 className="text-5xl font-bold text-foreground">
					Changelog Mastery
				</h1>
				<p className="max-w-3xl mx-auto text-xl text-muted-foreground">
					Learn how to create professional changelogs that keep your users
					informed and your project organized.
				</p>
			</div>

			<Tabs defaultValue="overview" className="w-full">
				<TabsList className="grid w-full grid-cols-5 rounded-full">
					<TabsTrigger
						className="transition-colors rounded-full hover:bg-accent hover:text-accent-foreground"
						value="overview"
					>
						Overview
					</TabsTrigger>
					<TabsTrigger
						className="transition-colors rounded-full hover:bg-accent hover:text-accent-foreground"
						value="examples"
					>
						Examples
					</TabsTrigger>
					<TabsTrigger
						className="transition-colors rounded-full hover:bg-accent hover:text-accent-foreground"
						value="tools"
					>
						Tools
					</TabsTrigger>
					<TabsTrigger
						className="transition-colors rounded-full hover:bg-accent hover:text-accent-foreground"
						value="best-practices"
					>
						Best Practices
					</TabsTrigger>
					<TabsTrigger
						className="transition-colors rounded-full hover:bg-accent hover:text-accent-foreground"
						value="automation"
					>
						Automation
					</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-6">
					<div className="grid gap-6 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									{getFontAwesomeIcon('Info', 'w-5 h-5 text-blue-500')}
									What is a Changelog?
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-muted-foreground">
									A changelog is a file that contains a chronologically ordered
									list of notable changes for each version of a project.
								</p>
								<div className="space-y-2">
									<h4 className="font-semibold">Key Benefits:</h4>
									<ul className="space-y-1 text-sm text-muted-foreground">
										<li>• Keep users informed about changes</li>
										<li>• Improve project transparency</li>
										<li>• Help with debugging and support</li>
										<li>• Professional project documentation</li>
									</ul>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									{getFontAwesomeIcon(
										'CheckCircle',
										'w-5 h-5 text-emerald-500',
									)}
									Why Use Changelogs?
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-muted-foreground">
									Changelogs are essential for maintaining professional software
									projects and keeping stakeholders informed.
								</p>
								<div className="space-y-2">
									<h4 className="font-semibold">Professional Benefits:</h4>
									<ul className="space-y-1 text-sm text-muted-foreground">
										<li>• Build user trust and confidence</li>
										<li>• Reduce support requests</li>
										<li>• Improve team communication</li>
										<li>• Meet industry standards</li>
									</ul>
								</div>
							</CardContent>
						</Card>
					</div>

					<Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 dark:border-blue-800">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								{getFontAwesomeIcon('Calendar', 'w-5 h-5')}
								Changelog Structure
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 md:grid-cols-4">
								<div className="p-4 text-center bg-white rounded-lg dark:bg-gray-800">
									<div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full dark:bg-blue-900">
										<span className="font-bold text-blue-600 dark:text-blue-400">
											A
										</span>
									</div>
									<h4 className="text-sm font-semibold">Added</h4>
									<p className="text-xs text-muted-foreground">New features</p>
								</div>
								<div className="p-4 text-center bg-white rounded-lg dark:bg-gray-800">
									<div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-full bg-emerald-100 dark:bg-emerald-900">
										<span className="font-bold text-emerald-600 dark:text-emerald-400">
											C
										</span>
									</div>
									<h4 className="text-sm font-semibold">Changed</h4>
									<p className="text-xs text-muted-foreground">Modifications</p>
								</div>
								<div className="p-4 text-center bg-white rounded-lg dark:bg-gray-800">
									<div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-orange-100 rounded-full dark:bg-orange-900">
										<span className="font-bold text-orange-600 dark:text-orange-400">
											F
										</span>
									</div>
									<h4 className="text-sm font-semibold">Fixed</h4>
									<p className="text-xs text-muted-foreground">Bug fixes</p>
								</div>
								<div className="p-4 text-center bg-white rounded-lg dark:bg-gray-800">
									<div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-red-100 rounded-full dark:bg-red-900">
										<span className="font-bold text-red-600 dark:text-red-400">
											R
										</span>
									</div>
									<h4 className="text-sm font-semibold">Removed</h4>
									<p className="text-xs text-muted-foreground">
										Deprecated features
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="examples" className="space-y-6">
					<div className="space-y-6">
						{Object.entries(CHANGELOG_EXAMPLES).map(([format, content]) => (
							<Card key={format}>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle className="flex items-center gap-2">
											{getFontAwesomeIcon('FileText', 'w-5 h-5')}
											{format.toUpperCase()} Format
										</CardTitle>
										<Button
											variant="outline"
											size="sm"
											onClick={() => copyToClipboard(content, format)}
										>
											{copiedFormat === format
												? getFontAwesomeIcon('CheckCircle', 'w-4 h-4 mr-2')
												: getFontAwesomeIcon('Copy', 'w-4 h-4 mr-2')}
											{copiedFormat === format ? 'Copied!' : 'Copy'}
										</Button>
									</div>
									<CardDescription>
										Example changelog in {format.toUpperCase()} format
									</CardDescription>
								</CardHeader>
								<CardContent>
									<pre className="p-4 overflow-x-auto text-sm rounded-lg bg-muted">
										<code>{content}</code>
									</pre>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="tools" className="space-y-6">
					<div className="grid gap-4">
						{CHANGELOG_TOOLS.map((tool, index) => (
							<Card key={index} className="transition-shadow hover:shadow-md">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg dark:bg-blue-900">
												{tool.icon}
											</div>
											<div>
												<CardTitle className="text-lg">{tool.name}</CardTitle>
												<CardDescription>{tool.description}</CardDescription>
											</div>
										</div>
										<Button variant="outline" size="sm" asChild>
											<Link
												href={tool.url}
												target="_blank"
												rel="noopener noreferrer"
											>
												{getFontAwesomeIcon('Download', 'w-4 h-4 mr-2')}
												Visit
											</Link>
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex flex-wrap gap-2">
										{tool.features.map((feature, featureIndex) => (
											<Badge key={featureIndex} variant="secondary">
												{feature}
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="best-practices" className="space-y-6">
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="format">
							<AccordionTrigger>Changelog Format Standards</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4">
									<p className="text-muted-foreground">
										Follow the Keep a Changelog format for consistency and
										professionalism.
									</p>
									<div className="p-4 rounded-lg bg-muted">
										<code className="font-mono text-sm">
											## [Version] - YYYY-MM-DD
											<br />
											### Added
											<br />
											### Changed
											<br />
											### Fixed
											<br />
											### Removed
										</code>
									</div>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="writing">
							<AccordionTrigger>Writing Guidelines</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4">
									<ul className="space-y-2 text-sm">
										<li>
											• Use present tense (&quot;Add feature&quot; not
											&quot;Added feature&quot;)
										</li>
										<li>• Be specific and descriptive</li>
										<li>• Include breaking changes prominently</li>
										<li>• Link to issues and pull requests</li>
										<li>• Group related changes together</li>
									</ul>
								</div>
							</AccordionContent>
						</AccordionItem>

						<AccordionItem value="automation">
							<AccordionTrigger>Automation Best Practices</AccordionTrigger>
							<AccordionContent>
								<div className="space-y-4">
									<ul className="space-y-2 text-sm">
										<li>• Use conventional commits for automatic generation</li>
										<li>• Set up CI/CD pipelines for changelog updates</li>
										<li>• Validate changelog format in pull requests</li>
										<li>• Generate changelogs from git metadata</li>
										<li>• Include changelog in release notes</li>
									</ul>
								</div>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</TabsContent>

				<TabsContent value="automation" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								{getFontAwesomeIcon('GitBranch', 'w-5 h-5')}
								Automated Changelog Generation
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground">
								Set up automated changelog generation using conventional commits
								and CI/CD pipelines.
							</p>

							<div className="space-y-4">
								<div className="p-4 rounded-lg bg-muted">
									<h4 className="mb-2 font-semibold">GitHub Actions Example</h4>
									<pre className="font-mono text-sm">
										{`name: Generate Changelog
on:
  push:
    branches: [main]
jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate Changelog
        run: |
          npx conventional-changelog -p angular -i CHANGELOG.md -s
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add CHANGELOG.md
          git commit -m "docs: update changelog" || exit 0
          git push`}
									</pre>
								</div>

								<div className="p-4 rounded-lg bg-muted">
									<h4 className="mb-2 font-semibold">Package.json Scripts</h4>
									<pre className="font-mono text-sm">
										{`{
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s",
    "version": "conventional-changelog -p angular -i CHANGELOG.md -s && git add CHANGELOG.md"
  }
}`}
									</pre>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
