'use client'

import { getGradientIcon, getIcon } from '@/utils/icon-mapper'

/**
 * Demo component showing all colorful icon variants
 * Displays both solid colors and gradient colors
 */
export function ColorfulIconsDemo() {
	const iconNames = [
		'Home',
		'Wrench',
		'Zap',
		'BookOpen',
		'CheckCircle',
		'Book',
		'FileText',
	]
	const iconLabels = [
		'Home',
		'Git Tools',
		'Generator',
		'Examples',
		'Validator',
		'Guide',
		'Changelog',
	]

	return (
		<div className="space-y-8">
			{/* Solid Color Icons */}
			<div>
				<h2 className="text-2xl font-bold mb-4">Solid Color Icons</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
					{iconNames.map((iconName, index) => (
						<div
							key={iconName}
							className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
						>
							{getIcon(iconName, 'w-8 h-8')}
							<span className="text-sm font-medium text-center">
								{iconLabels[index]}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Gradient Color Icons */}
			<div>
				<h2 className="text-2xl font-bold mb-4">Gradient Color Icons</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
					{iconNames.map((iconName, index) => (
						<div
							key={iconName}
							className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
						>
							{getGradientIcon(iconName, 'w-8 h-8')}
							<span className="text-sm font-medium text-center">
								{iconLabels[index]}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Color Palette */}
			<div>
				<h2 className="text-2xl font-bold mb-4">Color Palette</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
						<div className="flex items-center space-x-2">
							<div className="w-4 h-4 rounded-full bg-blue-500"></div>
							<span className="font-medium">Home - Blue</span>
						</div>
					</div>
					<div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
						<div className="flex items-center space-x-2">
							<div className="w-4 h-4 rounded-full bg-orange-500"></div>
							<span className="font-medium">Git Tools - Orange</span>
						</div>
					</div>
					<div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
						<div className="flex items-center space-x-2">
							<div className="w-4 h-4 rounded-full bg-yellow-500"></div>
							<span className="font-medium">Generator - Yellow</span>
						</div>
					</div>
					<div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
						<div className="flex items-center space-x-2">
							<div className="w-4 h-4 rounded-full bg-green-500"></div>
							<span className="font-medium">Examples - Green</span>
						</div>
					</div>
					<div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
						<div className="flex items-center space-x-2">
							<div className="w-4 h-4 rounded-full bg-emerald-500"></div>
							<span className="font-medium">Validator - Emerald</span>
						</div>
					</div>
					<div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
						<div className="flex items-center space-x-2">
							<div className="w-4 h-4 rounded-full bg-purple-500"></div>
							<span className="font-medium">Guide - Purple</span>
						</div>
					</div>
					<div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
						<div className="flex items-center space-x-2">
							<div className="w-4 h-4 rounded-full bg-cyan-500"></div>
							<span className="font-medium">Changelog - Cyan</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
