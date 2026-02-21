/**
 * Client-side i18n configuration for Next.js App Router
 * This handles client-side translations only
 */

import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'

const i18n = createInstance({
	lng: 'en',
	fallbackLng: 'en',
	debug: false,
	interpolation: {
		escapeValue: false,
	},
	react: {
		useSuspense: false,
	},
	// Preload all resources to prevent flashing
	preload: ['en'],
	// Initialize synchronously to prevent flashing
	initImmediate: false,
	// Load resources synchronously
	load: 'languageOnly',
	// Cache resources to prevent re-fetching
	backend: {
		loadPath: '/locales/{{lng}}/{{ns}}.json',
	},
})

i18n.use(initReactI18next)
i18n.use(
	resourcesToBackend(
		(language: string, namespace: string) =>
			import(`../../locales/${language}/${namespace}.json`),
	),
)

// Initialize synchronously and wait for ready
i18n.init().then(() => {
	// Ensure all resources are loaded
	return Promise.all([
		i18n.loadLanguages(['en']),
		i18n.loadNamespaces([
			'common',
			'home',
			'git-guide',
			'commit-guide',
			'changelog',
		]),
	])
})

export default i18n
