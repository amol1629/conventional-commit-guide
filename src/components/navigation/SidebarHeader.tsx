/**
 * Sidebar Header Component
 * Follows SOLID principles and accessibility standards
 */

import { useTranslation } from '@/hooks/useTranslation'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import Logo from '../../../public/logos/cc.jpeg'
import Image from 'next/image'
import Link from 'next/link'
import { MobileMenuButton } from './MobileMenuButton'

interface SidebarHeaderProps {
	isOpen: boolean
	onToggle: () => void
	className?: string
	isCollapsed?: boolean
	onToggleCollapse?: () => void
}

/**
 * Accessible sidebar header with proper branding and controls
 * Follows WCAG 2.1 AA standards
 */
export function SidebarHeader({
	isOpen,
	onToggle,
	className,
	isCollapsed = false,
}: SidebarHeaderProps) {
	const { t } = useTranslation(['common'])

	return (
		<div
			className={`flex items-center px-4 py-4 md:p-6 border-b border-border ${
				isCollapsed ? 'justify-center ' : 'justify-between'
			} ${className}`}
		>
			{/* Brand Section */}
			<div
				className={`flex items-center space-x-3 transition-all duration-300 ${
					isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
				}`}
			>
				{/* <div
					className="flex items-center justify-center w-8 h-8 text-purple-500 rounded-lg"
					aria-hidden="true"
				>
					{getFontAwesomeIcon('GithubIcon', 'w-6 h-6')}
				</div> */}
				<div>
					<h1 className="text-xl font-extrabold tracking-tight text-transparent w-max md:text-3xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text">
						{t('common:app_brand_name')}
					</h1>
					{/* <p className="text-xs text-muted-foreground">
						{t('common:app_brand_tagline')}
					</p> */}
				</div>
			</div>

			{/* Controls Section */}
			<div
				className={`flex items-center gap-2 md:gap-3 ${
					isCollapsed
						? 'justify-center   md:ml-0'
						: 'md:ml-8'
				}`}
			>
				{/* GitHub icon – home link, shown when sidebar collapsed */}
				{isCollapsed && (
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								href="/home"
								aria-label="Go to home page"
								className="relative flex items-center justify-center w-12 h-12 transition-all duration-300 bg-white rounded-full hover:opacity-90 focus:outline-none focus:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
							>
								<Image
									src={Logo}
									alt="App logo"
									fill
									sizes="48px"
									className="object-contain transition-all duration-300 ease-in-out rounded-full hover:opacity-90"
									priority
								/>
							</Link>
						</TooltipTrigger>

						<TooltipPrimitive.Portal>
							<TooltipContent
								side="right"
								align="center"
								sideOffset={12}
								className="z-[99999]"
							>
								Go to home
							</TooltipContent>
						</TooltipPrimitive.Portal>
					</Tooltip>
				)}

				{/* Mobile Menu Button */}
				{/* <MobileMenuButton
					isOpen={isOpen}
					onToggle={onToggle}
					className="p-1 transition-colors duration-300 rounded-md md:hidden text-foreground hover:text-primary hover:bg-accent"
				/> */}
			</div>
		</div>
	)
}
