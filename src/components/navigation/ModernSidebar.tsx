'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { NAVIGATION_ITEMS } from '@/constants/navigation'
import { useNavigation } from '@/hooks/useNavigation'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'
import { NavigationService } from '@/services/navigation.service'
import { useCallback, useEffect, useState } from 'react'
import { MobileMenuButton } from './MobileMenuButton'
import { NavigationButton } from './NavigationButton'
import { SidebarFooter } from './SidebarFooter'
import { SidebarHeader } from './SidebarHeader'

interface ModernSidebarProps {
	className?: string
}

/**
 * Modern sidebar with toggle functionality
 * Maintains original styling and colors while adding modern toggle features
 */
export function ModernSidebar({ className }: ModernSidebarProps) {
	const { t } = useTranslation(['common'])
	const [isOpen, setIsOpen] = useState(false)
	const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
		if (typeof window !== 'undefined') {
			const storedCollapseState =
				window.localStorage.getItem('sidebar-collapsed')
			if (storedCollapseState !== null) {
				return storedCollapseState === 'true'
			}
		}
		return true
	})

	// Initialize navigation service following Dependency Injection principle
	const navigationService = new NavigationService(NAVIGATION_ITEMS)
	const { getTranslatedNavigationItems, isActiveRoute } =
		useNavigation(navigationService)

	const toggleSidebar = () => {
		setIsOpen(!isOpen)
	}

	const toggleCollapse = useCallback(() => {
		setIsCollapsed((prev) => {
			const next = !prev
			if (typeof window !== 'undefined') {
				window.localStorage.setItem('sidebar-collapsed', String(next))
			}
			return next
		})
	}, [])

	const handleNavItemClick = useCallback(() => {
		if (typeof window !== 'undefined') {
			if (window.matchMedia('(max-width: 767px)').matches) {
				setIsOpen(false)
			}
		}
	}, [])

	const translatedItems = getTranslatedNavigationItems()

	// Handle keyboard shortcut for toggle
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === 'b') {
				event.preventDefault()
				toggleCollapse()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [toggleCollapse])

	return (
		<TooltipProvider>
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
				className={`fixed top-0 left-0 z-50 h-full bg-background border-r border-border transform transition-all duration-300 ease-in-out ${
					isOpen ? 'translate-x-0' : '-translate-x-full'
				} md:translate-x-0 md:static md:z-auto ${
					isCollapsed ? 'w-16' : 'w-64'
				} ${className}`}
				role="navigation"
				aria-label="Main navigation"
			>
				<div className="flex flex-col h-full">
					{/* Header with Toggle Button */}
					<SidebarHeader
						isOpen={isOpen}
						onToggle={toggleSidebar}
						isCollapsed={isCollapsed}
						onToggleCollapse={toggleCollapse}
					/>

					{/* Navigation Items */}
					<nav
						className={cn(
							'flex-1 py-6 transition-all duration-300 ease-in-out flex flex-col',
							isCollapsed ? 'px-2 space-y-4 items-center' : 'px-4 space-y-5',
						)}
						role="navigation"
						aria-label={t('common:navigation_main_label') as string}
					>
						{translatedItems.map((item, index) => (
							<div
								key={item.href}
								className="transition-all duration-300 ease-in-out"
								style={{
									animationDelay: `${index * 50}ms`,
								}}
							>
								<NavigationButton
									item={item}
									isActive={isActiveRoute(item.href)}
									onClick={handleNavItemClick}
									isCollapsed={isCollapsed}
								/>
							</div>
						))}
					</nav>

					{/* Footer with sidebar expand/collapse toggle */}
					<SidebarFooter
						isCollapsed={isCollapsed}
						onToggleCollapse={toggleCollapse}
					/>
				</div>
			</aside>
		</TooltipProvider>
	)
}
