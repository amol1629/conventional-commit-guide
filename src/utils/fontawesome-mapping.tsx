'use client'

import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import all Font Awesome icons we need
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
	faAngleDoubleLeft,
	faAngleDoubleRight,
	faArchive,
	faArrowRight,
	faBolt,
	faBook,
	faBookOpen,
	faBox,
	faBullseye,
	faCheck,
	faCheckCircle,
	faChevronDown,
	faChevronLeft,
	faChevronRight,
	faChevronUp,
	faCircle,
	faCircleCheck,
	// Basic icons
	faCircleXmark,
	faCloud,
	faCode,
	faCog,
	faCopy,
	faDownload,
	faEdit,
	faEnvelope,
	faExclamationTriangle,
	faEye,
	faEyeSlash,
	faFileText,
	faGlobe,
	faGripVertical,
	faHeart,
	faHistory,
	faHome,
	faInfo,
	faMaximize,
	faMinimize,
	faLightbulb,
	faLock,
	faMoon,
	faPlay,
	faPlus,
	faRefresh,
	faRocket,
	faSave,
	faSearch,
	faServer,
	faShield,
	faSignOutAlt,
	faStar,
	faSun,
	faTag,
	faTerminal,
	faTimes,
	faTrash,
	faUpload,
	faUser,
	faUserCog,
	faUsers,
	faX,
} from '@fortawesome/free-solid-svg-icons'

// Font Awesome icon mapping for all Lucide icons used in the project
export const fontAwesomeIconMap: Record<string, IconDefinition> = {
	// Basic navigation and UI
	Home: faHome,
	Book: faBook,
	BookOpen: faBookOpen,
	FileText: faFileText,
	CheckCircle: faCheckCircle,
	CircleCheck: faCircleCheck,
	Info: faInfo,
	Code: faCode,
	Copy: faCopy,
	Download: faDownload,
	RefreshCw: faRefresh,
	Check: faCheck,
	X: faX,
	Search: faSearch,
	Circle: faCircle,
	Dot: faCircle, // Using Circle as substitute for Dot
	CircleXmark: faCircleXmark,
	ChevronDown: faChevronDown,
	ChevronLeft: faChevronLeft,
	ChevronUp: faChevronUp,
	ChevronRight: faChevronRight,
	GripVertical: faGripVertical,
	Moon: faMoon,
	Sun: faSun,
	Zap: faBolt,
	Users: faUsers,
	Activity: faUsers, // Using Users as substitute for Activity
	ArrowRight: faArrowRight,
	Lightbulb: faLightbulb,
	AlertTriangle: faExclamationTriangle,
	Target: faBullseye,
	Terminal: faTerminal,
	GitBranch: faCode, // Using Code as substitute for GitBranch
	Server: faServer,
	GitCommit: faCode, // Using Code as substitute for GitCommit
	GitMerge: faCode, // Using Code as substitute for GitMerge
	GitPullRequest: faCode, // Using Code as substitute for GitPullRequest
	Github: faGithub,
	GithubIcon: faGithub,
	// Additional icons for git-commands
	Plus: faPlus,
	Save: faSave,
	Upload: faUpload,
	Eye: faEye,
	EyeSlash: faEyeSlash,
	History: faHistory,
	Globe: faGlobe,
	Tag: faTag,
	Archive: faArchive,
	Trash2: faTrash, // Using Trash as substitute for Trash2
	Merge: faCode, // Using Code as substitute for Merge
	Split: faCode, // Using Code as substitute for Split
	// Additional icons for github-features
	Shield: faShield,
	Package: faBox,
	Cloud: faCloud,
	// Additional icons for feature cards
	Heart: faHeart,
	Star: faStar,
	Rocket: faRocket,
	Maximize: faMaximize,
	Minimize: faMinimize,
	// Navigation icons
	Play: faPlay,
	// Profile and settings icons
	Cog: faCog,
	User: faUser,
	UserCog: faUserCog,
	SignOutAlt: faSignOutAlt,
	// Security icons
	Lock: faLock,
	// Communication icons
	Envelope: faEnvelope,
	// Photo upload icons
	Edit: faEdit,
	Times: faTimes,
}

export const byPrefixAndName: Record<string, Record<string, IconDefinition>> = {
	fas: {
		maximize: faMaximize,
		minimize: faMinimize,
		'chevron-left': faChevronLeft,
		'chevron-right': faChevronRight,
		'chevron-up': faChevronUp,
		'chevron-down': faChevronDown,
		'angle-double-left': faAngleDoubleLeft,
		'angle-double-right': faAngleDoubleRight,
	},
}

/**
 * Get Font Awesome icon component by name
 */
export function getFontAwesomeIcon(
	iconName: string,
	className: string = 'w-5 h-5',
) {
	const iconDefinition = fontAwesomeIconMap[iconName]
	if (!iconDefinition) {
		console.warn(`Font Awesome icon "${iconName}" not found in iconMap`)
		return null
	}

	return <FontAwesomeIcon icon={iconDefinition} className={className} />
}

/**
 * Get Font Awesome icon definition by name
 */
export function getFontAwesomeIconDefinition(
	iconName: string,
): IconDefinition | null {
	return fontAwesomeIconMap[iconName] || null
}
