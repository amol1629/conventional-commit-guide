export interface CommitTypeInfo {
	title: string
	description: string
	examples: string[]
	bestPractices: string[]
}

export interface PracticeScenario {
	id: number
	title: string
	description: string
	context: string
	expectedType: string
	expectedScope: string
	expectedDescription: string
	breakingChange?: boolean
	commitTypeInfo: CommitTypeInfo
}

export const practiceScenarios: PracticeScenario[] = [
	{
		id: 1,
		title: 'Critical Authentication Bug',
		description:
			'Fix a security vulnerability in the login system that allows unauthorized access',
		context:
			"Your security team discovered that users with special characters (!@#$%^&*) in their passwords cannot log in. This affects 15% of your user base. The issue is in the password validation regex that doesn't properly escape special characters. You need to fix the regex pattern in the auth service.",
		expectedType: 'fix',
		expectedScope: 'auth',
		expectedDescription: 'fix password validation regex for special characters',
		commitTypeInfo: {
			title: 'Fix Commits',
			description: 'Used for bug fixes that resolve issues in production code',
			examples: [
				'fix(auth): resolve login timeout issue',
				'fix(api): handle null response gracefully',
			],
			bestPractices: [
				'Always include the affected component in scope',
				'Be specific about what was fixed',
				'Use present tense (fix, not fixed)',
				'Include impact if significant',
			],
		},
	},
	{
		id: 2,
		title: 'Dark Mode Feature',
		description:
			'Implement user-requested dark mode toggle for better accessibility',
		context:
			'Your product manager received 200+ user requests for dark mode. The design team has provided Figma mockups. You need to implement a theme toggle in the header, add CSS variables for dark theme colors, and ensure all components support both themes. This is a major user-facing feature.',
		expectedType: 'feat',
		expectedScope: 'ui',
		expectedDescription: 'add dark mode toggle with theme persistence',
		commitTypeInfo: {
			title: 'Feature Commits',
			description:
				'Used for new features that add functionality to the application',
			examples: [
				'feat(auth): add two-factor authentication',
				'feat(dashboard): implement real-time notifications',
			],
			bestPractices: [
				'Describe the new functionality clearly',
				'Include the component or module affected',
				'Use imperative mood (add, implement, create)',
				'Be specific about what the feature does',
			],
		},
	},
	{
		id: 3,
		title: 'API Documentation Update',
		description:
			'Update API documentation to include missing endpoints and improve developer experience',
		context:
			'Your API documentation is outdated. The new developer onboarding process revealed that 3 new endpoints are missing from the docs, and 5 existing endpoints have incorrect examples. You need to update the OpenAPI spec and regenerate the documentation.',
		expectedType: 'docs',
		expectedScope: 'api',
		expectedDescription:
			'update OpenAPI spec with missing endpoints and examples',
		commitTypeInfo: {
			title: 'Documentation Commits',
			description: 'Used for changes that only affect documentation',
			examples: [
				'docs(readme): add installation instructions',
				'docs(api): update endpoint descriptions',
			],
			bestPractices: [
				'Specify what documentation was changed',
				'Include the type of documentation (readme, api, code comments)',
				'Be clear about what was added or updated',
				"Don't mix with code changes",
			],
		},
	},
	{
		id: 4,
		title: 'Database Performance Optimization',
		description:
			'Optimize slow database queries that are causing 2-second page load times',
		context:
			'Your application monitoring shows that the user dashboard is taking 2+ seconds to load due to inefficient database queries. The N+1 query problem is causing 15 database calls per page load. You need to implement proper joins and add database indexes.',
		expectedType: 'perf',
		expectedScope: 'db',
		expectedDescription: 'optimize user dashboard queries and add indexes',
		commitTypeInfo: {
			title: 'Performance Commits',
			description:
				'Used for changes that improve performance without changing functionality',
			examples: [
				'perf(api): optimize database queries',
				'perf(ui): lazy load images',
			],
			bestPractices: [
				'Specify what performance issue was addressed',
				'Include metrics if significant (e.g., "reduce load time by 50%")',
				'Focus on the optimization technique used',
				"Don't mix with feature additions",
			],
		},
	},
	{
		id: 5,
		title: 'API Response Format Change',
		description:
			'Change API response format from camelCase to snake_case for consistency',
		context:
			'Your backend team decided to standardize on snake_case for all API responses to match Python conventions. This affects all 25 API endpoints and will break existing frontend code. You need to update the response serialization and notify all API consumers.',
		expectedType: 'feat',
		expectedScope: 'api',
		expectedDescription: 'change response format from camelCase to snake_case',
		breakingChange: true,
		commitTypeInfo: {
			title: 'Breaking Change Commits',
			description:
				'Used for changes that break existing functionality or API contracts',
			examples: [
				'feat(api)!: change response format',
				'feat(auth)!: remove deprecated login method',
			],
			bestPractices: [
				'Always use the ! indicator for breaking changes',
				'Clearly describe what will break',
				'Include migration instructions if possible',
				'Consider the impact on existing users',
			],
		},
	},
	{
		id: 6,
		title: 'User Service Refactoring',
		description:
			'Refactor user service to improve code maintainability and reduce duplication',
		context:
			'Your user service has grown to 500+ lines with duplicated validation logic across 8 methods. Code review identified that the same email validation, password strength check, and user creation logic is repeated. You need to extract common functionality into reusable functions.',
		expectedType: 'refactor',
		expectedScope: 'user',
		expectedDescription:
			'extract common validation logic into reusable functions',
		commitTypeInfo: {
			title: 'Refactoring Commits',
			description:
				'Used for code changes that improve structure without changing functionality',
			examples: [
				'refactor(utils): extract common validation functions',
				'refactor(components): simplify prop interfaces',
			],
			bestPractices: [
				'Describe what was refactored and why',
				'Focus on the improvement made',
				"Don't mix with bug fixes or features",
				'Explain the benefit (maintainability, performance, etc.)',
			],
		},
	},
	{
		id: 7,
		title: 'Payment Module Test Coverage',
		description:
			'Add comprehensive unit tests for payment processing to meet 90% coverage requirement',
		context:
			"Your payment processing module has only 45% test coverage, which is below the company's 90% requirement. The module handles credit card processing, PayPal integration, and refund logic. You need to add unit tests for all payment scenarios including edge cases.",
		expectedType: 'test',
		expectedScope: 'payment',
		expectedDescription: 'add unit tests for payment processing scenarios',
		commitTypeInfo: {
			title: 'Test Commits',
			description: 'Used for adding, updating, or fixing tests',
			examples: [
				'test(auth): add login validation tests',
				'test(api): fix flaky integration tests',
			],
			bestPractices: [
				'Specify what is being tested',
				'Include the testing approach (unit, integration, e2e)',
				'Describe the test scenarios covered',
				"Don't mix with production code changes",
			],
		},
	},
	{
		id: 8,
		title: 'Production Build Configuration',
		description:
			'Update build configuration for production deployment with new environment variables',
		context:
			'Your DevOps team updated the production environment with new security requirements. You need to add 5 new environment variables, update the Docker configuration, and optimize the build process for faster deployments. This affects the CI/CD pipeline.',
		expectedType: 'chore',
		expectedScope: 'build',
		expectedDescription: 'update build config with new environment variables',
		commitTypeInfo: {
			title: 'Chore Commits',
			description: "Used for maintenance tasks that don't change functionality",
			examples: [
				'chore(deps): update React to v18',
				'chore(ci): add automated security scanning',
			],
			bestPractices: [
				'Specify what maintenance task was performed',
				'Include the affected system (build, ci, deps)',
				'Be clear about the change made',
				"Don't mix with feature or bug fix changes",
			],
		},
	},
	{
		id: 9,
		title: 'ESLint Configuration Update',
		description:
			'Fix linting errors and update ESLint configuration for better code quality',
		context:
			'Your codebase has 150+ ESLint warnings that are blocking the CI pipeline. The team decided to enforce stricter linting rules. You need to fix all warnings in the components directory and update the ESLint configuration to prevent future issues.',
		expectedType: 'style',
		expectedScope: 'components',
		expectedDescription: 'fix ESLint warnings and update configuration',
		commitTypeInfo: {
			title: 'Style Commits',
			description:
				"Used for formatting, linting, and style changes that don't affect functionality",
			examples: [
				'style(components): fix ESLint warnings',
				'style(utils): format code with Prettier',
			],
			bestPractices: [
				'Specify what style issues were addressed',
				'Include the tool used (ESLint, Prettier, etc.)',
				"Don't mix with functional changes",
				'Focus on code quality improvements',
			],
		},
	},
	{
		id: 10,
		title: 'SQL Injection Security Patch',
		description:
			'Fix critical SQL injection vulnerability in authentication middleware',
		context:
			'Your security audit revealed a SQL injection vulnerability in the user authentication middleware. The issue allows attackers to bypass login by injecting malicious SQL. This is a critical security issue that needs immediate patching. The vulnerability affects the user login endpoint.',
		expectedType: 'fix',
		expectedScope: 'security',
		expectedDescription: 'patch SQL injection vulnerability in auth middleware',
		commitTypeInfo: {
			title: 'Security Fix Commits',
			description: 'Used for fixing security vulnerabilities and issues',
			examples: [
				'fix(security): patch XSS vulnerability',
				'fix(auth): prevent CSRF attacks',
			],
			bestPractices: [
				'Always use "security" scope for security fixes',
				'Be specific about the vulnerability type',
				'Include the affected component',
				'Consider the severity and impact',
			],
		},
	},
	{
		id: 11,
		title: 'GitHub Actions CI/CD Pipeline',
		description:
			'Update GitHub Actions workflow for automated testing and deployment',
		context:
			'Your team is implementing CI/CD best practices. You need to update the GitHub Actions workflow to include automated testing, code quality checks, and deployment to staging environment. The workflow should run on every pull request and merge to main.',
		expectedType: 'ci',
		expectedScope: 'deploy',
		expectedDescription: 'add automated testing and staging deployment',
		commitTypeInfo: {
			title: 'CI/CD Commits',
			description: 'Used for changes to continuous integration and deployment',
			examples: [
				'ci(github): add automated testing',
				'ci(docker): update deployment pipeline',
			],
			bestPractices: [
				'Specify the CI/CD system used',
				'Describe what automation was added',
				'Include the deployment target if applicable',
				'Focus on the pipeline improvement',
			],
		},
	},
	{
		id: 12,
		title: 'Database Schema Migration',
		description:
			'Create database migration for user table schema changes and performance optimization',
		context:
			'Your user table needs schema changes to support new features. You need to add 3 new columns (last_login, profile_picture_url, timezone), create 2 new indexes for performance, and add a foreign key constraint. This migration will be applied to production during maintenance window.',
		expectedType: 'feat',
		expectedScope: 'db',
		expectedDescription: 'add user table columns and performance indexes',
		commitTypeInfo: {
			title: 'Database Migration Commits',
			description: 'Used for database schema changes and migrations',
			examples: [
				'feat(db): add user profile columns',
				'feat(migration): create product categories table',
			],
			bestPractices: [
				'Specify what database changes were made',
				'Include the affected table or schema',
				'Describe the purpose of the changes',
				'Consider migration rollback strategies',
			],
		},
	},
	{
		id: 13,
		title: 'API Versioning Implementation',
		description:
			'Deprecate v1 API endpoints and introduce v2 with improved response format',
		context:
			'Your API v1 is being deprecated due to inconsistent response formats and limited functionality. You need to mark all v1 endpoints as deprecated, introduce v2 endpoints with improved response structure, and provide migration documentation for API consumers.',
		expectedType: 'feat',
		expectedScope: 'api',
		expectedDescription: 'deprecate v1 endpoints and introduce v2 API',
		breakingChange: true,
		commitTypeInfo: {
			title: 'API Versioning Commits',
			description: 'Used for API versioning and endpoint changes',
			examples: [
				'feat(api): introduce v2 endpoints',
				'feat(api): deprecate legacy authentication',
			],
			bestPractices: [
				'Clearly indicate version changes',
				'Specify what endpoints are affected',
				'Include migration information',
				'Consider backward compatibility',
			],
		},
	},
	{
		id: 14,
		title: 'React Dependency Update',
		description:
			'Update React from v17 to v18 with security patches and breaking changes',
		context:
			'Your React v17 has security vulnerabilities that require updating to v18. This is a major version update with breaking changes including new JSX transform, automatic batching, and concurrent features. You need to update dependencies and fix compatibility issues.',
		expectedType: 'chore',
		expectedScope: 'deps',
		expectedDescription: 'update React to v18 with security patches',
		breakingChange: true,
		commitTypeInfo: {
			title: 'Dependency Update Commits',
			description: 'Used for updating dependencies and packages',
			examples: [
				'chore(deps): update lodash to v4',
				'chore(deps): upgrade TypeScript to v5',
			],
			bestPractices: [
				'Specify the package and version updated',
				'Include the reason for the update',
				'Mention breaking changes if applicable',
				'Consider the impact on the codebase',
			],
		},
	},
	{
		id: 15,
		title: 'Accessibility Compliance Fix',
		description:
			'Improve keyboard navigation and screen reader support for WCAG compliance',
		context:
			'Your application failed accessibility audit with 25 WCAG violations. The main issues are missing ARIA labels, poor keyboard navigation, and insufficient color contrast. You need to fix these issues to meet WCAG 2.1 AA standards for government compliance.',
		expectedType: 'fix',
		expectedScope: 'a11y',
		expectedDescription: 'improve keyboard navigation and ARIA labels',
		commitTypeInfo: {
			title: 'Accessibility Fix Commits',
			description:
				'Used for fixing accessibility issues and improving user experience',
			examples: [
				'fix(a11y): add ARIA labels to buttons',
				'fix(a11y): improve color contrast ratios',
			],
			bestPractices: [
				'Always use "a11y" scope for accessibility fixes',
				'Specify the accessibility issue addressed',
				'Include the WCAG guideline if applicable',
				'Focus on user experience improvements',
			],
		},
	},
]
