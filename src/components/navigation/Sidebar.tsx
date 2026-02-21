/**
 * Main Sidebar Component
 * Follows SOLID principles, WCAG accessibility, and UI/UX best practices
 */

import { NAVIGATION_ITEMS } from '@/constants/navigation'
import { useNavigation } from '@/hooks/useNavigation'
import { useTranslation } from '@/hooks/useTranslation'
import { NavigationService } from '@/services/navigation.service'
import { useState } from 'react'
import { MobileMenuButton } from './MobileMenuButton'
import { NavigationButton } from './NavigationButton'
import { SidebarFooter } from './SidebarFooter'
import { SidebarHeader } from './SidebarHeader'

interface SidebarProps {
	className?: string
}

/**
 * Accessible sidebar navigation component
 * Follows WCAG 2.1 AA standards with proper focus management
 */
export function Sidebar({ className }: SidebarProps) {
	const { t } = useTranslation(['common'])
	const [isOpen, setIsOpen] = useState(false)

	// Initialize navigation service following Dependency Injection principle
	const navigationService = new NavigationService(NAVIGATION_ITEMS)
	const { getTranslatedNavigationItems, isActiveRoute } =
		useNavigation(navigationService)

	const toggleSidebar = () => {
		setIsOpen(!isOpen)
	}

	const translatedItems = getTranslatedNavigationItems()

	return (
		<>
			{/* Mobile menu button */}
			<MobileMenuButton
				isOpen={isOpen}
				onToggle={toggleSidebar}
				className="fixed z-50 p-2 transition-all duration-200 ease-in-out border rounded-md shadow-lg top-4 left-4 bg-background border-border text-foreground hover:text-primary hover:scale-105 focus:outline-none focus:text-primary md:hidden"
			/>

			{/* Overlay for mobile - WCAG compliant with proper focus management */}
			{isOpen && (
				<div
					className="fixed inset-0 z-40 transition-opacity duration-200 ease-in-out bg-black/50 md:hidden"
					onClick={toggleSidebar}
					aria-hidden="true"
				/>
			)}

			{/* Sidebar */}
			<aside
				id="navigation-menu"
				className={`fixed top-0 left-0 z-50 h-full w-64 bg-background border-r border-border transform transition-all duration-200 ease-in-out ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				} md:translate-x-0 md:static md:z-auto ${className}`}
				role="navigation"
				aria-label="Main navigation"
			>
				<div className="flex flex-col h-full">
					{/* Header */}
					<SidebarHeader isOpen={isOpen} onToggle={toggleSidebar} />

					{/* Navigation Items */}
					<nav
						className="flex-1 px-4 py-6 space-y-2 transition-all duration-200 ease-in-out"
						role="navigation"
						aria-label={t('common:navigation_main_label') as string}
					>
						{translatedItems.map((item, index) => (
							<div
								key={item.href}
								className="transition-all duration-200 ease-in-out"
								style={{
									animationDelay: `${index * 50}ms`,
								}}
							>
								<NavigationButton
									item={item}
									isActive={isActiveRoute(item.href)}
									onClick={() => setIsOpen(false)}
								/>
							</div>
						))}
					</nav>

					{/* Footer with Theme Toggle */}
					<SidebarFooter />
				</div>
			</aside>
		</>
	)
}
