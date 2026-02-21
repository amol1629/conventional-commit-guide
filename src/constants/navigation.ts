/**
 * Navigation configuration following Single Responsibility Principle
 * This file contains all navigation-related constants and types
 */

export interface NavigationItem {
	name: string
	href: string
	icon: string
	description?: string
	ariaLabel?: string
}

export interface NavigationConfig {
	items: NavigationItem[]
}

/**
 * Navigation items configuration
 * Each item follows accessibility best practices with proper ARIA labels
 * Using string identifiers for Lucide React icons
 */
export const NAVIGATION_ITEMS: NavigationItem[] = [
	{
		name: 'home',
		href: '/home',
		icon: 'Home',
		description: 'Return to the main dashboard',
		ariaLabel: 'navigation_home_aria_label',
	},
	{
		name: 'git_github',
		href: '/git-guide',
		icon: 'Github',
		description: 'Learn Git and GitHub best practices',
		ariaLabel: 'navigation_git_github_aria_label',
	},
	{
		name: 'generator',
		href: '/generator',
		icon: 'Zap',
		description: 'Generate conventional commit messages',
		ariaLabel: 'navigation_generator_aria_label',
	},
	{
		name: 'examples',
		href: '/examples',
		icon: 'BookOpen',
		description: 'Browse commit message examples',
		ariaLabel: 'navigation_examples_aria_label',
	},
	{
		name: 'validator',
		href: '/validator',
		icon: 'CheckCircle',
		description: 'Validate your commit messages',
		ariaLabel: 'navigation_validator_aria_label',
	},
	{
		name: 'guide',
		href: '/guide',
		icon: 'Book',
		description: 'Learn about conventional commits',
		ariaLabel: 'navigation_guide_aria_label',
	},
	{
		name: 'changelog',
		href: '/changelog',
		icon: 'FileText',
		description: 'Generate changelogs from commits',
		ariaLabel: 'navigation_changelog_aria_label',
	},
	// {
	// 	name: 'interactive_practice',
	// 	href: '/interactive-practice',
	// 	icon: 'Play',
	// 	description: 'Practice writing conventional commits',
	// 	ariaLabel: 'navigation_interactive_practice_aria_label',
	// },
	// {
	// 	name: 'team_training',
	// 	href: '/team-training',
	// 	icon: 'Users',
	// 	description: 'Team training and resources',
	// 	ariaLabel: 'navigation_team_training_aria_label',
	// },
]

/**
 * Navigation configuration object
 * Follows Open/Closed Principle - easy to extend without modification
 */
export const NAVIGATION_CONFIG: NavigationConfig = {
	items: NAVIGATION_ITEMS,
}
