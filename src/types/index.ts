// Core types for the application

export interface GitCommand {
	command: string
	description: string
	example: string
	details: string
	useCases: string[]
	options: string[]
	icon: React.ReactNode
}

export interface GitHubFeature {
	name: string
	description: string
	icon: React.ReactNode
	benefits: string[]
	color: string
	details: string
	useCases: string[]
	bestPractices: string[]
}

export interface Workflow {
	name: string
	description: string
	steps: string[]
	pros: string[]
	cons: string[]
	details: string
	useCases: string[]
	bestPractices: string[]
	icon: React.ReactNode
}

export interface CommitType {
	type: string
	emoji: string
	description: string
	example: string
	details: string
	useCases: string[]
	examples: string[]
	breakingChange: string | null
}

export interface BestPractice {
	title: string
	description: string
	good: string
	bad: string
	icon: React.ReactNode
	details: string
}

export interface ChangelogEntry {
	type:
		| 'feat'
		| 'fix'
		| 'docs'
		| 'style'
		| 'refactor'
		| 'perf'
		| 'test'
		| 'build'
		| 'ci'
		| 'chore'
	message: string
	hash: string
	author: string
	date: string
	scope?: string
	breaking?: boolean
}

export interface ChangelogTool {
	name: string
	description: string
	url: string
	features: string[]
	icon: React.ReactNode
}

export interface GitCommands {
	basic: GitCommand[]
	advanced: GitCommand[]
	workflow: GitCommand[]
}
