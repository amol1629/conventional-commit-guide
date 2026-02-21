'use client'

import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
	faBolt,
	faBook,
	faBookOpen,
	faCheckCircle,
	faFileText,
	faHome,
	faPlay,
	faUsers,
	faWrench,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * Icon mapping utility for navigation
 * Maps string identifiers to Font Awesome icons with colorful variants
 */

// Color variants for each icon
export const iconColors = {
	Home: 'text-blue-600 dark:text-blue-400',
	Github: 'text-orange-600 dark:text-orange-400',
	Zap: 'text-yellow-600 dark:text-yellow-400',
	BookOpen: 'text-green-600 dark:text-green-400',
	CheckCircle: 'text-emerald-600 dark:text-emerald-400',
	Book: 'text-purple-600 dark:text-purple-400',
	FileText: 'text-cyan-600 dark:text-cyan-400',
	Play: 'text-indigo-600 dark:text-indigo-400',
	Users: 'text-pink-600 dark:text-pink-400',
}

// Gradient color variants for more vibrant icons
export const iconGradientColors = {
	Home: 'bg-gradient-to-br from-blue-500 to-blue-700 bg-clip-text text-transparent',
	Github:
		'bg-gradient-to-br from-orange-500 to-red-600 bg-clip-text text-transparent',
	Zap: 'bg-gradient-to-br from-yellow-500 to-orange-500 bg-clip-text text-transparent',
	BookOpen:
		'bg-gradient-to-br from-green-500 to-emerald-600 bg-clip-text text-transparent',
	CheckCircle:
		'bg-gradient-to-br from-emerald-500 to-green-600 bg-clip-text text-transparent',
	Book: 'bg-gradient-to-br from-purple-500 to-pink-600 bg-clip-text text-transparent',
	FileText:
		'bg-gradient-to-br from-cyan-500 to-blue-600 bg-clip-text text-transparent',
	Play: 'bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent',
	Users:
		'bg-gradient-to-br from-pink-500 to-rose-600 bg-clip-text text-transparent',
}

// Font Awesome icon mapping
export const iconMap: Record<string, IconDefinition> = {
	Home: faHome,
	Wrench: faWrench,
	Zap: faBolt,
	BookOpen: faBookOpen,
	CheckCircle: faCheckCircle,
	Book: faBook,
	FileText: faFileText,
	Github: faGithub,
	Play: faPlay,
	Users: faUsers,
}

/**
 * Get icon component by name with colorful styling
 */
export function getIcon(iconName: string, className: string = 'w-5 h-5') {
	const iconDefinition = iconMap[iconName]
	if (!iconDefinition) {
		console.warn(`Icon "${iconName}" not found in iconMap`)
		return null
	}

	// Get the color for this icon
	const iconColor =
		iconColors[iconName as keyof typeof iconColors] ||
		'text-gray-600 dark:text-gray-400'

	return (
		<FontAwesomeIcon
			icon={iconDefinition}
			className={`${className} ${iconColor}`}
		/>
	)
}

/**
 * Get icon component with gradient colors for more vibrant appearance
 * Note: SVG elements don't work with text-based gradients, so we use solid colors instead
 */
export function getGradientIcon(
	iconName: string,
	className: string = 'w-5 h-5',
) {
	const iconDefinition = iconMap[iconName]
	if (!iconDefinition) {
		console.warn(`Icon "${iconName}" not found in iconMap`)
		return null
	}

	// Use solid colors instead of gradients for SVG compatibility
	const iconColor =
		iconColors[iconName as keyof typeof iconColors] ||
		'text-gray-600 dark:text-gray-400'

	return (
		<FontAwesomeIcon
			icon={iconDefinition}
			className={`${className} ${iconColor}`}
		/>
	)
}
