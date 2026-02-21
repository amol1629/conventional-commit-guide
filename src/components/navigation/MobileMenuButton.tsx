/**
 * Mobile Menu Button Component
 * Follows WCAG accessibility standards and UI/UX best practices
 */

import { useTranslation } from '@/hooks/useTranslation'

interface MobileMenuButtonProps {
	isOpen: boolean
	onToggle: () => void
	className?: string
}

/**
 * Accessible mobile menu button
 * Follows WCAG 2.1 AA standards with proper ARIA attributes
 */
export function MobileMenuButton({
	isOpen,
	onToggle,
	className,
}: MobileMenuButtonProps) {
	const { t } = useTranslation(['common'])

	return (
		<button
			onClick={onToggle}
			className={className}
			aria-label={
				isOpen
					? (t('common:navigation_menu_close') as string)
					: (t('common:navigation_menu_open') as string)
			}
			aria-expanded={isOpen}
			aria-controls="navigation-menu"
			type="button"
		>
			<svg
				className="w-6 h-6 transition-all duration-200 ease-in-out"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				aria-hidden="true"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					className="transition-all duration-200 ease-in-out"
					// d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
					d="M4 6h16M4 12h16M4 18h16"

				/>
			</svg>
		</button>
	)
}
