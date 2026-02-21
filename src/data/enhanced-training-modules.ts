// Enhanced training modules with real-world scenarios and practical examples
export interface EnhancedTrainingModule {
	id: string
	title: string
	description: string
	duration: string
	level: 'Beginner' | 'Intermediate' | 'Advanced'
	icon: string
	prerequisites?: string[]
	realWorldScenarios: RealWorldScenario[]
	practicalExercises: PracticalExercise[]
	keyConcepts: string[]
	commonMistakes: string[]
	bestPractices: string[]
	tools: string[]
	content: {
		overview: string
		benefits: string[]
		structure?: string
		types?: Array<{
			type: string
			description: string
			example: string
			realWorldUse: string
		}>
		bestPractices?: string[]
		examples?: string[]
		workflow?: string[]
		tools?: string[]
	}
}

export interface RealWorldScenario {
	id: string
	title: string
	description: string
	context: string
	challenge: string
	solution: string
	commitExample: string
	lessons: string[]
}

export interface PracticalExercise {
	id: string
	title: string
	description: string
	instructions: string[]
	expectedOutcome: string
	difficulty: 'Easy' | 'Medium' | 'Hard'
	timeEstimate: string
}

export const enhancedTrainingModules: EnhancedTrainingModule[] = [
	{
		id: 'introduction',
		title: 'Introduction to Conventional Commits',
		description:
			'Master the fundamentals of conventional commit specification with real-world examples',
		duration: '20 min',
		level: 'Beginner',
		icon: 'BookOpen',
		realWorldScenarios: [
			{
				id: 'scenario-1',
				title: 'Startup Development Team',
				description:
					'A fast-growing startup needs to establish commit standards',
				context:
					'Your team of 5 developers is working on a React application. Code reviews are taking too long because commit messages are unclear.',
				challenge:
					'Developers are writing vague commit messages like "fix bug" or "update code"',
				solution:
					'Implement conventional commits to make the codebase history self-documenting',
				commitExample: 'feat(auth): add OAuth2 integration with Google',
				lessons: [
					'Clear commit messages reduce code review time',
					'Self-documenting history improves onboarding',
					'Consistent format enables automation',
				],
			},
			{
				id: 'scenario-2',
				title: 'Open Source Project',
				description: 'Contributing to a popular open source project',
				context:
					'You want to contribute to a popular open source project that uses conventional commits',
				challenge: "Understanding the project's commit message requirements",
				solution: "Learn conventional commits to match the project's standards",
				commitExample:
					'docs(readme): update installation instructions for Windows',
				lessons: [
					'Open source projects often require conventional commits',
					'Good commit messages help maintainers understand changes',
					'Consistent format makes project history readable',
				],
			},
		],
		practicalExercises: [
			{
				id: 'exercise-1',
				title: 'Convert Vague Commits',
				description:
					'Practice converting unclear commit messages to conventional format',
				instructions: [
					'Take 5 recent commits from your project',
					'Rewrite them using conventional commit format',
					'Identify the type, scope, and description for each',
					'Add breaking change indicators if applicable',
				],
				expectedOutcome: 'All commits follow conventional commit specification',
				difficulty: 'Easy',
				timeEstimate: '10 minutes',
			},
		],
		keyConcepts: [
			'Commit message structure',
			'Type classification',
			'Scope identification',
			'Description writing',
			'Breaking change handling',
		],
		commonMistakes: [
			'Using vague descriptions like "fix bug"',
			'Inconsistent type usage',
			'Missing scope when it would be helpful',
			'Not indicating breaking changes',
		],
		bestPractices: [
			'Use imperative mood in descriptions',
			'Keep descriptions under 50 characters',
			'Be specific about what changed',
			'Include scope for multi-component projects',
		],
		tools: [
			'Commitizen',
			'Conventional Changelog',
			'Semantic Release',
			'Husky',
		],
		content: {
			overview:
				'Conventional Commits is a specification for adding human and machine readable meaning to commit messages. It provides a simple set of rules for creating an explicit commit history, which makes it easier to write automated tools on top of.',
			benefits: [
				'Automated changelog generation',
				'Automated version bumping',
				'Better project history',
				'Improved team communication',
				'Easier code reviews',
				'Automated release notes',
			],
			structure: 'type(scope): description',
			types: [
				{
					type: 'feat',
					description: 'A new feature for the user',
					example: 'feat(auth): add OAuth2 integration',
					realWorldUse: 'Adding new user authentication method',
				},
				{
					type: 'fix',
					description: 'A bug fix',
					example: 'fix(api): resolve memory leak in user service',
					realWorldUse: 'Fixing production bug that causes server crashes',
				},
				{
					type: 'docs',
					description: 'Documentation only changes',
					example: 'docs(readme): update installation guide',
					realWorldUse: 'Improving project documentation for new contributors',
				},
			],
		},
	},
	{
		id: 'types',
		title: 'Commit Types Deep Dive',
		description:
			'Master all commit types with real-world scenarios and advanced techniques',
		duration: '30 min',
		level: 'Intermediate',
		icon: 'List',
		prerequisites: ['introduction'],
		realWorldScenarios: [
			{
				id: 'scenario-3',
				title: 'E-commerce Platform',
				description:
					'Managing a complex e-commerce application with multiple teams',
				context:
					'Your e-commerce platform has frontend, backend, mobile, and DevOps teams working on different components',
				challenge:
					'Different teams using different commit types inconsistently',
				solution: 'Establish clear guidelines for when to use each commit type',
				commitExample: 'feat(cart): add bulk item removal functionality',
				lessons: [
					'Consistent type usage across teams',
					'Clear guidelines prevent confusion',
					'Type-based automation works better',
				],
			},
		],
		practicalExercises: [
			{
				id: 'exercise-2',
				title: 'Type Classification Challenge',
				description:
					'Practice identifying the correct commit type for various changes',
				instructions: [
					'Review 10 different code changes',
					'Classify each change with the appropriate type',
					'Justify your choice for each classification',
					'Consider edge cases and ambiguous scenarios',
				],
				expectedOutcome: 'Accurate type classification for all scenarios',
				difficulty: 'Medium',
				timeEstimate: '15 minutes',
			},
		],
		keyConcepts: [
			'All commit types and their usage',
			'Type selection criteria',
			'Edge cases and ambiguous scenarios',
			'Type-based automation',
			'Team consistency',
		],
		commonMistakes: [
			'Using feat for internal changes',
			'Using fix for new features',
			'Inconsistent type usage across team',
			'Not considering automation implications',
		],
		bestPractices: [
			'Use feat only for user-facing features',
			'Use fix for actual bug fixes',
			'Use refactor for code improvements',
			'Use perf for performance improvements',
		],
		tools: ['Commitizen', 'Conventional Changelog', 'Semantic Release'],
		content: {
			overview:
				'Understanding when to use each commit type is crucial for maintaining a clean project history and enabling automated tools.',
			benefits: [
				'Clear project history',
				'Automated tool compatibility',
				'Better team collaboration',
				'Improved code review process',
			],
			types: [
				{
					type: 'feat',
					description: 'A new feature for the user',
					example: 'feat(auth): add two-factor authentication',
					realWorldUse: 'Adding new user-facing functionality',
				},
				{
					type: 'fix',
					description: 'A bug fix',
					example: 'fix(api): resolve memory leak in user service',
					realWorldUse: 'Fixing production issues and bugs',
				},
				{
					type: 'docs',
					description: 'Documentation only changes',
					example: 'docs(readme): update installation guide',
					realWorldUse: 'Improving project documentation',
				},
				{
					type: 'style',
					description: 'Changes that do not affect the meaning of the code',
					example: 'style(components): fix ESLint warnings',
					realWorldUse: 'Code formatting and style improvements',
				},
				{
					type: 'refactor',
					description:
						'A code change that neither fixes a bug nor adds a feature',
					example: 'refactor(utils): extract common validation logic',
					realWorldUse: 'Code restructuring without changing functionality',
				},
				{
					type: 'perf',
					description: 'A code change that improves performance',
					example: 'perf(db): optimize user query performance',
					realWorldUse: 'Performance optimizations and improvements',
				},
				{
					type: 'test',
					description: 'Adding missing tests or correcting existing tests',
					example: 'test(auth): add unit tests for login flow',
					realWorldUse: 'Improving test coverage and quality',
				},
				{
					type: 'chore',
					description: 'Changes to the build process or auxiliary tools',
					example: 'chore(deps): update dependencies to latest versions',
					realWorldUse: 'Maintenance tasks and tooling updates',
				},
			],
		},
	},
	{
		id: 'team-workflow',
		title: 'Team Workflow Integration',
		description:
			'Integrate conventional commits into your team workflow with automation and best practices',
		duration: '45 min',
		level: 'Advanced',
		icon: 'Users',
		prerequisites: ['introduction', 'types'],
		realWorldScenarios: [
			{
				id: 'scenario-4',
				title: 'Enterprise Development Team',
				description: 'Large enterprise team implementing conventional commits',
				context:
					'A 50+ developer team across multiple time zones needs to implement conventional commits',
				challenge:
					'Getting all developers to adopt the new standard consistently',
				solution: 'Implement automated tools and training program',
				commitExample: 'feat(api)!: redesign user authentication endpoints',
				lessons: [
					'Automation enforces consistency',
					'Training is essential for adoption',
					'Gradual rollout reduces resistance',
				],
			},
		],
		practicalExercises: [
			{
				id: 'exercise-3',
				title: 'Setup Team Workflow',
				description: 'Configure automated tools for your team',
				instructions: [
					'Install and configure Commitizen',
					'Set up Husky pre-commit hooks',
					'Configure conventional changelog',
					'Create team guidelines document',
				],
				expectedOutcome: 'Fully automated conventional commit workflow',
				difficulty: 'Hard',
				timeEstimate: '30 minutes',
			},
		],
		keyConcepts: [
			'Team adoption strategies',
			'Automation tools setup',
			'CI/CD integration',
			'Training and onboarding',
			'Monitoring and enforcement',
		],
		commonMistakes: [
			'Implementing without team buy-in',
			'Over-complicating the setup',
			'Not providing adequate training',
			'Failing to monitor adoption',
		],
		bestPractices: [
			'Start with a pilot team',
			'Provide comprehensive training',
			'Use automation to enforce standards',
			'Monitor and provide feedback',
		],
		tools: [
			'Commitizen',
			'Husky',
			'Conventional Changelog',
			'Semantic Release',
			'Commitlint',
		],
		content: {
			overview:
				'Set up automated workflows and tools to enforce conventional commits across your entire team.',
			benefits: [
				'Automated commit validation',
				'Consistent team practices',
				'Reduced manual errors',
				'Streamlined development workflow',
			],
			tools: [
				'Commitizen for interactive commit creation',
				'Husky for pre-commit hooks',
				'Conventional Changelog for automated changelogs',
				'Semantic Release for automated versioning',
				'Commitlint for commit message validation',
			],
			workflow: [
				'1. Install commitizen and husky',
				'2. Configure pre-commit hooks',
				'3. Set up automated changelog generation',
				'4. Train team on commit message standards',
				'5. Monitor adoption and provide feedback',
			],
		},
	},
]

export const getModuleById = (
	id: string,
): EnhancedTrainingModule | undefined => {
	return enhancedTrainingModules.find((module) => module.id === id)
}

export const getModulesByLevel = (level: string): EnhancedTrainingModule[] => {
	return enhancedTrainingModules.filter((module) => module.level === level)
}

export const getPrerequisites = (moduleId: string): string[] => {
	const trainingModule = getModuleById(moduleId)
	return trainingModule?.prerequisites || []
}
