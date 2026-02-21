/**
 * Navigation Service following SOLID principles
 * Single Responsibility: Handles navigation logic
 * Open/Closed: Easy to extend with new navigation features
 * Liskov Substitution: Can be replaced with different implementations
 * Interface Segregation: Focused interface for navigation needs
 * Dependency Inversion: Depends on abstractions, not concretions
 */

import { NavigationItem } from '@/constants/navigation'

export interface NavigationServiceInterface {
	getNavigationItems(): NavigationItem[]
	isActiveRoute(currentPath: string, targetPath: string): boolean
	getNavigationItemByHref(href: string): NavigationItem | undefined
}

export class NavigationService implements NavigationServiceInterface {
	private navigationItems: NavigationItem[]

	constructor(navigationItems: NavigationItem[]) {
		this.navigationItems = navigationItems
	}

	/**
	 * Get all navigation items
	 * @returns Array of navigation items
	 */
	getNavigationItems(): NavigationItem[] {
		return this.navigationItems
	}

	/**
	 * Check if a route is currently active
	 * @param currentPath - Current page path
	 * @param targetPath - Target navigation path
	 * @returns Boolean indicating if route is active
	 */
	isActiveRoute(currentPath: string, targetPath: string): boolean {
		if (targetPath === '/') {
			return currentPath === '/'
		}
		return currentPath.startsWith(targetPath)
	}

	/**
	 * Get navigation item by href
	 * @param href - Navigation href
	 * @returns Navigation item or undefined
	 */
	getNavigationItemByHref(href: string): NavigationItem | undefined {
		return this.navigationItems.find((item) => item.href === href)
	}
}
