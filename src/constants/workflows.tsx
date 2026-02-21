import { Workflow } from '@/types'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

export const WORKFLOWS: Workflow[] = [
	{
		name: 'Git Flow',
		description: 'A branching model for Git',
		steps: [
			'Create feature branch from develop',
			'Work on feature',
			'Create pull request to develop',
			'Merge after review',
			'Create release branch',
			'Merge to main and develop',
		],
		pros: ['Clear structure', 'Release management', 'Hotfix support'],
		cons: ['Complex for small teams', 'Many branches', 'Merge conflicts'],
		details:
			'Git Flow is a branching model that provides a robust framework for managing features, releases, and hotfixes. It uses multiple long-running branches and is ideal for projects with scheduled releases.',
		useCases: [
			'Large teams with scheduled releases',
			'Projects requiring strict release management',
			'Enterprise applications',
			'Open source projects with contributors',
		],
		bestPractices: [
			'Keep feature branches short-lived',
			'Use descriptive branch names',
			'Regular integration with develop',
			'Automated testing on all branches',
		],
		icon: getFontAwesomeIcon('GitBranch', 'w-5 h-5'),
	},
	{
		name: 'GitHub Flow',
		description: 'Simple workflow for continuous deployment',
		steps: [
			'Create feature branch from main',
			'Work on feature',
			'Create pull request',
			'Merge after review',
			'Deploy immediately',
		],
		pros: ['Simple', 'Fast deployment', 'Easy to understand'],
		cons: ['No release branches', 'Direct to main', 'Less structure'],
		details:
			'GitHub Flow is a lightweight workflow that emphasizes simplicity and continuous deployment. It works well for teams that deploy frequently and want to minimize complexity.',
		useCases: [
			'Small to medium teams',
			'Continuous deployment environments',
			'Web applications',
			'Startups and agile teams',
		],
		bestPractices: [
			'Keep main branch always deployable',
			'Use feature flags for incomplete features',
			'Automated testing and deployment',
			'Quick feedback loops',
		],
		icon: getFontAwesomeIcon('Zap', 'w-5 h-5'),
	},
	{
		name: 'Trunk-based Development',
		description: 'Work directly on main branch',
		steps: [
			'Work directly on main',
			'Small, frequent commits',
			'Feature flags for incomplete features',
			'Continuous integration',
		],
		pros: ['Simple', 'Fast feedback', 'No merge conflicts'],
		cons: ['Requires discipline', 'Feature flags needed', 'Less isolation'],
		details:
			'Trunk-based development emphasizes working directly on the main branch with small, frequent commits. It requires strong engineering practices and is ideal for teams that can maintain high code quality.',
		useCases: [
			'Experienced teams with strong practices',
			'Projects with comprehensive testing',
			'Teams using feature flags extensively',
			'High-frequency deployment needs',
		],
		bestPractices: [
			'Small, atomic commits',
			'Comprehensive automated testing',
			'Feature flags for incomplete work',
			'Strong code review culture',
		],
		icon: getFontAwesomeIcon('Target', 'w-5 h-5'),
	},
	{
		name: 'Forking Workflow',
		description: 'Distributed workflow for open source',
		steps: [
			'Fork the repository',
			'Clone your fork locally',
			'Create feature branch',
			'Push to your fork',
			'Create pull request to upstream',
		],
		pros: [
			'Open source friendly',
			'Isolated development',
			'No direct access needed',
		],
		cons: ['More complex setup', 'Harder to collaborate', 'Sync with upstream'],
		details:
			"The Forking Workflow is ideal for open source projects where contributors don't have direct write access to the main repository. Each contributor works on their own fork.",
		useCases: [
			'Open source projects',
			'Public repositories',
			'Contributors without write access',
			'Distributed teams',
		],
		bestPractices: [
			'Keep fork up to date with upstream',
			'Use descriptive branch names',
			'Write clear pull request descriptions',
			'Follow project contribution guidelines',
		],
		icon: getFontAwesomeIcon('Users', 'w-5 h-5'),
	},
	{
		name: 'GitLab Flow',
		description: 'Workflow optimized for GitLab',
		steps: [
			'Create feature branch from main',
			'Work on feature',
			'Create merge request',
			'Use environment branches',
			'Deploy through environments',
		],
		pros: [
			'Environment-based deployment',
			'GitLab integration',
			'Flexible branching',
		],
		cons: [
			'GitLab specific',
			'More complex than GitHub Flow',
			'Environment management',
		],
		details:
			'GitLab Flow extends GitHub Flow with environment-based deployment strategies. It uses environment branches to manage different deployment stages.',
		useCases: [
			'GitLab-based projects',
			'Multi-environment deployments',
			'Enterprise GitLab users',
			'Complex deployment pipelines',
		],
		bestPractices: [
			'Use environment-specific branches',
			'Automate deployment pipelines',
			'Monitor environment health',
			'Use GitLab CI/CD features',
		],
		icon: getFontAwesomeIcon('Server', 'w-5 h-5'),
	},
]
