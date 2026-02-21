import { GitHubFeature } from '@/types'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

export const GITHUB_FEATURES: GitHubFeature[] = [
	{
		name: 'Pull Requests',
		description: 'Review and merge code changes',
		icon: getFontAwesomeIcon('GitPullRequest', 'w-5 h-5'),
		benefits: [
			'Code review',
			'Discussion',
			'Automated checks',
			'Merge strategies',
		],
		color: 'blue',
		details:
			'Pull requests are the heart of collaborative development on GitHub. They allow teams to review, discuss, and merge code changes in a controlled manner.',
		useCases: [
			'Code review and feedback',
			'Automated testing and CI/CD',
			'Documentation and discussion',
			'Quality assurance',
		],
		bestPractices: [
			'Write clear PR descriptions',
			'Request specific reviewers',
			'Use draft PRs for work in progress',
			'Link related issues',
		],
	},
	{
		name: 'Issues',
		description: 'Track bugs and feature requests',
		icon: getFontAwesomeIcon('GitBranch', 'w-5 h-5'),
		benefits: ['Bug tracking', 'Feature requests', 'Labels', 'Milestones'],
		color: 'emerald',
		details:
			'Issues help you track bugs, feature requests, and other tasks. They provide a centralized place for project management and communication.',
		useCases: [
			'Bug reporting and tracking',
			'Feature request management',
			'Project planning',
			'Team communication',
		],
		bestPractices: [
			'Use clear, descriptive titles',
			'Provide detailed descriptions',
			'Use labels for categorization',
			'Assign to team members',
		],
	},
	{
		name: 'Actions',
		description: 'Automate workflows with CI/CD',
		icon: getFontAwesomeIcon('Zap', 'w-5 h-5'),
		benefits: [
			'Automated testing',
			'Deployment',
			'Code quality',
			'Notifications',
		],
		color: 'orange',
		details:
			'GitHub Actions provides powerful automation capabilities for CI/CD, testing, and deployment. It integrates seamlessly with your repository.',
		useCases: [
			'Automated testing on every commit',
			'Deployment to staging and production',
			'Code quality checks',
			'Release management',
		],
		bestPractices: [
			'Use reusable workflows',
			'Cache dependencies',
			'Use environment secrets',
			'Monitor workflow performance',
		],
	},
	{
		name: 'Projects',
		description: 'Organize work with project boards',
		icon: getFontAwesomeIcon('BookOpen', 'w-5 h-5'),
		benefits: [
			'Task management',
			'Progress tracking',
			'Team coordination',
			'Kanban boards',
		],
		color: 'purple',
		details:
			'GitHub Projects provide flexible project management tools with Kanban boards, roadmaps, and automation capabilities.',
		useCases: [
			'Sprint planning and tracking',
			'Feature roadmap management',
			'Team coordination',
			'Progress visualization',
		],
		bestPractices: [
			'Use custom fields for metadata',
			'Automate status updates',
			'Create project templates',
			'Regular project reviews',
		],
	},
	{
		name: 'Security',
		description: 'Secure your code and dependencies',
		icon: getFontAwesomeIcon('Shield', 'w-5 h-5'),
		benefits: [
			'Dependency scanning',
			'Secret detection',
			'Code scanning',
			'Security alerts',
		],
		color: 'red',
		details:
			'GitHub provides comprehensive security features to help you identify and fix vulnerabilities in your code and dependencies.',
		useCases: [
			'Vulnerability scanning',
			'Secret detection and removal',
			'Code security analysis',
			'Security policy enforcement',
		],
		bestPractices: [
			'Enable Dependabot alerts',
			'Use security policies',
			'Regular dependency updates',
			'Code scanning integration',
		],
	},
	{
		name: 'Collaboration',
		description: 'Work together effectively',
		icon: getFontAwesomeIcon('Users', 'w-5 h-5'),
		benefits: ['Team management', 'Permissions', 'Code review', 'Discussions'],
		color: 'green',
		details:
			'GitHub provides powerful collaboration tools including team management, permissions, and communication features.',
		useCases: [
			'Team organization and management',
			'Permission and access control',
			'Code review workflows',
			'Team communication',
		],
		bestPractices: [
			'Use team-based permissions',
			'Enable branch protection',
			'Set up code review requirements',
			'Use discussions for planning',
		],
	},
	{
		name: 'Packages',
		description: 'Package and distribute your code',
		icon: getFontAwesomeIcon('Package', 'w-5 h-5'),
		benefits: [
			'Package hosting',
			'Version management',
			'Access control',
			'Integration with workflows',
		],
		color: 'indigo',
		details:
			'GitHub Packages provides a unified experience for publishing and consuming packages across different ecosystems.',
		useCases: [
			'NPM package publishing',
			'Docker image hosting',
			'Maven artifact management',
			'NuGet package distribution',
		],
		bestPractices: [
			'Use semantic versioning',
			'Set up automated publishing',
			'Configure access controls',
			'Monitor package usage',
		],
	},
	{
		name: 'Codespaces',
		description: 'Cloud-based development environments',
		icon: getFontAwesomeIcon('Cloud', 'w-5 h-5'),
		benefits: [
			'Instant development setup',
			'Consistent environments',
			'Resource management',
			'Collaboration features',
		],
		color: 'cyan',
		details:
			'GitHub Codespaces provides cloud-based development environments that can be spun up instantly with your repository.',
		useCases: [
			'Quick development setup',
			'Consistent team environments',
			'Resource-intensive development',
			'Collaborative coding sessions',
		],
		bestPractices: [
			'Use devcontainer configuration',
			'Optimize for performance',
			'Share environment configurations',
			'Monitor usage and costs',
		],
	},
]
