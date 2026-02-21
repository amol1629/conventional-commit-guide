'use client'

/**
 * Modern translation hook (2025 approach)
 * Uses modern React patterns with proper error boundaries
 */

import { useMemo } from 'react'
import { useTranslation as useI18nTranslation } from 'react-i18next'

export function useTranslation(namespaces: string[] = ['common']) {
	const { t, ready, i18n } = useI18nTranslation(namespaces)

	// Modern memoization with proper dependencies
	const memoizedT = useMemo(() => {
		return (key: string, options?: Record<string, unknown>) => {
			// Handle namespace prefixes (e.g., 'common:key' -> 'key')
			const cleanKey = key.includes(':') ? key.split(':')[1] : key
			const namespace = key.includes(':') ? key.split(':')[0] : namespaces[0]

			// Use modern i18n with proper fallbacks
			return t(cleanKey, {
				ns: namespace,
				...options,
				// Modern fallback handling
				defaultValue: key,
			})
		}
	}, [t, namespaces])

	return {
		t: memoizedT,
		ready,
		i18n,
		// Modern additional utilities
		changeLanguage: i18n.changeLanguage,
		currentLanguage: i18n.language,
	}
}
