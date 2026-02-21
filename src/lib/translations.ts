/**
 * Server-side translations for static generation
 * This prevents translation key flashing by pre-loading translations
 */

import { readFileSync } from 'fs'
import { join } from 'path'

// Cache for translations
const translationCache = new Map<string, Record<string, unknown>>()

export function getTranslations(
	locale: string = 'en',
	namespace: string = 'common',
): Record<string, unknown> {
	const cacheKey = `${locale}-${namespace}`

	if (translationCache.has(cacheKey)) {
		return translationCache.get(cacheKey) as Record<string, unknown>
	}

	try {
		const filePath = join(process.cwd(), 'locales', locale, `${namespace}.json`)
		const fileContent = readFileSync(filePath, 'utf8')
		const translations = JSON.parse(fileContent)

		translationCache.set(cacheKey, translations)
		return translations
	} catch (error) {
		console.warn(
			`Failed to load translations for ${locale}/${namespace}:`,
			error,
		)
		return {}
	}
}

export function getAllTranslations(
	locale: string = 'en',
): Record<string, Record<string, unknown>> {
	const namespaces = [
		'common',
		'home',
		'git-guide',
		'commit-guide',
		'changelog',
	]
	const translations: Record<string, Record<string, unknown>> = {}

	for (const namespace of namespaces) {
		translations[namespace] = getTranslations(locale, namespace)
	}

	return translations
}
