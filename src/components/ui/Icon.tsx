/**
 * Flexible Icon Component
 * Allows using any Font Awesome icon with consistent styling
 */

import { cn } from '@/lib/utils'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type IconColor =
	| 'default'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'error'
	| 'muted'

const sizeClasses: Record<IconSize, string> = {
	xs: 'w-3 h-3',
	sm: 'w-4 h-4',
	md: 'w-5 h-5',
	lg: 'w-6 h-6',
	xl: 'w-8 h-8',
	'2xl': 'w-12 h-12',
}

const colorClasses: Record<IconColor, string> = {
	default: 'text-foreground',
	primary: 'text-primary',
	secondary: 'text-secondary',
	success: 'text-green-600 dark:text-green-400',
	warning: 'text-yellow-600 dark:text-yellow-400',
	error: 'text-red-600 dark:text-red-400',
	muted: 'text-muted-foreground',
}

export interface IconProps {
	name: string
	size?: IconSize
	color?: IconColor
	className?: string
	'aria-label'?: string
	'aria-hidden'?: boolean
}

/**
 * Flexible Icon component that can render any Font Awesome icon
 */
export function Icon({
	name,
	size = 'md',
	color = 'default',
	className,
	'aria-label': ariaLabel,
	'aria-hidden': ariaHidden = true,
	...props
}: IconProps) {
	return (
		<span
			className={cn(sizeClasses[size], colorClasses[color], className)}
			aria-label={ariaLabel}
			aria-hidden={ariaHidden}
			{...props}
		>
			{getFontAwesomeIcon(name, sizeClasses[size])}
		</span>
	)
}

export default Icon
