export const CHANGELOG_CONTENT = {
	hero: {
		title: 'Professional Changelog Generator',
		description:
			'Generate beautiful changelogs from conventional commits, inspired by git-cliff',
		gitCliffUrl: 'https://git-cliff.org/',
	},
	whatIs: {
		title: 'What is a Changelog?',
		description:
			'A changelog is a file that contains a curated, chronologically ordered list of notable changes for each version of a project. It helps users and contributors understand what has changed between versions.',
	},
	whyMatter: {
		title: 'Why Changelogs Matter',
		description:
			'Changelogs improve transparency, help users understand updates, enable better project management, and provide a historical record of project evolution.',
	},
	benefits: {
		user: {
			title: 'User Benefits',
			items: [
				"Understand what's new",
				'Track breaking changes',
				'Plan upgrades',
				'Stay informed',
			],
		},
		developer: {
			title: 'Developer Benefits',
			items: [
				'Document changes',
				'Improve communication',
				'Enable automation',
				'Professional standards',
			],
		},
		project: {
			title: 'Project Benefits',
			items: [
				'Better project history',
				'Improved collaboration',
				'Professional appearance',
				'Automated releases',
			],
		},
	},
	tabs: {
		generator: 'Generator',
		tools: 'Tools',
		examples: 'Examples',
	},
	gitCliffSetup: `# Install git-cliff
cargo install git-cliff

# Generate changelog
git-cliff --output CHANGELOG.md

# With custom config
git-cliff --config cliff.toml --output CHANGELOG.md`,
	examples: {
		keepAChangelog: `## [1.2.0] - 2024-01-15

### Added
- New feature X
- New feature Y

### Changed
- Improved performance
- Updated dependencies

### Fixed
- Bug in component A
- Bug in component B`,
		conventionalCommits: `## [1.2.0] - 2024-01-15

### ✨ Features
- feat(auth): add user authentication
- feat(ui): add dark mode support

### 🐛 Bug Fixes
- fix(auth): resolve login validation
- fix(ui): fix responsive layout`,
	},
}
