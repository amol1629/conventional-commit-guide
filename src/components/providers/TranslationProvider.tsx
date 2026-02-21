'use client'

/**
 * Translation Provider for Client-side i18n
 * Wraps the app with i18n context
 */

import i18n from '@/lib/i18n-client'
import { useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'

interface TranslationProviderProps {
	children: React.ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {
	// const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		// Preload all translations to prevent flashing
		const initializeTranslations = async () => {
			try {
				// Wait for i18n to be fully initialized
				await i18n.init()

				// Preload all namespaces
				await Promise.all([
					i18n.loadLanguages(['en']),
					i18n.loadNamespaces([
						'common',
						'home',
						'git-guide',
						'commit-guide',
						'changelog',
					]),
				])

				// Translations initialized
			} catch (error) {
				console.warn('Failed to initialize translations:', error)
				// Still render even if translations fail
			}
		}

		initializeTranslations()
	}, [])

	// Always render children with i18n context
	// The translations will be available immediately after initialization
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
