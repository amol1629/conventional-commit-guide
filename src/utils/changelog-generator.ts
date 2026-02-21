import { ChangelogEntry } from '@/types'

export const generateChangelog = (commits: ChangelogEntry[]): string => {
	const version = '1.2.0'
	const date = new Date().toISOString().split('T')[0]

	const features = commits.filter((c) => c.type === 'feat')
	const fixes = commits.filter((c) => c.type === 'fix')
	const docs = commits.filter((c) => c.type === 'docs')
	const breaking = commits.filter((c) => c.breaking)

	let changelog = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [${version}] - ${date}

`

	if (breaking.length > 0) {
		changelog += `### ⚠️ BREAKING CHANGES

`
		breaking.forEach((commit) => {
			changelog += `- **${commit.scope}**: ${commit.message} (${commit.hash})\n`
		})
		changelog += '\n'
	}

	if (features.length > 0) {
		changelog += `### ✨ Added

`
		features.forEach((commit) => {
			changelog += `- **${commit.scope}**: ${commit.message} (${commit.hash})\n`
		})
		changelog += '\n'
	}

	if (fixes.length > 0) {
		changelog += `### 🐛 Fixed

`
		fixes.forEach((commit) => {
			changelog += `- **${commit.scope}**: ${commit.message} (${commit.hash})\n`
		})
		changelog += '\n'
	}

	if (docs.length > 0) {
		changelog += `### 📚 Documentation

`
		docs.forEach((commit) => {
			changelog += `- **${commit.scope}**: ${commit.message} (${commit.hash})\n`
		})
		changelog += '\n'
	}

	changelog += `---

Generated with [git-cliff](https://git-cliff.org/) 🏔️`

	return changelog
}

export const getCommitIcon = (type: string): string => {
	switch (type) {
		case 'feat':
			return '✨'
		case 'fix':
			return '🐛'
		case 'docs':
			return '📚'
		case 'style':
			return '💄'
		case 'refactor':
			return '♻️'
		case 'perf':
			return '⚡'
		case 'test':
			return '🧪'
		case 'build':
			return '🔧'
		case 'ci':
			return '👷'
		case 'chore':
			return '🔨'
		default:
			return '📝'
	}
}

export const getCommitColor = (type: string): string => {
	switch (type) {
		case 'feat':
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
		case 'fix':
			return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
		case 'docs':
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
		case 'style':
			return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
		case 'refactor':
			return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
		case 'perf':
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
	}
}
