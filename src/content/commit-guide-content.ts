export const COMMIT_GUIDE_CONTENT = {
	hero: {
		title: 'Conventional Commits Guide',
		description:
			'Master the art of writing meaningful commit messages that make your Git history clean, readable, and professional.',
	},
	tabs: {
		overview: 'Overview',
		types: 'Commit Types',
		practices: 'Best Practices',
		examples: 'Examples',
		advanced: 'Advanced',
	},
	overview: {
		whatAre: {
			title: 'What are Conventional Commits?',
			description:
				'Conventional Commits is a specification for adding human and machine readable meaning to commit messages. It provides an easy set of rules for creating an explicit commit history, which makes it easier to write automated tools on top of.',
			format: `<type>[optional scope]: <description>

[optional body]

[optional footer(s)]`,
		},
		benefits: [
			'Automatically generate CHANGELOGs',
			'Automatically determine version bumps',
			'Communicate the nature of changes to team members',
			'Trigger build and publish processes',
			'Make it easier for people to contribute to your projects',
		],
		whyUse: [
			'Clear and consistent commit history',
			'Better collaboration in teams',
			'Easier debugging and code review',
			'Automated tooling support',
			'Professional development practices',
		],
	},
	examples: {
		simple: {
			title: 'Simple Examples',
			description:
				'Basic commit messages without scopes or detailed descriptions.',
			examples: [
				{
					message: 'feat: add user authentication',
					description: 'Adding a new feature',
				},
				{
					message: 'fix: resolve memory leak in data processing',
					description: 'Fixing a bug',
				},
				{
					message: 'docs: update README with installation steps',
					description: 'Documentation update',
				},
				{
					message: 'style: format code with prettier',
					description: 'Code formatting',
				},
			],
		},
		withScope: {
			title: 'With Scope',
			description:
				'Commit messages with scopes to indicate the area of the codebase affected.',
			examples: [
				{
					message: 'feat(auth): add OAuth2 login support',
					description: 'New feature in authentication module',
				},
				{
					message: 'fix(ui): correct button alignment on mobile',
					description: 'Bug fix in UI components',
				},
				{
					message: 'refactor(api): simplify user endpoint logic',
					description: 'Code refactoring in API layer',
				},
				{
					message: 'perf(db): optimize user query performance',
					description: 'Performance improvement in database',
				},
			],
		},
		breaking: {
			title: 'Breaking Changes',
			description:
				'Breaking changes that require special attention and version bumps.',
			examples: [
				{
					message: `feat(api)!: implement new REST API endpoints BREAKING CHANGE: The old API endpoints are deprecated and will be removed in the next major version. Please update your client code to use the new endpoints.`,
					description: 'Major API changes',
				},
				{
					message: 'feat!: change authentication method',
					description: 'Simple breaking change',
				},
				{
					message: 'refactor!: restructure API endpoints',
					description: 'Breaking refactoring',
				},
			],
		},
		detailed: {
			title: 'Detailed Examples',
			description:
				'Comprehensive commit messages with body and footer information.',
			examples: [
				{
					message: `feat(auth): add OAuth2 login support
Implement OAuth2 flow with Google and GitHub providers.
- Add user authentication middleware
- Update user model with OAuth fields
- Add comprehensive tests for OAuth flow
- Update API documentation
Closes #123, #456`,
					description: 'Feature with detailed description and issue references',
				},
				{
					message: `fix(ui): resolve button alignment issue on mobile
The buttons were not properly aligned on mobile devices due to flexbox configuration issues. This fix ensures proper alignment across all screen sizes.
- Fix flexbox alignment in button container
- Add responsive breakpoints for mobile
- Update CSS to handle different screen sizes
Fixes #789`,
					description: 'Bug fix with detailed explanation',
				},
				{
					message: `perf(db): optimize user query performance
Implement database query optimization to reduce response time from 500ms to 50ms for user profile queries.
- Add database indexes on frequently queried fields
- Implement query result caching
- Optimize JOIN operations
- Add query performance monitoring
Performance improvement: 90% reduction in query time`,
					description: 'Performance improvement with metrics',
				},
			],
		},
		realWorld: {
			title: 'Real-World Scenarios',
			description: "Common scenarios you'll encounter in real projects.",
			scenarios: [
				{
					title: 'New Feature Development',
					message: `feat(payment): add Stripe integration
- Implement Stripe payment processing
- Add payment form components
- Create payment success/failure pages
- Add comprehensive error handling
- Update API documentation
Closes #234`,
				},
				{
					title: 'Bug Fix',
					message: `fix(api): handle null values in user endpoint
The user endpoint was throwing 500 errors when encountering null values in the database. This fix adds proper null checking and returns appropriate error responses.
Fixes #567`,
				},
				{
					title: 'Code Refactoring',
					message: `refactor(utils): extract common validation logic
Extract repeated validation logic into reusable utility functions to improve code maintainability and reduce duplication across the codebase.
- Create validation utility functions
- Update all components to use new utilities
- Add comprehensive tests for validation logic`,
				},
			],
		},
	},
	advanced: {
		breakingChanges: {
			title: 'Breaking Changes',
			description:
				'Understanding and properly marking breaking changes in your commits.',
			whatAre:
				'Breaking changes are modifications that are not backwards compatible. They require consumers of your API or library to make changes to their code.',
			howToMark: [
				{
					message: 'feat!: change authentication method',
					description: 'Simple breaking change notation',
				},
				{
					message: `feat(api)!: implement new REST API endpoints BREAKING CHANGE: The old API endpoints are deprecated and will be removed in the next major version.`,
					description: 'Detailed breaking change with explanation',
				},
			],
		},
		scopes: {
			title: 'Scopes',
			description: 'Using scopes to organize commits by functional area.',
			examples: [
				'feat(auth): add OAuth2 support',
				'fix(ui): resolve button alignment',
				'refactor(api): simplify endpoints',
				'perf(db): optimize queries',
				'test(utils): add validation tests',
				'docs(api): update endpoints',
			],
			bestPractices: [
				'Use lowercase letters',
				'Keep scopes short and descriptive',
				'Be consistent across your project',
				'Use scopes that match your project structure',
			],
		},
		bodyAndFooter: {
			title: 'Commit Body and Footer',
			description:
				'Using the body and footer to provide additional context and metadata.',
			bodyExample: `feat(auth): add OAuth2 login support
Implement OAuth2 flow with Google and GitHub providers. This allows users to sign in using their existing social media accounts, improving user experience and reducing friction in the registration process.
- Add OAuth2 configuration
- Implement Google OAuth2 flow
- Implement GitHub OAuth2 flow
- Add user authentication middleware
- Update user model with OAuth fields
- Add comprehensive tests
- Update API documentation
Closes #123, #456`,
			footerExamples: [
				{
					message: 'Closes #123',
					description: 'Closes an issue',
				},
				{
					message: 'Fixes #456',
					description: 'Fixes a bug',
				},
				{
					message: 'Refs #789',
					description: 'References an issue',
				},
			],
		},
		automation: {
			title: 'Automation and Tooling',
			description: 'Tools and automation that work with conventional commits.',
			versionManagement: [
				'semantic-release: Automated versioning',
				'conventional-changelog: Generate changelogs',
				'standard-version: Version bumping',
			],
			validation: [
				'commitlint: Lint commit messages',
				'husky: Git hooks',
				'commitizen: Interactive commits',
			],
			benefits: [
				'Automatic version bumping based on commit types',
				'Automated changelog generation',
				'Consistent commit message formatting',
				'Integration with CI/CD pipelines',
			],
		},
	},
}
