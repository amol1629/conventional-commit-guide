/**
 * Custom hook for navigation functionality
 * Follows React best practices and SOLID principles
 */

import { NavigationItem } from '@/constants/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { NavigationService } from '@/services/navigation.service'
import { usePathname } from 'next/navigation'

export interface UseNavigationReturn {
	navigationItems: NavigationItem[]
	isActiveRoute: (href: string) => boolean
	getTranslatedNavigationItems: () => Array<
		NavigationItem & { translatedName: string }
	>
}

/**
 * Custom hook for navigation functionality
 * @param navigationService - Navigation service instance
 * @returns Navigation utilities and items
 */
export function useNavigation(
	navigationService: NavigationService,
): UseNavigationReturn {
	const pathname = usePathname()
	const { t } = useTranslation(['common'])

	/**
	 * Get all navigation items
	 */
	const navigationItems = navigationService.getNavigationItems()

	/**
	 * Check if a route is currently active
	 * @param href - Navigation href
	 * @returns Boolean indicating if route is active
	 */
	const isActiveRoute = (href: string): boolean => {
		return navigationService.isActiveRoute(pathname, href)
	}

	/**
	 * Get navigation items with translated names
	 * @returns Array of navigation items with translated names
	 */
	const getTranslatedNavigationItems = (): Array<
		NavigationItem & { translatedName: string }
	> => {
		return navigationItems.map((item) => ({
			...item,
			translatedName: t(`common:${item.name}_title`),
		}))
	}

	return {
		navigationItems,
		isActiveRoute,
		getTranslatedNavigationItems,
	}
}
