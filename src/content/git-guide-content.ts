export const GIT_GUIDE_CONTENT = {
	hero: {
		title: 'Git & GitHub Mastery',
		description:
			'Master version control with Git and collaboration with GitHub. From basic commands to advanced workflows.',
	},
	tabs: {
		gitBasics: 'Git Basics',
		githubFeatures: 'GitHub Features',
		workflows: 'Workflows',
		bestPractices: 'Best Practices',
	},
	bestPractices: {
		commit: {
			title: 'Commit Best Practices',
			description:
				'Master the art of writing meaningful commits that tell a story',
			dos: [
				'Write clear, descriptive commit messages',
				'Use conventional commit format',
				'Make small, focused commits',
				'Test before committing',
				'Use present tense in commit messages',
				'Include context in commit body',
			],
			donts: [
				'Commit broken or incomplete code',
				'Use vague messages like "fix bug"',
				'Commit large files or binaries',
				'Mix unrelated changes in one commit',
				'Commit sensitive information',
				'Force push to shared branches',
			],
		},
		branching: {
			title: 'Branching Strategies',
			description: 'Organize your work with effective branching strategies',
			bestPractices: [
				'Use descriptive branch names (feature/auth, bugfix/login)',
				'Keep branches short-lived (merge within days)',
				'Delete merged branches to keep repo clean',
				'Use feature flags for incomplete features',
				'Protect main branch with rules',
			],
			proTips: [
				'Use consistent naming conventions',
				'Regularly sync with main branch',
				'Use branch protection rules',
				'Document your branching strategy',
			],
		},
		collaboration: {
			title: 'Team Collaboration',
			description: 'Work effectively with your team using Git and GitHub',
			bestPractices: [
				'Use pull requests for code review',
				'Write clear PR descriptions',
				'Request reviews from team members',
				'Use issue templates',
				'Document your code',
			],
			teamTips: [
				'Use draft PRs for work in progress',
				'Set up automated checks',
				'Use project boards for tracking',
				'Regular team sync meetings',
			],
		},
		security: {
			title: 'Security Best Practices',
			description: 'Keep your code and data secure with proper practices',
			essentials: [
				'Never commit secrets or passwords',
				'Use environment variables',
				'Enable branch protection rules',
				'Use two-factor authentication',
				'Regularly update dependencies',
			],
			advanced: [
				"Use GitHub's secret scanning",
				'Enable dependency vulnerability alerts',
				'Use signed commits',
				'Regular security audits',
			],
		},
		performance: {
			title: 'Performance & Optimization',
			description: 'Optimize your Git workflow for better performance',
			performanceTips: [
				'Use .gitignore to exclude unnecessary files',
				'Use shallow clones for CI/CD',
				'Use Git LFS for large files',
				'Regular repository maintenance',
			],
			tools: [
				'Use pre-commit hooks',
				'Automate testing with CI/CD',
				'Use Git aliases for common commands',
				'Monitor repository health',
			],
		},
	},
}
