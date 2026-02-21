import {
	ExamplesTabs,
	ResponsiveTabs,
	SimpleTabs,
} from '@/components/ui/custom-tabs'

// Example usage of the reusable tab components
export function TabExample() {
	return (
		<div className="space-y-8">
			{/* Simple Tabs Example */}
			<div>
				<h3 className="text-lg font-semibold mb-4">Simple Tabs</h3>
				<SimpleTabs
					defaultValue="tab1"
					tabs={[
						{
							value: 'tab1',
							label: 'Tab 1',
							content: <div>Content for Tab 1</div>,
						},
						{
							value: 'tab2',
							label: 'Tab 2',
							content: <div>Content for Tab 2</div>,
						},
						{
							value: 'tab3',
							label: 'Tab 3',
							content: <div>Content for Tab 3</div>,
						},
					]}
				/>
			</div>

			{/* Examples Tabs (for commit examples) */}
			<div>
				<h3 className="text-lg font-semibold mb-4">Examples Tabs</h3>
				<ExamplesTabs
					defaultValue="feat"
					tabs={[
						{
							value: 'feat',
							label: 'feat',
							content: <div>Feature examples</div>,
						},
						{
							value: 'fix',
							label: 'fix',
							content: <div>Fix examples</div>,
						},
						{
							value: 'docs',
							label: 'docs',
							content: <div>Documentation examples</div>,
						},
					]}
				/>
			</div>

			{/* Responsive Tabs */}
			<div>
				<h3 className="text-lg font-semibold mb-4">Responsive Tabs</h3>
				<ResponsiveTabs
					defaultValue="overview"
					tabs={[
						{
							value: 'overview',
							label: 'Overview',
							content: <div>Overview content</div>,
						},
						{
							value: 'examples',
							label: 'Examples',
							content: <div>Examples content</div>,
						},
						{
							value: 'tools',
							label: 'Tools',
							content: <div>Tools content</div>,
						},
						{
							value: 'practices',
							label: 'Best Practices',
							content: <div>Best practices content</div>,
						},
					]}
				/>
			</div>
		</div>
	)
}
