import { BestPractice } from '@/types'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

export const BEST_PRACTICES: BestPractice[] = [
	{
		title: 'Use Imperative Mood',
		description:
			'Write commit messages in imperative mood, as if you were commanding someone. This creates consistency and clarity.',
		good: 'feat: add user authentication',
		bad: 'feat: added user authentication',
		icon: getFontAwesomeIcon('Target', 'w-5 h-5'),
		details:
			'The imperative mood makes commits read like instructions, which is more natural and consistent. Think "If applied, this commit will..." and complete the sentence.',
	},
	{
		title: 'Keep Subject Line Under 50 Characters',
		description:
			'The subject line should be concise and under 50 characters for better readability in Git logs.',
		good: 'feat(auth): add OAuth2 support',
		bad: 'feat(authentication): add comprehensive OAuth2 authentication support with multiple providers',
		icon: getFontAwesomeIcon('Zap', 'w-5 h-5'),
		details:
			'Short subject lines are easier to scan in Git logs and commit history. Use the body for detailed explanations.',
	},
	{
		title: 'Capitalize the First Letter',
		description:
			'Always capitalize the first letter of the subject line for consistency.',
		good: 'feat: Add new feature',
		bad: 'feat: add new feature',
		icon: getFontAwesomeIcon('Lightbulb', 'w-5 h-5'),
		details:
			'Capitalizing the first letter makes commits look more professional and consistent across the project.',
	},
	{
		title: "Don't End with a Period",
		description:
			'The subject line should not end with a period to maintain consistency.',
		good: 'feat: add user authentication',
		bad: 'feat: add user authentication.',
		icon: getFontAwesomeIcon('CheckCircle', 'w-5 h-5'),
		details:
			'Avoiding periods in subject lines creates a cleaner, more consistent look in Git logs.',
	},
	{
		title: 'Use Body for Details',
		description:
			'Use the body to explain what and why, not what. The subject should be self-explanatory.',
		good: 'feat: add user authentication\n\nImplement JWT-based authentication with refresh tokens.',
		bad: 'feat: add user authentication',
		icon: getFontAwesomeIcon('BookOpen', 'w-5 h-5'),
		details:
			'The body should explain the motivation for the change and any important details that help future developers understand the context.',
	},
	{
		title: 'Reference Issues and PRs',
		description:
			'Reference related issues, pull requests, or other commits to provide context.',
		good: 'fix: resolve memory leak in data processing\n\nCloses #123',
		bad: 'fix: resolve memory leak',
		icon: getFontAwesomeIcon('Info', 'w-5 h-5'),
		details:
			'Linking to issues and PRs helps maintain traceability and provides additional context for the changes.',
	},
	{
		title: 'Use Scopes Consistently',
		description:
			'Use scopes to indicate the area of the codebase affected by the change.',
		good: 'feat(auth): add OAuth2 support',
		bad: 'feat: add OAuth2 support',
		icon: getFontAwesomeIcon('Target', 'w-5 h-5'),
		details:
			'Scopes help organize commits by functional area and make it easier to filter and search commit history.',
	},
	{
		title: 'Be Specific and Descriptive',
		description:
			'Use specific, descriptive language that clearly communicates the change.',
		good: 'fix(ui): resolve button alignment on mobile devices',
		bad: 'fix: fix button',
		icon: getFontAwesomeIcon('Lightbulb', 'w-5 h-5'),
		details:
			'Specific descriptions help team members understand the change without reading the code diff.',
	},
	{
		title: 'Use Breaking Change Notation',
		description: 'Use "!" after the type/scope to indicate breaking changes.',
		good: 'feat!: change authentication method',
		bad: 'feat: change authentication method',
		icon: getFontAwesomeIcon('AlertTriangle', 'w-5 h-5'),
		details:
			'Breaking changes should be clearly marked to help with version management and release notes.',
	},
	{
		title: 'Write in English',
		description:
			'Write commit messages in English for consistency across international teams.',
		good: 'feat: add user authentication',
		bad: 'feat: добавить аутентификацию пользователя',
		icon: getFontAwesomeIcon('BookOpen', 'w-5 h-5'),
		details:
			'Using English ensures that all team members can understand the commit history regardless of their native language.',
	},
	{
		title: 'Use Present Tense',
		description: 'Use present tense in commit messages for consistency.',
		good: 'feat: add user authentication',
		bad: 'feat: added user authentication',
		icon: getFontAwesomeIcon('CheckCircle', 'w-5 h-5'),
		details:
			'Present tense makes commits read more naturally and consistently across the project.',
	},
	{
		title: 'Avoid Vague Language',
		description:
			'Avoid vague words like "stuff", "things", "fix", "update" without context.',
		good: 'fix(api): resolve null pointer exception in user endpoint',
		bad: 'fix: fix stuff',
		icon: getFontAwesomeIcon('AlertTriangle', 'w-5 h-5'),
		details:
			'Vague language makes it difficult to understand what was actually changed and why.',
	},
]
