import { getPageTitle, trackPageVisit } from '@/utils/page-tracker'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export const usePageTracker = (userId: string | undefined) => {
	const pathname = usePathname()
	const startTime = useRef<number>(Date.now())
	const lastPathname = useRef<string>(pathname)

	useEffect(() => {
		// Track page visit when pathname changes
		if (userId && pathname !== lastPathname.current) {
			const timeSpent = Math.round((Date.now() - startTime.current) / 1000 / 60) // in minutes

			// Track the previous page visit
			if (lastPathname.current !== pathname) {
				trackPageVisit(
					userId,
					lastPathname.current,
					getPageTitle(lastPathname.current),
					timeSpent,
				)
			}

			// Update refs for next visit
			lastPathname.current = pathname
			startTime.current = Date.now()

			// Track current page visit
			trackPageVisit(
				userId,
				pathname,
				getPageTitle(pathname),
				0, // Will be calculated on next page visit
			)
		}
	}, [pathname, userId])

	// Track final page visit on unmount
	useEffect(() => {
		return () => {
			if (userId && lastPathname.current) {
				const timeSpent = Math.round(
					(Date.now() - startTime.current) / 1000 / 60,
				)
				trackPageVisit(
					userId,
					lastPathname.current,
					getPageTitle(lastPathname.current),
					timeSpent,
				)
			}
		}
	}, [userId])
}
