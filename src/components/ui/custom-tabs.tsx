import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface TabItem {
	value: string
	label: string
	content: React.ReactNode
}

interface CustomTabsProps {
	defaultValue: string
	tabs: TabItem[]
	className?: string
	tabsListClassName?: string
	tabsTriggerClassName?: string
	tabsContentClassName?: string
}

export function CustomTabs({
	defaultValue,
	tabs,
	className = '',
	tabsListClassName = '',
	tabsTriggerClassName = '',
	tabsContentClassName = '',
}: CustomTabsProps) {
	return (
		<Tabs defaultValue={defaultValue} className={cn('w-full', className)}>
			<TabsList
				className={cn(
					'grid w-full rounded-full',
					`grid-cols-${tabs.length}`,
					tabsListClassName,
				)}
			>
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.value}
						value={tab.value}
						className={cn(
							'rounded-full hover:bg-accent hover:text-accent-foreground transition-colors',
							tabsTriggerClassName,
						)}
					>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>

			{tabs.map((tab) => (
				<TabsContent
					key={tab.value}
					value={tab.value}
					className={cn('space-y-4', tabsContentClassName)}
				>
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	)
}

// Specialized components for common use cases
interface SimpleTabsProps {
	defaultValue: string
	tabs: Array<{
		value: string
		label: string
		content: React.ReactNode
	}>
	gridCols?: number
	className?: string
}

export function SimpleTabs({
	defaultValue,
	tabs,
	gridCols,
	className = '',
}: SimpleTabsProps) {
	const cols = gridCols || tabs.length
	return (
		<CustomTabs
			defaultValue={defaultValue}
			tabs={tabs}
			className={className}
			tabsListClassName={`grid-cols-${cols}`}
		/>
	)
}

// Responsive tabs component
interface ResponsiveTabsProps {
	defaultValue: string
	tabs: Array<{
		value: string
		label: string
		content: React.ReactNode
	}>
	className?: string
}

export function ResponsiveTabs({
	defaultValue,
	tabs,
	className = '',
}: ResponsiveTabsProps) {
	return (
		<CustomTabs
			defaultValue={defaultValue}
			tabs={tabs}
			className={className}
			tabsListClassName="grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
		/>
	)
}

// Examples tabs component (for commit examples)
interface ExamplesTabsProps {
	defaultValue: string
	tabs: Array<{
		value: string
		label: string
		content: React.ReactNode
	}>
	className?: string
}

export function ExamplesTabs({
	defaultValue,
	tabs,
	className = '',
}: ExamplesTabsProps) {
	return (
		<CustomTabs
			defaultValue={defaultValue}
			tabs={tabs}
			className={className}
			tabsListClassName="grid-cols-4 lg:grid-cols-8"
			tabsTriggerClassName="text-xs"
		/>
	)
}
