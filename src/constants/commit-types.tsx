import { CommitType } from '@/types'

export const COMMIT_TYPES: CommitType[] = [
	{
		type: 'feat',
		emoji: '✨',
		description: 'A new feature',
		example: 'feat(auth): add OAuth2 login support',
		details:
			'Use when adding new functionality to the codebase. This is the most important type as it indicates new capabilities for users.',
		useCases: [
			'Adding new user-facing features',
			'Implementing new API endpoints',
			'Adding new configuration options',
			'Introducing new UI components',
		],
		examples: [
			'feat: add dark mode toggle',
			'feat(api): implement user profile endpoints',
			'feat(auth): add two-factor authentication',
			'feat(ui): add responsive navigation menu',
		],
		breakingChange: 'feat!: change authentication method',
	},
	{
		type: 'fix',
		emoji: '🐛',
		description: 'A bug fix',
		example: 'fix(ui): resolve button alignment issue',
		details:
			'Use when fixing a bug in the codebase. This should be used for any correction that resolves incorrect behavior.',
		useCases: [
			'Fixing runtime errors',
			'Correcting logic errors',
			'Resolving UI layout issues',
			'Fixing data processing bugs',
		],
		examples: [
			'fix: resolve memory leak in data processing',
			'fix(ui): correct button alignment on mobile',
			'fix(api): handle null values in user endpoint',
			'fix(auth): resolve token expiration issue',
		],
		breakingChange: 'fix!: change error handling behavior',
	},
	{
		type: 'docs',
		emoji: '📚',
		description: 'Documentation only changes',
		example: 'docs: update API documentation',
		details:
			'Use when making changes to documentation only. This includes README files, code comments, and external documentation.',
		useCases: [
			'Updating README files',
			'Adding code comments',
			'Writing API documentation',
			'Creating user guides',
		],
		examples: [
			'docs: update installation instructions',
			'docs(api): add endpoint documentation',
			'docs: fix typo in README',
			'docs: add contributing guidelines',
		],
		breakingChange: null,
	},
	{
		type: 'style',
		emoji: '💄',
		description: 'Changes that do not affect the meaning of the code',
		example: 'style: format code with prettier',
		details:
			'Use for formatting, missing semicolons, whitespace, etc. These changes do not affect the functionality.',
		useCases: [
			'Code formatting with prettier/eslint',
			'Adding missing semicolons',
			'Fixing indentation',
			'Removing trailing whitespace',
		],
		examples: [
			'style: format code with prettier',
			'style: fix indentation in components',
			'style: remove trailing whitespace',
			'style: add missing semicolons',
		],
		breakingChange: null,
	},
	{
		type: 'refactor',
		emoji: '♻️',
		description: 'A code change that neither fixes a bug nor adds a feature',
		example: 'refactor(utils): extract common validation logic',
		details:
			'Use when restructuring code without changing functionality. This improves code quality without changing behavior.',
		useCases: [
			'Extracting common functions',
			'Renaming variables for clarity',
			'Reorganizing file structure',
			'Simplifying complex logic',
		],
		examples: [
			'refactor: extract validation logic to utils',
			'refactor(api): simplify user endpoint logic',
			'refactor: rename variables for clarity',
			'refactor: reorganize component structure',
		],
		breakingChange: 'refactor!: restructure API endpoints',
	},
	{
		type: 'perf',
		emoji: '⚡',
		description: 'A code change that improves performance',
		example: 'perf(db): optimize user query performance',
		details:
			'Use when making performance improvements. This includes optimizations that make the code faster or use less memory.',
		useCases: [
			'Optimizing database queries',
			'Implementing caching',
			'Reducing memory usage',
			'Improving algorithm efficiency',
		],
		examples: [
			'perf: optimize database queries',
			'perf(api): implement response caching',
			'perf: reduce memory usage in data processing',
			'perf(ui): optimize component rendering',
		],
		breakingChange: null,
	},
	{
		type: 'test',
		emoji: '🧪',
		description: 'Adding missing tests or correcting existing tests',
		example: 'test(api): add unit tests for user endpoints',
		details:
			'Use when adding or modifying tests. This includes unit tests, integration tests, and e2e tests.',
		useCases: [
			'Adding new unit tests',
			'Fixing failing tests',
			'Adding integration tests',
			'Improving test coverage',
		],
		examples: [
			'test: add unit tests for user service',
			'test(api): add integration tests for auth endpoints',
			'test: fix flaky e2e tests',
			'test: improve test coverage for utils',
		],
		breakingChange: null,
	},
	{
		type: 'build',
		emoji: '🔧',
		description:
			'Changes that affect the build system or external dependencies',
		example: 'build: update webpack configuration',
		details:
			'Use for changes to build tools, dependencies, package.json, etc. This affects how the project is built.',
		useCases: [
			'Updating build tools',
			'Adding new dependencies',
			'Modifying build scripts',
			'Updating package.json',
		],
		examples: [
			'build: update webpack to v5',
			'build: add new build script',
			'build: update dependencies',
			'build: configure TypeScript compiler',
		],
		breakingChange: 'build!: upgrade to webpack v5',
	},
	{
		type: 'ci',
		emoji: '👷',
		description: 'Changes to our CI configuration files and scripts',
		example: 'ci: add automated testing pipeline',
		details:
			'Use for changes to CI/CD configuration. This includes GitHub Actions, Jenkins, Travis CI, etc.',
		useCases: [
			'Adding new CI workflows',
			'Updating deployment scripts',
			'Modifying test pipelines',
			'Configuring automated releases',
		],
		examples: [
			'ci: add GitHub Actions workflow',
			'ci: update deployment pipeline',
			'ci: configure automated testing',
			'ci: add code quality checks',
		],
		breakingChange: null,
	},
	{
		type: 'chore',
		emoji: '🔨',
		description: "Other changes that don't modify src or test files",
		example: 'chore: update package-lock.json',
		details:
			"Use for maintenance tasks that don't affect the codebase. This includes updating dependencies, configuration files, etc.",
		useCases: [
			'Updating package-lock.json',
			'Modifying .gitignore',
			'Updating configuration files',
			'Maintenance tasks',
		],
		examples: [
			'chore: update package-lock.json',
			'chore: update .gitignore',
			'chore: update eslint configuration',
			'chore: clean up old files',
		],
		breakingChange: null,
	},
	{
		type: 'revert',
		emoji: '⏪',
		description: 'Reverts a previous commit',
		example: 'revert: revert "feat: add new feature"',
		details:
			'Use when reverting a previous commit. This should reference the commit being reverted.',
		useCases: [
			'Reverting buggy features',
			'Undoing breaking changes',
			'Rolling back problematic commits',
			'Emergency fixes',
		],
		examples: [
			'revert: revert "feat: add new feature"',
			'revert: revert "fix: resolve memory leak"',
			'revert: revert "refactor: restructure API"',
			'revert: revert "perf: optimize queries"',
		],
		breakingChange: null,
	},
]
