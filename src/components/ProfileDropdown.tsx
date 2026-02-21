'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
// import { useTheme } from 'next-themes' // Removed for light-only theme
import { useRouter } from 'next/navigation'
import { isAuthRequired } from '@/config/auth.config'

interface ProfileDropdownProps {
	trigger?: React.ReactNode
}

export function ProfileDropdown({ trigger }: ProfileDropdownProps) {
	const { logout } = useAuth()
	// const { setTheme, theme } = useTheme() // Removed for light-only theme
	const router = useRouter()

	const handleLogout = () => {
		logout()
		// Redirect to home if auth is disabled, otherwise to login
		if (isAuthRequired()) {
			router.push('/auth/login')
		} else {
			router.push('/home')
		}
	}

	// Theme toggle removed - app is light mode only
	// const toggleTheme = () => {
	// 	setTheme(theme === 'light' ? 'dark' : 'light')
	// }

	const defaultTrigger = (
		<Button
			variant="ghost"
			size="icon"
			className="relative overflow-hidden transition-all duration-300 rounded-lg h-9 w-9 bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 hover:from-blue-600 hover:via-purple-600 hover:to-emerald-600 hover:scale-105 hover:shadow-xl dark:shadow-blue-500/25 dark:hover:shadow-blue-500/40"
		>
			{getFontAwesomeIcon('User', 'w-4 h-4 text-white')}
			<span className="sr-only">Open profile menu</span>
		</Button>
	)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{trigger || defaultTrigger}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-64 p-2 mx-2 border border-gray-200 rounded-lg shadow-xl dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md"
			>
				{/* User Info */}
				{/* <div className="px-3 py-3 mb-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
					<div className="flex items-center space-x-3">
						<div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600">
							{getFontAwesomeIcon('User', 'w-5 h-5 text-white')}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
								{authState.user?.name || 'User'}
							</p>
							<p className="text-xs text-gray-500 truncate dark:text-gray-400">
								{authState.user?.email || 'user@example.com'}
							</p>
						</div>
					</div>
				</div> */}

				{/* Profile Option */}
				<DropdownMenuItem
					onClick={() => router.push('/profile')}
					className="flex items-center px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 cursor-pointer group border-0 outline-none focus:outline-none focus:ring-0 focus:border-0 focus:bg-blue-50 dark:focus:bg-blue-900/20 focus:shadow-none"
				>
					<div className="flex items-center justify-center w-8 h-8 transition-all duration-300 bg-blue-100 rounded-lg dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50">
						{getFontAwesomeIcon(
							'UserCog',
							'w-4 h-4 text-blue-600 dark:text-white',
						)}
					</div>
					<span className="ml-3 font-medium text-gray-900 dark:text-white">
						Profile Settings
					</span>
				</DropdownMenuItem>

				{/* Theme Toggle - Removed for light-only theme */}
				{/* <DropdownMenuItem
					onClick={(e) => {
						e.preventDefault()
						toggleTheme()
					}}
					className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 cursor-pointer group border-0 outline-none focus:outline-none focus:ring-0 focus:border-0 focus:bg-amber-50 dark:focus:bg-amber-900/20 focus:shadow-none"
					onSelect={(e) => e.preventDefault()}
				>
					<div className="flex items-center">
						<div className="flex items-center justify-center w-8 h-8 transition-all duration-300 rounded-lg bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-200 dark:group-hover:bg-amber-900/50">
							{theme === 'light'
								? getFontAwesomeIcon(
										'Moon',
										'w-4 h-4 text-amber-600 dark:text-amber-400',
								  )
								: getFontAwesomeIcon(
										'Sun',
										'w-4 h-4 text-amber-600 dark:text-amber-400',
								  )}
						</div>
						<span className="ml-3 font-medium text-gray-900 dark:text-white">
							Theme
						</span>
					</div>
					<div className="flex items-center">
						<div
							className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${
								theme === 'dark'
									? 'bg-amber-500 shadow-lg shadow-amber-500/25'
									: 'bg-gray-300 dark:bg-gray-600'
							}`}
						>
							<div
								className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300 shadow-sm ${
									theme === 'dark' ? 'translate-x-4' : 'translate-x-0.5'
								}`}
							/>
						</div>
					</div>
				</DropdownMenuItem> */}

				<DropdownMenuSeparator className="my-2" />

				{/* Logout Option */}
				<DropdownMenuItem
					onClick={handleLogout}
					className="flex items-center px-3 py-2.5 rounded-lg transition-all duration-300 border border-red-200 dark:border-red-600 bg-red-50 dark:bg-red-900/30 cursor-pointer hover:!bg-red-100 dark:hover:!bg-red-800/40 hover:!border-red-600 dark:hover:!border-red-500 focus:outline-none focus:ring-0 focus:border-red-200 dark:focus:border-red-600 focus:shadow-none"
				>
					<div className="flex items-center justify-center w-8 h-8 transition-all duration-300 bg-red-200 rounded-lg dark:bg-red-800/40">
						{getFontAwesomeIcon(
							'SignOutAlt',
							'w-4 h-4 text-red-700 dark:text-red-300',
						)}
					</div>
					<span className="ml-3 font-medium text-red-700 dark:text-red-300">
						Sign Out
					</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
