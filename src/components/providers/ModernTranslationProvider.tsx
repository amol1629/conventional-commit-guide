'use client'

/**
 * Modern Translation Provider (2025 approach)
 * Uses Suspense and modern React patterns for better UX
 */

import { LoadingSpinner } from '@/components/LoadingSpinner'
import i18n from '@/lib/i18n-modern'
import { Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'

interface ModernTranslationProviderProps {
	children: React.ReactNode
}

// Modern loading component with better UX
function TranslationLoading() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<LoadingSpinner size="lg" />
		</div>
	)
}

/**
 * Modern translation provider with Suspense
 * This prevents translation key flashing using modern React patterns
 */
export function ModernTranslationProvider({
	children,
}: ModernTranslationProviderProps) {
	return (
		<I18nextProvider i18n={i18n}>
			<Suspense fallback={<TranslationLoading />}>{children}</Suspense>
		</I18nextProvider>
	)
}
