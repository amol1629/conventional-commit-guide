/**
 * Modern i18n setup for Next.js 15+ (2025 approach)
 * Uses built-in Next.js i18n with modern patterns
 */

import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'

// Modern i18n instance with 2025 best practices
const i18n = createInstance({
	lng: 'en',
	fallbackLng: 'en',
	debug: false,

	// Modern interpolation settings
	interpolation: {
		escapeValue: false,
	},

	// Modern React settings
	react: {
		useSuspense: true, // Use Suspense for better UX
		bindI18n: 'languageChanged loaded',
		bindI18nStore: 'added removed',
		transEmptyNodeValue: '',
		transSupportBasicHtmlNodes: true,
		transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
	},

	// Modern backend configuration
	backend: {
		loadPath: '/locales/{{lng}}/{{ns}}.json',
	},

	// Modern preloading
	preload: ['en'],
	load: 'languageOnly',

	// Modern caching
	initImmediate: false,
	keySeparator: false,
	nsSeparator: false,
})

// Modern resource loading with dynamic imports
i18n.use(
	resourcesToBackend((language: string, namespace: string) => {
		return import(`../../locales/${language}/${namespace}.json`)
	}),
)

i18n.use(initReactI18next)

// Modern initialization with proper error handling
i18n.init().catch(console.error)

export default i18n
