'use client'

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

export type FeatureCardVariant =
	| 'blue'
	| 'green'
	| 'purple'
	| 'cyan'
	| 'orange'
	| 'red'
	| 'indigo'
	| 'emerald'
	| 'pink'
	| 'teal'
	| 'violet'
	| 'amber'
	| 'lime'
	| 'rose'
	| 'sky'
	| 'slate'
	| 'stone'
	| 'zinc'
	| 'neutral'
	| 'gray'
	| 'custom'

interface FeatureCardProps {
	variant: FeatureCardVariant
	icon: string // Font Awesome icon name
	title: string
	description: string
	className?: string
	// Custom variant props
	customVariantStyles?: string
	customIconStyles?: string
}

const variantStyles: Record<FeatureCardVariant, string> = {
	blue: 'border-blue-200 hover:shadow-lg hover:shadow-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-800 dark:hover:shadow-lg dark:hover:shadow-blue-800',
	green:
		'border-green-200 hover:shadow-lg hover:shadow-green-100 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 dark:border-green-800 dark:hover:shadow-lg dark:hover:shadow-green-800',
	purple:
		'border-purple-200 hover:shadow-lg hover:shadow-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-800 dark:hover:shadow-lg dark:hover:shadow-purple-800',
	cyan: 'border-cyan-200 hover:shadow-lg hover:shadow-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 dark:border-cyan-800 dark:hover:shadow-lg dark:hover:shadow-cyan-800',
	orange:
		'border-orange-200 hover:shadow-lg hover:shadow-orange-100 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 dark:border-orange-800 dark:hover:shadow-lg dark:hover:shadow-orange-800',
	red: 'border-red-200 hover:shadow-lg hover:shadow-red-100 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-800 dark:hover:shadow-lg dark:hover:shadow-red-800',
	indigo:
		'border-indigo-200 hover:shadow-lg hover:shadow-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 dark:border-indigo-800 dark:hover:shadow-lg dark:hover:shadow-indigo-800',
	emerald:
		'border-emerald-200 hover:shadow-lg hover:shadow-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 dark:border-emerald-800 dark:hover:shadow-lg dark:hover:shadow-emerald-800',
	pink: 'border-pink-200 hover:shadow-lg hover:shadow-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 dark:border-pink-800 dark:hover:shadow-lg dark:hover:shadow-pink-800',
	teal: 'border-teal-200 hover:shadow-lg hover:shadow-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 dark:border-teal-800 dark:hover:shadow-lg dark:hover:shadow-teal-800',

	// Extended Colors
	violet:
		'border-violet-200 hover:shadow-lg hover:shadow-violet-100 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-fuchsia-900/20 dark:border-violet-800 dark:hover:shadow-lg dark:hover:shadow-violet-800',
	amber:
		'border-amber-200 hover:shadow-lg hover:shadow-amber-100 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20 dark:border-amber-800 dark:hover:shadow-lg dark:hover:shadow-amber-800',
	lime: 'border-lime-200 hover:shadow-lg hover:shadow-lime-100 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 dark:from-lime-900/20 dark:via-green-900/20 dark:to-emerald-900/20 dark:border-lime-800 dark:hover:shadow-lg dark:hover:shadow-lime-800',
	rose: 'border-rose-200 hover:shadow-lg hover:shadow-rose-100 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 dark:from-rose-900/20 dark:via-pink-900/20 dark:to-red-900/20 dark:border-rose-800 dark:hover:shadow-lg dark:hover:shadow-rose-800',
	sky: 'border-sky-200 hover:shadow-lg hover:shadow-sky-100 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 dark:from-sky-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 dark:border-sky-800 dark:hover:shadow-lg dark:hover:shadow-sky-800',

	// Neutral Colors
	slate:
		'border-slate-200 hover:shadow-lg hover:shadow-slate-100 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-900/20 dark:via-gray-900/20 dark:to-zinc-900/20 dark:border-slate-800 dark:hover:shadow-lg dark:hover:shadow-slate-800',
	stone:
		'border-stone-200 hover:shadow-lg hover:shadow-stone-100 bg-gradient-to-br from-stone-50 via-neutral-50 to-gray-50 dark:from-stone-900/20 dark:via-neutral-900/20 dark:to-gray-900/20 dark:border-stone-800 dark:hover:shadow-lg dark:hover:shadow-stone-800',
	zinc: 'border-zinc-200 hover:shadow-lg hover:shadow-zinc-100 bg-gradient-to-br from-zinc-50 via-slate-50 to-gray-50 dark:from-zinc-900/20 dark:via-slate-900/20 dark:to-gray-900/20 dark:border-zinc-800 dark:hover:shadow-lg dark:hover:shadow-zinc-800',
	neutral:
		'border-neutral-200 hover:shadow-lg hover:shadow-neutral-100 bg-gradient-to-br from-neutral-50 via-gray-50 to-slate-50 dark:from-neutral-900/20 dark:via-gray-900/20 dark:to-slate-900/20 dark:border-neutral-800 dark:hover:shadow-lg dark:hover:shadow-neutral-800',
	gray: 'border-gray-200 hover:shadow-lg hover:shadow-gray-100 bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-zinc-900/20 dark:border-gray-800 dark:hover:shadow-lg dark:hover:shadow-gray-800',

	custom: '', // Will be overridden by customVariantStyles
}

const iconStyles: Record<FeatureCardVariant, string> = {
	blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
	green:
		'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400',
	purple:
		'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400',
	cyan: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
	orange:
		'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400',
	red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
	indigo:
		'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400',
	emerald:
		'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-400',
	pink: 'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400',
	teal: 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400',

	// Extended Colors
	violet:
		'bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-400',
	amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400',
	lime: 'bg-lime-100 text-lime-600 dark:bg-lime-900 dark:text-lime-400',
	rose: 'bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-400',
	sky: 'bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400',

	// Neutral Colors
	slate: 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400',
	stone: 'bg-stone-100 text-stone-600 dark:bg-stone-900 dark:text-stone-400',
	zinc: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400',
	neutral:
		'bg-neutral-100 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400',
	gray: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400',

	custom: '', // Will be overridden by customIconStyles
}

export function FeatureCard({
	variant,
	icon,
	title,
	description,
	className,
	customVariantStyles,
	customIconStyles,
}: FeatureCardProps) {
	// Handle custom variant
	const getVariantStyles = () => {
		if (variant === 'custom' && customVariantStyles) {
			return customVariantStyles
		}
		return variantStyles[variant]
	}

	const getIconStyles = () => {
		if (variant === 'custom' && customIconStyles) {
			return customIconStyles
		}
		return iconStyles[variant]
	}

	return (
		<Card
			className={cn(
				'transition-all duration-300 ease-linear',
				getVariantStyles(),
				className,
			)}
		>
			<CardHeader className="text-center">
				<div
					className={cn(
						'flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg',
						getIconStyles(),
					)}
				>
					{getFontAwesomeIcon(icon, 'w-6 h-6')}
				</div>
				<CardTitle className="text-lg">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
		</Card>
	)
}
