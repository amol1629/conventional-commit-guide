// Page visit tracking utility
export const trackPageVisit = async (
	userId: string,
	page: string,
	title?: string,
	timeSpent?: number,
) => {
	try {
		const response = await fetch('/api/track-visit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				page,
				title,
				timeSpent,
			}),
		})

		const data = await response.json()
		return data.success
	} catch (error) {
		console.error('Error tracking page visit:', error)
		return false
	}
}

// Page titles mapping
export const PAGE_TITLES: Record<string, string> = {
	'/home': 'Dashboard',
	'/git-guide': 'Git & GitHub Guide',
	'/interactive-practice': 'Interactive Practice',
	'/team-training': 'Team Training',
	'/generator': 'Commit Generator',
	'/validator': 'Commit Validator',
	'/examples': 'Commit Examples',
	'/guide': 'Conventional Commits Guide',
	'/changelog': 'Changelog Generator',
	'/workflow': 'Git Workflow',
	'/profile': 'Profile Settings',
}

// Get page title
export const getPageTitle = (pathname: string): string => {
	return (
		PAGE_TITLES[pathname] ||
		pathname
			.replace('/', '')
			.replace('-', ' ')
			.replace(/\b\w/g, (l) => l.toUpperCase())
	)
}
