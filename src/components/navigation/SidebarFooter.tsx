/**
 * Sidebar Footer Component
 * Expand/collapse sidebar toggle with attractive design
 */

import {
	byPrefixAndName,
} from '@/utils/fontawesome-mapping'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

interface SidebarFooterProps {
	className?: string
	isCollapsed?: boolean
	onToggleCollapse?: () => void
}

/**
 * Sidebar footer with expand/collapse toggle
 * Follows WCAG 2.1 AA standards with proper accessibility
 */
export function SidebarFooter({
	className,
	isCollapsed = false,
	onToggleCollapse,
}: SidebarFooterProps) {
	return (
		<div
			className={`border-t border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300 ${className}`}
		>
			<div className={isCollapsed ? 'p-2' : 'p-4'}>
				<div
					className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-center'}`}
				>
					{onToggleCollapse && (
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									onClick={onToggleCollapse}
									aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
									className="flex items-center justify-center w-10 h-10 transition-all duration-200 border border-purple-300 rounded-full outline-none dark:border-purple-600 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 hover:border-purple-400 dark:hover:border-purple-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 ring-0 focus:ring-0"
								>
									<FontAwesomeIcon
										icon={
											isCollapsed
												? byPrefixAndName.fas['angle-double-right']
												: byPrefixAndName.fas['angle-double-left']
										}
										className="w-4 h-4 text-purple-600 dark:text-purple-400"
										aria-hidden="true"
									/>
								</button>
							</TooltipTrigger>

							<TooltipPrimitive.Portal>
								<TooltipContent
									side="right"
									align="center"
									sideOffset={12}
									className="z-[99999]"
								>
									{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
								</TooltipContent>
							</TooltipPrimitive.Portal>
						</Tooltip>
					)}
				</div>
			</div>
		</div>
	)
}
