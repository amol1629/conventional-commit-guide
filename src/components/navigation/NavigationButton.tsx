import { Button } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { NavigationItem } from '@/constants/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/lib/utils'
import { getGradientIcon } from '@/utils/icon-mapper'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import Link from 'next/link'

interface NavigationButtonProps {
	item: NavigationItem & { translatedName: string }
	isActive: boolean
	onClick: () => void
	className?: string
	isCollapsed?: boolean
}

/**
 * Smooth, accessible NavigationButton
 * - avoids layout-changing animations (no border-width changes)
 * - accent uses transform/opacity (GPU-accelerated)
 * - icon has a subtle transform for motion
 * - respects prefers-reduced-motion
 */
export function NavigationButton({
	item,
	isActive,
	onClick,
	className,
	isCollapsed = false,
}: NavigationButtonProps) {
	const { t } = useTranslation(['common'])

	const button = (
		<Button
			variant="ghost"
			asChild
			onClick={onClick}
			aria-current={isActive ? 'page' : undefined}
			aria-label={t(`common:${item.ariaLabel}`) as string}
			style={
				isActive
					? {
							background: 'linear-gradient(to right, #f6d5f7, #fbe9d7)',
						}
					: undefined
			}
			className={cn(
				// spacing: leave space for the accent on the left
				'relative flex items-center text-sm font-medium justify-start transition-all duration-300',
				isCollapsed
					? 'w-12 h-12 justify-center rounded-full'
					: 'w-full h-10 px-3 pl-6 justify-start rounded-lg',
				// visual states — keep color changes but avoid heavy shadows transitions
				'motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out',
				isActive
					? 'text-black hover:text-purple-700 hover:opacity-90'
					: 'text-foreground hover:rounded-full hover:bg-red-50 hover:text-purple-600 dark:hover:bg-green-800/40',
				// Make active state circular when expanded
				isActive && !isCollapsed && 'rounded-full',
				className,
			)}
		>
			<Link
				href={item.href}
				// link receives focus ring; still accessible
				className={cn(
					'relative z-10 flex items-center w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
					isCollapsed
						? 'justify-center h-12 w-12 rounded-full'
						: 'space-x-3 h-10 w-10 rounded-full',
				)}
				aria-label={t(`common:${item.ariaLabel}`) as string}
			>
				{/* Left accent bar (doesn't change layout) - only show when not collapsed */}
				{!isCollapsed && (
					<span
						aria-hidden
						className={cn(
							'absolute left-0 top-1/3 -translate-y-1/3 w-1 h-9 rounded-r transform-gpu will-change-transform',
							// only transform & opacity animate
							'motion-safe:transition-all motion-safe:duration-200 motion-safe:ease-out',
							isActive
								? 'translate-x-0 opacity-100 bg-[#E966A0] dark:bg-red-400'
								: '-translate-x-2 opacity-0 bg-transparent',
						)}
					/>
				)}

				{/* Icon: subtle transform on active/hover with colorful gradient */}
		<span
			className={cn(
				'flex-shrink-0 flex items-center justify-center',
				isCollapsed ? 'w-6 h-6' : 'w-5 h-5',
			)}
			aria-hidden="true"
			role="img"
		>
					{getGradientIcon(item.icon, isCollapsed ? 'w-6 h-6' : 'w-5 h-5')}
				</span>

				{/* Label - only show when not collapsed */}
				{!isCollapsed && (
					<span className="font-medium truncate">{item.translatedName}</span>
				)}
			</Link>
		</Button>
	)

	return (
		<Tooltip>
			<TooltipTrigger asChild>{button}</TooltipTrigger>
			<TooltipPrimitive.Portal>
				<TooltipContent
					side="right"
					align="center"
					sideOffset={12}
					className={cn(isCollapsed ? 'z-[99999]' : 'sr-only')}
				>
					{item.translatedName}
				</TooltipContent>
			</TooltipPrimitive.Portal>
		</Tooltip>
	)
}
